import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="halaman-tengah">
      <div className="kartu kartu--sempit">
        <h1>Halaman tidak ditemukan</h1>
        <p className="teks-redup">Alamat yang kamu buka tidak tersedia.</p>
        <Link to="/" className="tombol">Kembali ke beranda</Link>
      </div>
    </div>
  );
}
