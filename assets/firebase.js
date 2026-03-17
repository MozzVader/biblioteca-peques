/* ════════════════════════════════════════════
   firebase.js — Configuración de Firebase
   
   INSTRUCCIONES PARA ACTIVAR FIREBASE:
   
   1. Creá un proyecto en https://console.firebase.google.com
   2. Habilitá Firestore Database (modo prueba para empezar)
   3. Copiá tu configuración en firebaseConfig abajo
   4. Descomentá todo el código de este archivo
   5. Reemplazá las funciones en db.js para que usen
      Firestore en vez del array local
   ════════════════════════════════════════════ */

/*
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc }
  from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "TU_API_KEY",
  authDomain:        "TU_PROYECTO.firebaseapp.com",
  projectId:         "TU_PROYECTO",
  storageBucket:     "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId:             "TU_APP_ID"
};

const firebaseApp = initializeApp(firebaseConfig);
const db          = getFirestore(firebaseApp);

// ── COLECCIONES ─────────────────────────────
const colLibros    = collection(db, 'libros');
const colUsuarios  = collection(db, 'usuarios');
const colPrestamos = collection(db, 'prestamos');

// ── LEER ────────────────────────────────────
async function cargarLibros() {
  const snap = await getDocs(colLibros);
  DB.libros = snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── CREAR ────────────────────────────────────
async function crearLibro(libro) {
  const ref = await addDoc(colLibros, libro);
  return ref.id;
}

// ── ELIMINAR ─────────────────────────────────
async function eliminarLibro(id) {
  await deleteDoc(doc(db, 'libros', id));
}

// Exportar para usar desde otros archivos
export { db, cargarLibros, crearLibro, eliminarLibro };
*/
