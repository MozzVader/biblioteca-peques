/* ════════════════════════════════════════════
   ui.js — Helpers de interfaz
   ════════════════════════════════════════════ */

import DB        from './db.js';
import Prestamos from './prestamos.js';

const UI = {

  navigate(el, sec) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('sec-' + sec).classList.add('active');
    el.classList.add('active');

    const renders = {
      inicio:    () => import('./inicio.js').then(m => m.default.render()),
      catalogo:  () => import('./catalogo.js').then(m => { m.default.render(); }),
      prestamos: () => import('./prestamos.js').then(m => m.default.render()),
      usuarios:  () => import('./usuarios.js').then(m => m.default.render()),
      vencidos:  () => import('./vencidos.js').then(m => m.default.render()),
      reportes:  () => import('./reportes.js').then(m => m.default.render()),
    };
    if (renders[sec]) renders[sec]();
  },

  abrirModal(id) {
    if (id === 'modal-prestamo') {
      import('./prestamos.js').then(m => m.default.prepararModal());
    }
    document.getElementById(id).classList.add('open');
  },

  cerrarModal(id) {
    document.getElementById(id).classList.remove('open');
  },

  alerta(id, msg, tipo = 'success') {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = `alert alert-${tipo} show`;
    el.textContent = msg;
    setTimeout(() => el.classList.remove('show'), 3000);
  },

  mostrarCargando(visible) {
    document.getElementById('loading-overlay').style.display = visible ? 'flex' : 'none';
  }
};

// Cerrar modales al hacer clic fuera
window.addEventListener('click', e => {
  document.querySelectorAll('.overlay.open').forEach(o => {
    if (e.target === o) UI.cerrarModal(o.id);
  });
});

export default UI;
