<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
ini_set('display_errors','0');
session_start();
function out($data,$status=200){http_response_code($status);echo json_encode($data,JSON_INVALID_UTF8_SUBSTITUTE);exit;}
function require_user(){if(empty($_SESSION['uid']))out(['error'=>'Sign in first'],401);return (int)$_SESSION['uid'];}
function body($key){return trim((string)($_POST[$key]??''));}
function row($db,$sql,$types='',$args=[]){$s=$db->prepare($sql);if($types)$s->bind_param($types,...$args);$s->execute();return $s->get_result()->fetch_assoc();}
function rows($db,$sql,$types='',$args=[]){$s=$db->prepare($sql);if($types)$s->bind_param($types,...$args);$s->execute();return $s->get_result()->fetch_all(MYSQLI_ASSOC);}
function runq($db,$sql,$types='',$args=[]){$s=$db->prepare($sql);if($types)$s->bind_param($types,...$args);$s->execute();return $db->insert_id;}
function me($db,$id){return row($db,'SELECT u.user_id,u.first_name,u.last_name,u.email,u.phone,u.role,COALESCE(p.plan,\'No plan selected\') AS plan FROM users u LEFT JOIN user_profiles p ON p.user_id=u.user_id WHERE u.user_id=?','i',[$id]);}
function goal_access($db,$goal,$uid,$coach=false){$g=row($db,'SELECT * FROM goals WHERE goal_id=?','i',[$goal]);if(!$g || ($g['customer_id']!=$uid && (!$coach || $g['coach_id']!=$uid)))out(['error'=>'Goal not found or access denied'],403);return $g;}
try {
 require __DIR__.'/db_connect.php';
 $a=$_GET['action']??'';
 if($_SERVER['REQUEST_METHOD']!=='POST' && !in_array($a,['session','data','coaches'],true))out(['error'=>'POST required'],405);
 if($a==='signup'){
  $name=preg_split('/\s+/',body('name'),2);$email=filter_var(body('email'),FILTER_VALIDATE_EMAIL);$pass=body('password');
  if(!$email||strlen($pass)<8||!trim($name[0]??''))out(['error'=>'Enter a name, valid email, and password of at least 8 characters'],422);
  $id=runq($conn,'INSERT INTO users(first_name,last_name,email,password_hash,role) VALUES (?,?,?,?,\'customer\')','ssss',[$name[0],$name[1]??'',$email,password_hash($pass,PASSWORD_DEFAULT)]);
  session_regenerate_id(true);$_SESSION['uid']=$id;out(['user'=>me($conn,$id)]);
 }
 if($a==='login'){
  $email=body('email');$pass=body('password');
  $u=row($conn,'SELECT * FROM users WHERE email=?','s',[$email]);
  if(!$u || !password_verify($pass,$u['password_hash']))out(['error'=>'Invalid email or password'],401);
  session_regenerate_id(true);$_SESSION['uid']=(int)$u['user_id'];out(['user'=>me($conn,$_SESSION['uid'])]);
 }
 if($a==='logout'){$_SESSION=[];session_destroy();out(['ok'=>true]);}
 if($a==='session'){out(['user'=>empty($_SESSION['uid'])?null:me($conn,(int)$_SESSION['uid'])]);}
 if($a==='coaches'){
  out(['coaches'=>rows($conn,"SELECT u.user_id AS id,CONCAT(u.first_name,' ',u.last_name) AS name,u.email,COALESCE(ROUND(AVG(r.rating),1),0) AS rating FROM users u LEFT JOIN reviews r ON r.provider_id=u.user_id WHERE u.role='instructor' GROUP BY u.user_id ORDER BY u.first_name")]);
 }
 $uid=require_user();$user=me($conn,$uid);
 if($a==='data'){
  $coach=$user['role']==='instructor';
  $gs=rows($conn,"SELECT g.goal_id AS id,g.customer_id,g.coach_id,g.title,g.duration,g.category,g.target_hours,CONCAT(u.first_name,' ',u.last_name) AS mentee,COALESCE(CONCAT(c.first_name,' ',c.last_name),'Unassigned') AS coach FROM goals g JOIN users u ON u.user_id=g.customer_id LEFT JOIN users c ON c.user_id=g.coach_id WHERE ".($coach?'g.coach_id=?':'g.customer_id=?')." ORDER BY g.goal_id DESC",'i',[$uid]);
  foreach($gs as &$g){$g['id']=(int)$g['id'];$g['milestones']=rows($conn,'SELECT milestone_id AS id,task_text AS text,priority,status FROM milestones WHERE goal_id=? ORDER BY milestone_id','i',[$g['id']]);}unset($g);
  $msgs=rows($conn,"SELECT m.message_id,CONCAT(s.first_name,' ',s.last_name) AS `from`,CONCAT(t.first_name,' ',t.last_name) AS `to`,m.message_text AS text,DATE_FORMAT(m.created_at,'%b %e, %Y %l:%i %p') AS time,IF(s.role='instructor','coach','mentee') AS senderRole FROM messages m JOIN users s ON s.user_id=m.sender_id JOIN users t ON t.user_id=m.recipient_id WHERE m.sender_id=? OR m.recipient_id=? ORDER BY m.message_id",'ii',[$uid,$uid]);
  $rs=rows($conn,"SELECT r.review_id AS id,CONCAT(c.first_name,' ',c.last_name) AS coach,CONCAT(u.first_name,' ',u.last_name) AS mentee,r.rating,r.comment FROM reviews r JOIN users c ON c.user_id=r.provider_id JOIN users u ON u.user_id=r.customer_id ORDER BY r.review_id DESC");
  out(['user'=>$user,'goals'=>$gs,'messages'=>$msgs,'reviews'=>$rs]);
 }
 if($a==='goal_create'){
  if($user['role']!=='customer')out(['error'=>'Customer access required'],403);
  $title=body('title');$duration=body('duration');$hours=(float)body('hours');
  if(!$title||mb_strlen($title)>150||$hours<=0||$hours>999.99)out(['error'=>'Enter title and positive target hours'],422);
  $id=runq($conn,"INSERT INTO goals(customer_id,title,category,target_hours,duration) VALUES (?,?,'General',?,?)",'isds',[$uid,$title,$hours,$duration?:'30 Days']);out(['ok'=>true,'id'=>$id]);
 }
 if($a==='goal_coach'){
  $g=goal_access($conn,(int)body('goal_id'),$uid);if($g['customer_id']!=$uid)out(['error'=>'Only owner can assign coach'],403);
  $coach=(int)body('coach_id');if(!row($conn,"SELECT user_id FROM users WHERE user_id=? AND role='instructor'",'i',[$coach]))out(['error'=>'Invalid coach'],422);
  runq($conn,'UPDATE goals SET coach_id=? WHERE goal_id=?','ii',[$coach,$g['goal_id']]);out(['ok'=>true]);
 }
 if($a==='milestone_add'){
  if($user['role']!=='instructor')out(['error'=>'Coach access required'],403);
  $g=goal_access($conn,(int)body('goal_id'),$uid,true);if($g['coach_id']!=$uid)out(['error'=>'Not your assigned goal'],403);
  $txt=body('text');$pri=body('priority');if(!$txt||mb_strlen($txt)>255||!in_array($pri,['Low','Medium','High'],true))out(['error'=>'Invalid milestone'],422);
  runq($conn,'INSERT INTO milestones(goal_id,task_text,priority) VALUES (?,?,?)','iss',[$g['goal_id'],$txt,$pri]);out(['ok'=>true]);
 }
 if(in_array($a,['milestone_status','milestone_delete'],true)){
  $m=row($conn,'SELECT m.*,g.customer_id,g.coach_id FROM milestones m JOIN goals g ON g.goal_id=m.goal_id WHERE m.milestone_id=?','i',[(int)body('milestone_id')]);
  if(!$m||($uid!=$m['customer_id']&&$uid!=$m['coach_id']))out(['error'=>'Not authorized'],403);
  if($a==='milestone_delete'){
   if($uid!=$m['coach_id'])out(['error'=>'Coach access required'],403);
   runq($conn,'DELETE FROM milestones WHERE milestone_id=?','i',[$m['milestone_id']]);
  }else{
   $status=body('status');if(!in_array($status,['Planned','Completed'],true))out(['error'=>'Invalid status'],422);
   runq($conn,'UPDATE milestones SET status=? WHERE milestone_id=?','si',[$status,$m['milestone_id']]);
  }out(['ok'=>true]);
 }
 if($a==='message'){
  $recipient=(int)body('recipient_id');$msg=body('text');
  if(!$msg||mb_strlen($msg)>5000||$recipient===$uid||!row($conn,'SELECT user_id FROM users WHERE user_id=?','i',[$recipient]))out(['error'=>'Invalid message or recipient'],422);
  runq($conn,'INSERT INTO messages(sender_id,recipient_id,message_text) VALUES (?,?,?)','iis',[$uid,$recipient,$msg]);out(['ok'=>true]);
 }
 if($a==='review'){
  if($user['role']!=='customer')out(['error'=>'Customer access required'],403);
  $provider=(int)body('coach_id');$rating=(int)body('rating');$comment=body('comment');
  if($rating<1||$rating>5||mb_strlen($comment)>5000)out(['error'=>'Invalid review'],422);
  $appt=row($conn,"SELECT a.appointment_id FROM appointments a LEFT JOIN reviews r ON r.appointment_id=a.appointment_id WHERE a.customer_id=? AND a.provider_id=? AND a.status='completed' AND r.review_id IS NULL ORDER BY a.appointment_id DESC LIMIT 1",'ii',[$uid,$provider]);
  if(!$appt)out(['error'=>'A completed, unreviewed appointment with this coach is required'],422);
  runq($conn,'INSERT INTO reviews(appointment_id,customer_id,provider_id,rating,comment) VALUES (?,?,?,?,?)','iiiis',[$appt['appointment_id'],$uid,$provider,$rating,$comment]);out(['ok'=>true]);
 }
 if($a==='profile'){
  $name=preg_split('/\s+/',body('name'),2);$email=filter_var(body('email'),FILTER_VALIDATE_EMAIL);$phone=body('phone');$plan=body('plan');
  if(!$email||!trim($name[0]??''))out(['error'=>'Invalid name or email'],422);
  runq($conn,'UPDATE users SET first_name=?,last_name=?,email=?,phone=? WHERE user_id=?','ssssi',[$name[0],$name[1]??'',$email,$phone,$uid]);
  runq($conn,'INSERT INTO user_profiles(user_id,plan) VALUES (?,?) ON DUPLICATE KEY UPDATE plan=VALUES(plan)','is',[$uid,$plan]);out(['user'=>me($conn,$uid)]);
 }
 out(['error'=>'Unknown action'],404);
} catch(Throwable $e){error_log('AccountaDay API: '.$e->getMessage());out(['error'=>'Server/database error; inspect PHP error log'],500);}
