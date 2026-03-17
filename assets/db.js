/* ════════════════════════════════════════════
   db.js — Estado central. Todos los datos
   vienen de Firebase Firestore.
   ════════════════════════════════════════════ */

import {
  fbGetLibros,    fbAddLibro,    fbDeleteLibro,  fbUpdateLibro,
  fbGetUsuarios,  fbAddUsuario,  fbDeleteUsuario,
  fbGetPrestamos, fbAddPrestamo, fbUpdatePrestamo
} from './firebase.js';

const DB = {
  // Caché local (se llena al cargar)
  libros:    [],
  usuarios:  [],
  prestamos: [],

  config: {
    nombre: 'Escuela N° 1',
    dias:   7,
    biblio: 'Bibliotecario'
  },

  // ── HELPERS ────────────────────────────────
  libroById(id)    { return this.libros.find(l => l._id === id); },
  usuarioById(id)  { return this.usuarios.find(u => u._id === id); },
  prestamoById(id) { return this.prestamos.find(p => p._id === id); },

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
  },

  // ── CARGA INICIAL ───────────────────────────
  async cargar() {
    const [libros, usuarios, prestamos] = await Promise.all([
      fbGetLibros(),
      fbGetUsuarios(),
      fbGetPrestamos()
    ]);
    this.libros    = libros;
    this.usuarios  = usuarios;
    this.prestamos = prestamos;
  },

  // ── LIBROS ──────────────────────────────────
  async agregarLibro(datos) {
    const id = await fbAddLibro({ ...datos, prestados: 0 });
    this.libros.push({ _id: id, ...datos, prestados: 0 });
    this.libros.sort((a, b) => a.titulo.localeCompare(b.titulo));
  },

  async eliminarLibro(id) {
    await fbDeleteLibro(id);
    this.libros = this.libros.filter(l => l._id !== id);
  },

  async actualizarPrestadosLibro(id, valor) {
    await fbUpdateLibro(id, { prestados: valor });
    const libro = this.libroById(id);
    if (libro) libro.prestados = valor;
  },

  // ── USUARIOS ────────────────────────────────
  async agregarUsuario(datos) {
    const id = await fbAddUsuario(datos);
    this.usuarios.push({ _id: id, ...datos });
    this.usuarios.sort((a, b) => a.nombre.localeCompare(b.nombre));
  },

  async eliminarUsuario(id) {
    await fbDeleteUsuario(id);
    this.usuarios = this.usuarios.filter(u => u._id !== id);
  },

  // ── PRÉSTAMOS ────────────────────────────────
  async agregarPrestamo(datos) {
    const id = await fbAddPrestamo({ ...datos, devuelto: false });
    this.prestamos.push({ _id: id, ...datos, devuelto: false });
  },

  async devolverPrestamo(id) {
    await fbUpdatePrestamo(id, { devuelto: true });
    const p = this.prestamoById(id);
    if (p) p.devuelto = true;
  }
};

export default DB;
