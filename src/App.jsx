// src/App.jsx
import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [user, setUser] = useState(null);

  // Protección de ruta: Si no hay usuario, muestra el Login; si hay, muestra el Dashboard
  if (!user) {
    return <Login onLoginSuccess={(userData) => setUser(userData)} />;
  }

  return <Dashboard user={user} onLogout={() => setUser(null)} />;
}