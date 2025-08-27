# Gestión de Usuarios - Taskmanager

## Descripción del Proyecto

Este módulo forma parte de una aplicación web colaborativa de gestión de tareas. Se encarga específicamente de la **gestión de usuarios**, incluyendo registro, autenticación, edición y eliminación de usuarios. El proyecto está desarrollado con JavaScript moderno, siguiendo los paradigmas de orientación a objetos, programación orientada a eventos y programación asíncrona.

## Características Principales

- ✅ **Registro de usuarios** con validación de datos
- ✅ **Autenticación de usuarios** con sistema de sesiones
- ✅ **Edición de usuarios** existentes
- ✅ **Eliminación de usuarios** con confirmación
- ✅ **Persistencia de datos** usando localStorage
- ✅ **Simulación de API** con llamadas asíncronas
- ✅ **Interfaz modal** para crear/editar usuarios
- ✅ **Metodología BEM** para CSS
- ✅ **JavaScript moderno** (ES6+)

## Estructura de Archivos

```
usuarios/
├── usuarios.html          # Página principal de gestión de usuarios
├── acceso.html           # Página de autenticación/login
├── css/
│   └── stylesUsuarios.css # Estilos específicos con metodología BEM
├── js/
│   └── scriptUsuarios.js  # Lógica principal de la aplicación
└── README.md             # Este archivo de documentación
```

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica de las páginas
- **CSS3**: Estilos con metodología BEM
- **JavaScript ES6+**: Lógica de la aplicación
- **localStorage**: Persistencia de datos local
- **Fetch API**: Simulación de llamadas a API externa
- **Async/Await**: Programación asíncrona

## Paradigmas de Programación Implementados

### 1. Orientación a Objetos
- **Clase `Usuario`**: Representa la entidad usuario con sus propiedades y métodos
- **Clase `GestorUsuarios`**: Maneja la lógica de negocio y operaciones CRUD
- **Clase `InterfazUsuarios`**: Controla la interfaz de usuario y eventos

### 2. Programación Orientada a Eventos
- Event listeners para botones y formularios
- Manejo de eventos del teclado (Escape para cerrar modal)
- Eventos de envío de formularios con validación

### 3. Programación Asíncrona
- Uso de `async/await` para operaciones de usuario
- Simulación de llamadas a API con `Promise`
- Preparación para integración con MockAPI real

## Instrucciones de Ejecución

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, pero recomendado)

### Instalación y Ejecución

1. **Clonar o descargar** el proyecto en tu máquina local

2. **Abrir con servidor local** (recomendado):
   ```bash
   # Con Python 3
   python -m http.server 8000
   
   # Con Node.js (si tienes http-server instalado)
   npx http-server
   
   # Con PHP
   php -S localhost:8000
   ```

3. **Acceder a la aplicación**:
   - Navegar a `http://localhost:8000/usuarios/acceso.html`
   - O abrir directamente `acceso.html` en el navegador

### Credenciales por Defecto

La aplicación incluye un usuario administrador por defecto:
- **Usuario**: `admin`
- **Contraseña**: `admin123`

## Funcionalidades Detalladas

### Página de Acceso (`acceso.html`)
- Formulario de autenticación
- Validación de credenciales
- Redirección automática tras login exitoso
- Mensajes de error informativos

### Página de Usuarios (`usuarios.html`)
- Lista dinámica de usuarios registrados
- Botón para crear nuevos usuarios
- Botones de edición y eliminación por usuario
- Modal para crear/editar usuarios
- Información del usuario logueado
- Opción de cerrar sesión

### Gestión de Datos
- **localStorage**: Almacenamiento local de usuarios
- **Simulación de API**: Preparado para integración con MockAPI
- **Validaciones**: Nombres únicos, campos obligatorios
- **Persistencia**: Los datos se mantienen entre sesiones

## Integración con MockAPI

El código está preparado para integrar con MockAPI.io. Para activar la integración real:

1. Crear una cuenta en [MockAPI.io](https://mockapi.io/)
2. Crear un endpoint para usuarios
3. Actualizar la URL en `GestorUsuarios.apiUrl`
4. Reemplazar `simularLlamadaAPI()` por `llamadaAPIReal()`

### Ejemplo de configuración:
```javascript
// En la clase GestorUsuarios
this.apiUrl = 'https://[tu-id].mockapi.io/api/v1/usuarios';
```

## Metodología BEM

Los estilos CSS siguen la metodología BEM (Block, Element, Modifier):

```css
/* Bloque */
.usuario-item { }

/* Elemento */
.usuario-item__nombre { }
.usuario-item__acciones { }
.usuario-item__btn { }

/* Modificador */
.usuario-item__btn--editar { }
.usuario-item__btn--eliminar { }
.modal--active { }
```

## Compatibilidad con el Proyecto Principal

Este módulo está diseñado para integrarse con otros módulos del proyecto:

- **Namespace**: Todas las clases están en el scope global para acceso desde otros módulos
- **localStorage**: Usa prefijos `taskmanager_` para evitar conflictos
- **Eventos**: No interfiere con eventos de otros módulos
- **CSS**: Estilos específicos que no afectan otros componentes

## Estructura de Clases

### Clase Usuario
```javascript
class Usuario {
  constructor(id, nombre, contrasena)
  validarContrasena(contrasena)
  getInfo()
  toJSON()
  static fromJSON(data)
}
```

### Clase GestorUsuarios
```javascript
class GestorUsuarios {
  cargarUsuarios()
  guardarUsuarios()
  crearUsuario(nombre, contrasena)
  editarUsuario(id, nombre, contrasena)
  eliminarUsuario(id)
  autenticar(nombre, contrasena)
  cerrarSesion()
}
```

### Clase InterfazUsuarios
```javascript
class InterfazUsuarios {
  inicializar()
  configurarEventos()
  verificarAutenticacion()
  cargarListaUsuarios()
  abrirModal(usuario)
  cerrarModal()
}
```

## Flujo de la Aplicación

1. **Inicio**: El usuario accede a `acceso.html`
2. **Autenticación**: Ingresa credenciales válidas
3. **Redirección**: Se redirige a `usuarios.html`
4. **Gestión**: Puede crear, editar o eliminar usuarios
5. **Persistencia**: Los cambios se guardan automáticamente
6. **Sesión**: Puede cerrar sesión y volver al login

## Consideraciones de Seguridad

- Las contraseñas se almacenan en texto plano (solo para desarrollo)
- En producción, implementar hash de contraseñas
- Validación tanto en frontend como backend
- Sanitización de datos de entrada

## Próximas Mejoras

- [ ] Hash de contraseñas con bcrypt
- [ ] Validación de fortaleza de contraseñas
- [ ] Roles y permisos de usuario
- [ ] Recuperación de contraseñas
- [ ] Integración completa con MockAPI
- [ ] Tests unitarios
- [ ] Internacionalización (i18n)

## Soporte y Contacto

Este proyecto fue desarrollado como parte del bootcamp Frontend. Para dudas o sugerencias, contactar al equipo de desarrollo.

---

**Versión**: 1.0.0  
**Fecha**: Enero 2025  
**Autor**: Equipo Taskmanager - TAREA 2