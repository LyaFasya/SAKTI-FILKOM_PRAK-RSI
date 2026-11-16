import { Link } from "react-router-dom";

import PageHeader from "../PageHeader.jsx";

export default function DetailTidakDitemukan() {
  return (
    <>
      <PageHeader judul="Pengajuan tidak ditemukan" deskripsi="Pengajuan yang kamu buka tidak tersedia." />
      <Link to="/staf/pengajuan" className="tombol">Kembali ke daftar pengajuan</Link>
    </>
  );
}
