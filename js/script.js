let currentUser = "";
let currentRole = "";
let currentEmail = "bchowdhury@student.pvamu.edu";
let currentPlan = "3-Month Plan ($50.00)";
let currentPhone = "+1 (832) 555-0192";

let coaches = [
  { id: 1, name: "Dr. David Brown", specialty: "Driver Road Test Prep", rating: 4.9, email: "dbrown@accountaday.com", avatar: "images/avatar-coach.png" },
  { id: 2, name: "Sarah Jenkins", specialty: "Python & Cloud Exams", rating: 4.8, email: "sjenkins@accountaday.com", avatar: "images/avatar-coach-2.png" },
  { id: 3, name: "Marcus Vance", specialty: "5K Running & Stamina", rating: 5.0, email: "mvance@accountaday.com", avatar: "images/avatar-coach-3.png" }
];

let goals = [
  {
    id: 1,
    mentee: "Borhan Chowdhury",
    coach: "Dr. David Brown",
    title: "Learn Driving & Pass Road Test",
    duration: "60 Days",
    milestones: [
      { text: "Study State Driver Handbook", priority: "High", status: "Completed" },
      { text: "Complete 10 Hours of Behind-the-Wheel", priority: "High", status: "Completed" },
      { text: "Master Parallel Parking and 3-Point Turns", priority: "Medium", status: "Planned" }
    ]
  },
  {
    id: 2,
    mentee: "Borhan Chowdhury",
    coach: "Sarah Jenkins",
    title: "Python & Network Labs Sprint",
    duration: "45 Days",
    milestones: [
      { text: "Complete Socket Basics", priority: "High", status: "Completed" },
      { text: "Build Packet Sniffer Lab Script", priority: "Medium", status: "Planned" }
    ]
  },
  {
    id: 3,
    mentee: "Borhan Chowdhury",
    coach: "Marcus Vance",
    title: "5K Running & Stamina Habit",
    duration: "30 Days",
    milestones: [
      { text: "Run 1 Mile without Stopping", priority: "High", status: "Completed" },
      { text: "Complete 5K Run under 28 Minutes", priority: "Low", status: "Planned" }
    ]
  },
  {
    id: 4,
    mentee: "Borhan Chowdhury",
    coach: "Dr. David Brown",
    title: "AWS Cloud Practitioner Exam",
    duration: "40 Days",
    milestones: [
      { text: "Review Cloud Economics Whitepaper", priority: "High", status: "Completed" },
      { text: "Pass Practice Exam with 85%", priority: "Medium", status: "Planned" }
    ]
  },
  {
    id: 5,
    mentee: "Borhan Chowdhury",
    coach: "Sarah Jenkins",
    title: "Oral Presentation Practice",
    duration: "60 Days",
    milestones: [
      { text: "15-Minute Pen Articulation Drill", priority: "High", status: "Completed" },
      { text: "Record Technical Project Walkthrough", priority: "Medium", status: "Planned" }
    ]
  }
];

let selectedGoalIndex = 0;
let selectedCoachGoalId = 1;

let feedPosts = [
  { 
    id: 1, 
    user: "Borhan Chowdhury", 
    avatar: "images/user3.jpg", 
    goalTitle: "Driver Road Test (60-Day Sprint)", 
    coach: "Dr. David Brown", 
    time: "2 hours ago", 
    likes: 18, 
    text: "Just completed my reverse parallel parking practice with zero errors today! Having Dr. Brown prescribe structured 3-point turns and curb distance drills made a huge difference. Feeling completely ready for the official state road test next Tuesday." 
  },
  { 
    id: 2, 
    user: "Sarah Miller", 
    avatar: "images/user2.jpg", 
    goalTitle: "5K Running Endurance", 
    coach: "Marcus Vance", 
    time: "5 hours ago", 
    likes: 24, 
    text: "Officially finished my 30-day endurance running roadmap this morning with Coach Marcus! Managed a continuous 5K run under 27 minutes. Having someone hold me accountable to daily breathing drills kept me injury-free and consistent the entire month." 
  },
  { 
    id: 3, 
    user: "David Reed", 
    avatar: "images/user1.jpg", 
    goalTitle: "Python & Network Labs Sprint", 
    coach: "Sarah Jenkins", 
    time: "Yesterday", 
    likes: 12, 
    text: "Wrapped up my raw packet sniffer script and automated socket handler lab today. Coach Sarah Jenkins broke down complicated networking whitepapers into simple 45-minute daily milestones that kept me from burning out." 
  }
];

let reviews = [
  { 
    id: 1, 
    coach: "Dr. David Brown", 
    mentee: "Elena Rostova", 
    avatar: "images/user2.jpg", 
    rating: 5, 
    comment: "Dr. David Brown is a patient, detail-oriented instructor. His structured 60-day road test roadmap turned parallel parking and highway merging from stressful hurdles into second nature. I passed my road test on the first try!" 
  },
  { 
    id: 2, 
    coach: "Marcus Vance", 
    mentee: "Kevin Patel", 
    avatar: "images/user1.jpg", 
    rating: 5, 
    comment: "Marcus is an incredible coach. He provided realistic daily milestones that fit my busy schedule, and his regular chat check-ins kept me motivated even on difficult days. I reached my endurance goal ahead of schedule." 
  },
  { 
    id: 3, 
    coach: "Sarah Jenkins", 
    mentee: "Borhan Chowdhury", 
    avatar: "images/user3.jpg", 
    rating: 5, 
    comment: "Sarah broke down complicated Python socket programming and AWS security modules into manageable 1-hour milestones. Her prompt chat responses and daily checklist organization made self-study completely stress-free." 
  }
];

let coachNotifications = [
  { id: 1, title: "Milestone Completed", text: "Borhan Chowdhury finished '10 Hours Behind-the-Wheel'.", time: "1 hour ago" },
  { id: 2, title: "New Roadmap Enrollment", text: "Mentee registered for 60-day road driving sprint.", time: "Yesterday" }
];

let coachMessages = [
  { from: "Borhan Chowdhury", to: "Dr. David Brown", text: "Finished highway merging drill yesterday. Ready for next checklist.", time: "Today at 9:15 AM", senderRole: "mentee" },
  { from: "Dr. David Brown", to: "Borhan Chowdhury", text: "Excellent job Borhan. I have added parallel parking drills to your checklist.", time: "Today at 9:30 AM", senderRole: "coach" }
];

function showTab(tabName) {
  if (currentUser === "" && (tabName === "planner" || tabName === "coach" || tabName === "account")) {
    alert("Please log in to access this portal.");
    showTab("login");
    return;
  }
  if (tabName === "coach" && currentRole !== "Coach") {
    alert("Access Denied: Only coaches can access the Coach Portal.");
    return;
  }

  let pages = document.getElementsByClassName("tab-page");
  for (let i = 0; i < pages.length; i++) pages[i].classList.remove("active");

  let buttons = document.getElementsByClassName("nav-btn");
  for (let i = 0; i < buttons.length; i++) buttons[i].classList.remove("active");

  let target = document.getElementById(tabName + "-page");
  if (target) target.classList.add("active");

  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].textContent.toLowerCase().includes(tabName.toLowerCase())) {
      buttons[i].classList.add("active");
    }
  }

  if (tabName === "home") renderHomeFeed();
  if (tabName === "planner") renderMenteeGoals();
  if (tabName === "coach") renderCoachPortal();
  if (tabName === "reviews") renderReviews();
  if (tabName === "account") renderAccount();
}

function doLogin(e) {
  e.preventDefault();
  let val = document.getElementById("user-input").value.trim().toLowerCase();
  let rInput = document.getElementById("role-input").value;

  if (val.includes("borhan")) {
    currentUser = "Borhan Chowdhury";
    currentRole = "Mentee";
    currentEmail = "bchowdhury@student.pvamu.edu";
  } else if (val.includes("david") || val.includes("brown")) {
    currentUser = "Dr. David Brown";
    currentRole = "Coach";
    currentEmail = "dbrown@accountaday.com";
  } else if (val.includes("sarah")) {
    currentUser = "Sarah Jenkins";
    currentRole = "Coach";
    currentEmail = "sjenkins@accountaday.com";
  } else if (val.includes("marcus")) {
    currentUser = "Marcus Vance";
    currentRole = "Coach";
    currentEmail = "mvance@accountaday.com";
  } else {
    currentUser = document.getElementById("user-input").value.trim();
    currentRole = rInput;
    currentEmail = "user@accountaday.com";
  }

  document.getElementById("user-display").textContent = currentUser + " (" + currentRole + ")";
  document.getElementById("auth-btn").textContent = "Logout";
  document.getElementById("user-summary-card").style.display = "flex";
  document.getElementById("summary-username").textContent = currentUser;

  document.getElementById("user-input").value = "";
  document.getElementById("pass-input").value = "";

  if (currentRole === "Coach") {
    document.getElementById("coach-name-display").textContent = currentUser;
    showTab("coach");
  } else {
    document.getElementById("mentee-name-display").textContent = currentUser;
    showTab("planner");
  }
}

function doSignup(e) {
  e.preventDefault();
  let name = document.getElementById("signup-name").value.trim();
  let email = document.getElementById("signup-email").value.trim();

  currentUser = name;
  currentRole = "Mentee";
  currentEmail = email;

  document.getElementById("user-display").textContent = currentUser + " (" + currentRole + ")";
  document.getElementById("auth-btn").textContent = "Logout";
  document.getElementById("user-summary-card").style.display = "flex";
  document.getElementById("summary-username").textContent = currentUser;
  document.getElementById("mentee-name-display").textContent = currentUser;

  document.getElementById("signup-name").value = "";
  document.getElementById("signup-email").value = "";
  document.getElementById("signup-pass").value = "";

  alert("Account created successfully. Welcome to AccountaDay.");
  showTab("planner");
}

function handleAuth() {
  if (currentUser !== "") {
    currentUser = "";
    currentRole = "";
    document.getElementById("user-display").textContent = "Guest (Not Logged In)";
    document.getElementById("auth-btn").textContent = "Login";
    document.getElementById("user-summary-card").style.display = "none";
    showTab("login");
  } else {
    showTab("login");
  }
}

function renderHomeFeed() {
  let box = document.getElementById("community-feed");
  box.innerHTML = "";
  for (let i = 0; i < feedPosts.length; i++) {
    let p = feedPosts[i];
    box.innerHTML += 
      "<div class='feed-post'>" +
        "<div class='feed-user-meta'>" +
          "<div style='display:flex;align-items:center;'><img src='" + p.avatar + "' class='feed-avatar' alt='Avatar' onerror=\"this.src='images/logo-cropped.png'\"><strong>" + p.user + "</strong></div>" +
          "<span style='font-size:13px;color:#94a3b8;'>" + p.time + "</span>" +
        "</div>" +
        "<div class='feed-badge'>Target: " + p.goalTitle + " | Coach: " + p.coach + "</div>" +
        "<p style='font-size:15px;color:#334155;margin:8px 0;line-height:1.6;'>" + p.text + "</p>" +
        "<button class='btn btn-small btn-outline' onclick='likePost(" + i + ")'>" + p.likes + " Cheers</button>" +
      "</div>";
  }

  let total = 0, done = 0;
  for (let g = 0; g < goals.length; g++) {
    for (let m = 0; m < goals[g].milestones.length; m++) {
      total++;
      if (goals[g].milestones[m].status === "Completed") done++;
    }
  }
  document.getElementById("summary-rate").textContent = (total === 0 ? 0 : Math.round((done / total) * 100)) + "%";
}

function likePost(i) {
  feedPosts[i].likes++;
  renderHomeFeed();
}

function switchMenteeSection(sec) {
  let btns = document.getElementsByClassName("student-subtab-btn");
  for (let i = 0; i < btns.length; i++) btns[i].classList.remove("active");

  document.getElementById("mentee-section-goals").style.display = "none";
  document.getElementById("mentee-section-messages").style.display = "none";

  if (sec === "goals") {
    btns[0].classList.add("active");
    document.getElementById("mentee-section-goals").style.display = "block";
  } else {
    btns[1].classList.add("active");
    document.getElementById("mentee-section-messages").style.display = "block";
    renderMenteeChat();
  }
}

function renderMenteeGoals() {
  let tabsBar = document.getElementById("goal-tabs-container");
  tabsBar.innerHTML = "";
  for (let i = 0; i < goals.length; i++) {
    let btn = document.createElement("button");
    btn.className = "goal-tab-btn" + (i === selectedGoalIndex ? " active" : "");
    btn.textContent = (i + 1) + ". " + goals[i].title;
    btn.onclick = function() { selectedGoalIndex = i; renderMenteeGoals(); };
    tabsBar.appendChild(btn);
  }

  let g = goals[selectedGoalIndex];
  let coachObj = getCoachByName(g.coach);
  let done = 0;
  for (let m = 0; m < g.milestones.length; m++) {
    if (g.milestones[m].status === "Completed") done++;
  }
  let pct = g.milestones.length === 0 ? 0 : Math.round((done / g.milestones.length) * 100);

  let opts = "";
  for (let c = 0; c < coaches.length; c++) {
    let sel = coaches[c].name === g.coach ? "selected" : "";
    opts += "<option value='" + coaches[c].name + "' " + sel + ">" + coaches[c].name + "</option>";
  }

  document.getElementById("active-goal-container").innerHTML = 
    "<div class='card card-accent-blue'>" +
      "<h3>" + g.title + "</h3>" +
      "<p style='font-size: 15px;'>Timeline: <strong>" + g.duration + "</strong></p>" +
      "<div class='coach-badge-row'>" +
        "<div>Assigned Coach: <strong>" + g.coach + "</strong> (" + coachObj.rating + " Stars)</div>" +
        "<div class='coach-select-box'>" +
          "<button class='btn btn-purple btn-small' onclick='switchMenteeSection(\"messages\")'>Message Coach</button>" +
          "<select id='coach-selector-input'>" + opts + "</select>" +
          "<button class='btn btn-blue btn-small' onclick='setGoalCoach(" + g.id + ")'>Set Coach</button>" +
        "</div>" +
      "</div>" +
    "</div>" +
    "<div class='grid-2'>" +
      "<div class='card col-left card-accent-purple'><h3>Daily Milestones</h3><ul id='milestone-list'></ul></div>" +
      "<div class='card col-right'>" +
        "<h3>Goal Progress</h3><h1>" + pct + "%</h1>" +
        "<progress value='" + pct + "' max='100'></progress>" +
        "<p style='margin:10px 0; font-size: 16px;'><strong>" + done + "</strong> of <strong>" + g.milestones.length + "</strong> completed</p>" +
        "<button class='btn btn-green full-width' onclick='downloadReport()'>Download PDF Report</button>" +
      "</div>" +
    "</div>";

  let list = document.getElementById("milestone-list");
  for (let i = 0; i < g.milestones.length; i++) {
    let m = g.milestones[i];
    let li = document.createElement("li");
    li.className = "milestone-item";
    li.innerHTML = 
      "<div><strong>" + m.text + "</strong> (" + m.priority + ")</div>" +
      "<select onchange='updateGoalMilestoneStatus(" + selectedGoalIndex + ", " + i + ", this.value)'>" +
        "<option " + (m.status === "Planned" ? "selected" : "") + ">Planned</option>" +
        "<option " + (m.status === "Completed" ? "selected" : "") + ">Completed</option>" +
      "</select>";
    list.appendChild(li);
  }

  document.getElementById("mentee-msg-count").textContent = coachMessages.length;
}

function updateGoalMilestoneStatus(gIdx, mIdx, val) {
  goals[gIdx].milestones[mIdx].status = val;
  if (val === "Completed") {
    coachNotifications.unshift({
      id: coachNotifications.length + 1,
      title: "Milestone Completed",
      text: goals[gIdx].mentee + " completed '" + goals[gIdx].milestones[mIdx].text + "'.",
      time: "Just now"
    });
  }
  renderMenteeGoals();
}

function setGoalCoach(goalId) {
  let chosen = document.getElementById("coach-selector-input").value;
  for (let i = 0; i < goals.length; i++) {
    if (goals[i].id === goalId) {
      goals[i].coach = chosen;
      break;
    }
  }
  renderMenteeGoals();
  alert("Coach updated successfully.");
}

function renderMenteeChat() {
  let stream = document.getElementById("mentee-chat-stream");
  stream.innerHTML = "";
  for (let i = 0; i < coachMessages.length; i++) {
    let m = coachMessages[i];
    let bubbleClass = m.senderRole === "mentee" ? "chat-bubble from-coach" : "chat-bubble from-mentee";
    stream.innerHTML += 
      "<div class='" + bubbleClass + "'>" +
        "<strong>" + m.from + ":</strong> " + m.text +
        "<small>" + m.time + "</small>" +
      "</div>";
  }
  stream.scrollTop = stream.scrollHeight;
}

function sendMenteeResponse(e) {
  e.preventDefault();
  let input = document.getElementById("mentee-reply-input");
  let txt = input.value.trim();
  if (!txt) return;

  let assignedCoach = goals[selectedGoalIndex].coach;

  coachMessages.push({
    from: currentUser || "Borhan Chowdhury",
    to: assignedCoach,
    text: txt,
    time: "Just now",
    senderRole: "mentee"
  });

  coachNotifications.unshift({
    id: coachNotifications.length + 1,
    title: "New Student Message",
    text: (currentUser || "Borhan Chowdhury") + " sent a message: '" + txt + "'",
    time: "Just now"
  });

  input.value = "";
  renderMenteeChat();
  document.getElementById("mentee-msg-count").textContent = coachMessages.length;
  document.getElementById("msg-count").textContent = coachMessages.length;
}

function switchCoachSection(sec) {
  let btns = document.getElementsByClassName("coach-subtab-btn");
  for (let i = 0; i < btns.length; i++) btns[i].classList.remove("active");

  document.getElementById("coach-section-goals").style.display = "none";
  document.getElementById("coach-section-notifs").style.display = "none";
  document.getElementById("coach-section-messages").style.display = "none";

  if (sec === "goals") {
    btns[0].classList.add("active");
    document.getElementById("coach-section-goals").style.display = "block";
  } else if (sec === "notifs") {
    btns[1].classList.add("active");
    document.getElementById("coach-section-notifs").style.display = "block";
    renderCoachNotifs();
  } else {
    btns[2].classList.add("active");
    document.getElementById("coach-section-messages").style.display = "block";
    renderCoachChat();
  }
}

function renderCoachPortal() {
  let name = currentUser || "Dr. David Brown";
  document.getElementById("coach-name-display").textContent = name;

  let coachGoals = [];
  for (let i = 0; i < goals.length; i++) {
    if (goals[i].coach.toLowerCase() === name.toLowerCase()) coachGoals.push(goals[i]);
  }
  if (coachGoals.length === 0) coachGoals = goals;

  let cGrid = document.getElementById("coach-assigned-goals");
  cGrid.innerHTML = "";
  for (let i = 0; i < coachGoals.length; i++) {
    let g = coachGoals[i];
    let chip = document.createElement("div");
    chip.className = "coach-goal-chip" + (g.id === selectedCoachGoalId ? " active" : "");
    chip.innerHTML = "<h4>" + g.title + "</h4><p style='font-size:14px;color:#64748b;'>Mentee: " + g.mentee + "</p>";
    chip.onclick = function() { selectedCoachGoalId = g.id; renderCoachPortal(); };
    cGrid.appendChild(chip);
  }

  let activeGoal = coachGoals[0];
  for (let i = 0; i < goals.length; i++) {
    if (goals[i].id === selectedCoachGoalId) { activeGoal = goals[i]; break; }
  }

  if (activeGoal) {
    document.getElementById("coach-selected-goal-title").textContent = activeGoal.title + " (" + activeGoal.mentee + ")";
    let tbody = document.getElementById("coach-table-body");
    tbody.innerHTML = "";
    for (let i = 0; i < activeGoal.milestones.length; i++) {
      let m = activeGoal.milestones[i];
      let tr = document.createElement("tr");
      tr.innerHTML = 
        "<td>" + m.text + "</td><td>" + m.priority + "</td><td><strong>" + m.status + "</strong></td>" +
        "<td><button class='btn btn-small btn-blue' onclick='coachToggle(" + activeGoal.id + ", " + i + ")'>Toggle</button></td>" +
        "<td><button class='btn btn-small btn-gray' onclick='coachDelete(" + activeGoal.id + ", " + i + ")'>Delete</button></td>";
      tbody.appendChild(tr);
    }
  }

  document.getElementById("notif-count").textContent = coachNotifications.length;
  document.getElementById("msg-count").textContent = coachMessages.length;
}

function renderCoachNotifs() {
  let box = document.getElementById("coach-notifs-list");
  box.innerHTML = "";
  for (let i = 0; i < coachNotifications.length; i++) {
    let n = coachNotifications[i];
    box.innerHTML += 
      "<div class='feed-post'>" +
        "<div class='feed-user-meta'><strong>" + n.title + "</strong><span style='font-size:13px;color:#94a3b8;'>" + n.time + "</span></div>" +
        "<p style='font-size:15px;color:#334155;margin-top:6px;'>" + n.text + "</p>" +
      "</div>";
  }
}

function renderCoachChat() {
  let stream = document.getElementById("coach-chat-stream");
  stream.innerHTML = "";
  for (let i = 0; i < coachMessages.length; i++) {
    let m = coachMessages[i];
    let bubbleClass = m.senderRole === "coach" ? "chat-bubble from-coach" : "chat-bubble from-mentee";
    stream.innerHTML += 
      "<div class='" + bubbleClass + "'>" +
        "<strong>" + m.from + ":</strong> " + m.text +
        "<small>" + m.time + "</small>" +
      "</div>";
  }
  stream.scrollTop = stream.scrollHeight;
}

function sendCoachResponse(e) {
  e.preventDefault();
  let input = document.getElementById("coach-reply-input");
  let txt = input.value.trim();
  if (!txt) return;

  coachMessages.push({
    from: currentUser || "Dr. David Brown",
    to: "Borhan Chowdhury",
    text: txt,
    time: "Just now",
    senderRole: "coach"
  });

  input.value = "";
  renderCoachChat();
  document.getElementById("msg-count").textContent = coachMessages.length;
  document.getElementById("mentee-msg-count").textContent = coachMessages.length;
}

function coachAddMilestone(e) {
  e.preventDefault();
  let txt = document.getElementById("coach-milestone-text").value;
  let pri = document.getElementById("coach-milestone-priority").value;
  for (let i = 0; i < goals.length; i++) {
    if (goals[i].id === selectedCoachGoalId) {
      goals[i].milestones.push({ text: txt, priority: pri, status: "Planned" });
      break;
    }
  }
  document.getElementById("coach-milestone-text").value = "";
  renderCoachPortal();
}

function coachToggle(goalId, idx) {
  for (let i = 0; i < goals.length; i++) {
    if (goals[i].id === goalId) {
      if (goals[i].milestones[idx].status === "Completed") {
        goals[i].milestones[idx].status = "Planned";
      } else {
        goals[i].milestones[idx].status = "Completed";
      }
      break;
    }
  }
  renderCoachPortal();
}

function coachDelete(goalId, idx) {
  for (let i = 0; i < goals.length; i++) {
    if (goals[i].id === goalId) {
      goals[i].milestones.splice(idx, 1);
      break;
    }
  }
  renderCoachPortal();
}

function renderReviews() {
  let dir = document.getElementById("coaches-directory");
  dir.innerHTML = "";
  for (let i = 0; i < coaches.length; i++) {
    let c = coaches[i];
    dir.innerHTML += 
      "<div class='coach-card card-accent-blue'>" +
        "<img src='" + c.avatar + "' class='coach-card-avatar' alt='" + c.name + "' onerror=\"this.src='images/logo-cropped.png'\">" +
        "<h3>" + c.name + "</h3>" +
        "<p class='subtitle'>" + c.specialty + "</p>" +
        "<p class='coach-rating-text'>" + c.rating + " / 5 Stars</p>" +
        "<button class='btn btn-blue full-width' onclick='contactCoach(\"" + c.name + "\")'>Message Coach</button>" +
      "</div>";
  }

  let sel = document.getElementById("review-coach-select");
  sel.innerHTML = "";
  for (let i = 0; i < coaches.length; i++) {
    let opt = document.createElement("option");
    opt.value = coaches[i].name;
    opt.textContent = coaches[i].name;
    sel.appendChild(opt);
  }

  let rList = document.getElementById("reviews-list-container");
  rList.innerHTML = "";
  for (let i = 0; i < reviews.length; i++) {
    let r = reviews[i];
    rList.innerHTML += 
      "<div class='review-item'>" +
        "<div class='review-top'>" +
          "<div style='display:flex;align-items:center;'><img src='" + r.avatar + "' class='feed-avatar' alt='Review Avatar' onerror=\"this.src='images/logo-cropped.png'\"><strong class='review-author-title'>" + r.mentee + " on " + r.coach + "</strong></div>" +
          "<span class='review-stars-badge'>" + r.rating + " Stars</span>" +
        "</div>" +
        "<p class='review-body-text'>" + r.comment + "</p>" +
      "</div>";
  }
}

function submitCoachReview(e) {
  e.preventDefault();
  let cName = document.getElementById("review-coach-select").value;
  let rating = parseInt(document.getElementById("review-stars-select").value);
  let comment = document.getElementById("review-comment-text").value;

  let userAvatar = currentUser.toLowerCase().includes("borhan") ? "images/user3.jpg" : "images/logo-cropped.png";

  reviews.unshift({ id: reviews.length + 1, coach: cName, mentee: currentUser || "Borhan Chowdhury", avatar: userAvatar, rating: rating, comment: comment });
  document.getElementById("review-comment-text").value = "";
  alert("Thank you. Your review for " + cName + " has been posted.");
  renderReviews();
}

function contactCoach(name) {
  let c = getCoachByName(name);
  showTab("contact");
  document.getElementById("contact-recipient").value = name;
  document.getElementById("contact-message").focus();
}

function handleContact(e) {
  e.preventDefault();
  let rec = document.getElementById("contact-recipient").value;
  let name = document.getElementById("contact-name").value;
  let text = document.getElementById("contact-message").value;

  coachMessages.push({
    from: name,
    to: rec,
    text: text,
    time: "Just now",
    senderRole: "mentee"
  });

  coachNotifications.unshift({
    id: coachNotifications.length + 1,
    title: "New Message Received",
    text: name + " sent a message to " + rec + ".",
    time: "Just now"
  });

  document.getElementById("contact-msg").textContent = "Message sent successfully to " + rec + ".";
  e.target.reset();
}

function renderAccount() {
  document.getElementById("account-name-field").textContent = currentUser || "Borhan Chowdhury";
  document.getElementById("account-role-tag").textContent = currentRole || "Mentee";
  document.getElementById("edit-account-name").value = currentUser || "Borhan Chowdhury";
  document.getElementById("edit-account-email").value = currentEmail;
  document.getElementById("edit-account-role").value = currentRole || "Mentee";
  document.getElementById("edit-account-plan").value = currentPlan;
  document.getElementById("edit-account-phone").value = currentPhone;

  let avatarElem = document.getElementById("account-avatar-img");
  if (currentRole === "Coach") {
    avatarElem.src = "images/avatar-coach.png";
  } else {
    avatarElem.src = "images/user3.jpg";
  }
}

function saveAccountProfile(e) {
  e.preventDefault();
  currentUser = document.getElementById("edit-account-name").value.trim();
  currentEmail = document.getElementById("edit-account-email").value.trim();
  currentRole = document.getElementById("edit-account-role").value;
  currentPlan = document.getElementById("edit-account-plan").value;
  currentPhone = document.getElementById("edit-account-phone").value.trim();

  document.getElementById("user-display").textContent = currentUser + " (" + currentRole + ")";
  document.getElementById("summary-username").textContent = currentUser;
  document.getElementById("mentee-name-display").textContent = currentUser;
  document.getElementById("account-name-field").textContent = currentUser;
  document.getElementById("account-role-tag").textContent = currentRole;
  document.getElementById("billing-active-plan").textContent = currentPlan;

  let avatarElem = document.getElementById("account-avatar-img");
  if (currentRole === "Coach") {
    avatarElem.src = "images/avatar-coach.png";
    document.getElementById("coach-name-display").textContent = currentUser;
  } else {
    avatarElem.src = "images/user3.jpg";
  }

  document.getElementById("account-save-msg").textContent = "Profile updated successfully.";
  setTimeout(function() {
    document.getElementById("account-save-msg").textContent = "";
  }, 3500);
}

function getCoachByName(name) {
  for (let i = 0; i < coaches.length; i++) {
    if (coaches[i].name.toLowerCase() === name.toLowerCase()) return coaches[i];
  }
  return coaches[0];
}

function selectPlan(title, price) {
  document.getElementById("billing-active-plan").textContent = title;
  document.getElementById("billing-balance").textContent = "$" + price.toFixed(2) + " Due";
  document.getElementById("payment-amount").value = "$" + price.toFixed(2);
  currentPlan = title;
  alert(title + " selected. Balance updated to $" + price.toFixed(2) + ".");
}

function togglePaymentInputs(val) {
  if (val === "card") {
    document.getElementById("card-fields").style.display = "block";
    document.getElementById("bank-fields").style.display = "none";
  } else {
    document.getElementById("card-fields").style.display = "none";
    document.getElementById("bank-fields").style.display = "block";
  }
}

function handlePayment(e) {
  e.preventDefault();
  let amt = document.getElementById("payment-amount").value;
  document.getElementById("billing-balance").textContent = "$0.00 (No Dues)";
  document.getElementById("payment-status-msg").textContent = "Payment of " + amt + " processed successfully. Receipt sent to your email.";
}

function downloadReport() {
  let g = goals[selectedGoalIndex];
  let done = 0;
  for (let m = 0; m < g.milestones.length; m++) {
    if (g.milestones[m].status === "Completed") done++;
  }
  let pct = g.milestones.length === 0 ? 0 : Math.round((done / g.milestones.length) * 100);

  let w = window.open("", "_blank");
  let rows = "";
  for (let i = 0; i < g.milestones.length; i++) {
    let m = g.milestones[i];
    rows += "<tr><td>" + (i + 1) + "</td><td>" + m.text + "</td><td>" + m.priority + "</td><td>" + m.status + "</td></tr>";
  }

  w.document.body.innerHTML = 
    "<h1 style='color:#2563eb;'>AccountaDay Progress Report</h1>" +
    "<p><strong>Mentee:</strong> " + (currentUser || "Borhan Chowdhury") + " | <strong>Goal:</strong> " + g.title + "</p>" +
    "<p><strong>Assigned Coach:</strong> " + g.coach + " | <strong>Timeline:</strong> " + g.duration + "</p>" +
    "<h2 style='color:#10b981;'>" + pct + "% Completed (" + done + " of " + g.milestones.length + " milestones)</h2>" +
    "<table border='1' cellspacing='0' cellpadding='8' style='width:100%; border-collapse:collapse;'>" +
      "<tr style='background:#f1f5f9;'><th>#</th><th>Milestone</th><th>Priority</th><th>Status</th></tr>" +
      rows +
    "</table>";

  w.print();
}

renderHomeFeed();
renderMenteeGoals();
renderReviews();