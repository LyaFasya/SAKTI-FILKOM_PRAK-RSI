import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

import { GraduationCap, LayoutGrid, FileText, Bell, LogOut } from "lucide-react";

import { ASET } from "../../config/aset.js";
import { useAuth } from "../../context/AuthContext.jsx";
import useAmbilData from "../../hooks/useAmbilData.js";
import { ambilProfil } from "../../services/pengajuanMahasiswaService.js";
import "../../styles/mahasiswa-theme.css";

// Kerangka halaman Mahasiswa: bar atas dengan menu di tengah, isi halaman, footer.
// Dipakai lewat `layout` pada routeGroup (dkRoutes.jsx). Halaman milik AK (Layanan)
// bisa memakai layout yang sama dengan mengisi `layout: MahasiswaLayout` di akRoutes.jsx.
// Header dan footer disamakan dengan halaman Layanan milik AK (ikon lucide, ukuran, warna).
// Nama, inisial, dan prodi tetap diambil dari akun yang sedang login.
const MENU = [
  { label: "Layanan", to: "/layanan", Ikon: LayoutGrid },
  { label: "Pengajuan Saya", to: "/pengajuan-saya", Ikon: FileText },
  { label: "Notifikasi", to: "/notifikasi", Ikon: Bell }
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

  // Nama dan prodi dari GET /api/pengajuan/profil (khusus akun mahasiswa).
  const { data: profil } = useAmbilData(() => ambilProfil(), []);
  const kata = (profil?.namaMahasiswa ?? "").split(" ").filter(Boolean);
  const namaSingkat = kata.slice(0, 2).join(" ");
  const inisial = kata.slice(0, 2).map((k) => k[0]).join("").toUpperCase();

  return (
    <div className="mhs-app">
      <header className="mhs-topbar">
        <Link to="/layanan" className="mhs-merek">
          <span className="mhs-merek__logo"><GraduationCap size={19} strokeWidth={1.9} /></span>
          <span className="mhs-merek__judul">SAKTI FILKOM</span>
        </Link>

        <nav className="mhs-nav" aria-label="Menu mahasiswa">
          {MENU.map(({ label, to, Ikon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) => (isActive ? "mhs-nav__link mhs-nav__link--aktif" : "mhs-nav__link")}
            >
              <Ikon size={15} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mhs-profil">
          <span className="mhs-profil__avatar" aria-hidden="true">{inisial}</span>
          <div className="mhs-profil__teks">
            <strong className="mhs-profil__nama">{namaSingkat}</strong>
            <span className="mhs-profil__peran">Mahasiswa{profil ? ` · ${profil.programStudi}` : ""}</span>
          </div>
          <button type="button" className="mhs-keluar" onClick={logout} aria-label="Keluar" title="Keluar">
            <LogOut size={16} strokeWidth={1.8} />
          </button>
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
        <div className="mhs-footer__isi">
          <span className="mhs-footer__resmi">PORTAL RESMI</span>
          <img src={ASET.logoFilkomUb} alt="Logo FILKOM UB" className="mhs-footer__logo" />
          <span className="mhs-footer__garis" aria-hidden="true">|</span>
          <span>© 2026 SAKTI FILKOM · Universitas Brawijaya</span>
        </div>
      </footer>
    </div>
  );
}
