import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import DialogUnduhRekapitulasi from "../../components/dk/DialogUnduhRekapitulasi.jsx";
import { IkonGrafik, IkonUnduh } from "../../components/dk/IkonRekapitulasi.jsx";
import { IkonKalender } from "../../components/mahasiswa/Icons.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { DAFTAR_STATUS } from "../../config/constants.js";
import useAmbilData from "../../hooks/useAmbilData.js";
import {
  ambilDaftarLayananRekap,
  ambilRekapitulasi,
  simpanBerkas,
  unduhRekapitulasi
} from "../../services/rekapitulasiService.js";
import { formatTanggalPendek } from "../../utils/formatPengajuan.js";
import "../../styles/rekapitulasi.css";

// PJN-UI14 Rekapitulasi Pengajuan | PJN-UI15 Dialog Unduh Rekapitulasi
// PJN-UC14 Melihat Rekapitulasi Pengajuan, PJN-UC15 Mengunduh Rekapitulasi Pengajuan
// Filter disimpan di URL (?layanan=&status=&dari=&sampai=) dan baru berlaku saat tombol
// "Tampilkan Rekapitulasi" ditekan. Unduhan memakai filter yang sedang ditampilkan.

// "2026-10-01" + "2026-10-31" -> teks periode di bawah judul "Hasil rekapitulasi".
function teksPeriode(kriteria) {
  if (!kriteria) return "";
  const { tanggalMulai, tanggalAkhir } = kriteria;
  if (tanggalMulai && tanggalAkhir) return `${tanggalMulai} — ${tanggalAkhir}`;
  if (tanggalMulai) return `Mulai ${tanggalMulai}`;
  if (tanggalAkhir) return `Sampai ${tanggalAkhir}`;
  return "Semua tanggal";
}

export default function RekapitulasiPage() {
  const [params, setParams] = useSearchParams();
  const layanan = params.get("layanan") ?? "";
  const status = params.get("status") ?? "";
  const dari = params.get("dari") ?? "";
  const sampai = params.get("sampai") ?? "";

  const [isiLayanan, setIsiLayanan] = useState(layanan);
  const [isiStatus, setIsiStatus] = useState(status);
  const [isiDari, setIsiDari] = useState(dari);
  const [isiSampai, setIsiSampai] = useState(sampai);
  const [pesanFilter, setPesanFilter] = useState("");
  const [dialogTerbuka, setDialogTerbuka] = useState(false);
  // Naik setiap kali "Tampilkan Rekapitulasi" ditekan, supaya data diambil ulang walau filter sama.
  const [versi, setVersi] = useState(0);

  const kriteriaTampil = { idLayanan: layanan, statusPengajuan: status, tanggalMulai: dari, tanggalAkhir: sampai };

  const { data: daftarLayanan } = useAmbilData(() => ambilDaftarLayananRekap(), []);
  const { data: hasil, memuat, error } = useAmbilData(
    () => ambilRekapitulasi(kriteriaTampil),
    [layanan, status, dari, sampai, versi]
  );

  const baris = hasil?.data ?? [];
  const total = hasil?.total ?? 0;
  const adaFilter = Boolean(layanan || status || dari || sampai);

  function tampilkan(event) {
    event.preventDefault();
    if (isiDari && isiSampai && isiDari > isiSampai) {
      // Isian filter tetap dipertahankan agar bisa diperbaiki.
      setPesanFilter("Tanggal akhir tidak boleh lebih awal daripada tanggal awal.");
      return;
    }
    setPesanFilter("");
    const baru = new URLSearchParams();
    if (isiLayanan) baru.set("layanan", isiLayanan);
    if (isiStatus) baru.set("status", isiStatus);
    if (isiDari) baru.set("dari", isiDari);
    if (isiSampai) baru.set("sampai", isiSampai);
    setParams(baru);
    setVersi((v) => v + 1);
  }

  async function unduh(format) {
    simpanBerkas(await unduhRekapitulasi(format, kriteriaTampil));
  }

  const galatTanggal = Boolean(pesanFilter);

  return (
    <div className="rekap">
      <PageHeader
        judul="Rekapitulasi pengajuan"
        deskripsi="Pilih jenis layanan, status, dan periode; unduhan mengikuti hasil yang ditampilkan."
      />

      <section className="rekap-kartu" aria-labelledby="judul-filter-rekap">
        <h2 id="judul-filter-rekap">Filter rekapitulasi</h2>
        <form onSubmit={tampilkan} noValidate>
          <div className="rekap-filter">
            <div className="rekap-field">
              <label htmlFor="rekap-layanan">Jenis layanan</label>
              <select id="rekap-layanan" value={isiLayanan} onChange={(e) => setIsiLayanan(e.target.value)}>
                <option value="">Semua layanan</option>
                {(daftarLayanan ?? []).map((l) => (
                  <option key={l.idLayanan} value={String(l.idLayanan)}>{l.namaLayanan}</option>
                ))}
              </select>
            </div>

            <div className="rekap-field">
              <label htmlFor="rekap-status">Status</label>
              <select id="rekap-status" value={isiStatus} onChange={(e) => setIsiStatus(e.target.value)}>
                <option value="">Semua</option>
                {DAFTAR_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="rekap-field">
              <label htmlFor="rekap-dari">Tanggal awal</label>
              <div className="rekap-tanggal">
                <input
                  id="rekap-dari" type="date" value={isiDari} max={isiSampai || undefined}
                  onChange={(e) => setIsiDari(e.target.value)}
                  aria-invalid={galatTanggal || undefined} aria-describedby={galatTanggal ? "pesan-filter-rekap" : undefined}
                />
                <IkonKalender ukuran={18} />
              </div>
            </div>

            <div className="rekap-field">
              <label htmlFor="rekap-sampai">Tanggal akhir</label>
              <div className="rekap-tanggal">
                <input
                  id="rekap-sampai" type="date" value={isiSampai} min={isiDari || undefined}
                  onChange={(e) => setIsiSampai(e.target.value)}
                  aria-invalid={galatTanggal || undefined} aria-describedby={galatTanggal ? "pesan-filter-rekap" : undefined}
                />
                <IkonKalender ukuran={18} />
              </div>
            </div>
          </div>

          {pesanFilter && (
            <p id="pesan-filter-rekap" className="rekap-pesan rekap-pesan--galat" role="alert">{pesanFilter}</p>
          )}

          <div className="rekap-aksi">
            <button type="submit" className="rekap-tombol rekap-tombol--primer">Tampilkan Rekapitulasi</button>
          </div>
        </form>
      </section>

      <section className="rekap-kartu rekap-kartu--hasil" aria-labelledby="judul-hasil-rekap">
        <div className="rekap-hasil__kepala">
          <span className="rekap-hasil__ikon"><IkonGrafik ukuran={20} /></span>
          <div className="rekap-hasil__judul">
            <h2 id="judul-hasil-rekap">Hasil rekapitulasi</h2>
            <span>{teksPeriode(hasil?.kriteria)}</span>
          </div>
          <div className="rekap-hasil__aksi">
            <span className="rekap-jumlah"><strong>{total}</strong> pengajuan</span>
            <button
              type="button" className="rekap-tombol rekap-tombol--garis"
              onClick={() => setDialogTerbuka(true)}
              disabled={memuat || total === 0}
            >
              <IkonUnduh ukuran={16} /> Unduh Rekapitulasi
            </button>
          </div>
        </div>

        {error && <p className="rekap-pesan rekap-pesan--galat" role="alert">{error}</p>}

        <div className="rekap-tabel">
          <table>
            <thead>
              <tr>
                <th>ID pengajuan</th><th>Mahasiswa</th><th>Layanan</th><th>Tanggal</th><th>Status</th>
              </tr>
            </thead>
            {baris.length > 0 && (
              <tbody>
                {baris.map((p) => (
                  <tr key={p.idPengajuan}>
                    <td className="rekap-kode">{p.kodePengajuan}</td>
                    <td>
                      <span className="rekap-mhs">
                        <strong>{p.namaMahasiswa ?? "-"}</strong>
                        <span>{p.nim ?? ""}</span>
                      </span>
                    </td>
                    <td>{p.namaLayanan ?? "-"}</td>
                    <td className="rekap-tgl">{formatTanggalPendek(p.tanggalPengajuan)}</td>
                    <td><StatusBadge status={p.statusPengajuan} /></td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>

          {memuat && <p className="rekap-kosong rekap-redup">Memuat data...</p>}

          {!memuat && hasil && baris.length === 0 && (
            <div className="rekap-kosong">
              {adaFilter ? (
                <>
                  <strong>Data pengajuan tidak ditemukan</strong>
                  <p>Coba ubah kata kunci atau kriteria filter.</p>
                </>
              ) : (
                <>
                  <strong>Belum ada data pengajuan</strong>
                  <p>Rekapitulasi akan tampil setelah ada pengajuan dari mahasiswa.</p>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {dialogTerbuka && (
        <DialogUnduhRekapitulasi jumlah={total} onTutup={() => setDialogTerbuka(false)} onUnduh={unduh} />
      )}
    </div>
  );
}
