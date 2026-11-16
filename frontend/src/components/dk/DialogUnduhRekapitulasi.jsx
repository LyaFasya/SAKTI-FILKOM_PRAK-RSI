import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { IkonTutup } from "./IkonRekapitulasi.jsx";

// PJN-UI15 Dialog - Unduh Rekapitulasi Pengajuan
// Dipasang hanya saat dialog terbuka. onUnduh(format) harus melempar galat kalau file gagal dibuat;
// pesannya ditampilkan di dalam dialog dan hasil rekapitulasi tetap dipertahankan.
export default function DialogUnduhRekapitulasi({ jumlah, onTutup, onUnduh }) {
  const [sedang, setSedang] = useState(null); // "pdf" | "xlsx" | null
  const [galat, setGalat] = useState("");
  const kotak = useRef(null);

  // Fokus pindah ke dialog saat dibuka dan kembali ke tombol pemicu saat ditutup.
  useEffect(() => {
    const pemicu = document.activeElement;
    const overflowAsal = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    kotak.current?.querySelector("button[data-format]")?.focus();
    return () => {
      document.body.style.overflow = overflowAsal;
      pemicu?.focus?.();
    };
  }, []);

  async function pilih(format) {
    setGalat("");
    setSedang(format);
    try {
      await onUnduh(format);
      onTutup();
    } catch (e) {
      setGalat(e.message || "File rekapitulasi gagal dibuat. Coba lagi atau batalkan proses unduh.");
      setSedang(null);
    }
  }

  function tekanTombol(event) {
    if (event.key === "Escape" && !sedang) {
      event.stopPropagation();
      onTutup();
      return;
    }
    if (event.key !== "Tab") return;
    // Fokus tidak boleh keluar dari dialog.
    const bisaFokus = [...kotak.current.querySelectorAll("button:not(:disabled)")];
    if (bisaFokus.length === 0) return;
    const awal = bisaFokus[0];
    const akhir = bisaFokus[bisaFokus.length - 1];
    if (event.shiftKey && document.activeElement === awal) {
      event.preventDefault();
      akhir.focus();
    } else if (!event.shiftKey && document.activeElement === akhir) {
      event.preventDefault();
      awal.focus();
    }
  }

  return createPortal(
    <div
      className="rekap-lapis"
      onMouseDown={(e) => { if (e.target === e.currentTarget && !sedang) onTutup(); }}
      onKeyDown={tekanTombol}
    >
      <div ref={kotak} className="rekap-dialog" role="dialog" aria-modal="true" aria-labelledby="judul-dialog-rekap" aria-describedby="isi-dialog-rekap">
        <button type="button" className="rekap-dialog__tutup" onClick={onTutup} disabled={Boolean(sedang)} aria-label="Tutup dialog">
          <IkonTutup ukuran={16} />
        </button>
        <span className="rekap-eyebrow">Unduh rekapitulasi</span>
        <h2 id="judul-dialog-rekap">Pilih format laporan</h2>
        <p id="isi-dialog-rekap" className="rekap-dialog__ket">
          Menggunakan {jumlah} pengajuan pada hasil filter yang sedang ditampilkan.
        </p>

        <div className="rekap-dialog__aksi">
          <button type="button" data-format="pdf" className="rekap-tombol rekap-tombol--primer" onClick={() => pilih("pdf")} disabled={Boolean(sedang)}>
            {sedang === "pdf" ? "Menyiapkan..." : "PDF"}
          </button>
          <button type="button" data-format="xlsx" className="rekap-tombol rekap-tombol--garis" onClick={() => pilih("xlsx")} disabled={Boolean(sedang)}>
            {sedang === "xlsx" ? "Menyiapkan..." : "Excel (.xlsx)"}
          </button>
        </div>

        {galat && <p className="rekap-pesan rekap-pesan--galat" role="alert">{galat}</p>}
      </div>
    </div>,
    document.body
  );
}
