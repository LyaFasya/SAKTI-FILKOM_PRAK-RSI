import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";
import { navItems } from "../../routes/index.jsx";

// Kerangka halaman setelah login: sidebar di kiri, isi halaman di kanan.
// Menu sidebar diambil dari navItems tiap routes file, disaring sesuai role.
export default function AppLayout() {
  const { user, logout } = useAuth();
  const menu = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar__brand">SAKTI FILKOM</div>

        <nav className="sidebar__nav" aria-label="Menu utama">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "sidebar__link sidebar__link--aktif" : "sidebar__link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__user">
          <div className="sidebar__email">{user.email}</div>
          <button type="button" className="tombol tombol--garis" onClick={logout}>
            Keluar
          </button>
        </div>
      </aside>

      <main className="konten">
        <Outlet />
      </main>
    </div>
  );
}
