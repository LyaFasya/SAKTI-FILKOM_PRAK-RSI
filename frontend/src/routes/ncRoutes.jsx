// RUTE MILIK NC: halaman Staf Kemahasiswaan.
// Hanya NC yang mengubah file ini, sehingga tidak bentrok dengan AK dan DK.
import DashboardPage from "../pages/dashboard/DashboardPage.jsx";
import DaftarPengajuanPage from "../pages/pengajuan/DaftarPengajuanPage.jsx";
import DetailPengajuanPage from "../pages/pengajuan/DetailPengajuanPage.jsx";
import VerifikasiPengajuanPage from "../pages/pengajuan/VerifikasiPengajuanPage.jsx";
import PersetujuanPengajuanPage from "../pages/pengajuan/PersetujuanPengajuanPage.jsx";
import PenolakanPengajuanPage from "../pages/pengajuan/PenolakanPengajuanPage.jsx";
import DaftarLayananStafPage from "../pages/layanan/DaftarLayananStafPage.jsx";
import DetailLayananStafPage from "../pages/layanan/DetailLayananStafPage.jsx";
import EditLayananStafPage from "../pages/layanan/EditLayananStafPage.jsx";
import { ROLE } from "../config/constants.js";

export const routeGroup = {
  roles: [ROLE.STAF],
  routes: [
    { path: "/staf/dashboard", element: <DashboardPage /> },
    { path: "/staf/pengajuan", element: <DaftarPengajuanPage /> },
    { path: "/staf/pengajuan/:idPengajuan", element: <DetailPengajuanPage /> },
    { path: "/staf/pengajuan/:idPengajuan/verifikasi", element: <VerifikasiPengajuanPage /> },
    { path: "/staf/pengajuan/:idPengajuan/persetujuan", element: <PersetujuanPengajuanPage /> },
    { path: "/staf/pengajuan/:idPengajuan/penolakan", element: <PenolakanPengajuanPage /> },
    { path: "/staf/layanan", element: <DaftarLayananStafPage /> },
    { path: "/staf/layanan/:idLayanan", element: <DetailLayananStafPage /> },
    { path: "/staf/layanan/:idLayanan/edit", element: <EditLayananStafPage /> }
  ]
};

// Menu sidebar untuk role staf.
export const navItems = [
  { label: "Dashboard", to: "/staf/dashboard", roles: [ROLE.STAF] },
  { label: "Pengajuan", to: "/staf/pengajuan", roles: [ROLE.STAF] },
  { label: "Layanan", to: "/staf/layanan", roles: [ROLE.STAF] }
];
