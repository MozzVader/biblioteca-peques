/* ════════════════════════════════════════════
   catalogo.js — Gestión del catálogo de libros
   ════════════════════════════════════════════ */

import DB   from './db.js';
import Auth from './auth.js';
import UI   from './ui.js';

const Catalogo = {

  render() {
    const q = (document.getElementById('buscar-libro').value || '').toLowerCase();
    const lista = DB.libros.filter(l =>
      l.titulo.toLowerCase().includes(q) ||
      l.autor.toLowerCase().includes(q)  ||
      (l.isbn || '').includes(q)
    );

    const tbody = document.getElementById('tabla-catalogo');
    if (lista.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#98A2B3;padding:2rem">No se encontraron libros</td></tr>`;
      return;
    }

    tbody.innerHTML = lista.map(l => {
      const disp = DB.disponibles(l);
      const dispBadge = disp === 0
        ? `<span class="badge badge-rojo">0</span>`
        : disp <= 1
        ? `<span class="badge badge-amarillo">${disp}</span>`
        : `<span class="badge badge-verde">${disp}</span>`;

      return `<tr>
        <td>${l.titulo}</td>
        <td>${l.autor}</td>
        <td>${l.genero}</td>
        <td>${l.ejemplares}</td>
        <td>${dispBadge}</td>
        <td><button class="btn btn-sm btn-danger" onclick="window.Catalogo.eliminar('${l._id}')">Eliminar</button></td>
      </tr>`;
    }).join('');
  },

  async agregar() {
    if (!Auth.puedeEditar()) return;

    const titulo     = document.getElementById('libro-titulo').value.trim();
    const autor      = document.getElementById('libro-autor').value.trim();
    const isbn       = document.getElementById('libro-isbn').value.trim();
    const genero     = document.getElementById('libro-genero').value;
    const ejemplares = parseInt(document.getElementById('libro-ejemplares').value) || 1;

    if (!titulo || !autor) { alert('Completá al menos el título y el autor.'); return; }

    UI.cerrarModal('modal-libro');
    UI.mostrarCargando(true);

    try {
      await DB.agregarLibro({ titulo, autor, isbn, genero, ejemplares });
      this.render();
      UI.alerta('alert-libro', `✓ "${titulo}" agregado correctamente.`);
      ['libro-titulo','libro-autor','libro-isbn'].forEach(id => document.getElementById(id).value = '');
      document.getElementById('libro-ejemplares').value = '1';
    } catch(e) {
      alert('Error al guardar el libro. Intentá de nuevo.');
    } finally {
      UI.mostrarCargando(false);
    }
  },

  async eliminar(id) {
    if (!Auth.puedeEditar()) return;
    const libro = DB.libroById(id);
    if (!libro) return;

    if (DB.prestamos.some(p => p.libroId === id && !p.devuelto)) {
      alert('No se puede eliminar: el libro tiene préstamos activos.'); return;
    }
    if (!confirm(`¿Eliminar "${libro.titulo}"?`)) return;

    UI.mostrarCargando(true);
    try {
      await DB.eliminarLibro(id);
      this.render();
      UI.alerta('alert-libro', '✓ Libro eliminado.');
    } catch(e) {
      alert('Error al eliminar. Intentá de nuevo.');
    } finally {
      UI.mostrarCargando(false);
    }
  }
};

export default Catalogo;
