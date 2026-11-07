// MASIH MEMAKAI DATA DUMMY. Backend belum punya endpoint pengajuan.
// Bentuk nilai kembalian sengaja dibuat mirip dengan yang kemungkinan dikirim backend.
// Nanti ganti isi fungsi dengan apiRequest(...); komponen yang memanggilnya tidak berubah.
import {
  keputusanDummy,
  lampiranDummy,
  layananDummy,
  mahasiswaDummy,
  pengajuanDummy
} from "../mocks/pengajuan.js";
import { DAFTAR_STATUS, STATUS_PENGAJUAN } from "../config/constants.js";
import { HASIL_VERIFIKASI, NAMA_STAF, sudahDiputuskan } from "../config/pengajuan.js";
import { kodePengajuan } from "../utils/format.js";

const tunda = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

function saring(daftar, { status, idLayanan, kataKunci } = {}) {
  const kunci = kataKunci?.trim().toLowerCase();

  return daftar.filter((item) => {
    if (status && item.statusPengajuan !== status) return false;
    if (idLayanan && item.idLayanan !== Number(idLayanan)) return false;
    if (
      kunci &&
      !`${kodePengajuan(item)} ${item.namaMahasiswa} ${item.nim} ${item.namaLayanan}`
        .toLowerCase()
        .includes(kunci)
    ) {
      return false;
    }
    return true;
  });
}

// DSB-UC02 / DSB-UC03: daftar pengajuan + pencarian + filter
export async function ambilDaftarPengajuan(filter = {}) {
  await tunda();
  return saring(pengajuanDummy, filter);
}

// DSB-UC01: ringkasan jumlah (total, per status, per jenis layanan)
export async function ambilRingkasanPengajuan(filter = {}) {
  await tunda();
  const data = saring(pengajuanDummy, filter);

  const perStatus = Object.fromEntries(
    DAFTAR_STATUS.map((status) => [
      status,
      data.filter((item) => item.statusPengajuan === status).length
    ])
  );

  const perLayanan = {};
  for (const item of data) {
    perLayanan[item.namaLayanan] = (perLayanan[item.namaLayanan] ?? 0) + 1;
  }

  return { total: data.length, perStatus, perLayanan };
}

const cariPengajuan = (idPengajuan) =>
  pengajuanDummy.find((item) => item.idPengajuan === Number(idPengajuan));

// PJN-UC08: detail satu pengajuan (identitas, lampiran, keputusan). null kalau tidak ada.
export async function ambilDetailPengajuan(idPengajuan) {
  await tunda();
  const pengajuan = cariPengajuan(idPengajuan);
  if (!pengajuan) return null;

  return structuredClone({
    ...pengajuan,
    mahasiswa: mahasiswaDummy[pengajuan.nim] ?? { programStudi: "-", email: "-", noHp: null },
    lampiran: lampiranDummy[pengajuan.idPengajuan] ?? [],
    keputusan: keputusanDummy[pengajuan.idPengajuan] ?? null
  });
}

function ambilPengajuanBelumDiputuskan(idPengajuan) {
  const pengajuan = cariPengajuan(idPengajuan);
  if (!pengajuan) throw new Error("Pengajuan tidak ditemukan.");
  if (sudahDiputuskan(pengajuan.statusPengajuan)) {
    throw new Error("Pengajuan ini sudah diputuskan dan tidak bisa diubah lagi.");
  }
  return pengajuan;
}

// PJN-UC09: simpan hasil pemeriksaan satu lampiran.
// ASUMSI: begitu ada lampiran yang diperiksa, status pengajuan berubah dari
// "Menunggu Verifikasi" menjadi "Diproses". Cocokkan dengan RF.
export async function simpanHasilVerifikasi(idPengajuan, idDokumen, hasil) {
  await tunda(150);
  const pengajuan = ambilPengajuanBelumDiputuskan(idPengajuan);

  if (hasil !== HASIL_VERIFIKASI.SESUAI && hasil !== HASIL_VERIFIKASI.TIDAK_SESUAI) {
    throw new Error("Pilih hasil pemeriksaan terlebih dahulu.");
  }

  const dokumen = (lampiranDummy[pengajuan.idPengajuan] ?? []).find(
    (d) => d.idDokumen === idDokumen
  );
  if (!dokumen) throw new Error("Lampiran tidak ditemukan.");

  dokumen.hasilVerifikasi = hasil;
  if (pengajuan.statusPengajuan === STATUS_PENGAJUAN.MENUNGGU_VERIFIKASI) {
    pengajuan.statusPengajuan = STATUS_PENGAJUAN.DIPROSES;
  }
}

// PJN-UC10 dan PJN-UC11: setujui pengajuan dengan dokumen hasil.
// Berkasnya belum benar-benar diunggah; yang disimpan baru namanya.
export async function setujuiPengajuan(idPengajuan, namaDokumenHasil) {
  await tunda(300);
  const pengajuan = ambilPengajuanBelumDiputuskan(idPengajuan);

  if (!namaDokumenHasil) throw new Error("Unggah dokumen hasil terlebih dahulu.");
  const lampiran = lampiranDummy[pengajuan.idPengajuan] ?? [];
  if (lampiran.some((d) => d.wajib && d.hasilVerifikasi !== HASIL_VERIFIKASI.SESUAI)) {
    throw new Error("Semua lampiran wajib harus berstatus Sesuai sebelum disetujui.");
  }

  pengajuan.statusPengajuan = STATUS_PENGAJUAN.DISETUJUI;
  pengajuan.alasanPenolakan = null;
  keputusanDummy[pengajuan.idPengajuan] = {
    diputuskanOleh: NAMA_STAF,
    waktu: new Date().toISOString(),
    dokumenHasil: namaDokumenHasil
  };
}

// PJN-UC12 dan PJN-UC13: tolak pengajuan beserta alasannya.
export async function tolakPengajuan(idPengajuan, alasan) {
  await tunda(300);
  const pengajuan = ambilPengajuanBelumDiputuskan(idPengajuan);

  if (!alasan?.trim()) throw new Error("Alasan penolakan wajib diisi.");

  pengajuan.statusPengajuan = STATUS_PENGAJUAN.DITOLAK;
  pengajuan.alasanPenolakan = alasan.trim();
  keputusanDummy[pengajuan.idPengajuan] = {
    diputuskanOleh: NAMA_STAF,
    waktu: new Date().toISOString(),
    dokumenHasil: null
  };
}

// Pilihan untuk dropdown "Jenis layanan".
// Sementara dari data dummy karena tabel Layanan di database masih kosong.
export async function ambilOpsiLayanan() {
  await tunda(100);
  return layananDummy;
}
