import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
export const storage = getStorage(app);

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

// ---------- chat interno en tiempo real ----------
const CHAT_DOC = doc(db, COLLECTION, "team-chat");

// Devuelve una función para cancelar la suscripción (llamarla al desmontar el componente)
export function subscribeChat(callback) {
  return onSnapshot(
    CHAT_DOC,
    (snap) => {
      callback(snap.exists() ? snap.data().messages || [] : []);
    },
    (err) => {
      console.error("Chat subscription error:", err);
    }
  );
}

export async function sendChatMessage(message) {
  try {
    await updateDoc(CHAT_DOC, { messages: arrayUnion(message) });
    return true;
  } catch (e) {
    // El documento probablemente no existe todavía — lo creamos.
    try {
      await setDoc(CHAT_DOC, { messages: [message] });
      return true;
    } catch (e2) {
      console.error("Chat send error:", e2);
      return false;
    }
  }
}

// ---------- documentos (guía comercial / catálogo) — Firebase Storage ----------
export async function uploadDocumentFile(key, file) {
  try {
    const fileRef = ref(storage, `documents/${key}.pdf`);
    await withTimeout(uploadBytes(fileRef, file), 60000);
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (e) {
    console.error("Upload error:", e);
    return null;
  }
}
