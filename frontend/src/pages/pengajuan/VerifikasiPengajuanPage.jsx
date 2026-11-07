import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import PageHeader from "../../components/PageHeader.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import DetailTidakDitemukan from "../../components/staf/DetailTidakDitemukan.jsx";
import IdentitasMahasiswa from "../../components/staf/IdentitasMahasiswa.jsx";
import { HASIL_VERIFIKASI, sudahDiputuskan } from "../../config/pengajuan.js";
import useDetailPengajuan from "../../hooks/useDetailPengajuan.js";
import { simpanHasilVerifikasi } from "../../services/pengajuanService.js";
import { kodePengajuan } from "../../utils/format.js";
import "./detail-pengajuan.css";

// Satu lampiran: berkas + pilihan hasil + tombol Simpan.
function FormLampiran({ idPengajuan, lampiran, onTersimpan }) {
  const [hasil, setHasil] = useState(
    lampiran.hasilVerifikasi === HASIL_VERIFIKASI.BELUM ? "" : lampiran.hasilVerifikasi
  );
  const [menyimpan, setMenyimpan] = useState(false);
  const [pesan, setPesan] = useState({ jenis: "", teks: "" });

  async function simpan() {
    setPesan({ jenis: "", teks: "" });
    setMenyimpan(true);
    try {
      await simpanHasilVerifikasi(idPengajuan, lampiran.idDokumen, hasil);
      setPesan({ jenis: "ok", teks: "Hasil pemeriksaan tersimpan." });
      onTersimpan();
    } catch (error) {
      setPesan({ jenis: "error", teks: error.message });
    } finally {
      setMenyimpan(false);
    }
  }

  const idSelect = `hasil-${lampiran.idDokumen}`;

  return (
    <div>
      <h4 className="verifikasi-judul">
        {lampiran.jenisDokumen}
        {lampiran.wajib && <span className="pill-wajib">Wajib</span>}
      </h4>

      <div className="berkas">
        <span className="berkas__ikon">FILE</span>
        <div className="berkas__info"><div className="berkas__nama">{lampiran.namaFile}</div></div>
        {/* TODO: buka berkas asli setelah RF membuat endpoint dokumen. */}
        <button
          type="button"
          className="berkas__lihat"
          onClick={() => window.alert("Pratinjau berkas belum tersedia. Menunggu endpoint dokumen dari backend.")}
        >
          Lihat
        </button>
      </div>

      <div className="verifikasi-form">
        <label htmlFor={idSelect} className="sr-only" style={{ position: "absolute", left: "-9999px" }}>
          Hasil pemeriksaan {lampiran.jenisDokumen}
        </label>
        <select id={idSelect} value={hasil} onChange={(e) => setHasil(e.target.value)}>
          <option value="">Pilih hasil</option>
          <option value={HASIL_VERIFIKASI.SESUAI}>{HASIL_VERIFIKASI.SESUAI}</option>
          <option value={HASIL_VERIFIKASI.TIDAK_SESUAI}>{HASIL_VERIFIKASI.TIDAK_SESUAI}</option>
        </select>
        <button type="button" className="tombol tombol--garis" onClick={simpan} disabled={menyimpan}>
          {menyimpan ? "Menyimpan..." : "Simpan"}
        </button>
        {pesan.jenis === "ok" && <p className="verifikasi-status" role="status">{pesan.teks}</p>}
        {pesan.jenis === "error" && <p className="pesan pesan--error" role="alert">{pesan.teks}</p>}
      </div>
    </div>
  );
}

// PJN-UI09 | PJN-UC09 Memverifikasi Dokumen Pengajuan
// Sumber desain: Figma "Verifikasi pengajuan".
export default function VerifikasiPengajuanPage() {
  const { idPengajuan } = useParams();
  const navigate = useNavigate();
  const [versi, setVersi] = useState(0);
  const { data: d, memuat, error } = useDetailPengajuan(idPengajuan, versi);

  if (error) return <p className="pesan pesan--error" role="alert">{error}</p>;
  if (!d) return memuat ? <p className="teks-redup">Memuat data...</p> : <DetailTidakDitemukan />;
  if (sudahDiputuskan(d.statusPengajuan)) {
    return <Navigate to={`/staf/pengajuan/${d.idPengajuan}`} replace />;
  }

  // ASUMSI: lanjut ke persetujuan hanya boleh kalau semua lampiran wajib sudah "Sesuai"
  // (desain Persetujuan: "Pastikan dokumen wajib sudah diunggah dan diverifikasi Sesuai").
  const siapDisetujui = d.lampiran.every(
    (l) => !l.wajib || l.hasilVerifikasi === HASIL_VERIFIKASI.SESUAI
  );

  return (
    <>
      <PageHeader judul="Verifikasi pengajuan" deskripsi="Periksa isian formulir dan setiap lampiran sesuai jenis layanan." />

      <div className="detail-info">
        <div className="detail-kode">
          <span>{kodePengajuan(d)} · {d.namaLayanan}</span>
        </div>
        <StatusBadge status={d.statusPengajuan} />
      </div>

      <div className="detail-grid">
        <section className="detail-kartu" aria-label="Identitas dan lampiran">
          <h3 className="detail-subjudul" style={{ marginTop: 0 }}>Identitas mahasiswa</h3>
          <IdentitasMahasiswa detail={d} />

          <h3 className="detail-subjudul" style={{ fontSize: "1.35rem" }}>Lampiran pengajuan</h3>
          {d.lampiran.map((l) => (
            <FormLampiran
              key={l.idDokumen}
              idPengajuan={d.idPengajuan}
              lampiran={l}
              onTersimpan={() => setVersi((v) => v + 1)}
            />
          ))}
        </section>

        <section className="detail-kartu detail-samping" aria-label="Keputusan pengajuan">
          <h2>Keputusan pengajuan</h2>
          <p>Periksa isian dan seluruh lampiran wajib. Dokumen hasil diperlukan untuk persetujuan pengajuan surat.</p>

          <div className="detail-aksi">
            <button
              type="button"
              className="tombol"
              aria-disabled={!siapDisetujui}
              onClick={() => siapDisetujui && navigate(`/staf/pengajuan/${d.idPengajuan}/persetujuan`)}
            >
              Lanjut ke Persetujuan
            </button>
            <Link to={`/staf/pengajuan/${d.idPengajuan}/penolakan`} className="tombol tombol--garis">
              Tolak Pengajuan
            </Link>
          </div>
          {!siapDisetujui && (
            <p className="detail-bantuan">Persetujuan hanya bisa dilanjutkan setelah semua lampiran wajib berstatus Sesuai.</p>
          )}
        </section>
      </div>
    </>
  );
}
