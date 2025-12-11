import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Fix TS error: Property 'env' does not exist on type 'ImportMeta'
const env = (import.meta as any).env || {};

// Configuração que suporta variáveis de ambiente (Vercel) OU edição manual
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "SUA_API_KEY_AQUI",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "seu-projeto.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "seu-projeto",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "seu-projeto.appspot.com",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

// Verifica se a configuração ainda é a padrão (placeholder)
// Se qualquer uma das chaves contiver "SUA_API_KEY" ou o ID do projeto for o placeholder, considera não configurado.
export const isConfigured = 
  firebaseConfig.apiKey !== "SUA_API_KEY_AQUI" && 
  firebaseConfig.projectId !== "seu-projeto" &&
  firebaseConfig.projectId !== undefined &&
  firebaseConfig.apiKey !== undefined;

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);