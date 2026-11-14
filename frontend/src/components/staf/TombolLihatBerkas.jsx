import { useState } from "react";

import { ambilTautanBerkas } from "../../services/pengajuanService.js";

// Tombol "Lihat": meminta tautan sementara berkas ke backend (Supabase Storage), lalu membukanya di tab baru.
// Tab dibuka lebih dulu (sinkron saat klik) supaya tidak diblokir pop-up blocker.
// Tombol dan pesan error dibungkus satu kolom supaya tidak menghimpit kolom nama berkas di baris flex.
export default function TombolLihatBerkas({ idPengajuan, idDokumenPengajuan }) {
  const [memuat, setMemuat] = useState(false);
  const [pesan, setPesan] = useState("");

  async function lihat() {
    setPesan("");
    setMemuat(true);
    const tab = window.open("", "_blank");
    try {
      const url = await ambilTautanBerkas(idPengajuan, idDokumenPengajuan);
      if (tab) {
        tab.opener = null;
        tab.location.href = url;
      } else {
        window.location.href = url;
      }
    } catch (error) {
      if (tab) tab.close();
      setPesan(error.message);
    } finally {
      setMemuat(false);
    }
  }

  return (
    <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flex: "0 0 auto" }}>
      <button type="button" className="berkas__lihat" onClick={lihat} disabled={memuat}>
        {memuat ? "Membuka..." : "Lihat"}
      </button>
      {pesan && (
        <span role="alert" style={{ maxWidth: 170, fontSize: "0.7rem", lineHeight: 1.3, textAlign: "right", color: "#b3261e" }}>
          {pesan}
        </span>
      )}
    </span>
  );
}
