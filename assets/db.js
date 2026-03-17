/* ════════════════════════════════════════════
   db.js — Estado central y datos de la app
   Reemplazá este archivo con llamadas a
   Firebase Firestore cuando estés listo.
   ════════════════════════════════════════════ */

const DB = {
  libros: [
    { id: 1, titulo: 'El Principito',         autor: 'Antoine de Saint-Exupéry', isbn: '978-0156012195', genero: 'Literatura',    ejemplares: 3,  prestados: 1 },
    { id: 2, titulo: 'Cien años de soledad',  autor: 'Gabriel García Márquez',   isbn: '978-0060883287', genero: 'Novela',        ejemplares: 2,  prestados: 1 },
    { id: 3, titulo: 'Matemática 3° año',     autor: 'Editorial Santillana',     isbn: '',               genero: 'Texto escolar', ejemplares: 10, prestados: 3 },
    { id: 4, titulo: 'Historia Argentina',    autor: 'Luis A. Romero',           isbn: '',               genero: 'Historia',      ejemplares: 4,  prestados: 4 },
    { id: 5, titulo: 'Física y Química',      autor: 'Editorial Kapelusz',       isbn: '',               genero: 'Ciencias',      ejemplares: 8,  prestados: 2 },
  ],

  usuarios: [
    { id: 1, nombre: 'Lucía Gómez',        tipo: 'Alumno',       curso: '3° B'   },
    { id: 2, nombre: 'Martín Ruiz',        tipo: 'Alumno',       curso: '4° A'   },
    { id: 3, nombre: 'Prof. Carmen López', tipo: 'Docente',      curso: 'Lengua' },
    { id: 4, nombre: 'Ana Pérez',          tipo: 'Alumno',       curso: '2° C'   },
    { id: 5, nombre: 'Carlos Díaz',        tipo: 'Alumno',       curso: '5° A'   },
  ],

  prestamos: [
    { id: 1, libroId: 1, usuarioId: 1, fechaPrestamo: '2026-03-13', fechaDevolucion: '2026-03-20', devuelto: false },
    { id: 2, libroId: 2, usuarioId: 2, fechaPrestamo: '2026-03-11', fechaDevolucion: '2026-03-18', devuelto: false },
    { id: 3, libroId: 3, usuarioId: 4, fechaPrestamo: '2026-03-01', fechaDevolucion: '2026-03-10', devuelto: false },
    { id: 4, libroId: 4, usuarioId: 5, fechaPrestamo: '2026-03-08', fechaDevolucion: '2026-03-17', devuelto: false },
  ],

  config: {
    nombre: 'Escuela N° 1',
    dias: 7,
    biblio: 'Bibliotecario'
  },

  _nextId: { libros: 6, usuarios: 6, prestamos: 5 },

  // ── HELPERS ──────────────────────────────
  nextId(coleccion) { return this._nextId[coleccion]++; },

  libroById(id)    { return this.libros.find(l => l.id === id); },
  usuarioById(id)  { return this.usuarios.find(u => u.id === id); },
  prestamoById(id) { return this.prestamos.find(p => p.id === id); },

  disponibles(libro) { return libro.ejemplares - libro.prestados; },

  hoy() { return new Date().toISOString().split('T')[0]; },

  formatFecha(fecha) {
    if (!fecha) return '—';
    const [y, m, d] = fecha.split('-');
    return `${d}/${m}/${y}`;
  },

  diasAtraso(fechaDevolucion) {
    const diff = Math.floor((new Date(this.hoy()) - new Date(fechaDevolucion)) / 86400000);
    return diff > 0 ? diff : 0;
  },

  estadoPrestamo(prestamo) {
    if (prestamo.devuelto) return '<span class="badge badge-azul">Devuelto</span>';
    const atraso = this.diasAtraso(prestamo.fechaDevolucion);
    if (atraso > 0) return '<span class="badge badge-rojo">Vencido</span>';
    const faltan = Math.ceil((new Date(prestamo.fechaDevolucion) - new Date(this.hoy())) / 86400000);
    if (faltan <= 2) return '<span class="badge badge-amarillo">Por vencer</span>';
    return '<span class="badge badge-verde">Activo</span>';
  }
};
