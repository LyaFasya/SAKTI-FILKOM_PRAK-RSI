
import { Outlet, useSearchParams } from "react-router-dom";
import { ROLE } from "../config/constants.js";

import DashboardMahasiswa from "../pages/dashboard/DashboardMahasiswa.jsx";
import DetailLayanan from "../pages/dashboard/DetailLayanan.jsx";
import LayananTidakTersedia from "../pages/dashboard/LayananTidakTersedia.jsx";

// Halaman mahasiswa AK sudah mempunyai navbar sendiri.
// Outlet mencegah layout staf/default membungkus halaman tersebut.
function LayoutMahasiswaAK() {
  return <Outlet />;
}

// Menampilkan halaman daftar atau halaman hasil pencarian tidak tersedia.
function HalamanLayananMahasiswa() {
  const [searchParams] = useSearchParams();
  const pencarian = searchParams.get("search");

  if (pencarian) {
    return <LayananTidakTersedia />;
  }

  return <DashboardMahasiswa />;
}

export const routeGroup = {
  roles: [ROLE.MAHASISWA],
  layout: LayoutMahasiswaAK,

  routes: [
    {
      path: "/layanan",
      element: <HalamanLayananMahasiswa />,
    },
    {
      path: "/layanan/dispensasi",
      element: <DetailLayanan />,
    },
  ],
};

export const navItems = [
  {
    label: "Layanan",
    to: "/layanan",
    roles: [ROLE.MAHASISWA],
  },
];