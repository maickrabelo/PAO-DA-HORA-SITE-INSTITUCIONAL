import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const renderApp = () => {
  const container = document.getElementById('root');
  if (!container) return;

  try {
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Aplicação iniciada.");
  } catch (error: any) {
    console.error("Erro fatal ao iniciar:", error);
    container.innerHTML = `
      <div style="padding: 40px; text-align: center; font-family: sans-serif; background: #fbe9db; min-height: 100vh; display: flex; flex-direction: column; justify-content: center;">
        <h1 style="color: #6b3529;">Erro de Inicialização</h1>
        <p style="color: #c75d23; font-weight: bold;">${error?.message || 'Erro desconhecido'}</p>
        <p style="color: #6b3529; max-width: 400px; margin: 20px auto;">
          Isso geralmente ocorre quando os arquivos não foram compilados corretamente. 
          Certifique-se de que subiu o conteúdo da pasta <strong>dist</strong> para o seu servidor Hostinger.
        </p>
        <button onclick="window.location.reload()" style="background: #6b3529; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Tentar Novamente</button>
      </div>
    `;
  }
};

// Executa assim que possível
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  renderApp();
} else {
  window.addEventListener('DOMContentLoaded', renderApp);
}
