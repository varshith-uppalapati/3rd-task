let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

renderTasks();

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        addTask();
    }
});

document.querySelectorAll("[data-filter]").forEach(button => {

    button.addEventListener("click", () => {

        currentFilter = button.dataset.filter;

        renderTasks();
    });

});

function addTask(){

    const text = taskInput.value.trim();

    if(text === ""){
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    taskInput.value = "";

    renderTasks();
}

function renderTasks(){

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if(currentFilter === "active"){

        filteredTasks = tasks.filter(task => !task.completed);

    }else if(currentFilter === "completed"){

        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span class="task-text ${task.completed ? 'completed' : ''}">
                ${task.text}
            </span>

            <div class="actions">

                <button
                    class="complete-btn"
                    data-id="${task.id}">
                    ✓
                </button>

                <button
                    class="edit-btn"
                    data-id="${task.id}">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    data-id="${task.id}">
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(li);
    });
}

taskList.addEventListener("click", function(e){

    const id = Number(e.target.dataset.id);

    if(e.target.classList.contains("delete-btn")){

        deleteTask(id);
    }

    if(e.target.classList.contains("complete-btn")){

        toggleTask(id);
    }

    if(e.target.classList.contains("edit-btn")){

        editTask(id);
    }
});

function deleteTask(id){

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();
}

function toggleTask(id){

    tasks = tasks.map(task => {

        if(task.id === id){

            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();

    renderTasks();
}

function editTask(id){

    const task = tasks.find(task => task.id === id);

    const newText = prompt("Edit Task", task.text);

    if(newText && newText.trim() !== ""){

        task.text = newText.trim();

        saveTasks();

        renderTasks();
    }
}

function saveTasks(){

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}
