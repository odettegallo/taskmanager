const modal = document.getElementById('taskModal');
const taskForm = document.getElementById('taskForm');      
const nombreInput = document.getElementById('taskName');
const descripcionInput = document.getElementById('taskDescription');
const responsableSelect = document.getElementById('taskResponsible');
const btnCrearTarea = document.getElementById('createTask');
const mensajeDiv = document.getElementById('mensaje');      
const inProgressTasks = document.getElementById('inProgressTasks');
const completedTasks = document.getElementById('completedTasks');

const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.getElementById('closeModal');
const cancelTaskBtn = document.getElementById('cancelTask');

let currentEditId = null;


openModalBtn.addEventListener('click', () => {
    currentEditId = null;
    if (taskForm) taskForm.reset();
    document.querySelector('.modal-header h2').textContent = 'Nueva Tarea';
    btnCrearTarea.textContent = 'Crear';
    modal.style.display = 'flex';
    nombreInput.focus();
});

closeModalBtn.addEventListener('click', closeModal);
cancelTaskBtn.addEventListener('click', closeModal);

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

function closeModal() {
    modal.style.display = 'none';
    if (taskForm) taskForm.reset();
    currentEditId = null;
    if (btnCrearTarea) btnCrearTarea.textContent = 'Crear';
    const hdr = document.querySelector('.modal-header h2');
    if (hdr) hdr.textContent = 'Nueva Tarea';
}

document.addEventListener('DOMContentLoaded', function() {
    cargarUsuarios();
    cargarTareas();
});

function cargarUsuarios() {
    fetch('https://68ae3155a0b85b2f2cf5c714.mockapi.io/api/taskmanager/users')
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Error al cargar usuarios');
        })
        .then(usuarios => {
            llenarSelectResponsables(usuarios);
        })
        .catch(error => {
            console.error('Error al cargar usuarios:', error);
            mostrarMensaje('Error al cargar la lista de responsables', 'error');
        });
}

function llenarSelectResponsables(usuarios) {
    responsableSelect.innerHTML = '<option value="">Selecciona un responsable</option>';
    
    usuarios.forEach(usuario => {
        const option = document.createElement('option');
        option.value = usuario.name;
        option.textContent = usuario.name;
        responsableSelect.appendChild(option);
    });
}

function cargarTareas() {
    fetch('https://68ae3155a0b85b2f2cf5c714.mockapi.io/api/taskmanager/tasks')
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Error al cargar tareas');
        })
        .then(tareas => {
            mostrarTareas(tareas);
        })
        .catch(error => {
            console.error('Error al cargar tareas:', error);
            inProgressTasks.innerHTML = '<p class="error">Error al cargar las tareas</p>';
        });
}

function mostrarTareas(tareas) {
    inProgressTasks.innerHTML = '';
    completedTasks.innerHTML = '';
    
    if (!tareas || tareas.length === 0) {
        inProgressTasks.innerHTML = '<p>No hay tareas registradas</p>';
        return;
    }
    
    const tareasEnProgreso = tareas.filter(tarea => !tarea.state);
    const tareasCompletadas = tareas.filter(tarea => tarea.state);
    
    if (tareasEnProgreso.length === 0) {
        inProgressTasks.innerHTML = '<p>No hay tareas en progreso</p>';
    } else {
        const taskListProgress = document.createElement('ul');
        taskListProgress.className = 'task-list';
        
        tareasEnProgreso.forEach(tarea => {
            taskListProgress.appendChild(crearElementoTarea(tarea));
        });
        
        inProgressTasks.appendChild(taskListProgress);
    }
    
    if (tareasCompletadas.length === 0) {
        completedTasks.innerHTML = '<p>No hay tareas completadas</p>';
    } else {
        const taskListCompleted = document.createElement('ul');
        taskListCompleted.className = 'task-list';
        
        tareasCompletadas.forEach(tarea => {
            taskListCompleted.appendChild(crearElementoTarea(tarea));
        });
        
        completedTasks.appendChild(taskListCompleted);
    }
}

function crearElementoTarea(tarea) {
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    taskItem.dataset.id = tarea.id;
    taskItem.dataset.state = String(!!tarea.state); 

    if (tarea.state) {
        taskItem.classList.add('completed');
    }

    const taskHeader = document.createElement('div');
    taskHeader.className = 'task-header';

    const taskName = document.createElement('div');
    taskName.className = 'task-name';
    taskName.textContent = tarea.name;

    const taskResponsable = document.createElement('div');
    taskResponsable.className = 'task-responsable';
    taskResponsable.textContent = tarea.responsible;
    taskResponsable.dataset.initial = (tarea.responsible || '?').charAt(0).toUpperCase();

    taskHeader.appendChild(taskName);
    taskHeader.appendChild(taskResponsable);

    const taskDescription = document.createElement('div');
    taskDescription.className = 'task-description';
    taskDescription.textContent = tarea.description;

    const taskActions = document.createElement('div');
    taskActions.className = 'task-actions';

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'toggle-btn';
    toggleBtn.textContent = tarea.state ? 'Deshacer' : 'Marcar como completada';
    toggleBtn.addEventListener('click', () => toggleEstadoTarea(tarea.id, !tarea.state));

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Editar';
    editBtn.addEventListener('click', () => openEditModal(tarea));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.addEventListener('click', () => eliminarTarea(tarea.id));

    taskActions.appendChild(toggleBtn);
    taskActions.appendChild(editBtn);
    taskActions.appendChild(deleteBtn);

    taskItem.appendChild(taskHeader);
    taskItem.appendChild(taskDescription);
    taskItem.appendChild(taskActions);

    return taskItem;
}

function toggleEstadoTarea(tareaId, nuevoEstado) {
    fetch(`https://68ae3155a0b85b2f2cf5c714.mockapi.io/api/taskmanager/tasks/${tareaId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ state: nuevoEstado })
    })
    .then(response => {
        if (response.ok) {
            mostrarMensaje(`Tarea ${nuevoEstado ? 'completada' : 'marcada como pendiente'}`, 'exito');
            cargarTareas(); 
        } else {
            throw new Error('Error al actualizar la tarea');
        }
    })
    .catch(error => {
        mostrarMensaje('Error al actualizar la tarea: ' + error.message, 'error');
    });
}

function eliminarTarea(tareaId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        return;
    }
    
    fetch(`https://68ae3155a0b85b2f2cf5c714.mockapi.io/api/taskmanager/tasks/${tareaId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            mostrarMensaje('Tarea eliminada correctamente', 'exito');
            const taskElement = document.querySelector(`.task-item[data-id="${tareaId}"]`);
            if (taskElement) {
                taskElement.remove();
            }
            cargarTareas();
        } else {
            throw new Error('Error al eliminar la tarea');
        }
    })
    .catch(error => {
        mostrarMensaje('Error al eliminar la tarea: ' + error.message, 'error');
    });
}

if (taskForm) {
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();

        btnCrearTarea.disabled = true;
        const originalBtnText = btnCrearTarea.textContent;
        btnCrearTarea.textContent = currentEditId ? 'Guardando...' : 'Creando...';
        
        const nombre = nombreInput.value.trim();
        const descripcion = descripcionInput.value.trim();
        const responsable = responsableSelect.value;

        if (!nombre || !descripcion || !responsable) {
            mostrarMensaje('Por favor completa todos los campos', 'error');
            btnCrearTarea.disabled = false;
            btnCrearTarea.textContent = originalBtnText || 'Crear';
            return;
        }

        if (currentEditId) {
            const taskElem = document.querySelector(`.task-item[data-id="${currentEditId}"]`);
            const estadoActual = taskElem ? (taskElem.classList.contains('completed') ? true : false) : false;

            const updatedData = {
                name: nombre,
                description: descripcion,
                responsible: responsable,
                state: estadoActual
            };

            fetch(`https://68ae3155a0b85b2f2cf5c714.mockapi.io/api/taskmanager/tasks/${currentEditId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            })
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Error al actualizar tarea');
            })
            .then(updated => {
                mostrarMensaje('Tarea actualizada correctamente', 'exito');

                const taskElem = document.querySelector(`.task-item[data-id="${updated.id}"]`);
                if (taskElem) {
                    const nameEl = taskElem.querySelector('.task-name');
                    const descEl = taskElem.querySelector('.task-description');
                    const respEl = taskElem.querySelector('.task-responsable');

                    if (nameEl) nameEl.textContent = updated.name;
                    if (descEl) descEl.textContent = updated.description;
                    if (respEl) {
                        respEl.textContent = updated.responsible;
                        respEl.dataset.initial = (updated.responsible || '?').charAt(0).toUpperCase();
                    }
                    taskElem.dataset.state = String(!!updated.state);
                }

                closeModal();
            })
            .catch(err => {
                console.error(err);
                mostrarMensaje('Error al actualizar: ' + err.message, 'error');
            })
            .finally(() => {
                btnCrearTarea.disabled = false;
                btnCrearTarea.textContent = originalBtnText || 'Crear';
            });

            return; 
        }

        const nuevaTarea = {
            name: nombre,
            description: descripcion,
            responsible: responsable,
            state: false
        };

        fetch('https://68ae3155a0b85b2f2cf5c714.mockapi.io/api/taskmanager/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaTarea)
        })
        .then(res => {
            if (res.ok) return res.json();
            throw new Error('Error al crear tarea');
        })
        .then(tareaCreada => {
            mostrarMensaje('Tarea creada exitosamente: ' + tareaCreada.name, 'exito');
            taskForm.reset();
            closeModal();
            cargarTareas();
        })
        .catch(err => {
            console.error(err);
            mostrarMensaje('Hubo un problema: ' + err.message, 'error');
        })
        .finally(() => {
            btnCrearTarea.disabled = false;
            btnCrearTarea.textContent = originalBtnText || 'Crear';
        });
    });
}


if (btnCrearTarea) {
    btnCrearTarea.addEventListener('click', () => {
        if (taskForm) {
            if (typeof taskForm.requestSubmit === 'function') {
                taskForm.requestSubmit();
            } else {
                taskForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }
        }
    });
}

function mostrarMensaje(texto, tipo) {
    if (!mensajeDiv) {
        console.log(`[${tipo}] ${texto}`);
        return;
    }
    mensajeDiv.textContent = texto;
    mensajeDiv.className = tipo;
    mensajeDiv.style.display = 'block';
    
    setTimeout(() => {
        mensajeDiv.style.display = 'none';
    }, 5000);
}

function moveTaskElement(tareaId, nuevoEstado) {
    const taskElement = document.querySelector(`.task-item[data-id="${tareaId}"]`);
    if (!taskElement) return;

    const destinoContainer = nuevoEstado ? completedTasks : inProgressTasks;
    let ul = destinoContainer.querySelector('.task-list');
    if (!ul) {
        destinoContainer.innerHTML = '';
        ul = document.createElement('ul');
        ul.className = 'task-list';
        destinoContainer.appendChild(ul);
    }

    if (nuevoEstado) {
        taskElement.classList.add('completed');
    } else {
        taskElement.classList.remove('completed');
    }

    const oldToggle = taskElement.querySelector('.toggle-btn');
    if (oldToggle) {
        const newToggle = oldToggle.cloneNode(true);
        newToggle.textContent = nuevoEstado ? 'Deshacer' : 'Marcar como completada';
        oldToggle.parentNode.replaceChild(newToggle, oldToggle);

        newToggle.addEventListener('click', () => toggleEstadoTarea(tareaId, !nuevoEstado));
    }

    ul.appendChild(taskElement);

    [inProgressTasks, completedTasks].forEach(container => {
        const list = container.querySelector('.task-list');
        if (!list || list.children.length === 0) {
            if (container === inProgressTasks) {
                container.innerHTML = '<p>No hay tareas en progreso</p>';
            } else {
                container.innerHTML = '<p>No hay tareas completadas</p>';
            }
        }
    });
}

function crearElementoTarea(tarea) {
    console.log('Creando tarjeta para tarea:', tarea.id, tarea.name); 
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    taskItem.dataset.id = tarea.id;
    taskItem.dataset.state = String(!!tarea.state);

    if (tarea.state) taskItem.classList.add('completed');

    const taskHeader = document.createElement('div');
    taskHeader.className = 'task-header';

    const taskName = document.createElement('div');
    taskName.className = 'task-name';
    taskName.textContent = tarea.name || '(sin título)';

    const taskResponsable = document.createElement('div');
    taskResponsable.className = 'task-responsable';
    taskResponsable.textContent = tarea.responsible || '—';
    taskResponsable.dataset.initial = (tarea.responsible || '?').charAt(0).toUpperCase();

    taskHeader.appendChild(taskName);
    taskHeader.appendChild(taskResponsable);

    const taskDescription = document.createElement('div');
    taskDescription.className = 'task-description';
    taskDescription.textContent = tarea.description || '';

    const taskActions = document.createElement('div');
    taskActions.className = 'task-actions';

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'toggle-btn';
    toggleBtn.type = 'button';
    toggleBtn.textContent = tarea.state ? 'Deshacer' : 'Marcar como completada';
    toggleBtn.addEventListener('click', () => toggleEstadoTarea(tarea.id, !tarea.state));

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.type = 'button';
    editBtn.textContent = 'Editar';
    editBtn.addEventListener('click', () => {
        openEditModal(tarea);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.type = 'button';
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.addEventListener('click', () => eliminarTarea(tarea.id));

    taskActions.appendChild(toggleBtn);
    taskActions.appendChild(editBtn);
    taskActions.appendChild(deleteBtn);

    taskItem.appendChild(taskHeader);
    taskItem.appendChild(taskDescription);
    taskItem.appendChild(taskActions);

    return taskItem;
}


function toggleEstadoTarea(tareaId, nuevoEstado) {
    const taskBtn = document.querySelector(`.task-item[data-id="${tareaId}"] .toggle-btn`);
    if (taskBtn) {
        taskBtn.disabled = true;
        taskBtn.textContent = (nuevoEstado ? 'Marcando...' : 'Revirtiendo...');
    }

    fetch(`https://68ae3155a0b85b2f2cf5c714.mockapi.io/api/taskmanager/tasks/${tareaId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ state: nuevoEstado })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Error al actualizar la tarea');
    })
    .then(updated => {
        mostrarMensaje(`Tarea ${nuevoEstado ? 'completada' : 'marcada como pendiente'}`, 'exito');
        moveTaskElement(tareaId, nuevoEstado);
    })
    .catch(error => {
        mostrarMensaje('Error al actualizar la tarea: ' + error.message, 'error');
        console.error(error);
    })
    .finally(() => {
        const btnFinal = document.querySelector(`.task-item[data-id="${tareaId}"] .toggle-btn`);
        if (btnFinal) {
            btnFinal.disabled = false;
            btnFinal.textContent = nuevoEstado ? 'Deshacer' : 'Marcar como completada';
        }
    });
}

function openEditModal(tarea) {
    if (!tarea) return;
    currentEditId = tarea.id;

    nombreInput.value = tarea.name || '';
    descripcionInput.value = tarea.description || '';
    responsableSelect.value = tarea.responsible || '';

    const hdr = document.querySelector('.modal-header h2');
    if (hdr) hdr.textContent = 'Editar Tarea';
    btnCrearTarea.textContent = 'Guardar cambios';

    modal.style.display = 'flex';
    nombreInput.focus();
}
