import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./Layout.css";

export default function Layout({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/"); // al volver a entrar, empieza en Inicio
    onLogout();
  };

  return (
    <div className="shell">
      <Sidebar user={user} onLogout={handleLogout} />
      <div className="shell__main">
        <Navbar user={user} onLogout={handleLogout} />
        {/* Outlet = aqui se dibuja la pagina activa (Inicio, Catalogo...) */}
        <main className="shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
