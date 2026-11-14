import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import PageHeader from "../../components/PageHeader.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import DetailTidakDitemukan from "../../components/staf/DetailTidakDitemukan.jsx";
import IdentitasMahasiswa from "../../components/staf/IdentitasMahasiswa.jsx";
import TombolLihatBerkas from "../../components/staf/TombolLihatBerkas.jsx";
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

  // Hasil yang dipilih (nilaiBaru) langsung disimpan. Tombol Simpan memakai nilai yang sedang tampil.
  async function simpan(nilaiBaru = hasil) {
    setPesan({ jenis: "", teks: "" });
    if (!nilaiBaru) {
      setPesan({ jenis: "error", teks: "Pilih hasil pemeriksaan terlebih dahulu." });
      return;
    }
    setMenyimpan(true);
    try {
      await simpanHasilVerifikasi(idPengajuan, lampiran.idDokumen, nilaiBaru);
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
        <TombolLihatBerkas idPengajuan={idPengajuan} idDokumenPengajuan={lampiran.idDokumen} />
      </div>

      <div className="verifikasi-form">
        <label htmlFor={idSelect} className="sr-only" style={{ position: "absolute", left: "-9999px" }}>
          Hasil pemeriksaan {lampiran.jenisDokumen}
        </label>
        <select
          id={idSelect}
          value={hasil}
          disabled={menyimpan}
          onChange={(e) => {
            setHasil(e.target.value);
            if (e.target.value) simpan(e.target.value);
          }}
        >
          <option value="">Pilih hasil</option>
          <option value={HASIL_VERIFIKASI.SESUAI}>{HASIL_VERIFIKASI.SESUAI}</option>
          <option value={HASIL_VERIFIKASI.TIDAK_SESUAI}>{HASIL_VERIFIKASI.TIDAK_SESUAI}</option>
        </select>
        <button type="button" className="tombol tombol--garis" onClick={() => simpan()} disabled={menyimpan}>
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

  // Backend yang menentukan: true kalau semua dokumen wajib sudah diunggah dan berstatus Sesuai.
  const siapDisetujui = Boolean(d.bisaLanjutPersetujuan);

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
