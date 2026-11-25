
import { Outlet } from "react-router-dom";
import { ROLE } from "../config/constants.js";

import DashboardMahasiswa from "../pages/dashboard/DashboardMahasiswa.jsx";
import DetailLayanan from "../pages/dashboard/DetailLayanan.jsx";

// Halaman mahasiswa AK sudah mempunyai navbar sendiri.
// Outlet mencegah layout staf/default membungkus halaman tersebut.
function LayoutMahasiswaAK() {
  return <Outlet />;
}

export const routeGroup = {
  roles: [ROLE.MAHASISWA],
  layout: LayoutMahasiswaAK,

  routes: [
    {
      path: "/layanan",
      element: <DashboardMahasiswa />,
    },
    {
      path: "/layanan/:idLayanan",
      element: <DetailLayanan />,
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
