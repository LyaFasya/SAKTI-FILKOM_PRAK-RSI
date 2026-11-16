
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./LoginPage.css";

import bannerImg from "../../assets/Section kiri login.png";
import logoFilkom from "../../assets/Image (FILKOM Universitas Brawijaya).png";

export default function LoginPage() {
  const [nimEmail, setNimEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [sedangMasuk, setSedangMasuk] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!nimEmail.trim() || !password.trim()) {
      setErrorMsg("Lengkapi NIM/Email dan kata sandi terlebih dahulu.");
      return;
    }

    try {
      setSedangMasuk(true);

      const akun = await login(nimEmail, password);

      if (!akun || !akun.role) {
        throw new Error("Data akun tidak valid dari server.");
      }

      const role = String(akun.role).trim().toUpperCase();

      if (role === "MAHASISWA") {
        navigate("/dashboard", { replace: true });
      } else if (role === "STAF") {
        navigate("/staf/dashboard", { replace: true });
      } else {
        throw new Error("Role akun tidak dikenali.");
      }
    } catch (error) {
      console.error("Login gagal:", error);
      setErrorMsg(error.message || "Email atau kata sandi salah.");
    } finally {
      setSedangMasuk(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-left">
          <img
            src={bannerImg}
            alt="SAKTI FILKOM Banner"
            className="banner-image"
          />
        </div>

        <div className="login-right">
          <p className="welcome-text">Selamat datang kembali</p>
          <span className="access-badge">AKSES MAHASISWA &amp; STAF</span>
          <h1 className="login-title">Masuk ke SAKTI FILKOM</h1>

          <form className="login-form" onSubmit={handleLogin} noValidate>
            {errorMsg && (
              <p className="login-error">
                {errorMsg}
              </p>
            )}

            <div className="form-group">
              <label htmlFor="nimEmail">NIM atau email</label>
              <input
                type="text"
                id="nimEmail"
                value={nimEmail}
                onChange={(e) => {
                  setNimEmail(e.target.value);
                  setErrorMsg("");
                }}
                placeholder="Masukkan NIM atau email kampus"
                className="form-input"
                autoComplete="username"
                disabled={sedangMasuk}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Kata sandi</label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg("");
                  }}
                  placeholder="Masukkan kata sandi"
                  className="form-input password-input"
                  autoComplete="current-password"
                  disabled={sedangMasuk}
                />

                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Sembunyikan" : "Lihat"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={sedangMasuk}
            >
              <span>{sedangMasuk ? "Memproses..." : "Masuk ke portal"}</span>
              <span>→</span>
            </button>
          </form>

          <div className="security-notice">
            <div className="check-icon">✓</div>
            <div className="security-text">
              <strong>Akses aman dan terpusat</strong>
              <p>Gunakan akun kampus yang sesuai untuk melanjutkan.</p>
            </div>
          </div>

          <div className="login-footer">
            <div className="official-portal">
              <span>PORTAL RESMI</span>
              <img
                src={logoFilkom}
                alt="Logo FILKOM UB"
                className="footer-logo"
              />
            </div>

            <p className="copyright">
              © 2026 SAKTI FILKOM · Universitas Brawijaya
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}