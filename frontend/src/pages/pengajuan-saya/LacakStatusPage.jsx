import { useParams } from "react-router-dom";

import BerkasHasil from "../../components/dk/BerkasHasil.jsx";
import PengajuanTidakDitemukan from "../../components/dk/PengajuanTidakDitemukan.jsx";
import { IkonCentang, IkonHati } from "../../components/mahasiswa/Icons.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { STATUS_PENGAJUAN } from "../../config/constants.js";
import useAmbilData from "../../hooks/useAmbilData.js";
import { ambilDetailPengajuanSaya } from "../../services/pengajuanMahasiswaService.js";
import { formatIdPengajuan, formatTanggalWaktu } from "../../utils/formatPengajuan.js";

// Kartu kanan untuk status yang belum menghasilkan dokumen (Menunggu Verifikasi, Diproses, Ditolak).
const KARTU_TAHAP = {
  [STATUS_PENGAJUAN.DITOLAK]: {
    judul: "Baca alasan penolakan",
    isi: "Alasan keputusan ditampilkan pada riwayat status pengajuan."
  },
  default: {
    judul: "Pengajuanmu sedang berjalan",
    isi: "Perubahan status akan tersedia di notifikasi sistem dan email."
  }
};

// PJN-UI06 Lacak Status Menunggu Verifikasi | PJN-UI07 Lacak Status Disetujui
// PJN-UC04 Melacak Status Pengajuan. Riwayat diurutkan dari yang paling awal.
export default function LacakStatusPage() {
  const { idPengajuan } = useParams();
  const { data: p, memuat, error } = useAmbilData(() => ambilDetailPengajuanSaya(idPengajuan), [idPengajuan]);

  if (memuat) return <p className="teks-redup">Memuat status...</p>;
  if (error) return <p className="pesan pesan--error" role="alert">{error}</p>;
  if (!p) return <PengajuanTidakDitemukan />;

  const urut = [...p.riwayat].sort((a, b) =>
    `${a.tanggalStatus}${a.waktuStatus}`.localeCompare(`${b.tanggalStatus}${b.waktuStatus}`)
  );
  const disetujui = p.statusPengajuan === STATUS_PENGAJUAN.DISETUJUI;
  const ditolak = p.statusPengajuan === STATUS_PENGAJUAN.DITOLAK;
  const kartu = KARTU_TAHAP[p.statusPengajuan] ?? KARTU_TAHAP.default;

  return (
    <>
      <PageHeader judul="Lacak status pengajuan" deskripsi="Ikuti perkembangan pengajuan layananmu." />

      <div className="grid-detail">
        <section className="kartu" aria-labelledby="judul-riwayat">
          <div className="kepala-lacak">
            <h2 id="judul-riwayat">{formatIdPengajuan(p.idPengajuan, p.tanggalPengajuan)}</h2>
            <StatusBadge status={p.statusPengajuan} />
          </div>
          <p className="layanan-lacak teks-redup">{p.namaLayanan}</p>

          <ol className="linimasa" aria-label="Riwayat status">
            {urut.map((r, i) => (
              <li
                key={`${r.statusPengajuan}-${r.tanggalStatus}-${r.waktuStatus}`}
                className="linimasa__item"
                aria-current={i === urut.length - 1 ? "step" : undefined}
              >
                <span className="linimasa__titik" aria-hidden="true"><IkonCentang ukuran={12} strokeWidth={2.6} /></span>
                <span className="linimasa__judul">{r.statusPengajuan}</span>
                <span className="linimasa__waktu">{formatTanggalWaktu(r.tanggalStatus, r.waktuStatus)}</span>
              </li>
            ))}
          </ol>

          {ditolak && (
            <div className="kotak-alasan" role="note">
              <strong>Alasan penolakan</strong>
              {p.alasanPenolakan ?? "Alasan penolakan gagal diambil. Muat ulang halaman ini."}
            </div>
          )}
        </section>

        {disetujui ? (
          <BerkasHasil dokumenHasil={p.dokumenHasil} email={p.identitas.email} />
        ) : (
          <section className="kartu kartu--info" aria-labelledby="judul-tahap">
            <span className="kotak-ikon"><IkonHati ukuran={20} /></span>
            <h2 id="judul-tahap">{kartu.judul}</h2>
            <p className="teks-redup">{kartu.isi}</p>
          </section>
        )}
      </div>
    </>
  );
}
