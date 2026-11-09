import { useState } from "react";

import PageHeader from "../../components/PageHeader.jsx";
import { DAFTAR_STATUS } from "../../config/constants.js";
import useAmbilData from "../../hooks/useAmbilData.js";
import { ambilRingkasanPengajuan } from "../../services/pengajuanService.js";
import { Link } from "react-router-dom";

// DSB-UI01 | DSB-UC01 Melihat Ringkasan Pengajuan
// STARTER: sudah menampilkan angka dari data dummy. Sesuaikan tata letaknya dengan Figma.
export default function DashboardPage() {
  const [status, setStatus] = useState("");
  const { data, memuat, error } = useAmbilData(
    () => ambilRingkasanPengajuan({ status }),
    [status]
  );

  return (
    <>
      <PageHeader
        judul="Ringkasan pengajuan"
        deskripsi="Jumlah pengajuan layanan mahasiswa."
        aksi={
          <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter status">
            <option value="">Semua status</option>
            {DAFTAR_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        }
      />

      {error && <p className="pesan pesan--error" role="alert">{error}</p>}
      {memuat && <p className="teks-redup">Memuat data...</p>}

      {data && (
        <>
          <div className="grid-ringkasan">
            <div className="kartu">
              <div className="angka">{data.total}</div>
              <div className="teks-redup">Total pengajuan</div>
            </div>
            {DAFTAR_STATUS.map((s) => (
              <Link key={s} to={`/staf/pengajuan?status=${encodeURIComponent(s)}`} className="kartu kartu--link">
                <div className="angka">{data.perStatus[s]}</div>
                <div className="teks-redup">{s}</div>
              </Link>
            ))}
          </div>

          <h2>Per jenis layanan</h2>
          <div className="kartu">
            {Object.keys(data.perLayanan).length === 0 ? (
              <p className="teks-redup">Belum ada pengajuan.</p>
            ) : (
              <ul className="daftar-bersih">
                {Object.entries(data.perLayanan).map(([nama, jumlah]) => (
                  <li key={nama}><span>{nama}</span><strong>{jumlah}</strong></li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </>
  );
}
