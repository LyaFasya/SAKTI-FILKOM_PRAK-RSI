import { Link } from "react-router-dom";

import PageHeader from "../PageHeader.jsx";

// Ditampilkan jika pengajuan tidak ada atau bukan milik mahasiswa yang login.
export default function PengajuanTidakDitemukan() {
  return (
    <>
      <PageHeader judul="Pengajuan tidak ditemukan" />
      <div className="kartu">
        <p>Pengajuan ini tidak ada atau bukan milik akunmu.</p>
        <Link to="/pengajuan-saya" className="tombol">Kembali ke Pengajuan Saya</Link>
      </div>
    </>
  );
}
