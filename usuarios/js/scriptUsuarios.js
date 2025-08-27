// Clase Usuario
class Usuario {
  constructor(id, nombre, contrasena) {
    this.id = id;
    this.nombre = nombre;
    this.contrasena = contrasena;
    this.fechaCreacion = new Date().toISOString();
  }

  // Método para validar la contraseña
  validarContrasena(contrasena) {
    return this.contrasena === contrasena;
  }

  // Método para obtener información básica del usuario
  getInfo() {
    return {
      id: this.id,
      nombre: this.nombre,
      fechaCreacion: this.fechaCreacion
    };
  }

  // Método para convertir a JSON
  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      contrasena: this.contrasena,
      fechaCreacion: this.fechaCreacion
    };
  }

  // Método estático para crear desde JSON
  static fromJSON(data) {
    const usuario = new Usuario(data.id, data.nombre, data.contrasena);
    usuario.fechaCreacion = data.fechaCreacion;
    return usuario;
  }
}

// Clase GestorUsuarios - Manejo de la lógica de negocio
class GestorUsuarios {
  constructor() {
    this.usuarios = [];
    this.usuarioActual = null;
    this.apiUrl = 'https://mockapi.io/api/usuarios'; // URL base para MockAPI
    this.cargarUsuarios();
  }

  // Cargar usuarios desde localStorage
  cargarUsuarios() {
    try {
      const usuariosGuardados = localStorage.getItem('taskmanager_usuarios');
      if (usuariosGuardados) {
        const datos = JSON.parse(usuariosGuardados);
        this.usuarios = datos.map(data => Usuario.fromJSON(data));
      } else {
        // Crear usuario administrador por defecto
        this.crearUsuarioDefecto();
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      this.crearUsuarioDefecto();
    }
  }

  // Crear usuario administrador por defecto
  crearUsuarioDefecto() {
    const admin = new Usuario(1, 'admin', 'admin123');
    this.usuarios.push(admin);
    this.guardarUsuarios();
  }

  // Guardar usuarios en localStorage
  guardarUsuarios() {
    try {
      const datos = this.usuarios.map(usuario => usuario.toJSON());
      localStorage.setItem('taskmanager_usuarios', JSON.stringify(datos));
    } catch (error) {
      console.error('Error al guardar usuarios:', error);
    }
  }

  // Obtener todos los usuarios
  obtenerUsuarios() {
    return this.usuarios;
  }

  // Crear nuevo usuario
  async crearUsuario(nombre, contrasena) {
    try {
      // Validaciones frontend
      if (!nombre || !contrasena) {
        throw new Error('Todos los campos son obligatorios');
      }
      
      if (nombre.trim().length < 3) {
        throw new Error('El nombre debe tener al menos 3 caracteres');
      }
      
      if (contrasena.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Validar que el nombre no exista (validación local temporal)
      if (this.usuarios.some(u => u.nombre.toLowerCase() === nombre.toLowerCase())) {
        throw new Error('Ya existe un usuario con ese nombre');
      }

      // [ESPACIO PARA IMPLEMENTACIÓN - BACKEND]
      // Aquí se conectará con la API para CREAR usuario
      // Pedro, debes completar esta función según lo requerido
      // Ejemplo de llamada esperada:
      // const respuestaAPI = await this.llamadaAPIReal('POST', 'usuarios', {
      //   nombre: nombre.trim(),
      //   contrasena: contrasena
      // });
      
      // CÓDIGO TEMPORAL - Simular creación local hasta integrar API
      const nuevoId = this.usuarios.length > 0 ? Math.max(...this.usuarios.map(u => u.id)) + 1 : 1;
      const nuevoUsuario = new Usuario(nuevoId, nombre.trim(), contrasena);
      
      // Simular llamada a API (REMOVER cuando se implemente API real)
      await this.simularLlamadaAPI('POST', nuevoUsuario.toJSON());
      
      // Almacenamiento local temporal (MODIFICAR cuando se implemente API)
      this.usuarios.push(nuevoUsuario);
      this.guardarUsuarios();
      
      return nuevoUsuario;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }

  // Editar usuario existente
  async editarUsuario(id, nombre, contrasena) {
    try {
      // Validaciones frontend - mantener estas validaciones
      if (!nombre || !contrasena) {
        throw new Error('Todos los campos son obligatorios');
      }
      
      if (nombre.trim().length < 3) {
        throw new Error('El nombre debe tener al menos 3 caracteres');
      }
      
      if (contrasena.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Buscar usuario localmente (validación temporal)
      const usuario = this.usuarios.find(u => u.id === id);
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // Validar que el nombre no exista en otro usuario (validación local temporal)
      if (this.usuarios.some(u => u.id !== id && u.nombre.toLowerCase() === nombre.toLowerCase())) {
        throw new Error('Ya existe un usuario con ese nombre');
      }

      // [ESPACIO PARA IMPLEMENTACIÓN - BACKEND]
        // Aquí se conectará con la API para EDITAR usuario
        // Pedro, debes completar esta función según lo requerido
      // Ejemplo de llamada esperada:
      // const respuestaAPI = await this.llamadaAPIReal('PUT', `usuarios/${id}`, {
      //   nombre: nombre.trim(),
      //   contrasena: contrasena
      // });
      
      // CÓDIGO TEMPORAL - Simular edición local hasta integrar API
      // Simular llamada a API (REMOVER cuando se implemente API real)
      await this.simularLlamadaAPI('PUT', { id, nombre: nombre.trim(), contrasena });
      
      // Actualización local temporal (MODIFICAR cuando se implemente API)
      usuario.nombre = nombre.trim();
      usuario.contrasena = contrasena;
      
      this.guardarUsuarios();
      return usuario;
    } catch (error) {
      console.error('Error al editar usuario:', error);
      throw error;
    }
  }

  // Eliminar usuario
  async eliminarUsuario(id) {
    try {
      // Validaciones frontend - mantener estas validaciones
      if (!id) {
        throw new Error('ID de usuario requerido');
      }

      // Buscar usuario localmente (validación temporal)
      const indice = this.usuarios.findIndex(u => u.id === id);
      if (indice === -1) {
        throw new Error('Usuario no encontrado');
      }
      
      // Validación de seguridad: no permitir eliminar el último usuario admin
      const usuariosAdmin = this.usuarios.filter(u => u.nombre.toLowerCase() === 'admin');
      if (usuariosAdmin.length === 1 && this.usuarios[indice].nombre.toLowerCase() === 'admin') {
        throw new Error('No se puede eliminar el último usuario administrador');
      }

      // [ESPACIO PARA IMPLEMENTACIÓN - BACKEND]
        // Aquí se conectará con la API para ELIMINAR usuario
        // Pedro, debes completar esta función según lo requerido
      // Ejemplo de llamada esperada:
      // const respuestaAPI = await this.llamadaAPIReal('DELETE', `usuarios/${id}`);
      
      // CÓDIGO TEMPORAL - Simular eliminación local hasta integrar API
      // Simular llamada a API (REMOVER cuando se implemente API real)
      await this.simularLlamadaAPI('DELETE', { id });
      
      // Eliminación local temporal (MODIFICAR cuando se implemente API)
      this.usuarios.splice(indice, 1);
      this.guardarUsuarios();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }

  // Autenticar usuario
  autenticar(nombre, contrasena) {
    const usuario = this.usuarios.find(u => 
      u.nombre.toLowerCase() === nombre.toLowerCase() && 
      u.validarContrasena(contrasena)
    );
    
    if (usuario) {
      this.usuarioActual = usuario;
      localStorage.setItem('taskmanager_usuario_actual', JSON.stringify(usuario.getInfo()));
      return true;
    }
    
    return false;
  }

  // Cerrar sesión
  cerrarSesion() {
    this.usuarioActual = null;
    localStorage.removeItem('taskmanager_usuario_actual');
  }

  // Obtener usuario actual
  obtenerUsuarioActual() {
    if (!this.usuarioActual) {
      const usuarioGuardado = localStorage.getItem('taskmanager_usuario_actual');
      if (usuarioGuardado) {
        const datos = JSON.parse(usuarioGuardado);
        this.usuarioActual = this.usuarios.find(u => u.id === datos.id);
      }
    }
    return this.usuarioActual;
  }

  // Simular llamada a API con fetch y async/await
  async simularLlamadaAPI(metodo, datos) {
    return new Promise((resolve, reject) => {
      // Simular delay de red
      setTimeout(() => {
        console.log(`Simulando ${metodo} a API:`, datos);
        
        // Simular respuesta exitosa
        if (Math.random() > 0.1) { // 90% de éxito
          resolve({ success: true, data: datos });
        } else {
          reject(new Error('Error de conexión con la API'));
        }
      }, 500 + Math.random() * 1000); // Delay entre 500ms y 1.5s
    });
  }

  // [PEDRO - MÉTODO PREPARADO PARA INTEGRACIÓN CON API REAL]
  // Este método está listo para ser utilizado cuando implementes la conexión con MockAPI
  // Debes:
  // 1. Configurar la URL correcta en this.apiUrl
  // 2. Reemplazar las llamadas a simularLlamadaAPI() por llamadaAPIReal()
  // 3. Manejar los códigos de respuesta HTTP específicos según la API
  // 4. Agregar headers de autenticación si son necesarios
  async llamadaAPIReal(metodo, endpoint, datos = null) {
    try {
      // Configuración base de la petición HTTP
      const opciones = {
        method: metodo,
        headers: {
          'content-type': 'application/json'
          // [PEDRO - ESPACIO PARA HEADERS ADICIONALES]
          // Aquí puedes agregar headers de autenticación:
          // 'Authorization': `Bearer ${token}`,
          // 'X-API-Key': 'clave-api'
        }
      };

      // Agregar body para métodos que lo requieren
      if (datos && (metodo === 'POST' || metodo === 'PUT' || metodo === 'PATCH')) {
        opciones.body = JSON.stringify(datos);
      }

      // Realizar petición HTTP
      const respuesta = await fetch(`${this.apiUrl}/${endpoint}`, opciones);
      
      // [PEDRO - MANEJO DE RESPUESTAS]
      // Puedes personalizar el manejo según los códigos de respuesta
      if (respuesta.ok) {
        // Respuesta exitosa (200-299)
        return await respuesta.json();
      } else {
        // Manejar errores HTTP específicos
        let mensajeError = `Error HTTP: ${respuesta.status}`;
        
        // Personalizar mensajes según código de error
        switch (respuesta.status) {
          case 400:
            mensajeError = 'Datos inválidos enviados al servidor';
            break;
          case 401:
            mensajeError = 'No autorizado - verificar credenciales';
            break;
          case 404:
            mensajeError = 'Recurso no encontrado';
            break;
          case 500:
            mensajeError = 'Error interno del servidor';
            break;
        }
        
        throw new Error(mensajeError);
      }
    } catch (error) {
      console.error('Error en llamada a API:', error);
      throw error;
    }
  }
}

// Clase InterfazUsuarios - Manejo de la interfaz y eventos
class InterfazUsuarios {
  constructor() {
    this.gestor = new GestorUsuarios();
    this.modalActivo = false;
    this.usuarioEditando = null;
    this.inicializar();
  }

  // [INICIALIZACIÓN DE LA INTERFAZ]
  // Punto de entrada principal para configurar la aplicación de usuarios
  // Esta función se ejecuta cuando se carga la página
  inicializar() {
    // [CONFIGURACIÓN DE EVENTOS]
    // Configurar todos los event listeners de la interfaz
    this.configurarEventos();
    
    // [VERIFICACIÓN DE AUTENTICACIÓN]
    // Verificar si el usuario está autenticado y redirigir si es necesario
    this.verificarAutenticacion();
    
    // [CARGA INICIAL DE DATOS]
    // Si estamos en la página de usuarios, cargar la lista y mostrar usuario logueado
    if (document.getElementById('lista-usuarios')) {
      this.cargarListaUsuarios();
      this.mostrarUsuarioLogueado();
    }
    
    // [PEDRO - ESPACIO PARA INICIALIZACIÓN ADICIONAL]
    // Puedes agregar aquí:
    // - Configuración de permisos de usuario
    // - Inicialización de componentes adicionales
    // - Configuración de temas o preferencias
    // - Carga de configuraciones desde API
  }

  // [CONFIGURACIÓN DE EVENTOS] - Orientación a eventos
  // Configurar todos los event listeners de la interfaz de usuario
  // Esta función vincula los elementos HTML con las funciones JavaScript
  configurarEventos() {
    // [ELEMENTOS DE LA PÁGINA DE USUARIOS]
    // Obtener referencias a elementos del DOM para la gestión de usuarios
    const btnCrear = document.getElementById('btn-crear-usuario');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const formUsuario = document.getElementById('form-usuario');
    const btnCancelar = document.getElementById('btn-cancelar');
    const btnSalir = document.getElementById('btn-salir');

    // [ELEMENTOS DE LA PÁGINA DE ACCESO]
    // Obtener referencias a elementos del DOM para autenticación
    const formAcceso = document.getElementById('form-acceso');

    // [EVENT LISTENERS CON ARROW FUNCTIONS]
    // Configurar eventos usando funciones flecha para mantener el contexto
    
    // [BOTÓN CREAR USUARIO]
    // Event listener para abrir modal de creación
    if (btnCrear) {
      btnCrear.addEventListener('click', () => this.abrirModal());
    }

    // [BOTÓN CERRAR MODAL]
    // Event listener para cerrar modal con botón X
    if (btnCerrarModal) {
      btnCerrarModal.addEventListener('click', () => this.cerrarModal());
    }

    // [OVERLAY DEL MODAL]
    // Event listener para cerrar modal al hacer clic fuera
    if (modalOverlay) {
      modalOverlay.addEventListener('click', () => this.cerrarModal());
    }

    // [FORMULARIO DE USUARIO]
    // Event listener para manejar envío del formulario (crear/editar)
    if (formUsuario) {
      formUsuario.addEventListener('submit', (e) => this.manejarFormularioUsuario(e));
    }

    // [BOTÓN CANCELAR]
    // Event listener para cancelar operación y cerrar modal
    if (btnCancelar) {
      btnCancelar.addEventListener('click', () => this.cerrarModal());
    }

    // [BOTÓN SALIR]
    // Event listener para cerrar sesión
    if (btnSalir) {
      btnSalir.addEventListener('click', (e) => this.cerrarSesion(e));
    }

    // [FORMULARIO DE ACCESO]
    // Event listener para manejar autenticación
    if (formAcceso) {
      formAcceso.addEventListener('submit', (e) => this.manejarFormularioAcceso(e));
    }

    // [EVENTO GLOBAL - TECLA ESCAPE]
    // Event listener global para cerrar modal con tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalActivo) {
        this.cerrarModal();
      }
    });
    
    // [PEDRO - ESPACIO PARA EVENTOS ADICIONALES]
    // Puedes agregar aquí:
    // - Event listeners para filtros de búsqueda
    // - Event listeners para ordenamiento de columnas
    // - Event listeners para selección múltiple
    // - Event listeners para atajos de teclado
    // - Event listeners para drag & drop
    // - Event listeners para notificaciones
  }

  // Verificar autenticación
  verificarAutenticacion() {
    const usuario = this.gestor.obtenerUsuarioActual();
    const esAcceso = window.location.pathname.includes('acceso.html');
    
    if (!usuario && !esAcceso) {
      // Redirigir a acceso si no está autenticado
      window.location.href = 'acceso.html';
    } else if (usuario && esAcceso) {
      // Redirigir a usuarios si ya está autenticado
      window.location.href = 'usuarios.html';
    }
  }

  // Mostrar usuario logueado
  mostrarUsuarioLogueado() {
    const usuario = this.gestor.obtenerUsuarioActual();
    const elementoUsuario = document.getElementById('usuario-logueado');
    
    if (usuario && elementoUsuario) {
      elementoUsuario.textContent = usuario.nombre;
    }
  }

  // [CARGAR LISTA DE USUARIOS]
  // Obtener usuarios del gestor y renderizar en la interfaz
  // Esta función es el punto de entrada para actualizar la vista de usuarios
  async cargarListaUsuarios() {
    try {
      // [PEDRO - INTEGRACIÓN BACKEND]
      // Aquí se obtienen los usuarios del GestorUsuarios
      // Puedes modificar esta llamada para:
      // - Agregar filtros de búsqueda
      // - Implementar paginación
      // - Agregar ordenamiento
      // - Manejar estados de carga (loading spinner)
      const usuarios = this.gestor.obtenerUsuarios();
      
      // Renderizar usuarios en la interfaz
      this.renderizarListaUsuarios(usuarios);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      
      // [PEDRO - MANEJO DE ERRORES]
      // Puedes personalizar el manejo de errores:
      // - Mostrar mensajes específicos según el tipo de error
      // - Implementar reintentos automáticos
      // - Mostrar estado de error en la UI
      this.mostrarNotificacion('Error al cargar la lista de usuarios', 'error');
    }
  }

  // [RENDERIZAR LISTA DE USUARIOS]
  // Generar HTML dinámico para mostrar la lista de usuarios
  // Esta función construye la interfaz visual de la lista
  renderizarListaUsuarios(usuarios) {
    const listaContainer = document.getElementById('lista-usuarios');
    if (!listaContainer) {
      console.error('Contenedor lista-usuarios no encontrado');
      return;
    }

    // [ESTADO VACÍO]
    // Mostrar mensaje cuando no hay usuarios
    if (usuarios.length === 0) {
      listaContainer.innerHTML = '<p class="usuarios__mensaje">No hay usuarios registrados</p>';
      return;
    }

    // [PEDRO - GENERACIÓN DE HTML]
    // Crear HTML para cada usuario usando template strings
    // Puedes personalizar:
    // - Agregar más campos de usuario (email, rol, estado, etc.)
    // - Implementar diferentes vistas (tarjetas, tabla, etc.)
    // - Agregar filtros visuales
    // - Implementar selección múltiple
    listaContainer.innerHTML = '';
    
    usuarios.forEach(usuario => {
      const elementoUsuario = this.crearElementoUsuario(usuario);
      listaContainer.appendChild(elementoUsuario);
    });
    
    // [PEDRO - POST-RENDERIZADO]
    // Puedes agregar aquí:
    // - Inicialización de componentes interactivos
    // - Aplicación de filtros visuales
    // - Configuración de eventos adicionales
  }

  // Crear elemento HTML para un usuario
  crearElementoUsuario(usuario) {
    const div = document.createElement('div');
    div.className = 'usuario-item';
    div.innerHTML = `
      <span class="usuario-item__nombre">${usuario.nombre}</span>
      <div class="usuario-item__acciones">
        <button class="usuario-item__btn usuario-item__btn--editar" onclick="interfazUsuarios.editarUsuario(${usuario.id})">
          <svg class="usuario-item__icon" viewBox="0 0 24 24">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </button>
        <button class="usuario-item__btn usuario-item__btn--eliminar" onclick="interfazUsuarios.eliminarUsuario(${usuario.id})">
          <svg class="usuario-item__icon" viewBox="0 0 24 24">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        </button>
      </div>
    `;
    return div;
  }

  // [MODAL CREAR/EDITAR USUARIO]
  // Abrir modal para crear nuevo usuario o editar existente
  // Esta función maneja ambos casos según si se pasa un usuario o no
  abrirModal(usuario = null) {
    const modal = document.getElementById('modal-usuario');
    const titulo = document.getElementById('modal-titulo');
    const form = document.getElementById('form-usuario');
    
    if (!modal) return;

    // Guardar referencia del usuario que se está editando (null para crear)
    this.usuarioEditando = usuario;
    this.modalActivo = true;
    
    // Configurar título y campos según el modo (crear/editar)
    if (usuario) {
      // [MODO EDITAR] - Cargar datos del usuario existente
      titulo.textContent = 'Editar Usuario';
      document.getElementById('nombre-usuario').value = usuario.nombre;
      document.getElementById('contrasena-usuario').value = usuario.contrasena;
      
      // [PEDRO - ESPACIO PARA CONFIGURACIÓN ADICIONAL - EDITAR]
      // Puedes agregar aquí:
      // - Campos adicionales del usuario
      // - Restricciones de edición según permisos
      // - Validaciones específicas para edición
    } else {
      // [MODO CREAR] - Limpiar formulario para nuevo usuario
      titulo.textContent = 'Crear Usuario';
      form.reset();
      
      // [PEDRO - ESPACIO PARA CONFIGURACIÓN ADICIONAL - CREAR]
      // Puedes agregar aquí:
      // - Valores por defecto para nuevos usuarios
      // - Configuración inicial de campos
      // - Validaciones específicas para creación
    }
    
    // Mostrar modal y enfocar primer campo
    modal.classList.add('modal--active');
    document.getElementById('nombre-usuario').focus();
  }

  // [CERRAR MODAL]
  // Cerrar modal y limpiar estado
  // Esta función oculta el modal y resetea todas las variables de estado
  cerrarModal() {
    const modal = document.getElementById('modal-usuario');
    if (!modal) return;

    // Ocultar modal
    modal.classList.remove('modal--active');
    
    // Limpiar variables de estado
    this.modalActivo = false;
    this.usuarioEditando = null;
    
    // Limpiar formulario
    const form = document.getElementById('form-usuario');
    if (form) form.reset();
    
    // [PEDRO - ESPACIO PARA LIMPIEZA ADICIONAL]
    // Puedes agregar aquí:
    // - Limpiar validaciones visuales
    // - Resetear campos adicionales
    // - Limpiar mensajes de error
    // - Restaurar estado inicial del formulario
    // - Limpiar datos temporales
  }

  // Manejar formulario de usuario (crear/editar)
  async manejarFormularioUsuario(evento) {
    evento.preventDefault();
    
    // Obtener datos del formulario
    const nombre = document.getElementById('nombre-usuario').value.trim();
    const contrasena = document.getElementById('contrasena-usuario').value;
    
    // Validaciones básicas de frontend (mantener estas validaciones)
    if (!nombre || !contrasena) {
      this.mostrarNotificacion('Por favor, completa todos los campos', 'warning');
      return;
    }

    // [PEDRO - NOTA PARA INTEGRACIÓN]
     // Las validaciones adicionales (longitud, formato, etc.) se manejan
     // en las funciones crearUsuario() y editarUsuario() del GestorUsuarios
     // Puedes agregar validaciones adicionales aquí si es necesario

    try {
      // Determinar si es edición o creación
      if (this.usuarioEditando) {
        // [INTEGRACIÓN BACKEND] - Editar usuario existente
        await this.gestor.editarUsuario(this.usuarioEditando.id, nombre, contrasena);
        this.mostrarNotificacion('Usuario editado correctamente', 'success');
      } else {
        // [INTEGRACIÓN BACKEND] - Crear nuevo usuario
        await this.gestor.crearUsuario(nombre, contrasena);
        this.mostrarNotificacion('Usuario creado correctamente', 'success');
      }
      
      // Cerrar modal y actualizar lista tras operación exitosa
      this.cerrarModal();
      this.cargarListaUsuarios();
    } catch (error) {
      // Mostrar errores de validación o de API al usuario
      this.mostrarNotificacion(`Error: ${error.message}`, 'error');
    }
  }

  // Editar usuario
  editarUsuario(id) {
    const usuario = this.gestor.obtenerUsuarios().find(u => u.id === id);
    if (usuario) {
      this.abrirModal(usuario);
    }
  }

  // Eliminar usuario con confirmación
  async eliminarUsuario(id) {
    // Buscar usuario para mostrar información en la confirmación
    const usuario = this.gestor.obtenerUsuarios().find(u => u.id === id);
    if (!usuario) {
      this.mostrarNotificacion('Usuario no encontrado', 'error');
      return;
    }

    // [PEDRO - MODAL DE CONFIRMACIÓN]
    // Usar modal personalizado de confirmación
    // en lugar del alert() básico del navegador
    
    const confirmacion = await this.mostrarConfirmacion(
      `¿Estás seguro de que deseas eliminar al usuario "${usuario.nombre}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (confirmacion) {
      try {
        // [INTEGRACIÓN BACKEND] - Eliminar usuario
        await this.gestor.eliminarUsuario(id);
        this.mostrarNotificacion('Usuario eliminado correctamente', 'success');
        
        // Actualizar lista tras eliminación exitosa
        this.cargarListaUsuarios();
      } catch (error) {
        // Mostrar errores de validación o de API al usuario
        this.mostrarNotificacion(`Error: ${error.message}`, 'error');
      }
    }
  }

  // Manejar formulario de acceso
  async manejarFormularioAcceso(evento) {
    evento.preventDefault();
    
    const nombre = document.getElementById('nombre-acceso').value.trim();
    const contrasena = document.getElementById('contrasena-acceso').value;
    const mensajeError = document.getElementById('mensaje-error');
    
    if (!nombre || !contrasena) {
      this.mostrarError('Por favor, completa todos los campos');
      return;
    }

    try {
      if (this.gestor.autenticar(nombre, contrasena)) {
        // Autenticación exitosa
        window.location.href = 'usuarios.html';
      } else {
        this.mostrarError('Credenciales incorrectas');
      }
    } catch (error) {
      this.mostrarError('Error al autenticar usuario');
    }
  }

  // Mostrar mensaje de error
  mostrarError(mensaje) {
    const mensajeError = document.getElementById('mensaje-error');
    if (mensajeError) {
      mensajeError.querySelector('p').textContent = mensaje;
      mensajeError.style.display = 'block';
      
      // Ocultar después de 5 segundos
      setTimeout(() => {
        mensajeError.style.display = 'none';
      }, 5000);
    }
  }

  // Cerrar sesión
  cerrarSesion(evento) {
    evento.preventDefault();
    
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.gestor.cerrarSesion();
      window.location.href = 'acceso.html';
    }
  }

  // [SISTEMA DE MODALES PERSONALIZADOS]
  // Funciones para mostrar notificaciones y confirmaciones personalizadas
  // Reemplaza las alertas nativas del navegador

  // Mostrar notificación personalizada
  mostrarNotificacion(mensaje, tipo = 'info') {
    const modal = document.getElementById('notification-modal');
    const iconContainer = document.getElementById('notification-icon');
    const messageContainer = document.getElementById('notification-message');
    const okButton = document.getElementById('notification-ok');

    if (!modal || !iconContainer || !messageContainer || !okButton) {
      console.warn('Elementos de notificación no encontrados, usando alert nativo');
      alert(mensaje);
      return;
    }

    // Configurar icono según el tipo
    const iconos = {
      success: '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
      error: '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
      warning: '<svg viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>',
      info: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>'
    };

    iconContainer.innerHTML = iconos[tipo] || iconos.info;
    iconContainer.className = `notification-modal__icon notification-modal__icon--${tipo}`;
    messageContainer.textContent = mensaje;

    // Mostrar modal
    modal.classList.add('notification-modal--active');

    // Configurar evento del botón OK
    const handleOk = () => {
      modal.classList.remove('notification-modal--active');
      okButton.removeEventListener('click', handleOk);
    };

    okButton.addEventListener('click', handleOk);

    // Cerrar con Escape
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        modal.classList.remove('notification-modal--active');
        document.removeEventListener('keydown', handleEscape);
        okButton.removeEventListener('click', handleOk);
      }
    };

    document.addEventListener('keydown', handleEscape);
  }

  // Mostrar confirmación personalizada
  mostrarConfirmacion(mensaje) {
    return new Promise((resolve) => {
      const modal = document.getElementById('confirmation-modal');
      const messageContainer = document.getElementById('confirmation-message');
      const cancelButton = document.getElementById('confirmation-cancel');
      const confirmButton = document.getElementById('confirmation-confirm');

      if (!modal || !messageContainer || !cancelButton || !confirmButton) {
        console.warn('Elementos de confirmación no encontrados, usando confirm nativo');
        resolve(confirm(mensaje));
        return;
      }

      messageContainer.textContent = mensaje;
      modal.classList.add('confirmation-modal--active');

      // Configurar eventos de los botones
      const handleCancel = () => {
        modal.classList.remove('confirmation-modal--active');
        cleanup();
        resolve(false);
      };

      const handleConfirm = () => {
        modal.classList.remove('confirmation-modal--active');
        cleanup();
        resolve(true);
      };

      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          modal.classList.remove('confirmation-modal--active');
          cleanup();
          resolve(false);
        }
      };

      const cleanup = () => {
        cancelButton.removeEventListener('click', handleCancel);
        confirmButton.removeEventListener('click', handleConfirm);
        document.removeEventListener('keydown', handleEscape);
      };

      cancelButton.addEventListener('click', handleCancel);
      confirmButton.addEventListener('click', handleConfirm);
      document.addEventListener('keydown', handleEscape);
    });
  }
}

// Inicializar la aplicación cuando el DOM esté listo
let interfazUsuarios;

document.addEventListener('DOMContentLoaded', () => {
  interfazUsuarios = new InterfazUsuarios();
});

// Exportar para uso global (compatibilidad con otros módulos del proyecto)
if (typeof window !== 'undefined') {
  window.InterfazUsuarios = InterfazUsuarios;
  window.GestorUsuarios = GestorUsuarios;
  window.Usuario = Usuario;
}