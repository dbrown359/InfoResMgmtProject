<?php
// Run from Terminal only: php create_coach_cli.php 'First Last' 'email@example.com' 'strongpassword'
if(PHP_SAPI!=='cli'){http_response_code(403);exit('CLI only');}
if($argc!==4 || !filter_var($argv[2],FILTER_VALIDATE_EMAIL) || strlen($argv[3])<8){exit("Usage: php create_coach_cli.php 'First Last' 'email@example.com' 'password-8+chars'\n");}
require __DIR__.'/db_connect.php';
$parts=preg_split('/\s+/',trim($argv[1]),2);$hash=password_hash($argv[3],PASSWORD_DEFAULT);
$s=$conn->prepare("INSERT INTO users(first_name,last_name,email,password_hash,role) VALUES (?,?,?,?,'instructor')");
$s->bind_param('ssss',$parts[0],$parts[1],$argv[2],$hash);
try{$s->execute();echo "Created instructor ID: ".$conn->insert_id."\n";}catch(Throwable $e){fwrite(STDERR,"Unable to create instructor (possibly duplicate email).\n");exit(1);}
