const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const listEl = document.getElementById("todo-list");

function addTask(text, completed = false) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = text;
    if (completed) span.classList.add("completed");

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "🗑️";
    deleteBtn.classList.add("delete-btn");


    li.appendChild(span);
    li.appendChild(deleteBtn);
    listEl.appendChild(li);

    span.addEventListener("click", () => {
        span.classList.toggle("completed");
        saveTasks();
    });

    span.addEventListener("dblclick", () => {
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = span.textContent;

        li.replaceChild(editInput, span);
        editInput.focus();

        function finishEdit() {
            const newValue = editInput.value.trim();

            if (newValue !== "") {
            span.textContent = newValue;
            }

            li.replaceChild(span, editInput);
            saveTasks(); 
        }

        editInput.addEventListener("blur", finishEdit);
    
        editInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") finishEdit();
        });
    });


    deleteBtn.addEventListener("click", () => {
        li.remove();
        saveTasks();
    });

    saveTasks();


}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const task = input.value.trim();
    if (task === "") return;

    addTask(task);
    input.value = "";
});

function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#todo-list li span").forEach(span => {
        tasks.push({
        text: span.textContent,
        completed: span.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const saved = localStorage.getItem("tasks");
    if (!saved) return;

    const tasks = JSON.parse(saved);
    tasks.forEach(task => {
        addTask(task.text, task.completed);
    });
}

loadTasks();
