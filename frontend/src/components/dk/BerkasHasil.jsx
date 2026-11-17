import { useState } from "react";

import { IkonSurat } from "../mahasiswa/Icons.jsx";
import { ambilUrlDokumenHasil } from "../../services/pengajuanMahasiswaService.js";

// Kartu "Dokumen hasil tersedia" (PJN-UI04 dan PJN-UI07).
// Dokumen hasil juga dikirim ke email; tombol Unduh memakai tautan sementara dari backend.
export default function BerkasHasil({ idPengajuan, dokumenHasil, email }) {
  const [mengunduh, setMengunduh] = useState(false);
  const [galat, setGalat] = useState("");

  if (!dokumenHasil) return null;

  async function unduh() {
    setGalat("");
    setMengunduh(true);
    try {
      // window.open setelah await sering diblokir browser. Tautan dari backend sudah
      // berisi Content-Disposition: attachment, jadi cukup diarahkan lewat <a download>.
      const url = await ambilUrlDokumenHasil(idPengajuan);
      const tautan = document.createElement("a");
      tautan.href = url;
      tautan.rel = "noopener";
      tautan.download = dokumenHasil.namaDokumen ?? "";
      document.body.appendChild(tautan);
      tautan.click();
      tautan.remove();
    } catch (e) {
      setGalat(e.message || "Dokumen hasil belum bisa diunduh. Coba lagi.");
    } finally {
      setMengunduh(false);
    }
  }

  return (
    <section className="kartu kartu--info" aria-labelledby="judul-dokumen-hasil">
      <span className="kotak-ikon"><IkonSurat ukuran={20} /></span>
      <h2 id="judul-dokumen-hasil">Dokumen hasil tersedia</h2>
      <p className="teks-redup">{dokumenHasil.namaDokumen}</p>
      <p className="teks-redup">Dokumen hasil dikirim sebagai lampiran email ke akun mahasiswa. Silahkan cek inbox atau folder spam.</p>
      <p className="teks-redup" style={{ marginTop: 12 }}>Dikirim ke {email ?? "email mahasiswa"}</p>
      <button type="button" className="tautan-teks" onClick={unduh} disabled={mengunduh} style={{ marginTop: 12 }}>
        {mengunduh ? "Menyiapkan..." : "Unduh dokumen"}
      </button>
      {galat && <p className="field__galat" role="alert" style={{ marginTop: 8 }}>{galat}</p>}
    </section>
  );
}
