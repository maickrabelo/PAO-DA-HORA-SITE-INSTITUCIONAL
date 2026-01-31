
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Não foi possível encontrar o elemento 'root'. Verifique seu index.html.");
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Erro crítico na renderização do React:", error);
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif; text-align: center;">
        <h1 style="color: #6b3529;">Ops! Algo deu errado.</h1>
        <p>A aplicação não pôde ser iniciada corretamente. Verifique o console do desenvolvedor (F12).</p>
      </div>
    `;
  }
};

mountApp();
