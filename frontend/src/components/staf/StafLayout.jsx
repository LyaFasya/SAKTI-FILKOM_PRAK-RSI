import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

import logoFilkom from "../../assets/logo-filkom.png";
import { useAuth } from "../../context/AuthContext.jsx";
import "../../styles/staf-theme.css";
import {
  IkonDokumen,
  IkonGrafik,
  IkonKeluar,
  IkonPengaturan,
  IkonRingkasan,
  IkonTopi
} from "./Icons.jsx";

// Kerangka halaman untuk Staf Kemahasiswaan (sidebar navy + bar atas + footer).
// Dipakai lewat ncRoutes.jsx. Tampilan mengikuti desain Figma "Dashboard Staf KMA".
const MENU = [
  { label: "Ringkasan Pengajuan", to: "/staf/dashboard", Ikon: IkonRingkasan },
  { label: "Daftar Pengajuan", to: "/staf/pengajuan", Ikon: IkonDokumen, tepat: true },
  { label: "Rekapitulasi", to: "/staf/rekapitulasi", Ikon: IkonGrafik },
  { label: "Kelola Layanan", to: "/staf/layanan", Ikon: IkonPengaturan }
];

// Teks terakhir pada breadcrumb, sesuai halaman yang sedang dibuka.
const POLA_HALAMAN = [
  [/^\/staf\/dashboard/, "Ringkasan Pengajuan"],
  [/^\/staf\/pengajuan\/[^/]+\/verifikasi/, "Verifikasi Dokumen"],
  [/^\/staf\/pengajuan\/[^/]+\/persetujuan/, "Persetujuan Pengajuan"],
  [/^\/staf\/pengajuan\/[^/]+\/penolakan/, "Penolakan Pengajuan"],
  [/^\/staf\/pengajuan\/[^/]+/, "Detail Pengajuan"],
  [/^\/staf\/pengajuan/, "Daftar Pengajuan"],
  [/^\/staf\/rekapitulasi/, "Rekapitulasi"],
  [/^\/staf\/layanan/, "Kelola Layanan"]
];

export default function StafLayout() {
  const { logout } = useAuth();
  const { pathname } = useLocation();

  const labelHalaman = POLA_HALAMAN.find(([pola]) => pola.test(pathname))?.[1];

  return (
    <div className="staf-app">
      <aside className="staf-sidebar">
        <div className="staf-sidebar__atas">
          <div className="staf-merek">
            <span className="staf-merek__logo"><IkonTopi ukuran={22} /></span>
            <span className="staf-merek__nama">SAKTI FILKOM</span>
          </div>
          <p className="staf-sidebar__label">Ruang kerja staf</p>

          <nav className="staf-nav" aria-label="Menu staf">
            {MENU.map(({ label, to, Ikon, tepat }) => (
              <NavLink
                key={to}
                to={to}
                end={tepat}
                className={({ isActive }) =>
                  isActive ? "staf-nav__link staf-nav__link--aktif" : "staf-nav__link"
                }
              >
                <Ikon ukuran={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="staf-sidebar__bawah">
          <div className="staf-sidebar__instansi">
            <div>FILKOM</div>
            <div>Universitas Brawijaya</div>
          </div>
          <button type="button" className="staf-keluar" onClick={logout}>
            <IkonKeluar ukuran={18} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      <div className="staf-utama">
        <header className="staf-topbar">
          <div>
            <div className="staf-topbar__judul">SAKTI FILKOM</div>
            <div className="staf-topbar__sub">
              Sistem Akses Kemahasiswaan Terintegrasi FILKOM
            </div>
          </div>

          {/* Backend belum mengirim nama staf saat login, jadi teks ini tetap. */}
          <div className="staf-profil">
            <span className="staf-profil__avatar" aria-hidden="true">SK</span>
            <div>
              <div className="staf-profil__nama">Staf Kemahasiswaan</div>
              <div className="staf-profil__peran">Pengelola layanan</div>
            </div>
          </div>
        </header>

        <main className="staf-konten">
          <nav className="staf-breadcrumb" aria-label="Posisi halaman">
            <Link to="/staf/dashboard">Ruang Kerja Staf</Link>
            {labelHalaman && <span> / {labelHalaman}</span>}
          </nav>

          <Outlet />
        </main>

        <footer className="staf-footer">
          <span className="staf-footer__resmi">Portal resmi</span>
          <img src={logoFilkom} alt="Logo FILKOM" className="staf-footer__logo" />
          <span className="staf-footer__garis" aria-hidden="true" />
          <span>© 2026 SAKTI FILKOM · Universitas Brawijaya</span>
        </footer>
      </div>
    </div>
  );
}
