import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// ⚠️ Configuración de tu proyecto Firebase (honda-santo-domingo)
// (Configuración del proyecto → tu app web → SDK setup and configuration)
const firebaseConfig = {
  apiKey: "AIzaSyBViOtXcB5b5A0EHouVlWG2nG3FF55Q088",
  authDomain: "honda-santo-domingo.firebaseapp.com",
  databaseURL: "https://honda-santo-domingo-default-rtdb.firebaseio.com",
  projectId: "honda-santo-domingo",
  storageBucket: "honda-santo-domingo.firebasestorage.app",
  messagingSenderId: "180250217326",
  appId: "1:180250217326:web:70d9c2bb46e5f60b614f7f",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const COLLECTION = "app_data";

function withTimeout(promise, ms = 10000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

// Documento compartido: todos los usuarios de la app ven y escriben el mismo dato.
// key debe ser un string válido como ID de documento de Firestore (sin "/").
export async function loadDoc(key, fallback) {
  try {
    const snap = await withTimeout(getDoc(doc(db, COLLECTION, key)));
    return snap.exists() ? snap.data().value : fallback;
  } catch (e) {
    console.error("Firestore load error:", key, e);
    return fallback;
  }
}

export async function saveDoc(key, value) {
  try {
    await withTimeout(setDoc(doc(db, COLLECTION, key), { value, updatedAt: Date.now() }));
    return true;
  } catch (e) {
    console.error("Firestore save error:", key, e);
    return false;
  }
}
