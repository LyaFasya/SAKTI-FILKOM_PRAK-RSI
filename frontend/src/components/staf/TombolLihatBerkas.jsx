import { useState } from "react";

import { ambilTautanBerkas } from "../../services/pengajuanService.js";

// Tombol "Lihat": ambil tautan sementara dari backend, buka di tab baru
// Tab dibuka duluan biar tidak diblokir pop-up blocker
// Dibungkus satu kolom supaya error tidak menghimpit nama berkas
export default function TombolLihatBerkas({ idPengajuan, idDokumenPengajuan, ambilTautan = ambilTautanBerkas, kelas = "berkas__lihat" }) {
  const [memuat, setMemuat] = useState(false);
  const [pesan, setPesan] = useState("");

  async function lihat() {
    setPesan("");
    setMemuat(true);
    const tab = window.open("", "_blank");
    try {
      const url = await ambilTautan(idPengajuan, idDokumenPengajuan);
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
      <button type="button" className={kelas} onClick={lihat} disabled={memuat}>
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
