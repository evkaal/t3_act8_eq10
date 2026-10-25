import { useLocation } from "react-router-dom";
import { Bell, LogOut } from "lucide-react";
import Avatar from "./Avatar";

const titles = {
  "/": "Inicio",
  "/catalogo": "Catálogo",
  "/prestamos": "Mis préstamos",
};

export default function Navbar({ user, onLogout }) {
  const { pathname } = useLocation();
  const current = titles[pathname] ?? "Inicio";

  return (
    <header className="navbar">
      <nav className="navbar__breadcrumb" aria-label="Ruta">
        <span>Biblioteca</span>
        <span className="navbar__sep">/</span>
        <strong>{current}</strong>
      </nav>

      <div className="navbar__right">
        <button type="button" className="navbar__bell" aria-label="Notificaciones">
          <Bell size={18} />
          <span className="navbar__bell-dot" />
        </button>

        <div className="navbar__user">
          <Avatar user={user} />
          <div className="navbar__user-info">
            <strong>{user.firstName} {user.lastName}</strong>
            <span>Lector</span>
          </div>
        </div>

        <button type="button" className="navbar__logout" onClick={onLogout}>
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
