import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import PageHeader from "../../components/PageHeader.jsx";
import {
  IkonBeasiswa,
  IkonCari,
  IkonDaftar,
  IkonPanah,
  IkonPengaturan,
  IkonPiala
} from "../../components/staf/Icons.jsx";
import useAmbilData from "../../hooks/useAmbilData.js";
import { ambilDaftarLayanan } from "../../services/layananService.js";
import "./layanan.css";

// LYN-UI01 | LYN-UC01 Melihat Daftar Layanan
// Kondisi "Daftar Layanan Tidak Tersedia" tampil sebagai keadaan kosong di bawah.
// Sumber desain: Figma "Daftar Layanan". Filter disimpan di URL (?q=...&kategori=...).

function ikonKategori(kategori) {
  const k = String(kategori).toLowerCase();
  if (k === "beasiswa") return IkonBeasiswa;
  if (k === "wisuda") return IkonPiala;
  return IkonDaftar;
}

function labelJenis(layanan) {
  if (layanan.statusLayanan && layanan.statusLayanan !== "Aktif") return layanan.statusLayanan;
  return String(layanan.kategoriLayanan).toLowerCase() === "akademik" ? "Layanan akademik" : "Layanan";
}

export default function DaftarLayananStafPage() {
  const [params, setParams] = useSearchParams();
  const kataKunci = params.get("q") ?? "";
  const kategori = params.get("kategori") ?? "";

  // Teks di kolom cari baru dipakai saat tombol "Cari" ditekan (atau Enter).
  const [kataKunciInput, setKataKunciInput] = useState(kataKunci);
  const [kategoriInput, setKategoriInput] = useState(kategori);
  useEffect(() => setKataKunciInput(kataKunci), [kataKunci]);
  useEffect(() => setKategoriInput(kategori), [kategori]);

  // Daftar tanpa filter dipakai khusus untuk mengisi pilihan kategori.
  const semua = useAmbilData(() => ambilDaftarLayanan(), []);
  const daftar = useAmbilData(
    () => ambilDaftarLayanan({ kataKunci, kategoriLayanan: kategori }),
    [kataKunci, kategori]
  );

  const opsiKategori = [...new Set((semua.data ?? []).map((l) => l.kategoriLayanan))].sort();
  const hasil = daftar.data ?? [];

  function cari(event) {
    event.preventDefault();
    const baru = new URLSearchParams();
    if (kataKunciInput.trim()) baru.set("q", kataKunciInput.trim());
    if (kategoriInput) baru.set("kategori", kategoriInput);
    setParams(baru, { replace: true });
  }

  function tampilkanSemua() {
    setKataKunciInput("");
    setKategoriInput("");
    setParams({}, { replace: true });
  }

  return (
    <>
      <PageHeader
        judul="Daftar layanan"
        deskripsi="Lihat informasi, persyaratan umum, dan dokumen yang diperlukan untuk setiap layanan."
      />

      <form className="layanan-filter" onSubmit={cari}>
        <input
          type="search"
          placeholder="Cari layanan..."
          aria-label="Cari layanan"
          value={kataKunciInput}
          onChange={(e) => setKataKunciInput(e.target.value)}
        />
        <select
          aria-label="Filter kategori"
          value={kategoriInput}
          onChange={(e) => setKategoriInput(e.target.value)}
        >
          <option value="">Semua kategori</option>
          {opsiKategori.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
        <button type="submit" className="tombol">Cari</button>
      </form>

      {daftar.error && <p className="pesan pesan--error" role="alert">{daftar.error}</p>}
      {daftar.data === null && daftar.memuat && <p className="teks-redup">Memuat data...</p>}

      {daftar.data && hasil.length === 0 && (
        <section className="layanan-kosong" aria-live="polite">
          <span className="layanan-kosong__ikon"><IkonCari ukuran={20} /></span>
          <strong>Layanan tidak ditemukan</strong>
          <span>Coba kata kunci atau kategori lainnya.</span>
          <button type="button" className="tombol tombol--garis" onClick={tampilkanSemua}>
            Tampilkan semua layanan
          </button>
        </section>
      )}

      {hasil.length > 0 && (
        <div className="layanan-grid">
          {hasil.map((l) => {
            const Ikon = ikonKategori(l.kategoriLayanan);
            return (
              <article key={l.idLayanan} className="layanan-kartu">
                <div className="layanan-kartu__atas">
                  <span className="layanan-kartu__ikon"><Ikon ukuran={18} /></span>
                  <span className="staf-pill">{labelJenis(l)}</span>
                </div>
                <p className="layanan-kartu__kategori">{l.kategoriLayanan}</p>
                <h2 className="layanan-kartu__nama">{l.namaLayanan}</h2>
                <p className="layanan-kartu__deskripsi">
                  Lihat dan kelola informasi serta persyaratan layanan ini.
                </p>
                <div className="layanan-kartu__aksi">
                  <Link to={`/staf/layanan/${l.idLayanan}`} className="staf-link">
                    Lihat detail <IkonPanah ukuran={14} />
                  </Link>
                  <Link to={`/staf/layanan/${l.idLayanan}/edit`} className="layanan-tombol-kecil">
                    <IkonPengaturan ukuran={13} /> Edit Layanan
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
