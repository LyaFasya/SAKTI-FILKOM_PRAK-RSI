import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import PageHeader from "../../components/PageHeader.jsx";
import DetailTidakDitemukan from "../../components/staf/DetailTidakDitemukan.jsx";
import IdentitasMahasiswa from "../../components/staf/IdentitasMahasiswa.jsx";
import Modal from "../../components/staf/Modal.jsx";
import {
  HASIL_VERIFIKASI,
  MAKS_UKURAN_DOKUMEN_HASIL,
  NAMA_STAF,
  sudahDiputuskan
} from "../../config/pengajuan.js";
import useDetailPengajuan from "../../hooks/useDetailPengajuan.js";
import { setujuiPengajuan } from "../../services/pengajuanService.js";
import { formatUkuranBerkas, kodePengajuan } from "../../utils/format.js";
import "./detail-pengajuan.css";

// PJN-UI10 | PJN-UC10 Menyetujui Pengajuan, PJN-UC11 Mengunggah Dokumen Hasil
// Sumber desain: Figma "Persetujuan Pengajuan" dan "Pop up persetujuan".
export default function PersetujuanPengajuanPage() {
  const { idPengajuan } = useParams();
  const navigate = useNavigate();
  const { data: d, memuat, error } = useDetailPengajuan(idPengajuan);

  const [berkas, setBerkas] = useState(null);
  const [pesanBerkas, setPesanBerkas] = useState("");
  const [pesanForm, setPesanForm] = useState("");
  const [popupTerbuka, setPopupTerbuka] = useState(false);
  const [menyimpan, setMenyimpan] = useState(false);
  const [pesanPopup, setPesanPopup] = useState("");

  if (error) return <p className="pesan pesan--error" role="alert">{error}</p>;
  if (!d) return memuat ? <p className="teks-redup">Memuat data...</p> : <DetailTidakDitemukan />;
  if (sudahDiputuskan(d.statusPengajuan)) {
    return <Navigate to={`/staf/pengajuan/${d.idPengajuan}`} replace />;
  }

  const kembali = `/staf/pengajuan/${d.idPengajuan}/verifikasi`;

  function pilihBerkas(event) {
    const file = event.target.files?.[0];
    setPesanBerkas("");
    setPesanForm("");

    if (!file) {
      setBerkas(null);
      return;
    }
    const pdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!pdf) {
      setBerkas(null);
      setPesanBerkas("Berkas harus berformat PDF.");
      event.target.value = "";
      return;
    }
    if (file.size > MAKS_UKURAN_DOKUMEN_HASIL) {
      setBerkas(null);
      setPesanBerkas("Ukuran berkas maksimal 10 MB.");
      event.target.value = "";
      return;
    }
    setBerkas(file);
  }

  function tinjau() {
    setPesanForm("");
    const semuaSesuai = d.lampiran.every(
      (l) => !l.wajib || l.hasilVerifikasi === HASIL_VERIFIKASI.SESUAI
    );
    if (!semuaSesuai) {
      setPesanForm("Masih ada lampiran wajib yang belum berstatus Sesuai. Selesaikan verifikasi dulu.");
      return;
    }
    if (!berkas) {
      setPesanForm("Unggah dokumen hasil terlebih dahulu.");
      return;
    }
    setPesanPopup("");
    setPopupTerbuka(true);
  }

  async function konfirmasi() {
    setMenyimpan(true);
    setPesanPopup("");
    try {
      // TODO: kirim berkas ke backend (multipart) setelah endpoint tersedia. Sekarang baru namanya.
      await setujuiPengajuan(d.idPengajuan, berkas.name);
      navigate(`/staf/pengajuan/${d.idPengajuan}`);
    } catch (err) {
      setPesanPopup(err.message);
      setMenyimpan(false);
    }
  }

  return (
    <>
      <PageHeader judul="Persetujuan pengajuan" deskripsi="Unggah dokumen hasil, lalu tinjau kembali sebelum mengonfirmasi." />

      <div className="detail-grid">
        <section className="detail-kartu" aria-label="Dokumen hasil">
          <p className="staf-eyebrow">{kodePengajuan(d)}</p>
          <h2 className="detail-judul">{d.namaLayanan}</h2>

          <h3 className="detail-subjudul" style={{ marginTop: 0 }}>Identitas mahasiswa</h3>
          <IdentitasMahasiswa detail={d} />

          <h3 className="detail-subjudul">
            {d.namaLayanan}<span className="pill-wajib">Wajib</span>
          </h3>
          <p className="detail-bantuan" style={{ marginTop: 10 }}>Format PDF · Maksimal 10 MB</p>

          <div className="unggah">
            <div className="unggah__kotak">
              <input
                type="file"
                accept="application/pdf,.pdf"
                aria-label="Unggah dokumen hasil"
                onChange={pilihBerkas}
              />
            </div>
            <p className="unggah__ket" role="status">
              {berkas ? `${berkas.name} · ${formatUkuranBerkas(berkas.size)}` : "Belum ada dokumen hasil"}
            </p>
            {pesanBerkas && <p className="pesan pesan--error" role="alert" style={{ margin: "10px 0 0" }}>{pesanBerkas}</p>}
          </div>

          {pesanForm && <p className="pesan pesan--error" role="alert">{pesanForm}</p>}

          <div className="detail-aksi">
            <button type="button" className="tombol" onClick={tinjau}>Tinjau Persetujuan</button>
            <Link to={kembali} className="tombol tombol--garis">Batal</Link>
          </div>
        </section>

        <section className="detail-kartu detail-samping" aria-label="Sebelum menyetujui">
          <h2>Sebelum menyetujui</h2>
          <p>
            Pastikan dokumen wajib sudah diunggah dan diverifikasi <strong>Sesuai</strong>.
          </p>
          <div className="staf-infobox">
            <p>Mengunggah dokumen hasil belum mengubah status pengajuan. Keputusan disimpan setelah konfirmasi.</p>
          </div>
        </section>
      </div>

      <Modal
        terbuka={popupTerbuka}
        onTutup={() => !menyimpan && setPopupTerbuka(false)}
        eyebrow="Konfirmasi persetujuan"
        judul="Setujui pengajuan ini?"
      >
        <dl className="ringkas">
          <div><dt>ID Pengajuan</dt><dd>{kodePengajuan(d)}</dd></div>
          <div><dt>Staf</dt><dd>{NAMA_STAF}</dd></div>
        </dl>

        <div className="staf-infobox">
          <p>{d.namaLayanan}</p>
          <p>Dokumen hasil: {berkas?.name}</p>
          <p>Status setelah konfirmasi: <strong>Disetujui</strong></p>
        </div>

        <p className="modal__catatan">
          Keputusan, staf, waktu, dan riwayat disimpan bersama. Notifikasi diproses sesudah penyimpanan berhasil.
        </p>
        {pesanPopup && <p className="pesan pesan--error" role="alert" style={{ marginTop: 14 }}>{pesanPopup}</p>}

        <div className="modal__aksi">
          <button type="button" className="tombol" onClick={konfirmasi} disabled={menyimpan}>
            {menyimpan ? "Menyimpan..." : "Ya, Setujui"}
          </button>
          <button type="button" className="tombol tombol--garis" onClick={() => setPopupTerbuka(false)} disabled={menyimpan}>
            Batal
          </button>
        </div>
      </Modal>
    </>
  );
}
