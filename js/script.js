let currentUser = "";
let currentRole = "";

let goalTitle = "Learn Driving & Pass Road Test";
let goalDays = "60 Days";

let milestones = [
  { text: "Study State Driver Handbook", priority: "High", status: "Completed" },
  { text: "Complete 10 Hours of Driving Practice", priority: "High", status: "Completed" },
  { text: "Practice Highway Merging", priority: "Medium", status: "Planned" },
  { text: "Schedule Final Road Driving Test", priority: "Low", status: "Planned" }
];

function showTab(tabName) {
  if (currentUser === "" && (tabName === "planner" || tabName === "instructor")) {
    alert("Please log in first.");
    showTab("login");
    return;
  }

  if (tabName === "instructor" && currentRole !== "Instructor") {
    alert("Access Denied: Only instructors can open this portal.");
    return;
  }

  let pages = document.getElementsByClassName("tab-page");
  for (let i = 0; i < pages.length; i++) {
    pages[i].classList.remove("active");
  }

  let buttons = document.getElementsByClassName("nav-btn");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }

  document.getElementById(tabName + "-page").classList.add("active");

  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].textContent.toLowerCase().includes(tabName)) {
      buttons[i].classList.add("active");
    }
  }
}

function doLogin(e) {
  e.preventDefault();
  currentUser = document.getElementById("user-input").value;
  currentRole = document.getElementById("role-input").value;

  document.getElementById("user-display").textContent = currentUser + " (" + currentRole + ")";
  document.getElementById("auth-btn").textContent = "Logout";

  document.getElementById("user-input").value = "";
  document.getElementById("pass-input").value = "";

  if (currentRole === "Instructor") {
    showTab("instructor");
  } else {
    showTab("planner");
  }
}

function handleAuth() {
  if (currentUser !== "") {
    currentUser = "";
    currentRole = "";
    document.getElementById("user-display").textContent = "Guest (Not Logged In)";
    document.getElementById("auth-btn").textContent = "Login";
    showTab("login");
  } else {
    showTab("login");
  }
}

function saveMainGoal(e) {
  e.preventDefault();
  goalTitle = document.getElementById("goal-input-title").value;
  goalDays = document.getElementById("goal-input-days").value;

  document.getElementById("goal-title-text").textContent = goalTitle;
  document.getElementById("goal-days-text").textContent = goalDays;
  document.getElementById("coach-goal-display").textContent = goalTitle;

  document.getElementById("goal-input-title").value = "";
  document.getElementById("goal-input-days").value = "";
}

function render() {
  let list = document.getElementById("milestone-list");
  list.innerHTML = "";

  for (let i = 0; i < milestones.length; i++) {
    let item = milestones[i];
    let li = document.createElement("li");
    li.className = "milestone-item";
    li.innerHTML = 
      "<div><strong>" + item.text + "</strong> (" + item.priority + ")</div>" +
      "<select onchange='updateStatus(" + i + ", this.value)'>" +
        "<option " + (item.status === "Planned" ? "selected" : "") + ">Planned</option>" +
        "<option " + (item.status === "Completed" ? "selected" : "") + ">Completed</option>" +
      "</select>";
    list.appendChild(li);
  }

  let table = document.getElementById("coach-table-body");
  table.innerHTML = "";

  for (let i = 0; i < milestones.length; i++) {
    let item = milestones[i];
    let tr = document.createElement("tr");
    tr.innerHTML = 
      "<td>" + item.text + "</td>" +
      "<td>" + item.priority + "</td>" +
      "<td>" + item.status + "</td>" +
      "<td><button class='btn btn-gray btn-small' onclick='deleteMilestone(" + i + ")'>Remove</button></td>";
    table.appendChild(tr);
  }

  let completed = 0;
  for (let i = 0; i < milestones.length; i++) {
    if (milestones[i].status === "Completed") completed++;
  }

  let percent = milestones.length === 0 ? 0 : Math.round((completed / milestones.length) * 100);
  document.getElementById("progress-percent").textContent = percent + "%";
  document.getElementById("progress-bar").value = percent;
  document.getElementById("progress-text").textContent = completed + " of " + milestones.length + " completed";
}

function coachAddMilestone(e) {
  e.preventDefault();
  let text = document.getElementById("milestone-input").value;
  let priority = document.getElementById("milestone-priority").value;

  milestones.push({ text: text, priority: priority, status: "Planned" });
  document.getElementById("milestone-input").value = "";
  render();
}

function updateStatus(index, val) {
  milestones[index].status = val;
  render();
}

function deleteMilestone(index) {
  milestones.splice(index, 1);
  render();
}

function downloadReport() {
  let output = "AccountaDay Goal Report\nUser: " + (currentUser || "Mentee") + "\nGoal: " + goalTitle + " (" + goalDays + ")\n\n";
  for (let i = 0; i < milestones.length; i++) {
    output += (i + 1) + ". [" + milestones[i].status + "] " + milestones[i].text + "\n";
  }
  let blob = new Blob([output], { type: "text/plain" });
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "My_Report.txt";
  a.click();
}

function handleContact(e) {
  e.preventDefault();
  document.getElementById("contact-msg").textContent = "Message sent successfully!";
  e.target.reset();
}

render();