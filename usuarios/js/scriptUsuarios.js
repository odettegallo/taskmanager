// Clase Usuario
class Usuario {
  constructor(id, nombre, contrasena) {
    this.id = id;
    this.nombre = nombre;
    this.contrasena = contrasena;
    this.fechaCreacion = new Date().toISOString();
  }

  validarContrasena(contrasena) {
    return this.contrasena === contrasena;
  }

  getInfo() {
    return { id: this.id, nombre: this.nombre, fechaCreacion: this.fechaCreacion };
  }

  toJSON() {
    return { id: this.id, nombre: this.nombre, contrasena: this.contrasena, fechaCreacion: this.fechaCreacion };
  }

  static fromJSON(data) {
    const usuario = new Usuario(data.id, data.nombre, data.contrasena);
    usuario.fechaCreacion = data.fechaCreacion;
    return usuario;
  }
}

// Clase GestorUsuarios
class GestorUsuarios {
  constructor() {
    this.usuarios = [];
    this.usuarioActual = null;
    this.apiUrl = 'https://68ae3155a0b85b2f2cf5c714.mockapi.io/api/taskmanager/users';
  }

  async cargarUsuarios() {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error('Error al cargar usuarios desde API');
      const data = await response.json();
      this.usuarios = data.map(u => new Usuario(u.id, u.name, u.password));
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      this.usuarios = [];
    }
  }

  autenticar(nombre, contrasena) {
    const usuario = this.usuarios.find(u =>
      u.nombre.toLowerCase() === nombre.toLowerCase() && u.validarContrasena(contrasena)
    );
    if (usuario) {
      this.usuarioActual = usuario;
      localStorage.setItem('taskmanager_usuario_actual', JSON.stringify(usuario.getInfo()));
      return true;
    }
    return false;
  }

  cerrarSesion() {
    this.usuarioActual = null;
    localStorage.removeItem('taskmanager_usuario_actual');
  }

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

  obtenerUsuarios() {
    return this.usuarios;
  }

  async crearUsuario(nombre, contrasena) {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nombre.trim(), password: contrasena })
    });
    if (!response.ok) throw new Error('Error al crear usuario en la API');
    const nuevo = await response.json();
    const nuevoUsuario = new Usuario(nuevo.id, nuevo.name, nuevo.password);
    this.usuarios.push(nuevoUsuario);
    return nuevoUsuario;
  }

  async editarUsuario(id, nombre, contrasena) {
    const response = await fetch(`${this.apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nombre.trim(), password: contrasena })
    });
    if (!response.ok) throw new Error('Error al editar usuario en la API');
    const actualizado = await response.json();
    const usuario = this.usuarios.find(u => u.id == id);
    if (usuario) {
      usuario.nombre = actualizado.name;
      usuario.contrasena = actualizado.password;
    }
    return usuario;
  }

  async eliminarUsuario(id) {
    const response = await fetch(`${this.apiUrl}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error al eliminar usuario en la API');
    this.usuarios = this.usuarios.filter(u => u.id != id);
  }
}

// Clase InterfazUsuarios
class InterfazUsuarios {
  constructor() {
    this.gestor = new GestorUsuarios();
    this.modalActivo = false;
    this.usuarioEditando = null;
    this.inicializar();
  }

  async inicializar() {
    await this.gestor.cargarUsuarios(); // esperar a cargar usuarios
    this.configurarEventos();
    this.verificarAutenticacion();
    this.mostrarUsuarioLogueado();


    if (document.getElementById('lista-usuarios')) {
      this.cargarListaUsuarios();
    }
  }

  configurarEventos() {
    const btnCrear = document.getElementById('btn-crear-usuario');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const formUsuario = document.getElementById('form-usuario');
    const btnCancelar = document.getElementById('btn-cancelar');
    const btnSalir = document.getElementById('btn-salir');
    const formAcceso = document.getElementById('form-acceso');

    if (btnCrear) btnCrear.addEventListener('click', () => this.abrirModal());
    if (btnCerrarModal) btnCerrarModal.addEventListener('click', () => this.cerrarModal());
    if (modalOverlay) modalOverlay.addEventListener('click', () => this.cerrarModal());
    if (formUsuario) formUsuario.addEventListener('submit', (e) => this.manejarFormularioUsuario(e));
    if (btnCancelar) btnCancelar.addEventListener('click', () => this.cerrarModal());
    if (btnSalir) btnSalir.addEventListener('click', (e) => this.cerrarSesion(e));
    if (formAcceso) formAcceso.addEventListener('submit', (e) => this.manejarFormularioAcceso(e));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalActivo) this.cerrarModal();
    });
  }

  verificarAutenticacion() {
    const usuario = this.gestor.obtenerUsuarioActual();
    const esAcceso = window.location.pathname.includes('acceso.html');

    if (!usuario && !esAcceso) window.location.href = 'acceso.html';
    else if (usuario && esAcceso) window.location.href = 'usuarios.html';
  }

  mostrarUsuarioLogueado() {
    const usuario = this.gestor.obtenerUsuarioActual();
    const elementoUsuario = document.getElementById('usuario-logueado');
    if (usuario && elementoUsuario) elementoUsuario.textContent = usuario.nombre;
  }

  async manejarFormularioAcceso(evento) {
    evento.preventDefault();
    const nombre = document.getElementById('nombre-acceso').value.trim();
    const contrasena = document.getElementById('contrasena-acceso').value;
    if (!nombre || !contrasena) return this.mostrarError('Por favor completa todos los campos');

    try {
      await this.gestor.cargarUsuarios(); // asegurar que usuarios estén cargados
      if (this.gestor.autenticar(nombre, contrasena)) window.location.href = 'usuarios.html';
      else this.mostrarError('Credenciales incorrectas');
    } catch {
      this.mostrarError('Error al autenticar usuario');
    }
  }

  mostrarError(mensaje) {
    const mensajeError = document.getElementById('mensaje-error');
    if (mensajeError) {
      mensajeError.querySelector('p').textContent = mensaje;
      mensajeError.style.display = 'block';
      setTimeout(() => { mensajeError.style.display = 'none'; }, 5000);
    }
  }

  cerrarSesion(evento) {
    evento.preventDefault();
    if (confirm('¿Deseas cerrar sesión?')) {
      this.gestor.cerrarSesion();
      window.location.href = 'acceso.html';
    }
  }

  abrirModal(usuario = null) {
    const modal = document.getElementById('modal-usuario');
    const titulo = document.getElementById('modal-titulo');
    const form = document.getElementById('form-usuario');
    if (!modal) return;

    this.usuarioEditando = usuario;
    this.modalActivo = true;

    if (usuario) {
      titulo.textContent = 'Editar Usuario';
      document.getElementById('nombre-usuario').value = usuario.nombre;
      document.getElementById('contrasena-usuario').value = usuario.contrasena;
    } else {
      titulo.textContent = 'Crear Usuario';
      if (form) form.reset();
    }

    modal.classList.add('modal--active');
    document.getElementById('nombre-usuario').focus();
  }

  cerrarModal() {
    const modal = document.getElementById('modal-usuario');
    if (!modal) return;
    modal.classList.remove('modal--active');
    this.modalActivo = false;
    this.usuarioEditando = null;
    const form = document.getElementById('form-usuario');
    if (form) form.reset();
  }

  async manejarFormularioUsuario(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre-usuario').value.trim();
    const contrasena = document.getElementById('contrasena-usuario').value;
    if (!nombre || !contrasena) return this.mostrarNotificacion('Completa todos los campos', 'warning');

    try {
      if (this.usuarioEditando) await this.gestor.editarUsuario(this.usuarioEditando.id, nombre, contrasena);
      else await this.gestor.crearUsuario(nombre, contrasena);

      this.cerrarModal();
      this.cargarListaUsuarios();
      this.mostrarNotificacion('Operación realizada correctamente', 'success');
    } catch (error) {
      this.mostrarNotificacion(`Error: ${error.message}`, 'error');
    }
  }

  async cargarListaUsuarios() {
    const lista = document.getElementById('lista-usuarios');
    if (!lista) return;

    const usuarios = this.gestor.obtenerUsuarios();
    lista.innerHTML = usuarios.length === 0 ? '<p>No hay usuarios registrados</p>' : '';
    usuarios.forEach(u => {
      const div = document.createElement('div');
      div.className = 'usuario-item';
      div.innerHTML = `
        <span>${u.nombre}</span>
        <button onclick="interfazUsuarios.abrirModal(${u.id})">Editar</button>
        <button onclick="interfazUsuarios.eliminarUsuario(${u.id})">Eliminar</button>
      `;
      lista.appendChild(div);
    });
  }

  mostrarNotificacion(mensaje, tipo = 'info') {
    alert(`${tipo.toUpperCase()}: ${mensaje}`);
  }

  async eliminarUsuario(id) {
    if (!confirm('¿Deseas eliminar este usuario?')) return;
    try {
      await this.gestor.eliminarUsuario(id);
      this.cargarListaUsuarios();
      this.mostrarNotificacion('Usuario eliminado', 'success');
    } catch (error) {
      this.mostrarNotificacion(`Error: ${error.message}`, 'error');
    }
  }
}

// Inicialización global
let interfazUsuarios;
document.addEventListener('DOMContentLoaded', () => {
  interfazUsuarios = new InterfazUsuarios();
});

const abrirModalEditar = (usuario) => {
  const modal = document.querySelector('.modal');
  modal.classList.add('modal--active');

  // Llenar inputs con los datos del usuario
  const inputNombre = modal.querySelector('#nombre');
  const inputPassword = modal.querySelector('#password');

  inputNombre.value = usuario.nombre; // Aquí estaba undefined
  inputPassword.value = usuario.password; // Aquí puedes ver los puntos
};


