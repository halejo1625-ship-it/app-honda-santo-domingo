# Honda Santo Domingo · Gestión Integral de Procesos

App de registro de ventas, caja y presupuestos, ahora independiente de Claude — corre con
tu propio hosting y una base de datos Firebase (Firestore) propia.

## 1. Firebase ya está configurado ✓

Tu proyecto `honda-santo-domingo` ya está conectado en `src/firebase.js`. No necesitas
tocar ese archivo.

## 2. Reglas de Firestore

En la consola de Firebase → Firestore Database → pestaña **Reglas**, pega esto y publica:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /app_data/{docId} {
      allow read, write: if true;
    }
  }
}
```

⚠️ Esto deja la base de datos abierta a cualquiera que conozca la URL del proyecto
(igual de "seguro" que el link de Claude que usabas antes — la protección real la
siguen dando los usuarios/contraseñas dentro de la app, no Firestore). Si más adelante
quieres cerrarlo más, se puede agregar Firebase Authentication; avísame y lo hacemos.

## 3. Instala dependencias y prueba localmente (opcional)

Necesitas [Node.js](https://nodejs.org) instalado. Luego, en esta carpeta:

```
npm install
npm run dev
```

Abre la URL que te muestre (normalmente `http://localhost:5173`).

## 4. Sube el código a GitHub

Crea un repositorio nuevo en [github.com](https://github.com) y sube esta carpeta
(puedes arrastrar los archivos directamente en la web de GitHub si no usas Git).

## 5. Despliega en Vercel (gratis)

1. Entra a [vercel.com](https://vercel.com) y crea una cuenta (puedes usar tu GitHub).
2. "Add New" → "Project" → elige el repositorio que subiste.
3. Vercel detecta automáticamente que es un proyecto Vite. Deja todo por defecto y
   dale "Deploy".
4. En un par de minutos te da un link como `honda-app.vercel.app` — ese es tu link
   final, 100% independiente de Claude.
5. (Opcional) En Vercel → Settings → Domains, puedes conectar tu propio dominio si
   tienes uno (ej. `caja.hondasantodomingo.com`).

## Usuarios y contraseñas

Los mismos de siempre — Adrian, Fernanda, Steven (asesores), Valeria y Fernanda
(caja), y el PIN del administrador. Todo eso sigue igual dentro del código
(`src/App.jsx`), no cambió con esta migración.
