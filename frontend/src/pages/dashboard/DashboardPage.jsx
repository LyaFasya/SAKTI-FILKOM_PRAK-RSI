import { useState } from "react";
import { Link } from "react-router-dom";

import StatusBadge from "../../components/StatusBadge.jsx";
import { IkonPanah } from "../../components/staf/Icons.jsx";
import TabelPengajuan from "../../components/staf/TabelPengajuan.jsx";
import { DAFTAR_STATUS } from "../../config/constants.js";
import useAmbilData from "../../hooks/useAmbilData.js";
import {
  ambilDaftarPengajuan,
  ambilOpsiLayanan,
  ambilRingkasanPengajuan
} from "../../services/pengajuanService.js";
import { duaDigit } from "../../utils/format.js";
import "./dashboard.css";

const FILTER_AWAL = { kataKunci: "", status: "", idLayanan: "" };
const MAKS_BARIS_DASHBOARD = 5;

// DSB-UI01 | DSB-UC01 Ringkasan, DSB-UC02 Daftar, DSB-UC03 Cari dan Filter
// Sumber desain: Figma "Dashboard Staf KMA".
// Asumsi: kartu status menghitung SEMUA pengajuan; pencarian dan filter hanya
// mempengaruhi jumlah per layanan dan tabel di bawahnya. Cocokkan dengan tim kalau beda.
export default function DashboardPage() {
  const [kataKunciInput, setKataKunciInput] = useState("");
  const [filter, setFilter] = useState(FILTER_AWAL);

  const ringkasan = useAmbilData(() => ambilRingkasanPengajuan(), []);
  const opsiLayanan = useAmbilData(() => ambilOpsiLayanan(), []);
  const daftar = useAmbilData(
    () => ambilDaftarPengajuan(filter),
    [filter.kataKunci, filter.status, filter.idLayanan]
  );

  function cari(event) {
    event.preventDefault();
    setFilter((lama) => ({ ...lama, kataKunci: kataKunciInput }));
  }

  function reset() {
    setKataKunciInput("");
    setFilter(FILTER_AWAL);
  }

  const hasil = daftar.data ?? [];
  const layanan = opsiLayanan.data ?? [];
  // Bar hanya untuk layanan yang punya pengajuan (sesuai desain).
  const layananTampil = layanan
    .map((l) => ({
      nama: l.namaLayanan,
      jumlah: hasil.filter((p) => p.idLayanan === l.idLayanan).length
    }))
    .filter((l) => l.jumlah > 0);
  const siap = daftar.data !== null && opsiLayanan.data !== null;

  return (
    <>
      <section className="dash-hero">
        <p className="dash-eyebrow">Ruang kerja staf</p>
        <h1>Selamat datang, Staf Kemahasiswaan.</h1>
        <p>Pantau dan tindak lanjuti pengajuan layanan mahasiswa.</p>
      </section>

      {ringkasan.error && <p className="pesan pesan--error" role="alert">{ringkasan.error}</p>}

      <section className="dash-stat" aria-label="Jumlah pengajuan per status">
        {DAFTAR_STATUS.map((status) => (
          <div className="dash-stat__kartu" key={status}>
            <StatusBadge status={status} />
            <div className="dash-stat__angka">
              {ringkasan.data ? duaDigit(ringkasan.data.perStatus[status]) : "--"}
            </div>
            <div className="dash-stat__ket">pengajuan</div>
          </div>
        ))}
      </section>

      <section className="staf-panel" aria-labelledby="judul-ringkasan">
        <div className="staf-panel__kepala">
          <h2 id="judul-ringkasan">Ringkasan pengajuan</h2>
          <span className="staf-pill">{hasil.length} pengajuan</span>
        </div>

        <form className="dash-cari" onSubmit={cari}>
          <div className="dash-cari__kolom dash-field">
            <label htmlFor="cari-pengajuan">Cari pengajuan</label>
            <input
              id="cari-pengajuan"
              type="search"
              placeholder="Cari ID pengajuan, nama mahasiswa, NIM, atau layanan..."
              value={kataKunciInput}
              onChange={(e) => setKataKunciInput(e.target.value)}
            />
          </div>
          <div className="dash-cari__aksi">
            <button type="submit" className="tombol">Cari</button>
            <button type="button" className="tombol tombol--garis" onClick={reset}>Reset</button>
          </div>
        </form>

        <div className="dash-filter">
          <div className="dash-field">
            <label htmlFor="filter-status">Status</label>
            <select
              id="filter-status"
              value={filter.status}
              onChange={(e) => setFilter((lama) => ({ ...lama, status: e.target.value }))}
            >
              <option value="">Semua</option>
              {DAFTAR_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="dash-field">
            <label htmlFor="filter-layanan">Jenis layanan</label>
            <select
              id="filter-layanan"
              value={filter.idLayanan}
              onChange={(e) => setFilter((lama) => ({ ...lama, idLayanan: e.target.value }))}
            >
              <option value="">Semua layanan</option>
              {layanan.map((l) => (
                <option key={l.idLayanan} value={l.idLayanan}>{l.namaLayanan}</option>
              ))}
            </select>
          </div>
        </div>

        {siap && (
          <div className="dash-bar">
            {hasil.length === 0 ? (
              <p className="dash-bar__kosong">Tidak ada pengajuan untuk kriteria ini.</p>
            ) : (
              layananTampil.map(({ nama, jumlah }) => (
                <div key={nama}>
                  <div className="dash-bar__baris">
                    <span>{nama}</span>
                    <span className="dash-bar__jumlah">{jumlah}</span>
                  </div>
                  <div className="dash-bar__jalur">
                    <div
                      className="dash-bar__isi"
                      style={{ width: `${(jumlah / hasil.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      <section className="staf-panel" aria-labelledby="judul-daftar">
        <div className="staf-panel__kepala">
          <h2 id="judul-daftar">Daftar pengajuan</h2>
          <Link to="/staf/pengajuan" className="staf-link">
            Lihat semua <IkonPanah ukuran={14} />
          </Link>
        </div>

        {daftar.error && <p className="pesan pesan--error" role="alert">{daftar.error}</p>}
        {daftar.data === null && daftar.memuat && <p className="teks-redup">Memuat data...</p>}

        {daftar.data && <TabelPengajuan daftar={hasil.slice(0, MAKS_BARIS_DASHBOARD)} />}
      </section>
    </>
  );
}
