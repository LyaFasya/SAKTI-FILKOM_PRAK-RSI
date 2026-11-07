import { Link } from "react-router-dom";

import { formatTanggal, kodePengajuan } from "../../utils/format.js";
import StatusBadge from "../StatusBadge.jsx";
import { IkonPanah } from "./Icons.jsx";

// Tabel pengajuan yang sama dipakai di Dashboard (5 baris) dan Daftar Pengajuan (semua baris).
// Kalau daftar kosong, header tetap tampil dan muncul pesan "tidak ditemukan" (DSB-UI03).
// Tampilan mengikuti Figma; gayanya ada di styles/staf-theme.css (kelas staf-tabel).
export default function TabelPengajuan({ daftar }) {
  return (
    <div className="staf-tabel-bungkus">
      <table className="staf-tabel">
        <thead>
          <tr>
            <th>ID pengajuan</th>
            <th>Mahasiswa</th>
            <th>Layanan</th>
            <th>Tanggal</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {daftar.map((p) => (
            <tr key={p.idPengajuan}>
              <td className="staf-tabel__id">{kodePengajuan(p)}</td>
              <td>
                <div className="staf-tabel__nama">{p.namaMahasiswa}</div>
                <div className="staf-tabel__nim">{p.nim}</div>
              </td>
              <td>{p.namaLayanan}</td>
              <td>{formatTanggal(p.tanggalPengajuan)}</td>
              <td><StatusBadge status={p.statusPengajuan} /></td>
              <td>
                <Link to={`/staf/pengajuan/${p.idPengajuan}`} className="staf-link">
                  Detail <IkonPanah ukuran={14} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {daftar.length === 0 && (
        <div className="staf-tabel__kosong">
          <strong>Data pengajuan tidak ditemukan</strong>
          <span>Coba ubah kata kunci atau kriteria filter.</span>
        </div>
      )}
    </div>
  );
}
