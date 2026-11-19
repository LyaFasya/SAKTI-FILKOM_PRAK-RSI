import { Bell, FileText, GraduationCap, LayoutGrid, LogOut } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";
import { useEffect, useState } from "react";
import { ambilProfil } from "../../services/pengajuanMahasiswaService.js";
// Gaya bar atas diambil dari halaman Layanan milik AK supaya tampilannya sama persis.
import "../../pages/dashboard/DashboardMahasiswa.css";

// Bar atas Portal Mahasiswa (markup dan kelas CSS sama dengan halaman Layanan AK).
// Yang berbeda: nama, inisial, dan prodi diambil dari akun yang sedang login.
const MENU = [
  { label: "Layanan", to: "/layanan", Ikon: LayoutGrid },
  { label: "Pengajuan Saya", to: "/pengajuan-saya", Ikon: FileText },
  { label: "Notifikasi", to: "/notifikasi", Ikon: Bell }
];

// Profil disimpan per akun, jadi waktu pindah halaman header nggak kedip (nggak ambil ulang)
let profilTersimpan = { idAkun: null, data: null };

export default function HeaderMahasiswa() {
  const { user, logout } = useAuth();

  // Nama dan prodi dari GET /api/pengajuan/profil. Selama belum tiba (atau gagal),
  // dipakai email akun yang login supaya tidak pernah menampilkan orang lain.
  const cocok = profilTersimpan.idAkun === user?.idAkun;
  const [profil, setProfil] = useState(cocok ? profilTersimpan.data : null);

  useEffect(() => {
    if (cocok) return;
    ambilProfil()
      .then((data) => {
        profilTersimpan = { idAkun: user?.idAkun, data };
        setProfil(data);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.idAkun]);
  const kata = (profil?.namaMahasiswa ?? "").split(" ").filter(Boolean);
  const nama = kata.length ? kata.slice(0, 2).join(" ") : (user?.email ?? "");
  const inisial = (kata.length ? kata.slice(0, 2).map((k) => k[0]).join("") : (user?.email ?? "")[0] ?? "").toUpperCase();
  const prodi = profil?.programStudi ? ` · ${profil.programStudi}` : "";

  return (
    <header className="dash-navbar">
      <Link to="/layanan" className="nav-brand">
        <div className="brand-logo-box">
          <GraduationCap size={19} strokeWidth={1.9} />
        </div>
        <span className="brand-title">SAKTI FILKOM</span>
      </Link>

      <nav className="nav-links" aria-label="Menu mahasiswa">
        {MENU.map(({ label, to, Ikon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            <span className="nav-icon"><Ikon size={15} strokeWidth={1.8} /></span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="nav-profile">
        <div className="avatar-circle" aria-hidden="true">{inisial}</div>
        <div className="profile-info">
          <strong>{nama}</strong>
          <span>Mahasiswa{prodi}</span>
        </div>
        <button type="button" className="logout-icon-btn" title="Keluar" aria-label="Keluar" onClick={logout}>
          <LogOut size={16} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
}
