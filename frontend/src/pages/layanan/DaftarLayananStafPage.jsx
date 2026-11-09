import { Link } from "react-router-dom";

import PageHeader from "../../components/PageHeader.jsx";
import useAmbilData from "../../hooks/useAmbilData.js";
import { ambilDaftarLayanan } from "../../services/layananService.js";

// LYN-UI01 | LYN-UC01 Melihat Daftar Layanan
// STARTER: sudah terhubung ke API asli (GET /api/layanan). Sesuaikan tampilannya dengan Figma.
export default function DaftarLayananStafPage() {
  const { data, memuat, error } = useAmbilData(() => ambilDaftarLayanan(), []);

  return (
    <>
      <PageHeader judul="Daftar layanan" deskripsi="Layanan kemahasiswaan yang tersedia." />

      {error && <p className="pesan pesan--error" role="alert">{error}</p>}
      {memuat && <p className="teks-redup">Memuat data...</p>}

      {data && data.length === 0 && (
        <div className="kartu">
          <strong>Belum ada layanan</strong>
          <p className="teks-redup">Tambahkan data layanan lewat database terlebih dahulu.</p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="tabel-bungkus">
          <table className="tabel">
            <thead>
              <tr><th>Nama layanan</th><th>Kategori</th><th>Status</th></tr>
            </thead>
            <tbody>
              {data.map((l) => (
                <tr key={l.idLayanan}>
                  <td><Link to={`/staf/layanan/${l.idLayanan}`}>{l.namaLayanan}</Link></td>
                  <td>{l.kategoriLayanan}</td>
                  <td>{l.statusLayanan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
