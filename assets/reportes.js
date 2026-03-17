/* ════════════════════════════════════════════
   reportes.js — Estadísticas y reportes
   ════════════════════════════════════════════ */

const Reportes = {

  render() {
    const total     = DB.prestamos.length;
    const devueltos = DB.prestamos.filter(p => p.devuelto).length;
    const activos   = DB.prestamos.filter(p => !p.devuelto).length;
    const vencidos  = DB.prestamos.filter(p => !p.devuelto && DB.diasAtraso(p.fechaDevolucion) > 0).length;
    const tasa      = total > 0 ? Math.round((devueltos / total) * 100) : 0;

    document.getElementById('stats-reportes').innerHTML = `
      <div class="stat-card">
        <div class="label">Total préstamos</div>
        <div class="value">${total}</div>
      </div>
      <div class="stat-card">
        <div class="label">Devueltos</div>
        <div class="value" style="color:var(--verde)">${devueltos}</div>
      </div>
      <div class="stat-card">
        <div class="label">Activos</div>
        <div class="value">${activos}</div>
      </div>
      <div class="stat-card">
        <div class="label">Tasa devolución</div>
        <div class="value">${tasa}%</div>
        <div class="trend">a tiempo</div>
      </div>
    `;

    // Top 5 libros más prestados
    const conteo = {};
    DB.prestamos.forEach(p => {
      conteo[p.libroId] = (conteo[p.libroId] || 0) + 1;
    });

    const top = Object.entries(conteo)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    document.getElementById('tabla-mas-prestados').innerHTML = top.length === 0
      ? '<tr><td colspan="3" style="text-align:center;color:#888780;padding:1rem">Sin datos</td></tr>'
      : top.map(([id, n]) => {
          const l = DB.libroById(parseInt(id));
          return `<tr>
            <td>${l ? l.titulo : '—'}</td>
            <td>${l ? l.autor  : '—'}</td>
            <td>${n}</td>
          </tr>`;
        }).join('');
  }
};
