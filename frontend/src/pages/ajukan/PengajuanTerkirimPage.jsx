import { Link, useParams } from "react-router-dom";

import PengajuanTidakDitemukan from "../../components/dk/PengajuanTidakDitemukan.jsx";
import { IkonCentang } from "../../components/mahasiswa/Icons.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import useAmbilData from "../../hooks/useAmbilData.js";
import { ambilDetailPengajuanSaya } from "../../services/pengajuanMahasiswaService.js";
import { formatIdPengajuan } from "../../utils/formatPengajuan.js";

// PGJ-UI04 Pengajuan Terkirim | konfirmasi setelah PGJ-UC01
export default function PengajuanTerkirimPage() {
  const { idPengajuan } = useParams();
  const { data: p, memuat, error } = useAmbilData(() => ambilDetailPengajuanSaya(idPengajuan), [idPengajuan]);

  if (memuat) return <p className="teks-redup">Memuat...</p>;
  if (error) return <p className="pesan pesan--error" role="alert">{error}</p>;
  if (!p) return <PengajuanTidakDitemukan />;

  return (
    <section className="kartu kartu-terkirim" aria-labelledby="judul-konfirmasi">
      <div className="ikon-berhasil"><IkonCentang ukuran={22} /></div>
      <span className="eyebrow" role="status">Berhasil terkirim</span>
      <h1 id="judul-konfirmasi">Pengajuanmu sudah masuk!</h1>
      <p>Isian dan lampiran tersimpan dalam sesi prototipe ini. Pengiriman ke layanan FILKOM disimulasikan.</p>

      <div className="kotak-id">
        <strong>{formatIdPengajuan(p.idPengajuan, p.tanggalPengajuan)}</strong>
        <span>{p.namaLayanan}</span>
      </div>

      <StatusBadge status={p.statusPengajuan} />

      <div className="aksi-form">
        <Link to={`/pengajuan-saya/${p.idPengajuan}`} className="tombol">Lihat Detail Pengajuan</Link>
        <Link to="/pengajuan-saya" className="tombol tombol--garis">Pengajuan Saya</Link>
      </div>
    </section>
  );
}
