/* ════════════════════════════════════════════
   usuarios.js — Gestión de usuarios
   ════════════════════════════════════════════ */

const Usuarios = {

  render() {
    const q = (document.getElementById('buscar-usuario').value || '').toLowerCase();

    const lista = DB.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(q)
    );

    document.getElementById('tabla-usuarios').innerHTML = lista.map(u => {
      const activos   = DB.prestamos.filter(p => p.usuarioId === u.id && !p.devuelto).length;
      const tipoBadge = u.tipo === 'Docente'         ? 'badge-amarillo'
                      : u.tipo === 'Administrativo'  ? 'badge-azul'
                      : 'badge-verde';

      return `<tr>
        <td>${u.nombre}</td>
        <td><span class="badge ${tipoBadge}">${u.tipo}</span></td>
        <td>${u.curso || '—'}</td>
        <td>${activos > 0 ? `<span class="badge badge-rojo">${activos}</span>` : '0'}</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="Usuarios.eliminar(${u.id})">Eliminar</button>
        </td>
      </tr>`;
    }).join('');
  },

  agregar() {
    if (!Auth.puedeEditar()) return;

    const nombre = document.getElementById('usu-nombre').value.trim();
    const tipo   = document.getElementById('usu-tipo').value;
    const curso  = document.getElementById('usu-curso').value.trim();

    if (!nombre) {
      alert('Ingresá el nombre del usuario.');
      return;
    }

    DB.usuarios.push({
      id: DB.nextId('usuarios'),
      nombre, tipo, curso
    });

    UI.cerrarModal('modal-usuario');
    this.render();
    Inicio.render();
    UI.alerta('alert-usuario', `✓ "${nombre}" agregado correctamente.`);

    document.getElementById('usu-nombre').value = '';
    document.getElementById('usu-curso').value  = '';
  },

  eliminar(id) {
    if (!Auth.puedeEditar()) return;

    const usuario = DB.usuarioById(id);
    if (!usuario) return;

    if (DB.prestamos.some(p => p.usuarioId === id && !p.devuelto)) {
      alert('No se puede eliminar: el usuario tiene préstamos activos.');
      return;
    }

    if (!confirm(`¿Eliminar a "${usuario.nombre}"?`)) return;

    DB.usuarios = DB.usuarios.filter(u => u.id !== id);
    this.render();
    Inicio.render();
    UI.alerta('alert-usuario', '✓ Usuario eliminado.');
  }
};
