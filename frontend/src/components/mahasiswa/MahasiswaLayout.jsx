import { Link, Outlet, useLocation } from "react-router-dom";

import "../../styles/mahasiswa-theme.css";
import FooterMahasiswa from "./FooterMahasiswa.jsx";
import HeaderMahasiswa from "./HeaderMahasiswa.jsx";

// Kerangka halaman Mahasiswa milik DK: bar atas, isi halaman, footer.
// Bar atas dan footer sama dengan halaman Layanan milik AK (lihat HeaderMahasiswa dan FooterMahasiswa).
// Dipakai lewat `layout` pada routeGroup (dkRoutes.jsx).

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
  const { pathname } = useLocation();
  const labelHalaman = POLA_HALAMAN.find(([pola]) => pola.test(pathname))?.[1];

  return (
    <div className="mhs-app">
      <HeaderMahasiswa />

      <main className="mhs-konten">
        <nav className="mhs-breadcrumb" aria-label="Posisi halaman">
          <Link to="/layanan">Portal Mahasiswa</Link>
          {labelHalaman && <span> / {labelHalaman}</span>}
        </nav>
        <Outlet />
      </main>

      <FooterMahasiswa />
    </div>
  );
}
