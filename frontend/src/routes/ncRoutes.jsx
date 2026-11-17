
// Rute milik NC (staf)
import DashboardPage from "../pages/dashboard/DashboardPage.jsx";
import DaftarPengajuanPage from "../pages/pengajuan/DaftarPengajuanPage.jsx";
import DetailPengajuanPage from "../pages/pengajuan/DetailPengajuanPage.jsx";
import VerifikasiPengajuanPage from "../pages/pengajuan/VerifikasiPengajuanPage.jsx";
import PersetujuanPengajuanPage from "../pages/pengajuan/PersetujuanPengajuanPage.jsx";
import PenolakanPengajuanPage from "../pages/pengajuan/PenolakanPengajuanPage.jsx";

import DaftarLayananStafPage from "../pages/layanan/DaftarLayananStafPage.jsx";
import DetailLayananStafPage from "../pages/layanan/DetailLayananStafPage.jsx";
import EditLayananStafPage from "../pages/layanan/EditLayananStafPage.jsx";
import EditPersyaratanLayananPage from "../pages/layanan/EditPersyaratanLayananPage.jsx";

import PlaceholderPage from "../components/PlaceholderPage.jsx";
import StafLayout from "../components/staf/StafLayout.jsx";
import { ROLE } from "../config/constants.js";

export const routeGroup = {
  roles: [ROLE.STAF],
  layout: StafLayout,

  routes: [
    { path: "/staf/dashboard", element: <DashboardPage /> },

    { path: "/staf/pengajuan", element: <DaftarPengajuanPage /> },
    {
      path: "/staf/pengajuan/:idPengajuan",
      element: <DetailPengajuanPage />,
    },
    {
      path: "/staf/pengajuan/:idPengajuan/verifikasi",
      element: <VerifikasiPengajuanPage />,
    },
    {
      path: "/staf/pengajuan/:idPengajuan/persetujuan",
      element: <PersetujuanPengajuanPage />,
    },
    {
      path: "/staf/pengajuan/:idPengajuan/penolakan",
      element: <PenolakanPengajuanPage />,
    },

    {
      path: "/staf/rekapitulasi",
      element: <PlaceholderPage judul="Rekapitulasi" />,
    },

    { path: "/staf/layanan", element: <DaftarLayananStafPage /> },
    {
      path: "/staf/layanan/:idLayanan",
      element: <DetailLayananStafPage />,
    },
    {
      path: "/staf/layanan/:idLayanan/edit",
      element: <EditLayananStafPage />,
    },

    // LYN-UC04: Memperbarui persyaratan layanan
    {
      path: "/staf/layanan/:idLayanan/persyaratan",
      element: <EditPersyaratanLayananPage />,
    },
  ],
};

export const navItems = [];