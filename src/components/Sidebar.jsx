import { NavLink } from "react-router-dom";
import { LayoutGrid, Users, LogIn, LogOut } from "lucide-react";
import Avatar from "./Avatar";

// Los contadores son fijos por ahora; despues vendran del estado/API
const links = [
  { to: "/", label: "Inicio", icon: LayoutGrid, end: true },
  { to: "/catalogo", label: "Catálogo", icon: Users, badge: "1.284" },
  { to: "/prestamos", label: "Mis préstamos", icon: LogIn, badge: "42" },
];

export default function Sidebar({ user, onLogout }) {
  return (
    <aside className="sidebar">
      <p className="sidebar__title">MENÚ PRINCIPAL</p>

      <nav className="sidebar__nav">
        {links.map(({ to, label, icon: Icon, end, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
            }
          >
            <Icon size={20} />
            <span className="sidebar__label">{label}</span>
            {badge && <span className="sidebar__badge">{badge}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__user">
        <Avatar user={user} />
        <div className="sidebar__user-info">
          <strong>{user.firstName} {user.lastName}</strong>
          <span>Lector</span>
        </div>
        <button
          type="button"
          className="sidebar__logout"
          onClick={onLogout}
          aria-label="Cerrar sesión"
        >
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
}
