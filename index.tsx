import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log("Sistema Pão da Hora: Iniciando...");

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Sistema Pão da Hora: Renderizado com sucesso.");
  } catch (error) {
    console.error("Erro ao renderizar App:", error);
    container.innerHTML = `
      <div style="padding: 20px; text-align: center; color: #6b3529; font-family: sans-serif;">
        <h1>Erro ao carregar o site</h1>
        <p>Por favor, tente atualizar a página.</p>
      </div>
    `;
  }
} else {
  console.error("Elemento #root não encontrado no DOM.");
}
