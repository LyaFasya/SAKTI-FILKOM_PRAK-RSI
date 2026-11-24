import { ApiError, apiRequest } from "./api.js";
import { ambilDaftarLayanan } from "./layananService.js";
import { STATUS_PENGAJUAN } from "../config/constants.js";
import { HASIL_VERIFIKASI, NAMA_STAF } from "../config/pengajuan.js";

// Nama filter di halaman (status) beda dengan di backend (statusPengajuan)
function bangunQuery({ status, idLayanan, kataKunci } = {}) {
  const params = new URLSearchParams();
  if (status) params.set("statusPengajuan", status);
  if (idLayanan) params.set("idLayanan", idLayanan);
  if (kataKunci?.trim()) params.set("kataKunci", kataKunci.trim());
  const teks = params.toString();
  return teks ? `?${teks}` : "";
}

// DSB-UC02
export async function ambilDaftarPengajuan(filter = {}) {
  const hasil = await apiRequest(`/pengajuan/staf${bangunQuery(filter)}`);
  return hasil.data;
}

// DSB-UC01: bentuk datanya disesuaikan dengan yang dipakai DashboardPage
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

// Isi dropdown "Jenis layanan"
export async function ambilOpsiLayanan() {
  const daftar = await ambilDaftarLayanan();
  return daftar.map(({ idLayanan, namaLayanan }) => ({ idLayanan, namaLayanan }));
}

// PJN-UC08: bentuk detail disesuaikan dengan yang dipakai halaman Detail
function ubahDetailBackend(d) {
  return {
    ...d,
    mahasiswa: {
      programStudi: d.programStudi ?? "-",
      email: d.email ?? "-",
      noHp: d.nomorHp ?? null
    },
    // idDokumen = idDokumenPengajuan, id ini yang dipakai backend saat simpan verifikasi
    lampiran: d.lampiran.map((l) => ({
      idDokumen: l.idDokumenPengajuan,
      jenisDokumen: l.namaDokumen,
      namaFile: l.namaFile,
      formatFile: l.formatFile,
      hasilVerifikasi: l.statusDokumen ?? HASIL_VERIFIKASI.BELUM
    })),
    keputusan: d.waktuKeputusan
      ? { diputuskanOleh: NAMA_STAF, waktu: d.waktuKeputusan, dokumenHasil: null }
      : null
  };
}

// null kalau 404 (pengajuan tidak ada)
export async function ambilDetailPengajuan(idPengajuan) {
  try {
    const hasil = await apiRequest(`/pengajuan/staf/${idPengajuan}`);
    return ubahDetailBackend(hasil.data);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

// PJN-UC09: backend cuma terima "Sesuai" / "Tidak Sesuai", dan hanya saat status Diproses
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

// PJN-UC10/11: upload PDF dulu (ke Supabase), baru setujui pakai versi hasil upload-nya
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

// Tautan PDF cuma berlaku 120 detik, jadi dipanggil ulang tiap mau buka
export async function ambilDokumenHasil(idPengajuan) {
  const hasil = await apiRequest(`/pengajuan/staf/${idPengajuan}/dokumen-hasil`);
  return hasil.data;
}

// Tautan sementara (120 detik)
export async function ambilTautanBerkas(idPengajuan, idDokumenPengajuan) {
  const hasil = await apiRequest(`/pengajuan/staf/${idPengajuan}/berkas/${idDokumenPengajuan}`);
  return hasil.data.url;
}

// PJN-UC12/13: backend nolak kalau masih ada berkas belum diverifikasi, pesannya ditampilkan apa adanya
export async function tolakPengajuan(idPengajuan, alasan) {
  if (!alasan?.trim()) throw new Error("Alasan penolakan wajib diisi.");

  const respons = await apiRequest(`/pengajuan/staf/${idPengajuan}/tolak`, {
    method: "PATCH",
    body: { alasanPenolakan: alasan.trim() }
  });
  return respons.data;
}
