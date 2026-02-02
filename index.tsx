import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Log para depuração no console do navegador (F12)
console.log("Padaria Pão da Hora: Iniciando aplicação...");

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Padaria Pão da Hora: Renderização concluída.");
  } catch (error) {
    console.error("Erro fatal na renderização:", error);
    container.innerHTML = `<div style="padding: 20px; text-align: center; color: #6b3529;"><h1>Erro ao carregar o site</h1><p>Verifique o console do navegador para mais detalhes.</p></div>`;
  }
} else {
  console.error("Erro: Elemento #root não encontrado.");
}