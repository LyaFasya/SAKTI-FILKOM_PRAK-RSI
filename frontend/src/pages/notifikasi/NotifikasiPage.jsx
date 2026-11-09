import { Link } from "react-router-dom";

import { IkonPanah, IkonSurat } from "../../components/mahasiswa/Icons.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import useAmbilData from "../../hooks/useAmbilData.js";
import { ambilNotifikasi } from "../../services/pengajuanMahasiswaService.js";
import { formatIdPengajuan, formatTanggalWaktu } from "../../utils/formatPengajuan.js";

// PJN-UC07 Menerima Notifikasi Perubahan Status Pengajuan
// Tampilan mengikuti Figma "Notifikasi". Tiap baris membuka detail pengajuannya.
export default function NotifikasiPage() {
  const { data, memuat, error } = useAmbilData(() => ambilNotifikasi(), []);

  return (
    <>
      <PageHeader judul="Notifikasi" deskripsi="Perubahan status pengajuanmu tersimpan di sini." />

      {error && <p className="pesan pesan--error" role="alert">{error}</p>}
      {memuat && <p className="teks-redup">Memuat notifikasi...</p>}

      {data && (
        <section className="kartu" aria-label="Daftar notifikasi">
          {data.length === 0 ? (
            <>
              <strong>Belum ada notifikasi</strong>
              <p className="teks-redup" style={{ margin: "6px 0 0" }}>
                Notifikasi muncul saat status pengajuanmu berubah.
              </p>
            </>
          ) : (
            <ul className="daftar-notifikasi">
              {data.map((n) => (
                <li key={n.idNotifikasi}>
                  <Link to={`/pengajuan-saya/${n.idPengajuan}`} className="notifikasi__tautan">
                    <span className="notifikasi__ikon"><IkonSurat ukuran={20} /></span>
                    <span className="notifikasi__isi">
                      <span className="notifikasi__judul">
                        {formatIdPengajuan(n.idPengajuan, n.tanggalPerubahan)}
                        {n.namaLayanan && ` · ${n.namaLayanan}`}
                      </span>
                      <p className="notifikasi__pesan">{n.pesan}</p>
                      <span className="notifikasi__waktu">{formatTanggalWaktu(n.tanggalPerubahan, n.waktuPerubahan)}</span>
                      {n.statusPengirimanEmail === "Gagal" && (
                        <p className="notifikasi__email-gagal">{n.keteranganEmail ?? "Email notifikasi gagal dikirim."}</p>
                      )}
                    </span>
                    <IkonPanah className="notifikasi__panah" ukuran={14} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </>
  );
}
