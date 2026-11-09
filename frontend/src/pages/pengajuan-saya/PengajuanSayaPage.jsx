import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { IkonPanah } from "../../components/mahasiswa/Icons.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { DAFTAR_STATUS } from "../../config/constants.js";
import useAmbilData from "../../hooks/useAmbilData.js";
import { ambilPengajuanSaya } from "../../services/pengajuanMahasiswaService.js";
import { formatIdPengajuan, formatTanggalPendek } from "../../utils/formatPengajuan.js";

// PJN-UI01 Pengajuan Saya | PJN-UI02 Pengajuan Saya Tidak Tersedia
// PJN-UC01 Melihat Riwayat Pengajuan, PJN-UC02 Mencari dan Memfilter Pengajuan Saya
// Filter disimpan di URL (?q=...&status=...) dan baru berlaku saat tombol Cari ditekan.
export default function PengajuanSayaPage() {
  const [params, setParams] = useSearchParams();
  const kataKunci = params.get("q") ?? "";
  const status = params.get("status") ?? "";

  const [isiCari, setIsiCari] = useState(kataKunci);
  const [isiStatus, setIsiStatus] = useState(status);

  const { data, memuat, error } = useAmbilData(
    () => ambilPengajuanSaya({ status, kataKunci }),
    [status, kataKunci]
  );

  const adaFilter = Boolean(kataKunci || status);

  function cari(event) {
    event.preventDefault();
    const baru = new URLSearchParams();
    if (isiCari.trim()) baru.set("q", isiCari.trim());
    if (isiStatus) baru.set("status", isiStatus);
    setParams(baru);
  }

  function reset() {
    setIsiCari("");
    setIsiStatus("");
    setParams({});
  }

  return (
    <>
      <PageHeader judul="Pengajuan saya" deskripsi="Cari, filter, dan pantau riwayat pengajuan milikmu." />

      <section className="kartu kartu-daftar" aria-label="Daftar pengajuan">
        <form className="toolbar-saya" onSubmit={cari} role="search">
          <input
            type="search"
            placeholder="Cari ID pengajuan atau layanan"
            value={isiCari}
            onChange={(e) => setIsiCari(e.target.value)}
            aria-label="Cari ID pengajuan atau layanan"
          />
          <select value={isiStatus} onChange={(e) => setIsiStatus(e.target.value)} aria-label="Filter status">
            <option value="">Semua</option>
            {DAFTAR_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button type="submit" className="tombol">Cari</button>
          <button type="button" className="tombol tombol--garis" onClick={reset}>Reset</button>
        </form>

        {error && <p className="pesan pesan--error" role="alert">{error}</p>}

        <div className="tabel-saya">
          <table>
            <thead>
              <tr>
                <th>ID pengajuan</th><th>Layanan</th><th>Tanggal</th><th>Status</th><th>Aksi</th>
              </tr>
            </thead>
            {data && data.length > 0 && (
              <tbody>
                {data.map((p) => (
                  <tr key={p.idPengajuan}>
                    <td>{formatIdPengajuan(p.idPengajuan, p.tanggalPengajuan)}</td>
                    <td>{p.namaLayanan}</td>
                    <td>{formatTanggalPendek(p.tanggalPengajuan)}</td>
                    <td><StatusBadge status={p.statusPengajuan} /></td>
                    <td>
                      <Link to={`/pengajuan-saya/${p.idPengajuan}`}>
                        Detail <IkonPanah ukuran={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>

          {memuat && <p className="kosong-tabel teks-redup">Memuat data...</p>}

          {data && data.length === 0 && (
            <div className="kosong-tabel">
              {adaFilter ? (
                <>
                  <strong>Data pengajuan tidak ditemukan</strong>
                  <p>Coba ubah kata kunci atau kriteria filter.</p>
                </>
              ) : (
                <>
                  <strong>Belum ada pengajuan</strong>
                  <p>Pilih layanan di menu <Link to="/layanan">Layanan</Link> untuk membuat pengajuan pertamamu.</p>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
