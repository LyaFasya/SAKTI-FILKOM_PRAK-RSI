import { Link, useParams } from "react-router-dom";

import BerkasHasil from "../../components/dk/BerkasHasil.jsx";
import PengajuanTidakDitemukan from "../../components/dk/PengajuanTidakDitemukan.jsx";
import { IkonPanah } from "../../components/mahasiswa/Icons.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { STATUS_PENGAJUAN } from "../../config/constants.js";
import { KELAS_STATUS_DOKUMEN } from "../../config/formPengajuan.js";
import useAmbilData from "../../hooks/useAmbilData.js";
import { ambilDetailPengajuanSaya } from "../../services/pengajuanMahasiswaService.js";
import { formatIdPengajuan, formatTanggalPendek } from "../../utils/formatPengajuan.js";

// PJN-UI03 Detail Menunggu Verifikasi | PJN-UI04 Detail Selesai (Disetujui) | PJN-UI05 Detail Ditolak
// PJN-UC03 Melihat Detail, PJN-UC05 Melihat Alasan Penolakan, PJN-UC06 Memperoleh Dokumen Hasil
// Satu halaman untuk semua status: kartu tambahan muncul sesuai statusPengajuan.
export default function DetailPengajuanSayaPage() {
  const { idPengajuan } = useParams();
  const { data: p, memuat, error } = useAmbilData(() => ambilDetailPengajuanSaya(idPengajuan), [idPengajuan]);

  if (memuat) return <p className="teks-redup">Memuat detail pengajuan...</p>;
  if (error) return <p className="pesan pesan--error" role="alert">{error}</p>;
  if (!p) return <PengajuanTidakDitemukan />;

  const ditolak = p.statusPengajuan === STATUS_PENGAJUAN.DITOLAK;
  const disetujui = p.statusPengajuan === STATUS_PENGAJUAN.DISETUJUI;
  const { identitas: i, formulir: f } = p;

  return (
    <>
      <PageHeader judul="Detail pengajuan" deskripsi="Informasi pengajuan dan dokumen persyaratan mahasiswa." />

      <div className="baris-id">
        <span>{formatIdPengajuan(p.idPengajuan, p.tanggalPengajuan)}</span>
        <StatusBadge status={p.statusPengajuan} />
        <time dateTime={p.tanggalPengajuan}>Diajukan {formatTanggalPendek(p.tanggalPengajuan)}</time>
      </div>

      <div className="grid-detail">
        <section className="kartu kartu-detail" aria-labelledby="judul-layanan">
          <span className="eyebrow">Layanan</span>
          <h2 id="judul-layanan" className="judul-layanan">{p.namaLayanan}</h2>

          <h3>Identitas mahasiswa</h3>
          <dl className="daftar-info">
            <div><dt>Nama</dt><dd>{i.namaMahasiswa}</dd></div>
            <div><dt>NIM</dt><dd>{i.nim}</dd></div>
            <div><dt>Program studi</dt><dd>{i.programStudi}</dd></div>
            <div><dt>Email</dt><dd>{i.email}</dd></div>
            <div><dt>HP / WA</dt><dd>{i.noHp || "–"}</dd></div>
          </dl>

          {f && (
            <>
              <h3>Isian formulir</h3>
              <dl className="daftar-info daftar-isian">
                <div><dt>Nama Kegiatan/Lomba</dt><dd>{f.namaKegiatan}</dd></div>
                <div><dt>Lokasi Kegiatan/Lomba</dt><dd>{f.lokasiKegiatan}</dd></div>
                <div><dt>Sebagai</dt><dd>{f.peran}</dd></div>
                {f.peranLain && <div><dt>Other response</dt><dd>{f.peranLain}</dd></div>}
                <div><dt>Tanggal Awal Pelaksanaan Kegiatan</dt><dd>{f.tanggalAwal}</dd></div>
                <div><dt>Tanggal Akhir Pelaksanaan Kegiatan</dt><dd>{f.tanggalAkhir}</dd></div>
              </dl>
            </>
          )}

          <h3>Lampiran pendukung</h3>
          {!f && <p className="info-berkas">Berkas pengajuan tersimpan pada sistem.</p>}
          {p.dokumen.length === 0 ? (
            <p className="teks-redup">Tidak ada lampiran.</p>
          ) : (
            <ul className="daftar-berkas">
              {p.dokumen.map((d) => (
                <li key={`${d.namaDokumen}-${d.namaFile}`} className="berkas-item">
                  <span className="berkas__ikon" aria-hidden="true">FILE</span>
                  <span className="berkas__info">
                    <span className="berkas__nama">{d.namaFile}</span>
                    <span className="berkas__ket">{d.namaDokumen}</span>
                  </span>
                  <span className={`badge ${KELAS_STATUS_DOKUMEN[d.statusDokumen] ?? ""}`}>{d.statusDokumen}</span>
                  {d.urlFile ? (
                    <a href={d.urlFile} target="_blank" rel="noreferrer" className="tautan-teks">Lihat</a>
                  ) : (
                    // Belum ada endpoint unduhan di backend, jadi berkas dummy tidak bisa dibuka.
                    <button type="button" className="tautan-teks" disabled title="Pratinjau berkas belum tersedia di prototipe">
                      Lihat
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="kolom">
          <section className="kartu kartu-perkembangan kartu--polos" aria-labelledby="judul-perkembangan">
            <h2 id="judul-perkembangan">Perkembangan pengajuan</h2>
            <p className="teks-redup">Lihat status terkini dan riwayat perubahan pengajuanmu.</p>
            <Link to={`/pengajuan-saya/${p.idPengajuan}/status`} className="tombol">
              Lacak Status <IkonPanah ukuran={16} />
            </Link>
          </section>

          {ditolak && (
            <section className="kartu kartu-alasan" aria-labelledby="judul-alasan">
              <h2 id="judul-alasan">Alasan penolakan</h2>
              {p.alasanPenolakan ? (
                <p>{p.alasanPenolakan}</p>
              ) : (
                <p className="pesan pesan--error" role="alert">
                  Alasan penolakan gagal diambil. Muat ulang halaman ini.
                </p>
              )}
            </section>
          )}

          {disetujui && <BerkasHasil dokumenHasil={p.dokumenHasil} email={i.email} />}
        </div>
      </div>
    </>
  );
}
