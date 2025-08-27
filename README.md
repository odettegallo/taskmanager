# 📋 TaskManager - Sistema de Gestión de tareas

**Evaluación Final Módulo 5** - Aplicación web para gestión de tareas.

## 🚀 Características Principales

### ✨ **Usuarios**
- **Sistema de autenticación** De acuerdo a usuarios almacenados en API. https://68ae3155a0b85b2f2cf5c714.mockapi.io/api/taskmanager/users
- **Gestión de usuarios** Registrar y eliminar usuarios.

### ✨ **Tareas**
- **Sistema de tareas** Crear tareas y asignarlas a los usuarios registrados.
- **Gestión de tareas** Editar y eliminar tareas. Al completar la tarea, ésta se mueve a la columna de "Tareas terminadas" con la opción de deshacer.

### ✨ **Dashboard**
- **Sistema de estadísticas** Se visualizan las tareas en progreso/terminadas globales. Se visualizan las tareas divididas por usuarios.

### 🎨 **Otros**
- Diseño responsive
- Integración con API de usuarios: https://68ae3155a0b85b2f2cf5c714.mockapi.io/api/taskmanager/users
- Integración con API de tareas: https://68ae3155a0b85b2f2cf5c714.mockapi.io/api/taskmanager/tasks

## 💻 Funcionalidades del Sistema

### **🔐 Página de Acceso (acceso.html)**
- Formulario de autenticación seguro.
- Validación de credenciales.
- Redirección automática tras login exitoso.

### **👥 Gestión de Usuarios (usuarios.html)**
- Formulario para registrar usuario.
- Listado de usuarios registrados.

### **👥 Gestión de tareas (tareas.html)**
- Formulario para crear nueva tarea.
- Listado de tareas en progreso y tareas completadas.

### **👥 Estadísticas (dashboard.html)**
- Visualización de gráficos y contadores.

### **👥 API **
- Integración con las distintas páginas. (PUT, DELETE, POST)


### ✨ **Responsabilidades del grupo**
- **Odette Gallo** Dashboard y arreglos globales.
- **Antonio Eliash** Tareas y arreglos globales.
- **José Huerta** Usuarios y arreglos globales.
- **Pedro Nina** Creación e integración API con sistema.


