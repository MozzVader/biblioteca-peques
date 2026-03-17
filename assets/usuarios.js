/* ════════════════════════════════════════════
   usuarios.js — Gestión de usuarios
   ════════════════════════════════════════════ */

import DB   from './db.js';
import Auth from './auth.js';
import UI   from './ui.js';

const Usuarios = {

  render() {
    const q = (document.getElementById('buscar-usuario').value || '').toLowerCase();
    const lista = DB.usuarios.filter(u => u.nombre.toLowerCase().includes(q));

    document.getElementById('tabla-usuarios').innerHTML = lista.map(u => {
      const activos   = DB.prestamos.filter(p => p.usuarioId === u._id && !p.devuelto).length;
      const tipoBadge = u.tipo === 'Docente'        ? 'badge-amarillo'
                      : u.tipo === 'Administrativo' ? 'badge-azul'
                      : 'badge-verde';
      return `<tr>
        <td>${u.nombre}</td>
        <td><span class="badge ${tipoBadge}">${u.tipo}</span></td>
        <td>${u.curso || '—'}</td>
        <td>${activos > 0 ? `<span class="badge badge-rojo">${activos}</span>` : '0'}</td>
        <td><button class="btn btn-sm btn-danger" onclick="window.Usuarios.eliminar('${u._id}')">Eliminar</button></td>
      </tr>`;
    }).join('');
  },

  async agregar() {
    if (!Auth.puedeEditar()) return;

    const nombre = document.getElementById('usu-nombre').value.trim();
    const tipo   = document.getElementById('usu-tipo').value;
    const curso  = document.getElementById('usu-curso').value.trim();

    if (!nombre) { alert('Ingresá el nombre del usuario.'); return; }

    UI.cerrarModal('modal-usuario');
    UI.mostrarCargando(true);

    try {
      await DB.agregarUsuario({ nombre, tipo, curso });
      this.render();
      UI.alerta('alert-usuario', `✓ "${nombre}" agregado correctamente.`);
      document.getElementById('usu-nombre').value = '';
      document.getElementById('usu-curso').value  = '';
    } catch(e) {
      alert('Error al guardar el usuario. Intentá de nuevo.');
    } finally {
      UI.mostrarCargando(false);
    }
  },

  async eliminar(id) {
    if (!Auth.puedeEditar()) return;
    const usuario = DB.usuarioById(id);
    if (!usuario) return;

    if (DB.prestamos.some(p => p.usuarioId === id && !p.devuelto)) {
      alert('No se puede eliminar: el usuario tiene préstamos activos.'); return;
    }
    if (!confirm(`¿Eliminar a "${usuario.nombre}"?`)) return;

    UI.mostrarCargando(true);
    try {
      await DB.eliminarUsuario(id);
      this.render();
      UI.alerta('alert-usuario', '✓ Usuario eliminado.');
    } catch(e) {
      alert('Error al eliminar. Intentá de nuevo.');
    } finally {
      UI.mostrarCargando(false);
    }
  }
};

export default Usuarios;
