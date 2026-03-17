/* ════════════════════════════════════════════
   app.js — UI helpers, Inicio, Vencidos,
            Config e inicialización general
   ════════════════════════════════════════════ */

// ── UI ────────────────────────────────────────
const UI = {

  navigate(el, sec) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('sec-' + sec).classList.add('active');
    el.classList.add('active');

    // Renderizar la sección correspondiente
    const mapa = {
      inicio:    () => Inicio.render(),
      catalogo:  () => Catalogo.render(),
      prestamos: () => Prestamos.render(),
      usuarios:  () => Usuarios.render(),
      vencidos:  () => Vencidos.render(),
      reportes:  () => Reportes.render(),
    };
    if (mapa[sec]) mapa[sec]();
  },

  abrirModal(id) {
    if (id === 'modal-prestamo') Prestamos.prepararModal();
    document.getElementById(id).classList.add('open');
  },

  cerrarModal(id) {
    document.getElementById(id).classList.remove('open');
  },

  alerta(id, msg, tipo = 'success') {
    const el = document.getElementById(id);
    el.className = `alert alert-${tipo} show`;
    el.textContent = msg;
    setTimeout(() => el.classList.remove('show'), 3000);
  }
};

// Cerrar modales al hacer clic fuera
window.addEventListener('click', e => {
  document.querySelectorAll('.overlay.open').forEach(o => {
    if (e.target === o) UI.cerrarModal(o.id);
  });
});

// ── INICIO ────────────────────────────────────
const Inicio = {

  render() {
    const activos  = DB.prestamos.filter(p => !p.devuelto);
    const vencidos = activos.filter(p => DB.diasAtraso(p.fechaDevolucion) > 0);

    document.getElementById('stat-libros').textContent   = DB.libros.length;
    document.getElementById('stat-activos').textContent  = activos.length;
    document.getElementById('stat-vencidos').textContent = vencidos.length;
    document.getElementById('stat-usuarios').textContent = DB.usuarios.length;

    // Badge en sidebar
    const badge = document.getElementById('badge-vencidos');
    badge.textContent = vencidos.length > 0 ? vencidos.length : '';

    // Últimos préstamos
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

    // Fecha en el header
    const dias   = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
    const meses  = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    const ahora  = new Date();
    document.getElementById('fecha-hoy').textContent =
      `${dias[ahora.getDay()]} ${ahora.getDate()} de ${meses[ahora.getMonth()]} de ${ahora.getFullYear()}`;
  }
};

// ── VENCIDOS ──────────────────────────────────
const Vencidos = {

  render() {
    const lista = DB.prestamos.filter(p => !p.devuelto && DB.diasAtraso(p.fechaDevolucion) > 0);

    document.getElementById('tabla-vencidos').innerHTML = lista.length === 0
      ? `<tr><td colspan="5" style="text-align:center;color:#1D9E75;padding:2rem">✓ No hay préstamos vencidos</td></tr>`
      : lista.map(p => {
          const l    = DB.libroById(p.libroId);
          const u    = DB.usuarioById(p.usuarioId);
          const dias = DB.diasAtraso(p.fechaDevolucion);
          return `<tr>
            <td>${l ? l.titulo  : '—'}</td>
            <td>${u ? u.nombre  : '—'}</td>
            <td>${DB.formatFecha(p.fechaDevolucion)}</td>
            <td><span class="badge badge-rojo">${dias} día${dias !== 1 ? 's' : ''}</span></td>
            <td>
              <button class="btn btn-sm" onclick="Prestamos.devolver(${p.id})">Devolver</button>
            </td>
          </tr>`;
        }).join('');
  }
};

// ── CONFIG ────────────────────────────────────
const Config = {

  guardar() {
    DB.config.nombre = document.getElementById('cfg-nombre').value.trim() || DB.config.nombre;
    DB.config.dias   = parseInt(document.getElementById('cfg-dias').value) || 7;
    DB.config.biblio = document.getElementById('cfg-biblio').value.trim() || DB.config.biblio;

    // Actualizar header con nuevo nombre
    document.getElementById('header-username').textContent = DB.config.biblio;
    document.getElementById('avatar-initials').textContent =
      DB.config.biblio.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    UI.alerta('alert-config', '✓ Configuración guardada.');
  }
};

// ── FIREBASE (stub) ───────────────────────────
// Cuando conectes Firebase, reemplazá estas
// funciones vacías con las llamadas reales.
const Firebase = {
  init()              { /* firebase.initializeApp(firebaseConfig) */ },
  async getLibros()   { /* return await getDocs(collection(db,'libros')) */ },
  async saveLibro(l)  { /* await addDoc(collection(db,'libros'), l) */ },
  async deletLibro(id){ /* await deleteDoc(doc(db,'libros',id)) */ },
};
