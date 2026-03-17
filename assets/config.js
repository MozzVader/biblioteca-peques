/* ════════════════════════════════════════════
   config.js — Configuración de la app
   ════════════════════════════════════════════ */

import DB from './db.js';
import UI from './ui.js';

const Config = {
  guardar() {
    DB.config.nombre = document.getElementById('cfg-nombre').value.trim() || DB.config.nombre;
    DB.config.dias   = parseInt(document.getElementById('cfg-dias').value) || 7;
    DB.config.biblio = document.getElementById('cfg-biblio').value.trim() || DB.config.biblio;

    document.getElementById('header-username').textContent = DB.config.biblio;
    document.getElementById('avatar-initials').textContent =
      DB.config.biblio.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    UI.alerta('alert-config', '✓ Configuración guardada.');
  }
};

export default Config;
