
// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';

// TODO: Sostituisci questo oggetto con la tua configurazione Firebase
// (Puoi trovarla nella console Firebase > Impostazioni progetto > Generali)
const firebaseConfig = {
 apiKey: "AIzaSyBgeYsbOSy0WU0DkVAm5WXpdpR3kGIv6pw",
  authDomain: "esimo-b3377.firebaseapp.com",
  projectId: "esimo-b3377",
  storageBucket: "esimo-b3377.firebasestorage.app",
  messagingSenderId: "1091271938947",
  appId: "1:1091271938947:web:5144c6c5b6c359ea5a9cb6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
