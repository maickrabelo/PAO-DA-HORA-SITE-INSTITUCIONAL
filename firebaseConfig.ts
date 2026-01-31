
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Helper para acessar variáveis de ambiente de forma segura no Vite
const getEnv = (key: string) => {
  return (import.meta as any).env?.[key] || (process as any).env?.[key] || "";
};

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY') || "SUA_API_KEY_AQUI",
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN') || "seu-projeto.firebaseapp.com",
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID') || "seu-projeto",
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET') || "seu-projeto.appspot.com",
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID') || "123456789",
  appId: getEnv('VITE_FIREBASE_APP_ID') || "1:123456789:web:abcdef"
};

// Verifica se a configuração é válida
export const isConfigured = 
  firebaseConfig.apiKey !== "SUA_API_KEY_AQUI" && 
  firebaseConfig.projectId !== "seu-projeto" &&
  !!firebaseConfig.apiKey;

let app;
let db: any = null;

try {
  if (isConfigured) {
    // Padrão de singleton para evitar inicializações múltiplas
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
  } else {
    console.warn("Firebase não configurado ou chaves ausentes. Algumas funcionalidades podem não funcionar.");
  }
} catch (error) {
  console.error("Falha ao inicializar Firebase:", error);
}

export { db };
