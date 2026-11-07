import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import PageHeader from "../../components/PageHeader.jsx";
import TabelPengajuan from "../../components/staf/TabelPengajuan.jsx";
import { DAFTAR_STATUS } from "../../config/constants.js";
import useAmbilData from "../../hooks/useAmbilData.js";
import { ambilDaftarPengajuan, ambilOpsiLayanan } from "../../services/pengajuanService.js";
import "./pengajuan.css";

// DSB-UI02 | DSB-UC02 Melihat Daftar Pengajuan, DSB-UC03 Mencari dan Memfilter
// DSB-UI03 (tidak ditemukan) tampil sebagai kondisi kosong di bawah.
// Sumber desain: Figma "Daftar Pengajuan".
// Filter disimpan di URL (?q=...&status=...&layanan=...), jadi bisa di-bookmark
// dan tombol Back di browser tetap masuk akal.
export default function DaftarPengajuanPage() {
  const [params, setParams] = useSearchParams();
  const kataKunci = params.get("q") ?? "";
  const status = params.get("status") ?? "";
  const idLayanan = params.get("layanan") ?? "";

  // Teks di kolom cari baru dipakai saat tombol "Cari" ditekan (atau Enter).
  const [kataKunciInput, setKataKunciInput] = useState(kataKunci);
  useEffect(() => setKataKunciInput(kataKunci), [kataKunci]);

  const opsiLayanan = useAmbilData(() => ambilOpsiLayanan(), []);
  const daftar = useAmbilData(
    () => ambilDaftarPengajuan({ kataKunci, status, idLayanan }),
    [kataKunci, status, idLayanan]
  );

  function ubahFilter(nama, nilai) {
    const baru = new URLSearchParams(params);
    if (nilai) baru.set(nama, nilai);
    else baru.delete(nama);
    setParams(baru, { replace: true });
  }

  function cari(event) {
    event.preventDefault();
    ubahFilter("q", kataKunciInput.trim());
  }

  function reset() {
    setKataKunciInput("");
    setParams({}, { replace: true });
  }

  const hasil = daftar.data ?? [];
  const layanan = opsiLayanan.data ?? [];

  return (
    <>
      <PageHeader
        judul="Daftar pengajuan"
        deskripsi="Pengajuan layanan mahasiswa yang tersimpan pada sistem."
      />

      <section className="staf-panel" aria-label="Daftar pengajuan">
        <form className="daftar-filter" onSubmit={cari}>
          <div className="daftar-filter__cari">
            <input
              type="search"
              placeholder="Cari ID, nama, NIM, atau layanan"
              aria-label="Cari pengajuan"
              value={kataKunciInput}
              onChange={(e) => setKataKunciInput(e.target.value)}
            />
          </div>

          <select
            aria-label="Filter status"
            value={status}
            onChange={(e) => ubahFilter("status", e.target.value)}
          >
            <option value="">Semua</option>
            {DAFTAR_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            aria-label="Filter jenis layanan"
            value={idLayanan}
            onChange={(e) => ubahFilter("layanan", e.target.value)}
          >
            <option value="">Semua layanan</option>
            {layanan.map((l) => (
              <option key={l.idLayanan} value={l.idLayanan}>{l.namaLayanan}</option>
            ))}
          </select>

          <button type="submit" className="tombol">Cari</button>
          <button type="button" className="tombol tombol--garis" onClick={reset}>Reset</button>
        </form>

        {daftar.error && <p className="pesan pesan--error" role="alert">{daftar.error}</p>}
        {daftar.data === null && daftar.memuat && <p className="teks-redup">Memuat data...</p>}

        {daftar.data && <TabelPengajuan daftar={hasil} />}
      </section>
    </>
  );
}
