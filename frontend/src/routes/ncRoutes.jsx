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
import PlaceholderPage from "../components/PlaceholderPage.jsx";
import StafLayout from "../components/staf/StafLayout.jsx";
import { ROLE } from "../config/constants.js";

// Halaman Edit Persyaratan (LYN-UC04) punya AK.
const EditPersyaratanLayananPage = Object.values(
  import.meta.glob("../pages/layanan/EditPersyaratanLayananPage.jsx", { eager: true })
)[0]?.default;

export const routeGroup = {
  roles: [ROLE.STAF],
  layout: StafLayout, // kerangka khusus staf (sidebar navy sesuai Figma)
  routes: [
    { path: "/staf/dashboard", element: <DashboardPage /> },
    { path: "/staf/pengajuan", element: <DaftarPengajuanPage /> },
    { path: "/staf/pengajuan/:idPengajuan", element: <DetailPengajuanPage /> },
    { path: "/staf/pengajuan/:idPengajuan/verifikasi", element: <VerifikasiPengajuanPage /> },
    { path: "/staf/pengajuan/:idPengajuan/persetujuan", element: <PersetujuanPengajuanPage /> },
    { path: "/staf/pengajuan/:idPengajuan/penolakan", element: <PenolakanPengajuanPage /> },
    // Placeholder aja, halaman Rekapitulasi asli punya DK (dkStafRoutes.jsx, didahulukan)
    { path: "/staf/rekapitulasi", element: <PlaceholderPage judul="Rekapitulasi" /> },
    { path: "/staf/layanan", element: <DaftarLayananStafPage /> },
    { path: "/staf/layanan/:idLayanan", element: <DetailLayananStafPage /> },
    { path: "/staf/layanan/:idLayanan/edit", element: <EditLayananStafPage /> },
    {
      path: "/staf/layanan/:idLayanan/persyaratan",
      element: EditPersyaratanLayananPage
        ? <EditPersyaratanLayananPage />
        : <PlaceholderPage judul="Edit persyaratan layanan" uiId="LYN-UI04" useCase="LYN-UC04 Memperbarui Persyaratan Layanan" />
    }
  ]
};

export const navItems = [];
