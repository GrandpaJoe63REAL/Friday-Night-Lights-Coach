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
  } catch (err) {
    console.error('React mounting error:', err);
    rootElement.innerHTML = `<div style="color: white; padding: 20px; font-family: sans-serif; background: #020617; height: 100vh;">
      <h1 style="color: #ef4444;">Application Error</h1>
      <p>The application failed to start. This is likely due to a module loading error.</p>
      <pre style="background: #1e293b; padding: 15px; border-radius: 8px; overflow: auto;">${err instanceof Error ? err.message : String(err)}</pre>
      <button onclick="window.location.reload()" style="background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-top: 20px;">Retry Load</button>
    </div>`;
  }
} else {
  console.error("Critical Error: Root element '#root' not found in DOM.");
}
