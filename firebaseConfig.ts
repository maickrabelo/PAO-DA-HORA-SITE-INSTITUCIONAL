import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Busca variáveis do Vite (import.meta.env) ou do processo global (process.env)
const getEnv = (key: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    // @ts-ignore
    return import.meta.env[key];
  }
  try {
    return (process as any).env?.[key] || "";
  } catch {
    return "";
  }
};

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID')
};

// Verifica se a configuração básica existe
export const isConfigured = !!firebaseConfig.apiKey && firebaseConfig.apiKey.length > 20;

let db: any = null;

if (isConfigured) {
  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("🔥 Banco de dados conectado.");
  } catch (error) {
    console.error("Erro ao conectar ao Firebase:", error);
  }
} else {
  console.log("ℹ️ Site rodando em modo demonstração (Firebase não configurado).");
}

export { db };