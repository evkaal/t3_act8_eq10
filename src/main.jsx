import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Paso 1: Obtenemos el elemento
const container = document.getElementById('root');

// Paso 2: Creamos el root solo si el contenedor existe
if (container) {
  createRoot(container).render(<App />);
}