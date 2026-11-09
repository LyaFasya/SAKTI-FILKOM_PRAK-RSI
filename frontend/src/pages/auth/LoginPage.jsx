import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight, GraduationCap, Building2 } from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";
import { halamanAwal } from "../../routes/index.jsx";
import "./LoginPage.css";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const lokasi = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pesanError, setPesanError] = useState("");
  const [sedangMasuk, setSedangMasuk] = useState(false);

  if (user) {
    return <Navigate to={halamanAwal[user.role] ?? "/"} replace />;
  }

  async function kirim(event) {
    event.preventDefault();
    setPesanError("");
    setSedangMasuk(true);

    try {
      const akun = await login(email, password);
      const tujuan = lokasi.state?.dari?.pathname ?? halamanAwal[akun.role] ?? "/";
      navigate(tujuan, { replace: true });
    } catch (error) {
      setPesanError(error.message);
    } finally {
      setSedangMasuk(false);
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        {/* ================= PANEL KIRI (BIRU GRADIENT) ================= */}
        <div className="login-left">
          {/* Logo Brand */}
          <div className="login-brand">
            <div className="login-brand-icon">
              <GraduationCap size={16} />
            </div>
            <span className="login-brand-text">SAKTI FILKOM</span>
          </div>

          {/* Hero Content */}
          <div className="login-hero">
            <p className="login-eyebrow">
              SISTEM AKSES KEMAHASISWAAN TERINTEGRASI FILKOM
            </p>
            <h1 className="login-title">
              Satu pintu untuk <br />layanan kampus.
            </h1>
            <p className="login-desc">
              Ajukan kebutuhan kemahasiswaan, pantau proses, dan kelola layanan dalam satu ruang yang rapi.
            </p>

            {/* Pill Badges */}
            <div className="login-badges">
              <span className="login-badge">21 layanan kampus</span>
              <span className="login-badge">Pelacakan terpusat</span>
              <span className="login-badge">Dokumen lebih tertata</span>
            </div>
          </div>

          {/* Footer Ilustrasi / Info Kiri */}
          <div className="login-left-footer">
            <div className="status-indicator">
              <span className="status-dot"></span>
              <Building2 size={14} />
            </div>
            <span>Portal Resmi Fakultas Ilmu Komputer Universitas Brawijaya</span>
          </div>
        </div>

        {/* ================= PANEL KANAN (FORM LOGIN) ================= */}
        <div className="login-right">
          <div>
            <div className="login-header-group">
              <p className="login-welcome">Selamat datang kembali</p>
              <span className="login-role-tag">AKSES MAHASISWA & STAF</span>
              <h2 className="login-form-title">Masuk ke SAKTI FILKOM</h2>
            </div>

            <form onSubmit={kirim} className="login-form">
              {/* Field NIM / Email */}
              <div className="form-group">
                <label className="form-label">NIM atau email</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan NIM atau email kampus"
                  autoComplete="username"
                  className="form-input"
                  required
                />
              </div>

              {/* Field Password */}
              <div className="form-group">
                <label className="form-label">Kata sandi</label>
                <div className="form-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    autoComplete="current-password"
                    className="form-input form-input-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="toggle-password-btn"
                  >
                    {showPassword ? "Sembunyi" : "Lihat"}
                  </button>
                </div>
              </div>

              {pesanError && (
                <div className="login-error-box">
                  <p role="alert">{pesanError}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={sedangMasuk}
                className="login-submit-btn"
              >
                <span>{sedangMasuk ? "Memproses..." : "Masuk ke portal"}</span>
                {!sedangMasuk && <ArrowRight size={16} />}
              </button>
            </form>
          </div>

          {/* Footer Kanan (Security & Official Brand) */}
          <div className="login-right-footer">
            <div className="security-box">
              <div className="security-icon">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="security-title">Akses aman dan terpusat</p>
                <p className="security-desc">
                  Gunakan akun kampus yang sesuai untuk melanjutkan.
                </p>
              </div>
            </div>

            <div className="official-footer">
              <div className="official-brand-label">PORTAL RESMI</div>
              <div className="official-brand-name">FILKOM UB</div>
              <div className="official-copyright">
                © 2026 SAKTI FILKOM · Universitas Brawijaya
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}