# 📋 Task Manager - Sistema de Gestión de Usuarios

**Evaluación Final Módulo 5** - Aplicación web completa para gestión de usuarios con interfaz moderna y funcionalidades avanzadas.

## 🚀 Características Principales

### ✨ **Funcionalidades Implementadas**
- **Sistema de autenticación** con página de acceso segura
- **Gestión completa de usuarios** (crear, editar, eliminar, listar)
- **Interfaz moderna y atractiva** con diseño responsive
- **Modales personalizados** para notificaciones y confirmaciones
- **Persistencia de datos** usando localStorage
- **Validaciones de formulario** en tiempo real
- **Arquitectura orientada a objetos** con clases JavaScript

### 🎨 **Mejoras Visuales Recientes**
- **Diseño completamente renovado** con gradientes modernos
- **Animaciones suaves** y efectos de transición profesionales
- **Sistema de notificaciones integrado** (sin alertas del navegador)
- **Efectos hover avanzados** con transformaciones 3D
- **Fondo dinámico** con patrones radiales y efectos de profundidad
- **Tipografía mejorada** con mejor jerarquía visual
- **Sombras multicapa** para sensación de profundidad

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con metodología BEM
- **JavaScript ES6+** - Lógica de aplicación orientada a objetos
- **LocalStorage** - Persistencia de datos del lado del cliente
- **Responsive Design** - Adaptable a diferentes dispositivos

## 📁 Estructura del Proyecto

```
taskmanager/
├── README.md
├── cssGlobal/
│   └── stylesGlobal.css
├── dashboard/
│   ├── css/
│   ├── dashboard.html
│   └── js/
├── tareas/
│   ├── css/
│   ├── js/
│   └── tareas.html
└── usuarios/                    # 🎯 Módulo principal implementado
    ├── README.md
    ├── acceso.html             # Página de login
    ├── usuarios.html           # Gestión de usuarios
    ├── css/
    │   └── stylesUsuarios.css  # Estilos modernos
    └── js/
        └── scriptUsuarios.js   # Lógica de aplicación
```

## 🚀 Instalación y Uso

### **Requisitos Previos**
- Python 3.x instalado en el sistema
- Navegador web moderno

### **Pasos para Ejecutar**

1. **Clonar o descargar** el proyecto
2. **Abrir terminal** en la carpeta del proyecto
3. **Iniciar servidor local:**
   ```bash
   python -m http.server 8000
   ```
4. **Abrir navegador** y ir a: `http://localhost:8000/usuarios/acceso.html`

### **Credenciales de Acceso**
- **Usuario:** `admin`
- **Contraseña:** `admin123`

## 💻 Funcionalidades del Sistema

### **🔐 Página de Acceso (acceso.html)**
- Formulario de autenticación seguro
- Validación de credenciales
- Interfaz moderna con efectos visuales
- Redirección automática tras login exitoso

### **👥 Gestión de Usuarios (usuarios.html)**
- **Listar usuarios** con diseño de tarjetas modernas
- **Crear usuarios** mediante modal interactivo
- **Editar usuarios** con formulario pre-rellenado
- **Eliminar usuarios** con confirmación personalizada
- **Validaciones** en tiempo real
- **Notificaciones** integradas (sin alertas del navegador)

## 🎨 Características del Diseño

### **Elementos Visuales Modernos**
- **Gradientes dinámicos** en todos los componentes
- **Animaciones de shimmer** en el header
- **Efectos de cristal** (backdrop-filter) en modales
- **Transformaciones 3D** en elementos interactivos
- **Curvas de animación profesionales** (cubic-bezier)
- **Sistema de colores coherente** basado en tonos cyan

### **Experiencia de Usuario**
- **Feedback visual inmediato** en todas las interacciones
- **Transiciones suaves** entre estados
- **Diseño responsive** para móviles y desktop
- **Accesibilidad mejorada** con soporte de teclado
- **Carga rápida** sin dependencias externas

## 🔧 Preparación para Backend

### **Comentarios para Integración**
El código incluye **comentarios detallados dirigidos a Pedro** para facilitar la futura integración con backend:

- **Puntos de integración API** claramente marcados
- **Funciones preparadas** para llamadas HTTP
- **Manejo de errores** estructurado
- **Configuración de headers** documentada
- **Validaciones adicionales** sugeridas

### **Funciones Listas para Backend**
```javascript
// Ejemplos de funciones preparadas:
crearUsuario()     // POST /api/usuarios
editarUsuario()    // PUT /api/usuarios/:id
eliminarUsuario()  // DELETE /api/usuarios/:id
cargarUsuarios()   // GET /api/usuarios
```

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🎯 Estado del Proyecto

### ✅ **Completado**
- [x] Sistema de autenticación
- [x] CRUD completo de usuarios
- [x] Interfaz moderna y responsive
- [x] Modales personalizados
- [x] Validaciones de formulario
- [x] Persistencia con localStorage
- [x] Documentación para backend
- [x] Mejoras visuales avanzadas

### 🔄 **Pendiente (Futuras Mejoras)**
- [ ] Integración con API backend
- [ ] Módulo de tareas
- [ ] Dashboard principal
- [ ] Autenticación con JWT
- [ ] Base de datos real

## 👨‍💻 Desarrollo

**Desarrollado con metodología BEM** para CSS y **programación orientada a objetos** en JavaScript, siguiendo las mejores prácticas de desarrollo frontend.

---

**¡La aplicación está lista para usar y preparada para integración backend!** 🚀
