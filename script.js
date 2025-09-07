const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const listEl = document.getElementById("todo-list");

//ADD TASK FUNCTION

function addTask(text, completed = false, id = null) {
    const li = document.createElement("li");
    li.classList.add("fade-in");
    
    if (id) {
        li.dataset.id = id;
    }

    const span = document.createElement("span");
    span.textContent = text;
    if (completed) span.classList.add("completed");

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "🗑️";
    deleteBtn.classList.add("delete-btn");

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.classList.add("edit-btn");

    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    listEl.appendChild(li);
    requestAnimationFrame(() => li.classList.add("fade-in"));

    span.addEventListener("click", () => {
        span.classList.toggle("completed");
        const taskId = li.dataset.id;

        fetch(`http://localhost:3000/tasks/${taskId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: span.classList.contains("completed") })
            });

        saveTasks();
    });

    // EDIT TASK FUNCTION

    editBtn.addEventListener("click", () => {
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = span.textContent;
        editInput.classList.add("edit-input");

        li.replaceChild(editInput, span);
        editInput.focus();

        function finishEdit() {
            const newValue = editInput.value.trim();
            const taskId = li.dataset.id;

            if (newValue !== "") {
            span.textContent = newValue;

            fetch(`http://localhost:3000/tasks/${taskId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: newValue })
            });
            }

            li.replaceChild(span, editInput);
        }

        editInput.addEventListener("blur", finishEdit);
        editInput.addEventListener("keydown", e => {
            if (e.key === "Enter") finishEdit();
        });
    });

    // DELETE TASK FUNCTION

    deleteBtn.addEventListener("click", () => {
        const taskId = li.dataset.id; 
        if (taskId) {
            fetch(`http://localhost:3000/tasks/${taskId}`, {
            method: "DELETE"
            })
            .then(res => {
            if (res.ok) {
                li.classList.add("fade-out");
                setTimeout(() => li.remove(), 300);
            }
            });
        }
    });


    

    saveTasks();


}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = input.value.trim();
  if (task === "") return;

  fetch("http://localhost:3000/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: task, completed: false })
  })
  .then(res => res.json())
  .then(newTask => {
    addTask(newTask.text, newTask.completed, newTask.id);
  });

  input.value = "";
});


// SAVE TASKS FUNCTION

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

// LOAD TASKS FUNCTION

function loadTasks() {
  fetch("http://localhost:3000/tasks")
    .then(response => response.json())
    .then(tasks => {
        tasks.forEach(task => {
            addTask(task.text, task.completed, task.id); 
        });
    });
}

//FILTER TASKS DISPLAY FUNCTION

document.getElementById("filter-all").addEventListener("click", () => filterTasks("all"));
document.getElementById("filter-active").addEventListener("click", () => filterTasks("active"));
document.getElementById("filter-completed").addEventListener("click", () => filterTasks("completed"));

function filterTasks(filter) {
  const tasks = document.querySelectorAll("#todo-list li");

  tasks.forEach(li => {
    const span = li.querySelector("span");

    switch (filter) {
      case "all":
        li.style.display = "flex";
        break;
      case "active":
        li.style.display = span.classList.contains("completed") ? "none" : "flex";
        break;
      case "completed":
        li.style.display = span.classList.contains("completed") ? "flex" : "none";
        break;
    }
  });
}

// FILTER BUTTONS COLOR STYLE WHEN CLICKED

const filterBtns = document.getElementById("todo-filter");

filterBtns.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    [...filterBtns.querySelectorAll("button")].forEach(btn =>
      btn.classList.remove("active")
    );

    event.target.classList.add("active");
  }
});

const darkModeToggle = document.getElementById("dark-mode-toggle");

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    darkModeToggle.textContent = "☀️ Light";
  } else {
    localStorage.setItem("theme", "light");
    darkModeToggle.textContent = "🌙 Dark";
  }
});

const savedTheme = localStorage.getItem("theme");

if(savedTheme === "dark") {
    document.body.classList.add("dark-mode");
}




loadTasks();
