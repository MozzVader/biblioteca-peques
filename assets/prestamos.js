/* ════════════════════════════════════════════
   prestamos.js — Gestión de préstamos
   ════════════════════════════════════════════ */

const Prestamos = {

  render() {
    const lista = DB.prestamos.filter(p => !p.devuelto);
    const tbody = document.getElementById('tabla-prestamos');

    if (lista.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#888780;padding:2rem">No hay préstamos activos</td></tr>`;
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
        <td>
          <button class="btn btn-sm" onclick="Prestamos.devolver(${p.id})">Devolver</button>
        </td>
      </tr>`;
    }).join('');
  },

  // Llenar selects antes de abrir el modal
  prepararModal() {
    const librosDisp = DB.libros.filter(l => DB.disponibles(l) > 0);

    document.getElementById('pres-libro').innerHTML = librosDisp.length === 0
      ? '<option disabled>No hay libros disponibles</option>'
      : librosDisp.map(l =>
          `<option value="${l.id}">${l.titulo} (${DB.disponibles(l)} disp.)</option>`
        ).join('');

    document.getElementById('pres-usuario').innerHTML = DB.usuarios.map(u =>
      `<option value="${u.id}">${u.nombre}</option>`
    ).join('');

    // Fechas automáticas
    const hoy = DB.hoy();
    const dev = new Date();
    dev.setDate(dev.getDate() + DB.config.dias);

    document.getElementById('pres-fecha').value       = hoy;
    document.getElementById('pres-devolucion').value  = dev.toISOString().split('T')[0];
  },

  registrar() {
    if (!Auth.puedeEditar()) return;

    const libroId         = parseInt(document.getElementById('pres-libro').value);
    const usuarioId       = parseInt(document.getElementById('pres-usuario').value);
    const fechaPrestamo   = document.getElementById('pres-fecha').value;
    const fechaDevolucion = document.getElementById('pres-devolucion').value;

    if (!libroId || !usuarioId) {
      alert('Seleccioná un libro y un usuario.');
      return;
    }

    // Incrementar contador de prestados
    const libro = DB.libroById(libroId);
    libro.prestados++;

    DB.prestamos.push({
      id: DB.nextId('prestamos'),
      libroId, usuarioId, fechaPrestamo, fechaDevolucion,
      devuelto: false
    });

    UI.cerrarModal('modal-prestamo');
    this.render();
    Inicio.render();
    UI.alerta('alert-prestamo', '✓ Préstamo registrado correctamente.');
  },

  devolver(id) {
    const prestamo = DB.prestamoById(id);
    const libro    = DB.libroById(prestamo.libroId);

    if (!confirm(`¿Registrar devolución de "${libro.titulo}"?`)) return;

    prestamo.devuelto = true;
    libro.prestados   = Math.max(0, libro.prestados - 1);

    this.render();
    Inicio.render();
    Vencidos.render();
    UI.alerta('alert-prestamo', '✓ Devolución registrada.');
  }
};
