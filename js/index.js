const $app = document.querySelector('#app');
$app.innerHTML = `
<form class="todo-input" name="todo-list">
    <input type="text" placeholder="Ingresá aquí tu tarea" name="todo"/>
    <button type="submit" class="btn" name="submit">+</button>
</form>
<div class="todo-list">
</div>`;

const $form = document.forms['todo-list'];
const $input = $form.elements.todo;
const $btnSubmit = $form.elements.submit;

const $todoList = $app.querySelector('.todo-list');
const $btnDelete = $app.querySelector('.btn');
let allToDo = [];

function manejarEventos() {
  $form.addEventListener('submit', agregarToDo);
}

function agregarToDo(e) {
  e.preventDefault();
  const toDo = $input.value.trim();
  if (toDo.length === 0) {
    return;
  }

  allToDo = [
    ...allToDo,
    {
      tarea: toDo,
      completo: false,
    },
  ];

  renderizarToDos(allToDo);
  $input.value = '';
}

function renderizarToDos(toDo) {
  let toDoHtml = '';

  toDo.forEach((value, index) => {
    if (value.completo) {
      toDoHtml += `
        <div class="todo" data-id="${index}">
          <input type="checkbox" id="todo-check" checked/>
          <p class="checked" >${value.tarea}</p>
          <button class="btn">-</button>
        </div>
        `;
    } else {
      toDoHtml += `
        <div class="todo" data-id="${index}">
          <input type="checkbox" id="todo-check" />
          <p>${value.tarea}</p>
          <button class="btn">-</button>
        </div>
        `;
    }
  });

  $todoList.innerHTML = toDoHtml;
}

manejarEventos();
