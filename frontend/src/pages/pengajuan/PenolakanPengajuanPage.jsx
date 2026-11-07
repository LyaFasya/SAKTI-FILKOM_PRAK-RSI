import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import PageHeader from "../../components/PageHeader.jsx";
import DetailTidakDitemukan from "../../components/staf/DetailTidakDitemukan.jsx";
import Modal from "../../components/staf/Modal.jsx";
import { sudahDiputuskan } from "../../config/pengajuan.js";
import useDetailPengajuan from "../../hooks/useDetailPengajuan.js";
import { tolakPengajuan } from "../../services/pengajuanService.js";
import { kodePengajuan } from "../../utils/format.js";
import "./detail-pengajuan.css";

// PJN-UI12 | PJN-UC12 Menolak Pengajuan, PJN-UC13 Mengisi Alasan Penolakan
// Sumber desain: Figma "Penolakan pengajuan" dan "Pop up penolakan".
export default function PenolakanPengajuanPage() {
  const { idPengajuan } = useParams();
  const navigate = useNavigate();
  const { data: d, memuat, error } = useDetailPengajuan(idPengajuan);

  const [alasan, setAlasan] = useState("");
  const [pesanForm, setPesanForm] = useState("");
  const [popupTerbuka, setPopupTerbuka] = useState(false);
  const [menyimpan, setMenyimpan] = useState(false);
  const [pesanPopup, setPesanPopup] = useState("");

  if (error) return <p className="pesan pesan--error" role="alert">{error}</p>;
  if (!d) return memuat ? <p className="teks-redup">Memuat data...</p> : <DetailTidakDitemukan />;
  if (sudahDiputuskan(d.statusPengajuan)) {
    return <Navigate to={`/staf/pengajuan/${d.idPengajuan}`} replace />;
  }

  function simpanAlasan(event) {
    event.preventDefault();
    if (!alasan.trim()) {
      setPesanForm("Alasan penolakan wajib diisi.");
      return;
    }
    setPesanForm("");
    setPesanPopup("");
    setPopupTerbuka(true);
  }

  async function konfirmasi() {
    setMenyimpan(true);
    setPesanPopup("");
    try {
      await tolakPengajuan(d.idPengajuan, alasan);
      navigate(`/staf/pengajuan/${d.idPengajuan}`);
    } catch (err) {
      setPesanPopup(err.message);
      setMenyimpan(false);
    }
  }

  return (
    <>
      <PageHeader judul="Penolakan pengajuan" deskripsi="Sampaikan alasan berdasarkan hasil pemeriksaan dokumen." />

      <form className="detail-kartu detail-kartu--sedang" onSubmit={simpanAlasan} noValidate>
        <p className="staf-eyebrow">{kodePengajuan(d)}</p>
        <h2 className="detail-judul">{d.namaLayanan}</h2>

        <label htmlFor="alasan-penolakan" style={{ display: "block", marginBottom: 8, fontSize: "0.8rem", fontWeight: 600 }}>
          Alasan penolakan <span className="wajib-bintang" aria-hidden="true">*</span>
        </label>
        <textarea
          id="alasan-penolakan"
          className="penolakan-isian"
          value={alasan}
          onChange={(e) => setAlasan(e.target.value)}
          aria-required="true"
          aria-describedby="bantuan-alasan"
        />
        <p id="bantuan-alasan" className="penolakan-bantuan">Alasan ini akan ditampilkan kepada mahasiswa.</p>

        {pesanForm && <p className="pesan pesan--error" role="alert">{pesanForm}</p>}

        <div className="detail-aksi">
          <button type="submit" className="tombol">Simpan Alasan</button>
          <Link to={`/staf/pengajuan/${d.idPengajuan}/verifikasi`} className="tombol tombol--garis">Batal</Link>
        </div>
      </form>

      <Modal
        terbuka={popupTerbuka}
        onTutup={() => !menyimpan && setPopupTerbuka(false)}
        eyebrow="Konfirmasi penolakan"
        judul="Tolak pengajuan ini?"
      >
        <p className="teks-redup" style={{ margin: "0 0 14px", fontSize: "0.85rem" }}>{kodePengajuan(d)}</p>

        <div className="staf-infobox staf-infobox--bahaya">
          <p><strong>Alasan penolakan</strong></p>
          <p>{alasan.trim()}</p>
        </div>

        <p className="modal__catatan">Keputusan dan alasan akan disimpan setelah konfirmasi.</p>
        {pesanPopup && <p className="pesan pesan--error" role="alert" style={{ marginTop: 14 }}>{pesanPopup}</p>}

        <div className="modal__aksi">
          <button type="button" className="tombol tombol--bahaya" onClick={konfirmasi} disabled={menyimpan}>
            {menyimpan ? "Menyimpan..." : "Ya, Tolak Pengajuan"}
          </button>
          <button type="button" className="tombol tombol--garis" onClick={() => setPopupTerbuka(false)} disabled={menyimpan}>
            Batal
          </button>
        </div>
      </Modal>
    </>
  );
}
