import { useState } from "react";
import Login from "./pages/Login";

function App() {
  // Si el usuario marco "Mantener sesion activa", lo recuperamos al recargar
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

  // Ruta protegida: sin usuario, solo se ve el Login
  if (!user) return <Login onLogin={handleLogin} />;

  // TEMPORAL: en el paso 2 aqui va Sidebar + Navbar + paginas
  return (
    <div style={{ padding: 32 }}>
      <img src={user.image} alt={user.firstName} width={64} />
      <h1>Bienvenido, {user.firstName} {user.lastName}</h1>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}

export default App;
