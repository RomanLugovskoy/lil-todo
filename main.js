(function () {
  function createAppTitle(title) {
    const appTitle = document.createElement("h2");
    appTitle.innerHTML = title;
    appTitle.classList.add("text-center", "mb-4");

    return appTitle;
  }

  function createTodoItemForm() {
    const form = document.createElement("form");
    const input = document.createElement("input");
    const buttonWrapper = document.createElement("div");
    const button = document.createElement("button");

    form.classList.add("input-group", "mb-3");
    form.style.gap = "5px";

    input.classList.add("form-control");
    input.placeholder = "Введите задачу";

    buttonWrapper.classList.add("input-group-append");

    button.classList.add("btn", "btn-primary");
    button.disabled = true;
    button.style.borderTopLeftRadius = 0;
    button.style.borderBottomLeftRadius = 0;
    button.textContent = "Добавить задачу";

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  function createTodoList() {
    const list = document.createElement("ul");
    list.classList.add("list-group");

    return list;
  }

  function createClearAllBtn() {
    const btnWrap = document.createElement("div");
    const btn = document.createElement("button");

    btnWrap.classList.add("d-flex", "justify-content-center", "mt-5");
    btn.classList.add("btn", "btn-danger");
    btn.id = "clearBtn";
    btn.textContent = "Удалить все задачи";

    btnWrap.append(btn);

    btn.addEventListener("click", (e) => {
      e.preventDefault();

      if (confirm("Вы уверены, что хотите безвозвратно удалить все задачи?")) {
        localStorage.clear();
        const list = document.querySelector("ul.list-group");
        list.innerHTML = "";
        updateClearBtnState();
      }
    });

    return {
      btnWrap,
      btn,
    };
  }

  function updateClearBtnState() {
    const clearAllButton = document.getElementById("clearBtn");
    const tasks = document.querySelectorAll("li");
    clearAllButton.disabled = tasks.length === 0;
  }

  function createTodoItem(name, status = "none", tasks) {
    const item = document.createElement("li");
    const buttonGroup = document.createElement("div");
    const doneButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );

    if (status === "done") {
      item.classList.add("list-group-item-success");
    }

    item.textContent = name;

    buttonGroup.classList.add("btn-group", "btn-group-sm");

    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Готово";

    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    doneButton.addEventListener("click", () => {
      item.classList.toggle("list-group-item-success");
      const newStatus = item.classList.contains("list-group-item-success")
        ? "done"
        : "none";

      const taskIndex = tasks.findIndex((task) => task.name === name);
      if (taskIndex !== -1) {
        tasks[taskIndex].status = newStatus;
        localStorage.setItem("tasks", JSON.stringify(tasks));
      }

      updateClearBtnState();
    });

    deleteButton.addEventListener("click", () => {
      if (confirm("Вы уверены?")) {
        item.remove();
        const taskIndex = tasks.findIndex((task) => task.name === name);
        if (taskIndex !== -1) {
          tasks.splice(taskIndex, 1);
          localStorage.setItem("tasks", JSON.stringify(tasks));
        }
      }
      updateClearBtnState();
    });

    return {
      item,
      doneButton,
      deleteButton,
      name,
    };
  }

  document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("todo-app");

    const todoAppTitle = createAppTitle("Список задач");
    const todoItemForm = createTodoItemForm();
    const todoList = createTodoList();

    const clearAllBtn = createClearAllBtn();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);
    container.append(clearAllBtn.btnWrap);

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach((task) => {
      const localItem = createTodoItem(task.name, task.status, tasks);
      todoList.append(localItem.item);
    });

    todoItemForm.input.addEventListener("input", () => {
      todoItemForm.button.disabled = !todoItemForm.input.value;
    });

    todoItemForm.form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!todoItemForm.input.value) {
        return;
      }

      const todoItem = createTodoItem(todoItemForm.input.value, "none", tasks);

      tasks.push({ name: todoItem.name, status: "none" });
      localStorage.setItem("tasks", JSON.stringify(tasks));

      todoList.append(todoItem.item);
      todoItemForm.input.value = "";
      todoItemForm.button.disabled = true;

      updateClearBtnState();
    });

    updateClearBtnState();
  });
})();
