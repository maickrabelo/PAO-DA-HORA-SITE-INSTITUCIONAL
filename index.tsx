import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log("Iniciando Padaria Pão da Hora...");

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Renderização concluída com sucesso.");
  } catch (err: any) {
    console.error("Erro ao renderizar:", err);
    container.innerHTML = `
      <div style="padding: 40px; text-align: center; font-family: sans-serif; color: #6b3529;">
        <h2 style="font-family: serif; font-size: 2rem;">Ops! A fornada queimou.</h2>
        <p style="margin-top: 10px;">Ocorreu um erro ao carregar o site:</p>
        <code style="display: block; background: #eee; padding: 10px; margin-top: 10px; border-radius: 5px; color: red;">
          ${err.message || err}
        </code>
        <button onclick="window.location.reload()" style="margin-top: 20px; background: #c75d23; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
          Tentar novamente
        </button>
      </div>
    `;
  }
} else {
  console.error("Elemento #root não encontrado no HTML.");
}
