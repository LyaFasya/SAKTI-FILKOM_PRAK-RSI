import { Link, useParams } from "react-router-dom";

import PageHeader from "../../components/PageHeader.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import DetailTidakDitemukan from "../../components/staf/DetailTidakDitemukan.jsx";
import TombolLihatBerkas from "../../components/staf/TombolLihatBerkas.jsx";
import HasilBadge from "../../components/staf/HasilBadge.jsx";
import IdentitasMahasiswa from "../../components/staf/IdentitasMahasiswa.jsx";
import { IkonPanah } from "../../components/staf/Icons.jsx";
import { STATUS_PENGAJUAN } from "../../config/constants.js";
import { sudahDiputuskan } from "../../config/pengajuan.js";
import useDetailPengajuan from "../../hooks/useDetailPengajuan.js";
import { formatTanggal, formatWaktuKeputusan, kodePengajuan } from "../../utils/format.js";
import "./detail-pengajuan.css";

// PJN-UI08 | PJN-UC08 Melihat Detail Pengajuan Mahasiswa
// Sumber desain: Figma "Detail pengajuan" (4 kondisi: Menunggu Verifikasi, Diproses, Disetujui, Ditolak).
export default function DetailPengajuanPage() {
  const { idPengajuan } = useParams();
  const { data: d, memuat, error } = useDetailPengajuan(idPengajuan);

  if (error) return <p className="pesan pesan--error" role="alert">{error}</p>;
  if (!d) return memuat ? <p className="teks-redup">Memuat data...</p> : <DetailTidakDitemukan />;

  const final = sudahDiputuskan(d.statusPengajuan);
  const disetujui = d.statusPengajuan === STATUS_PENGAJUAN.DISETUJUI;
  const ditolak = d.statusPengajuan === STATUS_PENGAJUAN.DITOLAK;

  return (
    <>
      <PageHeader judul="Detail pengajuan" deskripsi="Informasi pengajuan dan dokumen persyaratan mahasiswa." />

      <div className="detail-info">
        <div className="detail-kode">
          <span>{kodePengajuan(d)}</span>
          <StatusBadge status={d.statusPengajuan} />
        </div>
        <span className="detail-tanggal">Diajukan {formatTanggal(d.tanggalPengajuan)}</span>
      </div>

      <div className="detail-grid">
        <section className="detail-kartu" aria-label="Informasi pengajuan">
          <p className="staf-eyebrow">Layanan</p>
          <h2 className="detail-judul">{d.namaLayanan}</h2>

          <h3 className="detail-subjudul">Identitas mahasiswa</h3>
          <IdentitasMahasiswa detail={d} />

          <h3 className="detail-subjudul">Lampiran pendukung</h3>
          <div className="staf-infobox"><p>Berkas pengajuan tersimpan pada sistem.</p></div>

          {d.lampiran.map((l) => (
            <div className="berkas" key={l.idDokumen}>
              <span className="berkas__ikon">FILE</span>
              <div className="berkas__info">
                <div className="berkas__nama">{l.namaFile}</div>
                <div className="berkas__jenis">{l.jenisDokumen}</div>
              </div>
              <HasilBadge hasil={l.hasilVerifikasi} />
              <TombolLihatBerkas idPengajuan={d.idPengajuan} idDokumenPengajuan={l.idDokumen} />
            </div>
          ))}
        </section>

        <div className="detail-kolom">
          <section className="detail-kartu detail-samping" aria-label="Tindakan pengajuan">
            <h2>Tindakan pengajuan</h2>
            <p>Periksa dokumen sebelum memberikan keputusan.</p>

            {final ? (
              <div className="staf-infobox">
                <p>Keputusan akhir telah tersimpan.</p>
                <p>{d.keputusan?.diputuskanOleh} · {formatWaktuKeputusan(d.keputusan?.waktu)}</p>
              </div>
            ) : (
              <Link to={`/staf/pengajuan/${d.idPengajuan}/verifikasi`} className="tombol tombol--ikon">
                Verifikasi Dokumen <IkonPanah ukuran={16} />
              </Link>
            )}
          </section>

          {disetujui && (
            <section className="detail-kartu detail-samping" aria-label="Dokumen hasil">
              <div className="detail-ikon-surat" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </div>
              <h2>Dokumen hasil tersedia</h2>
              <p>
                {d.keputusan?.dokumenHasil}<br />
                Dokumen hasil dikirim sebagai lampiran email ke akun mahasiswa.
              </p>
              <p>Dikirim ke {d.mahasiswa.email}</p>
            </section>
          )}

          {ditolak && (
            <section className="detail-kartu detail-samping" aria-label="Alasan penolakan">
              <h2 className="detail-judul-bahaya">Alasan penolakan</h2>
              <p>{d.alasanPenolakan}</p>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
