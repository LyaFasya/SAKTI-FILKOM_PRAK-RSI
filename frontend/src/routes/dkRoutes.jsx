// RUTE MILIK DK: halaman Mahasiswa untuk Pengajuan, Riwayat, dan Notifikasi
// (PGJ-UC01 dan PJN-UC01 sampai PJN-UC07). Hanya DK yang mengubah file ini.
import MahasiswaLayout from "../components/mahasiswa/MahasiswaLayout.jsx";
import "../styles/dk.css";

import FormPengajuanPage from "../pages/ajukan/FormPengajuanPage.jsx";
import PengajuanTerkirimPage from "../pages/ajukan/PengajuanTerkirimPage.jsx";
import PengajuanSayaPage from "../pages/pengajuan-saya/PengajuanSayaPage.jsx";
import DetailPengajuanSayaPage from "../pages/pengajuan-saya/DetailPengajuanSayaPage.jsx";
import LacakStatusPage from "../pages/pengajuan-saya/LacakStatusPage.jsx";
import NotifikasiPage from "../pages/notifikasi/NotifikasiPage.jsx";
import { ROLE } from "../config/constants.js";

export const routeGroup = {
  roles: [ROLE.MAHASISWA],
  // Bar atas Portal Mahasiswa sesuai Figma. Kosongkan baris ini untuk kembali ke sidebar bawaan.
  layout: MahasiswaLayout,
  routes: [
    // Tombol "Ajukan" di halaman layanan (milik AK) harus menuju path ini.
    { path: "/layanan/:idLayanan/ajukan", element: <FormPengajuanPage /> },
    { path: "/pengajuan-saya", element: <PengajuanSayaPage /> },
    { path: "/pengajuan-saya/terkirim/:idPengajuan", element: <PengajuanTerkirimPage /> },
    { path: "/pengajuan-saya/:idPengajuan", element: <DetailPengajuanSayaPage /> },
    { path: "/pengajuan-saya/:idPengajuan/status", element: <LacakStatusPage /> },
    { path: "/notifikasi", element: <NotifikasiPage /> }
  ]
};

export const navItems = [
  { label: "Pengajuan Saya", to: "/pengajuan-saya", roles: [ROLE.MAHASISWA] },
  { label: "Notifikasi", to: "/notifikasi", roles: [ROLE.MAHASISWA] }
];
