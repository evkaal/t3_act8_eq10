import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Catalog from "./pages/Catalog";
import Loans from "./pages/Loans";

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (data, remember) => {
    setUser(data);
    if (remember) localStorage.setItem("user", JSON.stringify(data));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // RUTA PROTEGIDA: sin usuario, nunca se renderiza el sistema
  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <Routes>
      <Route element={<Layout user={user} onLogout={handleLogout} />}>
        <Route index element={<Dashboard user={user} />} />
        <Route path="catalogo" element={<Catalog />} />
        <Route path="prestamos" element={<Loans />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
