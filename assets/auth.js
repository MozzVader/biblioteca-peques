/* ════════════════════════════════════════════
   auth.js — Login y manejo de roles
   ════════════════════════════════════════════ */

const USUARIOS_SISTEMA = [
  { usuario: 'admin',    password: '1234',   nombre: 'María Administradora', rol: 'admin'         },
  { usuario: 'biblio',   password: 'biblio', nombre: 'Juan Bibliotecario',   rol: 'bibliotecario' },
  { usuario: 'consulta', password: '0000',   nombre: 'Solo Lectura',         rol: 'consulta'      },
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

    document.getElementById('header-username').textContent = encontrado.nombre;
    document.getElementById('avatar-initials').textContent = encontrado.nombre
      .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    document.getElementById('pantalla-login').style.display = 'none';
    const app = document.getElementById('app');
    app.classList.remove('app-hidden');
    app.classList.add('app-visible');

    this.aplicarPermisos(encontrado.rol);

    // Cargar datos desde Firebase y mostrar inicio
    UI.mostrarCargando(true);
    DB.cargar().then(() => {
      UI.mostrarCargando(false);
      Inicio.render();
    }).catch(err => {
      UI.mostrarCargando(false);
      console.error('Error al cargar datos:', err);
      alert('No se pudo conectar con la base de datos. Verificá la conexión.');
    });
  },

  logout() {
    this.usuarioActual = null;
    document.getElementById('app').classList.replace('app-visible', 'app-hidden');
    document.getElementById('pantalla-login').style.display = 'flex';
    document.getElementById('login-usuario').value  = '';
    document.getElementById('login-password').value = '';
  },

  aplicarPermisos(rol) {
    const soloLectura = rol === 'consulta';
    document.querySelectorAll('.btn-primary, .btn-danger').forEach(btn => {
      btn.style.display = soloLectura ? 'none' : '';
    });
  },

  puedeEditar() {
    return this.usuarioActual && this.usuarioActual.rol !== 'consulta';
  }
};

export default Auth;
