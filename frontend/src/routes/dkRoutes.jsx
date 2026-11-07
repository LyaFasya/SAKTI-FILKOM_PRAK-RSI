// RUTE MILIK DK: halaman Mahasiswa untuk Pengajuan, Riwayat, dan Notifikasi
// (PGJ-UC01 dan PJN-UC01 sampai PJN-UC07). Isi sesuai halaman DK.
//
// Contoh:
//   routes: [{ path: "/pengajuan-saya", element: <RiwayatPengajuanPage /> }]
//   navItems: [{ label: "Pengajuan Saya", to: "/pengajuan-saya", roles: [ROLE.MAHASISWA] }]
import { ROLE } from "../config/constants.js";

export const routeGroup = {
  roles: [ROLE.MAHASISWA],
  routes: []
};

export const navItems = [];
