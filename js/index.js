const $app = document.querySelector('#app');
$app.innerHTML = `
<form class="todo-input" name="todo-list">
    <input type="text" placeholder="Ingresá aquí tu tarea" name="todo"/>
    <button type="submit" class="btn" name="submit">+</button>
</form>
<div class="todo-list">
</div>
<div class="buttons oculto">
<button class="btn btn-delete">Eliminar las tareas completadas</button>
</div>`;

const $form = document.forms['todo-list'];
const $input = $form.elements.todo;
const $btnSubmit = $form.elements.submit;

const $todoList = $app.querySelector('.todo-list');
const $btnDelete = $app.querySelector('.btn');

const $divButtons = $app.querySelector('.buttons');
const $btnDeleteAll = $app.querySelector('.btn-delete');
let allToDo = [];

function manejarEventos() {
  $form.addEventListener('submit', agregarToDo);
  $todoList.addEventListener('click', borrarToDo);
  $todoList.addEventListener('change', checkearToDo);
  $btnDeleteAll.addEventListener('click', eliminarTareasRealizadas);
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

function borrarToDo(e) {
  if (e.target.className === 'btn') {
    const id = parseInt(e.target.parentNode.dataset.id);
    allToDo.splice(id, 1);
    renderizarToDos(allToDo);
  }
}

function checkearToDo(e) {
  const toDo = e.target.parentNode;
  const id = toDo.dataset.id;
  const $tarea = toDo.querySelector('p');
  $tarea.classList.toggle('checked');

  allToDo[id].completo = true;
  manejarBtnDeleteToDos();
}

function eliminarTareasRealizadas() {
  let filtro = allToDo.filter((value) => value.completo != true);
  allToDo = [...filtro];
  renderizarToDos(allToDo);
}

function manejarBtnDeleteToDos() {
  if (allToDo.length === 0) {
    $divButtons.classList.add('oculto');
  }
  for (let i = 0; i < allToDo.length; i++) {
    if (allToDo[i].completo) {
      $divButtons.classList.remove('oculto');
      return;
    } else {
      $divButtons.classList.add('oculto');
    }
  }
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
  manejarBtnDeleteToDos();
}

manejarEventos();
