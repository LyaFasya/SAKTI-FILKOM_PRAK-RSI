// RUTE MILIK DK, sisi STAF: Rekapitulasi Pengajuan dan Unduh Rekapitulasi (PJN-UC14, PJN-UC15).
// Mengikuti pola dkRoutes.jsx. Hanya DK yang mengubah file ini.
import RekapitulasiPage from "../pages/rekapitulasi/RekapitulasiPage.jsx";
import { ROLE } from "../config/constants.js";

// Kerangka halaman staf (sidebar navy sesuai Figma) dibuat NC di components/staf/StafLayout.jsx.
// Dimuat hanya jika file itu ada, supaya branch ini tetap bisa dibangun sebelum branch NC
// masuk ke main. Tanpa file itu, halaman memakai AppLayout bawaan.
const kerangkaStaf = Object.values(
  import.meta.glob("../components/staf/StafLayout.jsx", { eager: true })
)[0]?.default;

// Path sama dengan menu "Rekapitulasi" di StafLayout dan placeholder di ncRoutes.jsx.
// Di routes/index.jsx kelompok ini diletakkan PALING DEPAN, jadi halaman ini yang dipakai
// walaupun placeholder NC masih ada.
export const routeGroup = {
  roles: [ROLE.STAF],
  layout: kerangkaStaf,
  routes: [
    { path: "/staf/rekapitulasi", element: <RekapitulasiPage /> }
  ]
};

// Dipakai sidebar bawaan (AppLayout). StafLayout punya menunya sendiri.
export const navItems = [
  { label: "Rekapitulasi", to: "/staf/rekapitulasi", roles: [ROLE.STAF] }
];
