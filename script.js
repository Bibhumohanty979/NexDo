/*==========================================
        NexDo - Your Smart Task Manager
==========================================*/

//==============================
// DOM Elements
//==============================

const loginScreen = document.getElementById("loginScreen");
const loginBtn = document.getElementById("loginBtn");
const username = document.getElementById("username");

const profileBtn = document.getElementById("profileBtn");
const profileMenu = document.getElementById("profileMenu");
const profileName = document.getElementById("profileName");
const logoutBtn = document.getElementById("logoutBtn");

const themeBtn = document.getElementById("themeBtn");

const welcomeText = document.getElementById("welcomeText");

const totalTask = document.getElementById("totalTask");
const completedTask = document.getElementById("completedTask");
const pendingTask = document.getElementById("pendingTask");
const importantTask = document.getElementById("importantTask");

const progressBar = document.getElementById("progressBar");
const progressPercent = document.getElementById("progressPercent");

const toast = document.getElementById("toast");

//==============================
// Application Data
//==============================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let trash = JSON.parse(localStorage.getItem("trash")) || [];

let currentUser = localStorage.getItem("nexdoUser") || "";

//==============================
// Toast
//==============================

function showToast(message,color="#4F46E5"){

    toast.innerHTML = message;

    toast.style.background = color;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}

//==============================
// Login
//==============================

window.addEventListener("load",()=>{

    if(currentUser){

        loginScreen.style.display="none";

        profileName.textContent=currentUser;

        greeting();

    }

    updateDashboard();

});

loginBtn.addEventListener("click",()=>{

    const name=username.value.trim();

    if(name===""){

        showToast("Enter your name","#EF4444");

        return;

    }

    currentUser=name;

    localStorage.setItem("nexdoUser",currentUser);

    profileName.textContent=currentUser;

    greeting();

    loginScreen.style.display="none";

    showToast("Welcome to NexDo!");

});

//==============================
// Greeting
//==============================

function greeting(){

    const hour=new Date().getHours();

    let text="";

    if(hour<12){

        text="Good Morning ☀️";

    }

    else if(hour<18){

        text="Good Afternoon 🌤️";

    }

    else{

        text="Good Evening 🌙";

    }

    welcomeText.textContent=`${text}, ${currentUser}`;

}

//==============================
// Profile Menu
//==============================

profileBtn.addEventListener("click",(e)=>{

    e.stopPropagation();

    profileMenu.classList.toggle("show");

});

document.addEventListener("click",()=>{

    profileMenu.classList.remove("show");

});

//==============================
// Logout
//==============================

logoutBtn.addEventListener("click",()=>{

    localStorage.removeItem("nexdoUser");

    location.reload();

});

//==============================
// Theme
//==============================

const savedTheme=localStorage.getItem("theme");

if(savedTheme==="dark"){

    document.body.classList.add("dark");

    themeBtn.innerHTML="☀️";

}

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

        themeBtn.innerHTML="☀️";

    }

    else{

        localStorage.setItem("theme","light");

        themeBtn.innerHTML="🌙";

    }

});

//==============================
// Save Data
//==============================

function saveData(){

    localStorage.setItem("tasks",JSON.stringify(tasks));

    localStorage.setItem("trash",JSON.stringify(trash));

}

//==============================
// Dashboard
//==============================

function updateDashboard(){

    totalTask.textContent=tasks.length;

    const completed=tasks.filter(task=>task.completed);

    completedTask.textContent=completed.length;

    pendingTask.textContent=tasks.length-completed.length;

    importantTask.textContent=

    tasks.filter(task=>task.priority==="High").length;

    const percent=

    tasks.length===0

    ?0

    :Math.round((completed.length/tasks.length)*100);

    progressBar.style.width=percent+"%";

    progressPercent.textContent=percent+"%";

}
/*==========================================
        Task DOM Elements
==========================================*/

const taskInput = document.getElementById("taskInput");
const category = document.getElementById("category");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskContainer = document.getElementById("taskContainer");

/*==========================================
        Add Task
==========================================*/

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        addTask();

    }

});

function addTask() {

    const title = taskInput.value.trim();

    if (title === "") {

        showToast("Please enter a task!", "#EF4444");

        return;

    }

    const task = {

        id: Date.now(),

        title,

        category: category.value,

        priority: priority.value,

        dueDate: dueDate.value,

        completed: false,

        pinned: false

    };

    tasks.unshift(task);

    saveData();

    clearForm();

    renderTasks();

    updateDashboard();

    showToast("Task Added Successfully", "#22C55E");

}

/*==========================================
        Clear Form
==========================================*/

function clearForm() {

    taskInput.value = "";

    dueDate.value = "";

    category.selectedIndex = 0;

    priority.selectedIndex = 0;

}

/*==========================================
        Render Tasks
==========================================*/

function renderTasks(taskArray = tasks) {

    taskContainer.innerHTML = "";

    if (taskArray.length === 0) {

        taskContainer.innerHTML = `

        <div class="empty">

            No Tasks Available

        </div>

        `;

        return;

    }

    taskArray.forEach(task => {

        createTaskCard(task);

    });

}

/*==========================================
        Create Task Card
==========================================*/

function createTaskCard(task) {

    const card = document.createElement("div");

    card.className = "task-card";

    if (task.completed) {

        card.classList.add("completed");

    }

    let overdue = "";

    if (task.dueDate) {

        const today = new Date().toISOString().split("T")[0];

        if (task.dueDate < today && !task.completed) {

            overdue = `<span class="overdue">Overdue</span>`;

        }

    }

    card.innerHTML = `

    <div class="task-info">

        <h3>${task.pinned ? "📌 " : ""}${task.title}</h3>

        <p>📂 ${task.category}</p>

        <p>📅 ${task.dueDate || "No Due Date"} ${overdue}</p>

        <span class="priority ${task.priority.toLowerCase()}">

            ${task.priority}

        </span>

    </div>

    <div class="task-buttons">

        <button class="complete"

            onclick="toggleTask(${task.id})">

            ${task.completed ? "Undo" : "Complete"}

        </button>

        <button class="edit"

            onclick="editTask(${task.id})">

            Edit

        </button>

        <button class="delete"

            onclick="deleteTask(${task.id})">

            Delete

        </button>

        <button class="pin"

            onclick="pinTask(${task.id})">

            📌

        </button>

    </div>

    `;

    taskContainer.appendChild(card);

}

/*==========================================
        Complete / Undo
==========================================*/

function toggleTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    task.completed = !task.completed;

    saveData();

    renderTasks();

    updateDashboard();

    showToast(task.completed ? "Task Completed" : "Task Reopened", "#3B82F6");

}

/*==========================================
        Edit Task
==========================================*/

function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    const updatedTitle = prompt("Edit Task", task.title);

    if (updatedTitle === null) return;

    if (updatedTitle.trim() === "") return;

    task.title = updatedTitle.trim();

    saveData();

    renderTasks();

    showToast("Task Updated", "#F59E0B");

}

/*==========================================
        Delete Task
==========================================*/

function deleteTask(id) {

    const index = tasks.findIndex(task => task.id === id);

    if (index === -1) return;

    trash.push(tasks[index]);

    tasks.splice(index, 1);

    saveData();

    renderTasks();

    updateDashboard();

    showToast("Task Moved To Trash", "#EF4444");

}

/*==========================================
        Pin Task
==========================================*/

function pinTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    task.pinned = !task.pinned;

    tasks.sort((a, b) => b.pinned - a.pinned);

    saveData();

    renderTasks();

    showToast(task.pinned ? "Task Pinned" : "Task Unpinned", "#8B5CF6");

}

/*==========================================
        Initial Render
==========================================*/

renderTasks();
updateDashboard();
/*==========================================
        Sidebar DOM
==========================================*/

const dashboardBtn=document.getElementById("dashboardBtn");
const allTaskBtn=document.getElementById("allTaskBtn");
const todayBtn=document.getElementById("todayBtn");
const importantBtn=document.getElementById("importantBtn");
const completedBtn=document.getElementById("completedBtn");
const trashBtn=document.getElementById("trashBtn");
const settingsBtn=document.getElementById("settingsBtn");

const searchTask=document.getElementById("searchTask");

/*==========================================
        Active Sidebar
==========================================*/

function setActive(button){

    document.querySelectorAll(".sidebar li").forEach(item=>{

        item.classList.remove("active");

    });

    button.classList.add("active");

}

/*==========================================
        Search
==========================================*/

searchTask.addEventListener("input",()=>{

    const keyword=searchTask.value.trim().toLowerCase();

    const filtered=tasks.filter(task=>

        task.title.toLowerCase().includes(keyword)

    );

    renderTasks(filtered);

});

/*==========================================
        Dashboard
==========================================*/

dashboardBtn.addEventListener("click",()=>{

    setActive(dashboardBtn);

    renderTasks();

});

/*==========================================
        All Tasks
==========================================*/

allTaskBtn.addEventListener("click",()=>{

    setActive(allTaskBtn);

    renderTasks();

});

/*==========================================
        Today's Tasks
==========================================*/

todayBtn.addEventListener("click",()=>{

    setActive(todayBtn);

    const today=new Date().toISOString().split("T")[0];

    const todayTasks=tasks.filter(task=>

        task.dueDate===today

    );

    renderTasks(todayTasks);

});

/*==========================================
        Important Tasks
==========================================*/

importantBtn.addEventListener("click",()=>{

    setActive(importantBtn);

    const important=tasks.filter(task=>

        task.priority==="High"

    );

    renderTasks(important);

});

/*==========================================
        Completed Tasks
==========================================*/

completedBtn.addEventListener("click",()=>{

    setActive(completedBtn);

    const completed=tasks.filter(task=>

        task.completed

    );

    renderTasks(completed);

});

/*==========================================
        Trash
==========================================*/

trashBtn.addEventListener("click",()=>{

    setActive(trashBtn);

    taskContainer.innerHTML="";

    if(trash.length===0){

        taskContainer.innerHTML=`

        <div class="empty">

            Trash is Empty

        </div>

        `;

        return;

    }

    trash.forEach(task=>{

        const card=document.createElement("div");

        card.className="task-card";

        card.innerHTML=`

        <div class="task-info">

            <h3>${task.title}</h3>

            <p>📂 ${task.category}</p>

            <p>📅 ${task.dueDate || "No Due Date"}</p>

        </div>

        <div class="task-buttons">

            <button class="complete"

                onclick="restoreTask(${task.id})">

                Restore

            </button>

            <button class="delete"

                onclick="deleteForever(${task.id})">

                Delete Forever

            </button>

        </div>

        `;

        taskContainer.appendChild(card);

    });

});

/*==========================================
        Restore Task
==========================================*/

function restoreTask(id){

    const index=trash.findIndex(task=>task.id===id);

    if(index===-1) return;

    tasks.unshift(trash[index]);

    trash.splice(index,1);

    saveData();

    renderTasks();

    updateDashboard();

    showToast("Task Restored","#22C55E");

}

/*==========================================
        Delete Forever
==========================================*/

function deleteForever(id){

    const index=trash.findIndex(task=>task.id===id);

    if(index===-1) return;

    trash.splice(index,1);

    saveData();

    trashBtn.click();

    showToast("Task Deleted Forever","#EF4444");

}

/*==========================================
        Settings
==========================================*/

settingsBtn.addEventListener("click",()=>{

    setActive(settingsBtn);

    const option=prompt(

`Settings

1 - Toggle Dark Mode
2 - Clear All Tasks
3 - Logout`

    );

    switch(option){

        case "1":

            themeBtn.click();

            break;

        case "2":

            if(confirm("Delete all tasks?")){

                tasks=[];

                trash=[];

                saveData();

                renderTasks();

                updateDashboard();

                showToast("All Tasks Deleted","#EF4444");

            }

            break;

        case "3":

            logoutBtn.click();

            break;

    }

});
/*==========================================
        FINAL FEATURES
==========================================*/

//==============================
// Export Tasks
//==============================

function exportTasks(){

    if(tasks.length===0){

        showToast("No Tasks To Export","#EF4444");

        return;

    }

    const data=JSON.stringify(tasks,null,2);

    const blob=new Blob([data],{type:"application/json"});

    const url=URL.createObjectURL(blob);

    const a=document.createElement("a");

    a.href=url;

    a.download="NexDo_Tasks.json";

    a.click();

    URL.revokeObjectURL(url);

    showToast("Tasks Exported Successfully","#22C55E");

}

//==============================
// Keyboard Shortcuts
//==============================

document.addEventListener("keydown",(e)=>{

    if(e.ctrlKey && e.key==="n"){

        e.preventDefault();

        taskInput.focus();

    }

    if(e.ctrlKey && e.key==="f"){

        e.preventDefault();

        searchTask.focus();

    }

    if(e.key==="Escape"){

        profileMenu.classList.remove("show");

    }

});

//==============================
// Greeting Refresh
//==============================

setInterval(()=>{

    greeting();

},60000);

//==============================
// Auto Save
//==============================

window.addEventListener("beforeunload",()=>{

    saveData();

});

//==============================
// Empty Trash
//==============================

function emptyTrash(){

    if(trash.length===0){

        showToast("Trash Already Empty","#EF4444");

        return;

    }

    if(confirm("Delete all items from Trash?")){

        trash=[];

        saveData();

        trashBtn.click();

        showToast("Trash Cleared","#22C55E");

    }

}

//==============================
// Sort Tasks
//==============================

function sortTasks(){

    tasks.sort((a,b)=>{

        if(a.pinned!==b.pinned){

            return b.pinned-a.pinned;

        }

        if(a.completed!==b.completed){

            return a.completed-b.completed;

        }

        return new Date(a.dueDate||9999999999)-new Date(b.dueDate||9999999999);

    });

    renderTasks();

}

//==============================
// Load
//==============================

window.addEventListener("load",()=>{

    sortTasks();

});

//==============================
// Statistics
//==============================

function getStatistics(){

    return{

        total:tasks.length,

        completed:tasks.filter(task=>task.completed).length,

        pending:tasks.filter(task=>!task.completed).length,

        important:tasks.filter(task=>task.priority==="High").length

    };

}

//==============================
// Refresh Dashboard
//==============================

function refresh(){

    renderTasks();

    updateDashboard();

}

refresh();

//==============================
// Welcome
//==============================

setTimeout(()=>{

    if(currentUser){

        showToast("Welcome Back, "+currentUser);

    }

},700);

//==============================
// Developer Info
//==============================

console.log("%cNexDo","font-size:32px;color:#4F46E5;font-weight:bold");

console.log("%cYour Smart Task Manager","font-size:18px;color:#22C55E");

console.log("%cFrontend Internship Project","font-size:15px;color:#F59E0B");
