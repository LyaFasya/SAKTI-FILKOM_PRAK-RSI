// Sebagian sudah memakai API asli (backend feat/backend-foundation):
//   ambilDaftarPengajuan, ambilRingkasanPengajuan, ambilOpsiLayanan
// Sudah API asli juga: ambilDetailPengajuan, simpanHasilVerifikasi, tolakPengajuan
// Sudah API asli juga: setujuiPengajuan (unggah dokumen hasil butuh kunci Supabase di backend), ambilTautanBerkas
import { ApiError, apiRequest } from "./api.js";
import { ambilDaftarLayanan } from "./layananService.js";
import {
  keputusanDummy,
  lampiranDummy,
  pengajuanDummy
} from "../mocks/pengajuan.js";
import { STATUS_PENGAJUAN } from "../config/constants.js";
import { HASIL_VERIFIKASI, NAMA_STAF, sudahDiputuskan } from "../config/pengajuan.js";

const tunda = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

// Halaman memakai nama filter { status, idLayanan, kataKunci },
// backend memakai { statusPengajuan, idLayanan, kataKunci }.
function bangunQuery({ status, idLayanan, kataKunci } = {}) {
  const params = new URLSearchParams();
  if (status) params.set("statusPengajuan", status);
  if (idLayanan) params.set("idLayanan", idLayanan);
  if (kataKunci?.trim()) params.set("kataKunci", kataKunci.trim());
  const teks = params.toString();
  return teks ? `?${teks}` : "";
}

// GET /api/pengajuan/staf  ->  data: [{ idPengajuan, kodePengajuan, namaMahasiswa,
//   nim, idLayanan, namaLayanan, tanggalPengajuan, statusPengajuan }]
export async function ambilDaftarPengajuan(filter = {}) {
  const hasil = await apiRequest(`/pengajuan/staf${bangunQuery(filter)}`);
  return hasil.data;
}

// GET /api/pengajuan/staf/ringkasan
// Bentuk dari backend diubah supaya sama dengan yang dipakai DashboardPage.
export async function ambilRingkasanPengajuan(filter = {}) {
  const hasil = await apiRequest(`/pengajuan/staf/ringkasan${bangunQuery(filter)}`);
  const data = hasil.data;

  return {
    total: data.total,
    perStatus: {
      [STATUS_PENGAJUAN.MENUNGGU_VERIFIKASI]: data.menungguVerifikasi,
      [STATUS_PENGAJUAN.DIPROSES]: data.diproses,
      [STATUS_PENGAJUAN.DISETUJUI]: data.disetujui,
      [STATUS_PENGAJUAN.DITOLAK]: data.ditolak
    },
    perLayanan: data.perLayanan
  };
}

// Pilihan untuk dropdown "Jenis layanan" (GET /api/layanan).
export async function ambilOpsiLayanan() {
  const daftar = await ambilDaftarLayanan();
  return daftar.map(({ idLayanan, namaLayanan }) => ({ idLayanan, namaLayanan }));
}

// ======================= MASIH DUMMY DI BAWAH INI =======================

const cariPengajuan = (idPengajuan) =>
  pengajuanDummy.find((item) => item.idPengajuan === Number(idPengajuan));

// PJN-UC08: detail satu pengajuan (identitas, lampiran, keputusan). null kalau tidak ada.
// Bentuk detail dari backend diubah supaya sama dengan yang dipakai halaman Detail.
function ubahDetailBackend(d) {
  return {
    ...d,
    mahasiswa: {
      programStudi: d.programStudi ?? "-",
      email: d.email ?? "-",
      noHp: d.nomorHp ?? null
    },
    // idDokumen di halaman = idDokumenPengajuan (id satu berkas yang diunggah mahasiswa),
    // karena itu yang dibutuhkan backend saat menyimpan hasil verifikasi.
    lampiran: d.lampiran.map((l) => ({
      idDokumen: l.idDokumenPengajuan,
      jenisDokumen: l.namaDokumen,
      namaFile: l.namaFile,
      hasilVerifikasi: l.statusDokumen ?? HASIL_VERIFIKASI.BELUM
    })),
    keputusan: d.waktuKeputusan
      ? { diputuskanOleh: NAMA_STAF, waktu: d.waktuKeputusan, dokumenHasil: null }
      : null
  };
}

// GET /api/pengajuan/staf/:id  ->  null kalau tidak ditemukan (404)
export async function ambilDetailPengajuan(idPengajuan) {
  try {
    const hasil = await apiRequest(`/pengajuan/staf/${idPengajuan}`);
    return ubahDetailBackend(hasil.data);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

function ambilPengajuanBelumDiputuskan(idPengajuan) {
  const pengajuan = cariPengajuan(idPengajuan);
  if (!pengajuan) throw new Error("Pengajuan tidak ditemukan.");
  if (sudahDiputuskan(pengajuan.statusPengajuan)) {
    throw new Error("Pengajuan ini sudah diputuskan dan tidak bisa diubah lagi.");
  }
  return pengajuan;
}

// PATCH /api/pengajuan/staf/:id/verifikasi/:idDokumenPengajuan  body: { statusDokumen }
// `idDokumen` di sini adalah idDokumenPengajuan (lihat ubahDetailBackend).
// Backend hanya menerima "Sesuai" atau "Tidak Sesuai", dan hanya untuk pengajuan berstatus Diproses.
export async function simpanHasilVerifikasi(idPengajuan, idDokumen, hasil) {
  if (hasil !== HASIL_VERIFIKASI.SESUAI && hasil !== HASIL_VERIFIKASI.TIDAK_SESUAI) {
    throw new Error("Pilih hasil pemeriksaan terlebih dahulu.");
  }

  const respons = await apiRequest(
    `/pengajuan/staf/${idPengajuan}/verifikasi/${idDokumen}`,
    { method: "PATCH", body: { statusDokumen: hasil } }
  );
  return respons.data;
}

// Menyetujui pengajuan butuh dua langkah di backend:
//   1) POST  /api/pengajuan/staf/:id/dokumen-hasil  (multipart, field "dokumenHasil", PDF maks 10 MB)
//      -> data.versiDokumenHasil
//   2) PATCH /api/pengajuan/staf/:id/setujui        body: { versiDokumenHasil }
// Langkah 1 memakai Supabase Storage, jadi butuh SUPABASE_URL dan SUPABASE_SECRET_KEY di backend/.env.
export async function setujuiPengajuan(idPengajuan, berkasPdf) {
  if (!berkasPdf) throw new Error("Unggah dokumen hasil terlebih dahulu.");

  const form = new FormData();
  form.append("dokumenHasil", berkasPdf);

  let unggahan;
  try {
    unggahan = await apiRequest(`/pengajuan/staf/${idPengajuan}/dokumen-hasil`, {
      method: "POST",
      body: form
    });
  } catch (error) {
    if (error instanceof ApiError && error.status >= 500) {
      throw new Error("Dokumen hasil belum bisa diunggah ke Storage. Coba lagi atau hubungi pengelola sistem.");
    }
    throw error;
  }

  const respons = await apiRequest(`/pengajuan/staf/${idPengajuan}/setujui`, {
    method: "PATCH",
    body: { versiDokumenHasil: unggahan.data.versiDokumenHasil }
  });
  return respons.data;
}

// GET /api/pengajuan/staf/:id/dokumen-hasil -> { namaDokumen, tanggalUpload, url (berlaku 120 detik), ... }
// Dipanggil lagi setiap kali ingin membuka PDF, karena tautannya cepat kedaluwarsa.
export async function ambilDokumenHasil(idPengajuan) {
  const hasil = await apiRequest(`/pengajuan/staf/${idPengajuan}/dokumen-hasil`);
  return hasil.data;
}

// GET /api/pengajuan/staf/:id/berkas/:idDokumenPengajuan -> tautan sementara (berlaku 120 detik)
export async function ambilTautanBerkas(idPengajuan, idDokumenPengajuan) {
  const hasil = await apiRequest(`/pengajuan/staf/${idPengajuan}/berkas/${idDokumenPengajuan}`);
  return hasil.data.url;
}

// PATCH /api/pengajuan/staf/:id/tolak  body: { alasanPenolakan }
// Backend menolak kalau status bukan Diproses, atau masih ada berkas yang belum diverifikasi
// (pesan errornya ditampilkan apa adanya di popup konfirmasi).
export async function tolakPengajuan(idPengajuan, alasan) {
  if (!alasan?.trim()) throw new Error("Alasan penolakan wajib diisi.");

  const respons = await apiRequest(`/pengajuan/staf/${idPengajuan}/tolak`, {
    method: "PATCH",
    body: { alasanPenolakan: alasan.trim() }
  });
  return respons.data;
}
