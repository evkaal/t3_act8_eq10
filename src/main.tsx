import React from 'react';
import ReactDOM from 'react-dom/client';
// Esta es la línea clave: debe apuntar a tu App unificado
import App from './app/App'; 
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);