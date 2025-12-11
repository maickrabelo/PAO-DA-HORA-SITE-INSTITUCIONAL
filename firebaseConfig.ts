import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// --- IMPORTANTE: SUBSTITUA COM SUAS CONFIGURAÇÕES DO FIREBASE ---
// 1. Vá em console.firebase.google.com
// 2. Crie um projeto "Pao da Hora"
// 3. Adicione um App Web
// 4. Copie as configurações e cole abaixo
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);