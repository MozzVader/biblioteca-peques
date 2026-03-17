/* ════════════════════════════════════════════
   auth.js — Login y manejo de roles
   Para producción: reemplazá USUARIOS por
   Firebase Authentication.
   ════════════════════════════════════════════ */

const USUARIOS_SISTEMA = [
  { usuario: 'admin',      password: '1234',   nombre: 'María Administradora', rol: 'admin'        },
  { usuario: 'biblio',     password: 'biblio', nombre: 'Juan Bibliotecario',   rol: 'bibliotecario' },
  { usuario: 'consulta',   password: '0000',   nombre: 'Solo Lectura',         rol: 'consulta'     },
];

const Auth = {
  usuarioActual: null,

  login() {
    const usuario  = document.getElementById('login-usuario').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl  = document.getElementById('login-error');

    const encontrado = USUARIOS_SISTEMA.find(
      u => u.usuario === usuario && u.password === password
    );

    if (!encontrado) {
      errorEl.textContent = 'Usuario o contraseña incorrectos.';
      errorEl.classList.add('show');
      return;
    }

    errorEl.classList.remove('show');
    this.usuarioActual = encontrado;

    // Actualizar header
    document.getElementById('header-username').textContent = encontrado.nombre;
    document.getElementById('avatar-initials').textContent = encontrado.nombre
      .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    // Mostrar app, ocultar login
    document.getElementById('pantalla-login').style.display = 'none';
    const app = document.getElementById('app');
    app.classList.remove('app-hidden');
    app.classList.add('app-visible');

    // Aplicar permisos según rol
    this.aplicarPermisos(encontrado.rol);

    // Inicializar vista de inicio
    Inicio.render();
  },

  logout() {
    this.usuarioActual = null;
    document.getElementById('app').classList.remove('app-visible');
    document.getElementById('app').classList.add('app-hidden');
    document.getElementById('pantalla-login').style.display = 'flex';
    document.getElementById('login-usuario').value  = '';
    document.getElementById('login-password').value = '';
  },

  // Ocultar secciones según el rol
  aplicarPermisos(rol) {
    const soloLectura = rol === 'consulta';
    // Ocultar botones de agregar/eliminar para rol consulta
    document.querySelectorAll('.btn-primary, .btn-danger').forEach(btn => {
      btn.style.display = soloLectura ? 'none' : '';
    });
  },

  // Verificar si el usuario tiene permiso para una acción
  puedeEditar() {
    return this.usuarioActual && this.usuarioActual.rol !== 'consulta';
  }
};
