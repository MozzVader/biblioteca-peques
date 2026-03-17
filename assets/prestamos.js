/* ════════════════════════════════════════════
   prestamos.js — Gestión de préstamos
   ════════════════════════════════════════════ */

import DB      from './db.js';
import Auth    from './auth.js';
import UI      from './ui.js';
import Inicio  from './inicio.js';
import Vencidos from './vencidos.js';

const Prestamos = {

  render() {
    const lista = DB.prestamos.filter(p => !p.devuelto);
    const tbody = document.getElementById('tabla-prestamos');

    if (lista.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#98A2B3;padding:2rem">No hay préstamos activos</td></tr>`;
      return;
    }

    tbody.innerHTML = lista.map(p => {
      const libro   = DB.libroById(p.libroId);
      const usuario = DB.usuarioById(p.usuarioId);
      return `<tr>
        <td>${libro   ? libro.titulo   : '—'}</td>
        <td>${usuario ? usuario.nombre : '—'}</td>
        <td>${DB.formatFecha(p.fechaPrestamo)}</td>
        <td>${DB.formatFecha(p.fechaDevolucion)}</td>
        <td>${DB.estadoPrestamo(p)}</td>
        <td><button class="btn btn-sm" onclick="window.Prestamos.devolver('${p._id}')">Devolver</button></td>
      </tr>`;
    }).join('');
  },

  prepararModal() {
    const librosDisp = DB.libros.filter(l => DB.disponibles(l) > 0);

    document.getElementById('pres-libro').innerHTML = librosDisp.length === 0
      ? '<option disabled>No hay libros disponibles</option>'
      : librosDisp.map(l =>
          `<option value="${l._id}">${l.titulo} (${DB.disponibles(l)} disp.)</option>`
        ).join('');

    document.getElementById('pres-usuario').innerHTML = DB.usuarios.map(u =>
      `<option value="${u._id}">${u.nombre}</option>`
    ).join('');

    const hoy = DB.hoy();
    const dev = new Date();
    dev.setDate(dev.getDate() + DB.config.dias);
    document.getElementById('pres-fecha').value      = hoy;
    document.getElementById('pres-devolucion').value = dev.toISOString().split('T')[0];
  },

  async registrar() {
    if (!Auth.puedeEditar()) return;

    const libroId         = document.getElementById('pres-libro').value;
    const usuarioId       = document.getElementById('pres-usuario').value;
    const fechaPrestamo   = document.getElementById('pres-fecha').value;
    const fechaDevolucion = document.getElementById('pres-devolucion').value;

    if (!libroId || !usuarioId) { alert('Seleccioná un libro y un usuario.'); return; }

    UI.cerrarModal('modal-prestamo');
    UI.mostrarCargando(true);

    try {
      const libro = DB.libroById(libroId);
      const nuevosPrestandos = libro.prestados + 1;

      await Promise.all([
        DB.agregarPrestamo({ libroId, usuarioId, fechaPrestamo, fechaDevolucion }),
        DB.actualizarPrestadosLibro(libroId, nuevosPrestandos)
      ]);

      this.render();
      Inicio.render();
      UI.alerta('alert-prestamo', '✓ Préstamo registrado correctamente.');
    } catch(e) {
      alert('Error al registrar el préstamo. Intentá de nuevo.');
    } finally {
      UI.mostrarCargando(false);
    }
  },

  async devolver(id) {
    const prestamo = DB.prestamoById(id);
    const libro    = DB.libroById(prestamo.libroId);

    if (!confirm(`¿Registrar devolución de "${libro ? libro.titulo : 'este libro'}"?`)) return;

    UI.mostrarCargando(true);
    try {
      const nuevosPrestandos = Math.max(0, libro.prestados - 1);
      await Promise.all([
        DB.devolverPrestamo(id),
        DB.actualizarPrestadosLibro(prestamo.libroId, nuevosPrestandos)
      ]);

      this.render();
      Inicio.render();
      Vencidos.render();
      UI.alerta('alert-prestamo', '✓ Devolución registrada.');
    } catch(e) {
      alert('Error al registrar la devolución. Intentá de nuevo.');
    } finally {
      UI.mostrarCargando(false);
    }
  }
};

export default Prestamos;
