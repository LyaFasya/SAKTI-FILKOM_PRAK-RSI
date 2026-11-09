import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

import logoFilkom from "../../assets/logo-filkom.png";
import { useAuth } from "../../context/AuthContext.jsx";
import { profilDummy } from "../../mocks/pengajuanMahasiswa.js";
import "../../styles/mahasiswa-theme.css";
import { IkonDokumen, IkonKeluar, IkonLayanan, IkonLonceng, IkonTopi } from "./Icons.jsx";

// Kerangka halaman Mahasiswa: bar atas dengan menu di tengah, isi halaman, footer.
// Dipakai lewat `layout` pada routeGroup (dkRoutes.jsx). Halaman milik AK (Layanan)
// bisa memakai layout yang sama dengan mengisi `layout: MahasiswaLayout` di akRoutes.jsx.
// Tampilan mengikuti desain Figma "Portal Mahasiswa".
const MENU = [
  { label: "Layanan", to: "/layanan", Ikon: IkonLayanan },
  { label: "Pengajuan Saya", to: "/pengajuan-saya", Ikon: IkonDokumen },
  { label: "Notifikasi", to: "/notifikasi", Ikon: IkonLonceng }
];

// Teks terakhir pada breadcrumb. Urutan penting: pola yang lebih spesifik dulu.
const POLA_HALAMAN = [
  [/^\/layanan\/[^/]+\/ajukan/, "Formulir Pengajuan"],
  [/^\/layanan/, "Layanan"],
  [/^\/pengajuan-saya\/terkirim/, "Pengajuan Terkirim"],
  [/^\/pengajuan-saya\/[^/]+\/status/, "Lacak Status"],
  [/^\/pengajuan-saya\/[^/]+/, "Detail Pengajuan"],
  [/^\/pengajuan-saya/, "Pengajuan Saya"],
  [/^\/notifikasi/, "Notifikasi"]
];

export default function MahasiswaLayout() {
  const { logout } = useAuth();
  const { pathname } = useLocation();
  const labelHalaman = POLA_HALAMAN.find(([pola]) => pola.test(pathname))?.[1];

  // Backend belum mengirim nama dan prodi saat login, jadi diambil dari profil dummy.
  const kata = profilDummy.namaMahasiswa.split(" ");
  const namaSingkat = kata.slice(0, 2).join(" ");
  const inisial = kata.slice(0, 2).map((k) => k[0]).join("").toUpperCase();

  return (
    <div className="mhs-app">
      <header className="mhs-topbar">
        <div className="mhs-topbar__isi">
          <Link to="/layanan" className="mhs-merek">
            <span className="mhs-merek__logo"><IkonTopi ukuran={20} /></span>
            <span>SAKTI FILKOM</span>
          </Link>

          <nav className="mhs-nav" aria-label="Menu mahasiswa">
            {MENU.map(({ label, to, Ikon }) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) => (isActive ? "mhs-nav__link mhs-nav__link--aktif" : "mhs-nav__link")}
              >
                <Ikon ukuran={16} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mhs-profil">
            <span className="mhs-profil__avatar" aria-hidden="true">{inisial}</span>
            <div className="mhs-profil__teks">
              <div className="mhs-profil__nama">{namaSingkat}</div>
              <div className="mhs-profil__peran">Mahasiswa · {profilDummy.programStudi}</div>
            </div>
            <button type="button" className="mhs-keluar" onClick={logout} aria-label="Keluar">
              <IkonKeluar ukuran={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="mhs-konten">
        <nav className="mhs-breadcrumb" aria-label="Posisi halaman">
          <Link to="/layanan">Portal Mahasiswa</Link>
          {labelHalaman && <span> / {labelHalaman}</span>}
        </nav>
        <Outlet />
      </main>

      <footer className="mhs-footer">
        <span className="mhs-footer__resmi">Portal resmi</span>
        <img src={logoFilkom} alt="Logo FILKOM" className="mhs-footer__logo" />
        <span className="mhs-footer__garis" aria-hidden="true" />
        <span>© 2026 SAKTI FILKOM · Universitas Brawijaya</span>
      </footer>
    </div>
  );
}
