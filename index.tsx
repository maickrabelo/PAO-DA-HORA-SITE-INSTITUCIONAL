import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Log para confirmar que o arquivo foi carregado pelo navegador
console.log("🍞 Padaria Pão da Hora: Iniciando...");

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("✅ Site carregado com sucesso.");
  } catch (err: any) {
    console.error("❌ Erro ao montar o React:", err);
    container.innerHTML = `
      <div style="padding: 40px; text-align: center; font-family: sans-serif; color: #6b3529; background: #fbe9db; min-height: 100vh; display: flex; flex-direction: column; justify-content: center;">
        <h2 style="font-family: serif; font-size: 2rem;">A fornada queimou!</h2>
        <p>Ocorreu um erro ao carregar o site.</p>
        <pre style="background: #fff; padding: 10px; margin-top: 20px; border-radius: 4px; border: 1px solid #c75d23; font-size: 12px; color: red;">${err.message || err}</pre>
        <button onclick="window.location.reload()" style="margin-top: 20px; background: #c75d23; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Tentar novamente</button>
      </div>
    `;
  }
} else {
  console.error("❌ Elemento 'root' não encontrado no HTML.");
}