import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// --- IMPORTANTE: SUBSTITUA COM SUAS CONFIGURAÇÕES DO FIREBASE ---
// 1. Vá em console.firebase.google.com
// 2. Crie um projeto "Pao da Hora"
// 3. Adicione um App Web
// 4. Copie as configurações e cole abaixo
const firebaseConfig = {
  apiKey: "AIzaSyD2Xw6GihcAk4KL26AIOGgXXQQWgsDmODU",
  authDomain: "paodahora-bf494.firebaseapp.com",
  projectId: "paodahora-bf494",
  storageBucket: "paodahora-bf494.firebasestorage.app",
  messagingSenderId: "133547494332",
  appId: "1:133547494332:web:e82ca84df33890723b39b9"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
