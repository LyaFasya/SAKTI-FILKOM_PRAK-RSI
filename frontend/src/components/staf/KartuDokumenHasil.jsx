import { useEffect, useState } from "react";

import { ambilDokumenHasil } from "../../services/pengajuanService.js";

// Kartu "Dokumen hasil tersedia" pada pengajuan yang sudah Disetujui.
// Nama file diambil dari backend; PDF dibuka lewat tautan sementara yang diminta ulang setiap klik.
export default function KartuDokumenHasil({ idPengajuan }) {
  const [dokumen, setDokumen] = useState(null);
  const [memuat, setMemuat] = useState(false);
  const [pesan, setPesan] = useState("");

  useEffect(() => {
    let batal = false;
    ambilDokumenHasil(idPengajuan)
      .then((data) => !batal && setDokumen(data))
      .catch((error) => !batal && setPesan(error.message));
    return () => {
      batal = true;
    };
  }, [idPengajuan]);

  async function lihat() {
    setPesan("");
    setMemuat(true);
    const tab = window.open("", "_blank");
    try {
      const terbaru = await ambilDokumenHasil(idPengajuan);
      if (tab) {
        tab.opener = null;
        tab.location.href = terbaru.url;
      } else {
        window.location.href = terbaru.url;
      }
    } catch (error) {
      if (tab) tab.close();
      setPesan(error.message);
    } finally {
      setMemuat(false);
    }
  }

  return (
    <section className="detail-kartu detail-samping" aria-label="Dokumen hasil">
      <div className="detail-ikon-surat" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      </div>
      <h2>Dokumen hasil tersedia</h2>
      <p>
        {dokumen?.namaDokumen ?? "Memuat nama dokumen..."}
        <br />
        Dokumen hasil tersimpan pada sistem.
      </p>
      <button type="button" className="tombol tombol--garis" onClick={lihat} disabled={memuat || !dokumen}>
        {memuat ? "Membuka..." : "Lihat dokumen hasil"}
      </button>
      {pesan && <p className="pesan pesan--error" role="alert" style={{ marginTop: 10 }}>{pesan}</p>}
    </section>
  );
}
