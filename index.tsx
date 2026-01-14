import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Friday Night Lights Coach initialized successfully.");
  } catch (err) {
    console.error('React mounting error:', err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    rootElement.innerHTML = `
      <div style="color: white; padding: 40px; font-family: sans-serif; background: #020617; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <h1 style="color: #ef4444; margin-bottom: 10px;">Application Runtime Error</h1>
        <p style="color: #94a3b8; margin-bottom: 20px;">The React engine failed to start properly.</p>
        <pre style="background: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155; overflow: auto; max-width: 80vw; font-size: 13px;">${errorMessage}</pre>
        <button onclick="window.location.reload()" style="background: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: bold; margin-top: 24px;">Restart Engine</button>
      </div>`;
  }
} else {
  console.error("Critical Error: Root element '#root' not found in DOM. Ensure index.html contains a <div id='root'>.");
}
