import { ASET } from "../../config/aset.js";
import "../../pages/dashboard/DashboardMahasiswa.css";

// Footer Portal Mahasiswa (markup dan kelas CSS sama dengan halaman Layanan AK).
export default function FooterMahasiswa() {
  return (
    <footer className="dash-footer">
      <div className="footer-inner">
        <span className="footer-label">PORTAL RESMI</span>
        <img src={ASET.logoFilkomUb} alt="Logo FILKOM UB" className="footer-logo" />
        <span className="footer-divider">|</span>
        <span className="footer-copy">© 2026 SAKTI FILKOM · Universitas Brawijaya</span>
      </div>
    </footer>
  );
}
