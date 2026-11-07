import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";
import { halamanAwal } from "../../routes/index.jsx";

// Halaman login (LGN-UI01). Tampilan masih netral, sesuaikan dengan Figma.
export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const lokasi = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="halaman-tengah">
      <form className="kartu kartu--sempit" onSubmit={kirim}>
        <h1>Masuk ke SAKTI FILKOM</h1>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {pesanError && <p className="pesan pesan--error" role="alert">{pesanError}</p>}

        <button type="submit" className="tombol" disabled={sedangMasuk}>
          {sedangMasuk ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}
