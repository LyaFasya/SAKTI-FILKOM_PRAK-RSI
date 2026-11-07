import { Link, useSearchParams } from "react-router-dom";

import PageHeader from "../../components/PageHeader.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { DAFTAR_STATUS } from "../../config/constants.js";
import useAmbilData from "../../hooks/useAmbilData.js";
import { ambilDaftarPengajuan } from "../../services/pengajuanService.js";

// DSB-UI02 | DSB-UC02 Melihat Daftar Pengajuan, DSB-UC03 Mencari dan Memfilter
// DSB-UI03 (tidak ditemukan) tampil sebagai kondisi kosong di bawah.
// STARTER: filter disimpan di URL (?status=...&q=...) sehingga link dari Dashboard
// langsung membuka daftar yang sudah terfilter.
export default function DaftarPengajuanPage() {
  const [params, setParams] = useSearchParams();
  const status = params.get("status") ?? "";
  const kataKunci = params.get("q") ?? "";

  const { data, memuat, error } = useAmbilData(
    () => ambilDaftarPengajuan({ status, kataKunci }),
    [status, kataKunci]
  );

  function ubahFilter(nama, nilai) {
    const baru = new URLSearchParams(params);
    if (nilai) baru.set(nama, nilai);
    else baru.delete(nama);
    setParams(baru, { replace: true });
  }

  return (
    <>
      <PageHeader judul="Daftar pengajuan" deskripsi="Pengajuan layanan dari mahasiswa." />

      <div className="toolbar">
        <input
          type="search"
          placeholder="Cari nama, NIM, atau ID pengajuan"
          value={kataKunci}
          onChange={(e) => ubahFilter("q", e.target.value)}
          aria-label="Cari pengajuan"
        />
        <select value={status} onChange={(e) => ubahFilter("status", e.target.value)} aria-label="Filter status">
          <option value="">Semua status</option>
          {DAFTAR_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {error && <p className="pesan pesan--error" role="alert">{error}</p>}
      {memuat && <p className="teks-redup">Memuat data...</p>}

      {data && data.length === 0 && (
        <div className="kartu">
          <strong>Pengajuan tidak ditemukan</strong>
          <p className="teks-redup">Ubah kata kunci atau filter, lalu coba lagi.</p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="tabel-bungkus">
          <table className="tabel">
            <thead>
              <tr>
                <th>ID</th><th>Mahasiswa</th><th>NIM</th><th>Layanan</th><th>Tanggal</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr key={p.idPengajuan}>
                  <td><Link to={`/staf/pengajuan/${p.idPengajuan}`}>{p.idPengajuan}</Link></td>
                  <td>{p.namaMahasiswa}</td>
                  <td>{p.nim}</td>
                  <td>{p.namaLayanan}</td>
                  <td>{p.tanggalPengajuan}</td>
                  <td><StatusBadge status={p.statusPengajuan} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
