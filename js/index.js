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

let allToDo = JSON.parse(localStorage.getItem('todo')) || [];

function guardarEnLocalStorage(todo) {
  localStorage.setItem('todo', JSON.stringify(todo));
}

function manejarEventos() {
  renderizarToDos(allToDo);
  $form.addEventListener('submit', agregarToDo);
  $todoList.addEventListener('click', borrarToDo);
  $todoList.addEventListener('change', checkearToDo);
  $todoList.addEventListener('dblclick', editarToDo);
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
  guardarEnLocalStorage(allToDo);
  $input.value = '';
  $input.focus();
}

function borrarToDo(e) {
  if (e.target.className === 'btn') {
    const id = parseInt(e.target.parentNode.dataset.id);
    allToDo.splice(id, 1);
    renderizarToDos(allToDo);
    guardarEnLocalStorage(allToDo);
  }
}

function checkearToDo(e) {
  const toDo = e.target.parentNode;
  const id = toDo.dataset.id;
  const $tarea = toDo.querySelector('span');
  $tarea.classList.toggle('checked');
  if ($tarea.classList.contains('checked')) {
    allToDo[id].completo = true;
  } else {
    allToDo[id].completo = false;
  }

  manejarBtnDeleteToDos();
  guardarEnLocalStorage(allToDo);
}

function editarToDo(e) {
  if (e.target.nodeName.toLowerCase() != 'span') {
    return;
  }
  const tarea = e.target.parentNode;
  const id = parseInt(tarea.dataset.id);
  const tareaSeleccionada = allToDo[id].tarea;
  if (allToDo[id].completo) {
    return;
  }
  const spanTarea = tarea.querySelector('span');

  const INPUT = document.createElement('input');
  INPUT.type = 'text';
  INPUT.value = tareaSeleccionada;
  tarea.replaceChild(INPUT, spanTarea);
  INPUT.focus();

  INPUT.addEventListener('change', (e) => {
    const tarea = e.target.value;
    e.stopPropagation();
    if (tarea != tareaSeleccionada) {
      allToDo = allToDo.map((todo, index) => {
        if (id === index) {
          return {
            ...todo,
            tarea,
          };
        }
        return todo;
      });
      renderizarToDos(allToDo);
      guardarEnLocalStorage(allToDo);
    }
    e.target.display = '';
  });

  INPUT.addEventListener('blur', (e) => {
    e.target.display = '';
    const SPAN = document.createElement('span');
    SPAN.innerText = tareaSeleccionada;
    tarea.replaceChild(SPAN, INPUT);
  });
}

function eliminarTareasRealizadas() {
  let filtro = allToDo.filter((value) => value.completo != true);
  allToDo = [...filtro];
  renderizarToDos(allToDo);
  guardarEnLocalStorage(allToDo);
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
          <span class="checked" >${value.tarea}</span>
          <button class="btn">-</button>
        </div>
        `;
    } else {
      toDoHtml += `
        <div class="todo" data-id="${index}">
          <input type="checkbox" id="todo-check" />
          <span>${value.tarea}</span>
          <button class="btn">-</button>
        </div>
        `;
    }
  });

  $todoList.innerHTML = toDoHtml;
  manejarBtnDeleteToDos();
}

manejarEventos();
