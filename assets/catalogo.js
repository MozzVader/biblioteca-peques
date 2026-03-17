/* ════════════════════════════════════════════
   catalogo.js — Gestión del catálogo de libros
   ════════════════════════════════════════════ */

const Catalogo = {

  render() {
    const q = (document.getElementById('buscar-libro').value || '').toLowerCase();

    const lista = DB.libros.filter(l =>
      l.titulo.toLowerCase().includes(q) ||
      l.autor.toLowerCase().includes(q)  ||
      l.isbn.includes(q)
    );

    const tbody = document.getElementById('tabla-catalogo');

    if (lista.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#888780;padding:2rem">No se encontraron libros</td></tr>`;
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
        <td>
          <button class="btn btn-sm btn-danger" onclick="Catalogo.eliminar(${l.id})">Eliminar</button>
        </td>
      </tr>`;
    }).join('');
  },

  agregar() {
    if (!Auth.puedeEditar()) return;

    const titulo     = document.getElementById('libro-titulo').value.trim();
    const autor      = document.getElementById('libro-autor').value.trim();
    const isbn       = document.getElementById('libro-isbn').value.trim();
    const genero     = document.getElementById('libro-genero').value;
    const ejemplares = parseInt(document.getElementById('libro-ejemplares').value) || 1;

    if (!titulo || !autor) {
      alert('Completá al menos el título y el autor.');
      return;
    }

    DB.libros.push({
      id: DB.nextId('libros'),
      titulo, autor, isbn, genero, ejemplares,
      prestados: 0
    });

    UI.cerrarModal('modal-libro');
    this.render();
    Inicio.render();
    UI.alerta('alert-libro', `✓ "${titulo}" agregado correctamente.`);

    // Limpiar campos del formulario
    ['libro-titulo', 'libro-autor', 'libro-isbn'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.getElementById('libro-ejemplares').value = '1';
  },

  eliminar(id) {
    if (!Auth.puedeEditar()) return;

    const libro = DB.libroById(id);
    if (!libro) return;

    if (DB.prestamos.some(p => p.libroId === id && !p.devuelto)) {
      alert('No se puede eliminar: el libro tiene préstamos activos.');
      return;
    }

    if (!confirm(`¿Eliminar "${libro.titulo}"?`)) return;

    DB.libros = DB.libros.filter(l => l.id !== id);
    this.render();
    Inicio.render();
    UI.alerta('alert-libro', '✓ Libro eliminado.');
  }
};
