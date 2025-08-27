// Elementos del DOM
const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.getElementById('closeModal');
const cancelTaskBtn = document.getElementById('cancelTask');
const modal = document.getElementById('taskModal');
const taskForm = document.getElementById('taskForm');
let createTaskBtn = document.getElementById('createTask');
const inProgressTasks = document.getElementById('inProgressTasks');
const completedTasks = document.getElementById('completedTasks');

// Variables para controlar el modo de edición
let isEditing = false;
let currentEditId = null;

// Cargar tareas desde localStorage al iniciar
// document.addEventListener('DOMContentLoaded', loadTasks);

// Abrir modal para crear nueva tarea
openModalBtn.addEventListener('click', () => {
  resetModalToCreateMode();
  modal.style.display = 'flex';
  document.getElementById('taskName').focus();
});

// Cerrar modal
closeModalBtn.addEventListener('click', closeModal);
cancelTaskBtn.addEventListener('click', closeModal);

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

//PEDRO, DEJO COMENTADA lA TOTALIDAD FUNCIONALIDAD DEL BOTÓN CREAR DEL MODAL
// Función principal para manejar el clic en el botón Crear/Actualizar
// createTaskBtn.addEventListener('click', handleCreateOrUpdateTask);

// Función para manejar la creación o actualización de tareas
/*
function handleCreateOrUpdateTask() {
  const name = document.getElementById('taskName').value;
  const description = document.getElementById('taskDescription').value;
  const responsible = document.getElementById('taskResponsible').value;

  // Validar campos
  if (!name || !description || !responsible) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  if (isEditing && currentEditId) {
    // Modo edición - actualizar tarea existente
    updateTask(currentEditId, name, description, responsible);
  } else {
    // Modo creación - crear nueva tarea
    createNewTask(name, description, responsible);
  }
  
  closeModal();
}
*/

// Función para crear nueva tarea
/*
function createNewTask(name, description, responsible) {
  const task = {
    id: Date.now(),
    name,
    description,
    responsible,
    completed: false,
    createdAt: new Date().toISOString()
  };

  addTaskToDOM(task);
  saveTaskToLocalStorage(task);
  
  // Eliminar solo el mensaje de "No hay tareas en progreso" si existe
  removeNoTasksMessage('inProgress');
}
*/

// Función para actualizar tarea existente
/*
function updateTask(taskId, name, description, responsible) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex !== -1) {
    tasks[taskIndex].name = name;
    tasks[taskIndex].description = description;
    tasks[taskIndex].responsible = responsible;
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    // Recargar las tareas
    loadTasks();
  }
}
*/

// Función para cerrar el modal
function closeModal() {
  modal.style.display = 'none';
  resetModalToCreateMode();
}

// Función para resetear el modal al modo de creación
function resetModalToCreateMode() {
  isEditing = false;
  currentEditId = null;
  createTaskBtn.textContent = 'Crear';
  taskForm.reset();
}

// Función para agregar tarea al DOM
/*
function addTaskToDOM(task) {
  const taskElement = document.createElement('div');
  taskElement.className = `task-card ${task.completed ? 'completed' : ''}`;
  taskElement.dataset.id = task.id;

  taskElement.innerHTML = `
    <h4>${task.name}</h4>
    <p>${task.description}</p>
    <p class="responsible"><strong>Responsable:</strong> ${task.responsible}</p>
    <div class="task-actions">
      ${!task.completed ? `
        <button class="edit-btn" title="Editar tarea"><i class="fas fa-edit"></i></button>
        <button class="complete-btn" title="Marcar como completada"><i class="fas fa-check"></i></button>
      ` : ''}
      <button class="delete-btn" title="Eliminar tarea"><i class="fas fa-times"></i></button>
    </div>
  `;

  // Agregar event listeners a los botones
  if (!task.completed) {
    const editBtn = taskElement.querySelector('.edit-btn');
    const completeBtn = taskElement.querySelector('.complete-btn');
    
    editBtn.addEventListener('click', () => editTask(task.id));
    completeBtn.addEventListener('click', () => completeTask(task.id));
  }
  
  const deleteBtn = taskElement.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', () => deleteTask(task.id));

  if (task.completed) {
    completedTasks.appendChild(taskElement);
  } else {
    inProgressTasks.appendChild(taskElement);
  }
}
*/

// Función para eliminar mensajes de "No hay tareas" específicos
/*
function removeNoTasksMessage(type) {
  if (type === 'inProgress') {
    const noTasksMessage = inProgressTasks.querySelector('.no-tasks');
    if (noTasksMessage) {
      noTasksMessage.remove();
    }
  } else if (type === 'completed') {
    const noTasksMessage = completedTasks.querySelector('.no-tasks');
    if (noTasksMessage) {
      noTasksMessage.remove();
    }
  }
}
*/

// Función para verificar y mostrar mensajes de "No hay tareas"
/*
function checkAndShowNoTasksMessages() {
  // Verificar tareas en progreso
  if (inProgressTasks.children.length === 0 || 
      (inProgressTasks.children.length === 1 && inProgressTasks.querySelector('.no-tasks'))) {
    inProgressTasks.innerHTML = '<p class="no-tasks">No hay tareas en progreso</p>';
  }
  
  // Verificar tareas completadas
  if (completedTasks.children.length === 0 || 
      (completedTasks.children.length === 1 && completedTasks.querySelector('.no-tasks'))) {
    completedTasks.innerHTML = '<p class="no-tasks">No hay tareas completadas</p>';
  }
}
*/

// Función para guardar tarea en localStorage
/*
function saveTaskToLocalStorage(task) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
*/

// Función para cargar tareas desde localStorage
/*
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
  // Limpiar contenedores
  inProgressTasks.innerHTML = '';
  completedTasks.innerHTML = '';
  
  // Separar tareas completadas y en progreso
  const inProgress = tasks.filter(task => !task.completed);
  const completed = tasks.filter(task => task.completed);
  
  // Agregar tareas en progreso
  if (inProgress.length === 0) {
    inProgressTasks.innerHTML = '<p class="no-tasks">No hay tareas en progreso</p>';
  } else {
    inProgress.forEach(task => addTaskToDOM(task));
  }
  
  // Agregar tareas completadas
  if (completed.length === 0) {
    completedTasks.innerHTML = '<p class="no-tasks">No hay tareas completadas</p>';
  } else {
    completed.forEach(task => addTaskToDOM(task));
  }
}
*/

// Función para completar tarea
/*
function completeTask(taskId) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = true;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    // Recargar las tareas para actualizar la interfaz correctamente
    loadTasks();
    
    // Verificar si ahora no hay tareas en progreso y mostrar el mensaje
    const remainingInProgress = tasks.filter(task => !task.completed);
    if (remainingInProgress.length === 0) {
      inProgressTasks.innerHTML = '<p class="no-tasks">No hay tareas en progreso</p>';
    }
  }
}
*/

// Función para eliminar tarea
/*
function deleteTask(taskId) {
  if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    // Recargar las tareas y verificar mensajes
    loadTasks();
    checkAndShowNoTasksMessages();
  }
}
*/

// Función para editar tarea
/*
function editTask(taskId) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const task = tasks.find(t => t.id === taskId);
  
  if (task) {
    // Llenar el formulario con los datos existentes
    document.getElementById('taskName').value = task.name;
    document.getElementById('taskDescription').value = task.description;
    document.getElementById('taskResponsible').value = task.responsible;
    
    // Cambiar a modo edición
    isEditing = true;
    currentEditId = taskId;
    createTaskBtn.textContent = 'Actualizar';
    
    modal.style.display = 'flex';
    document.getElementById('taskName').focus();
  }
}
*/

// Estilo para cuando no hay tareas
/*
const style = document.createElement('style');
style.textContent = `
  .no-tasks {
    text-align: center;
    color: #888;
    font-style: italic;
    grid-column: 1 / -1;
    padding: 30px;
  }
`;
document.head.appendChild(style);
*/