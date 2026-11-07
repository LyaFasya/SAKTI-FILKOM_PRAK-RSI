// RUTE MILIK AK: halaman Mahasiswa untuk Login dan Layanan
// (LYN-UC05 sampai LYN-UC09). Isi sesuai halaman AK.
//
// Contoh menambah halaman:
//   import DaftarLayananMahasiswaPage from "../pages/layanan/DaftarLayananMahasiswaPage.jsx";
//   routes: [{ path: "/layanan", element: <DaftarLayananMahasiswaPage /> }]
//   navItems: [{ label: "Layanan", to: "/layanan", roles: [ROLE.MAHASISWA] }]
import { ROLE } from "../config/constants.js";

export const routeGroup = {
  roles: [ROLE.MAHASISWA],
  routes: []
};

export const navItems = [];
