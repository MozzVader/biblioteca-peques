/* ════════════════════════════════════════════
   inicio.js — Panel principal
   ════════════════════════════════════════════ */

import DB from './db.js';

const Inicio = {
  render() {
    const activos  = DB.prestamos.filter(p => !p.devuelto);
    const vencidos = activos.filter(p => DB.diasAtraso(p.fechaDevolucion) > 0);

    document.getElementById('stat-libros').textContent   = DB.libros.length;
    document.getElementById('stat-activos').textContent  = activos.length;
    document.getElementById('stat-vencidos').textContent = vencidos.length;
    document.getElementById('stat-usuarios').textContent = DB.usuarios.length;

    const badge = document.getElementById('badge-vencidos');
    badge.textContent = vencidos.length > 0 ? vencidos.length : '';

    const ultimos = [...DB.prestamos].reverse().slice(0, 5);
    document.getElementById('tabla-ultimos').innerHTML = ultimos.map(p => {
      const l = DB.libroById(p.libroId);
      const u = DB.usuarioById(p.usuarioId);
      return `<tr>
        <td>${l ? l.titulo  : '—'}</td>
        <td>${u ? u.nombre  : '—'}</td>
        <td>${DB.formatFecha(p.fechaDevolucion)}</td>
        <td>${DB.estadoPrestamo(p)}</td>
      </tr>`;
    }).join('');

    const dias  = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
    const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    const ahora = new Date();
    document.getElementById('fecha-hoy').textContent =
      `${dias[ahora.getDay()]} ${ahora.getDate()} de ${meses[ahora.getMonth()]} de ${ahora.getFullYear()}`;
  }
};

export default Inicio;
