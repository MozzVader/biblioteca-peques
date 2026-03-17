/* ════════════════════════════════════════════
   vencidos.js — Préstamos vencidos
   ════════════════════════════════════════════ */

import DB from './db.js';

const Vencidos = {
  render() {
    const lista = DB.prestamos.filter(p => !p.devuelto && DB.diasAtraso(p.fechaDevolucion) > 0);

    document.getElementById('tabla-vencidos').innerHTML = lista.length === 0
      ? `<tr><td colspan="5" style="text-align:center;color:var(--verde);padding:2rem">✓ No hay préstamos vencidos</td></tr>`
      : lista.map(p => {
          const l    = DB.libroById(p.libroId);
          const u    = DB.usuarioById(p.usuarioId);
          const dias = DB.diasAtraso(p.fechaDevolucion);
          return `<tr>
            <td>${l ? l.titulo  : '—'}</td>
            <td>${u ? u.nombre  : '—'}</td>
            <td>${DB.formatFecha(p.fechaDevolucion)}</td>
            <td><span class="badge badge-rojo">${dias} día${dias !== 1 ? 's' : ''}</span></td>
            <td><button class="btn btn-sm" onclick="window.Prestamos.devolver('${p._id}')">Devolver</button></td>
          </tr>`;
        }).join('');
  }
};

export default Vencidos;
