// Service pengajuan sisi MAHASISWA (milik DK), memanggil API asli backend:
//   GET  /api/pengajuan/profil             GET  /api/pengajuan?kataKunci=&statusPengajuan=
//   GET  /api/layanan/:id                  GET  /api/pengajuan/:id
//   POST /api/pengajuan (multipart)        GET  /api/pengajuan/:id/dokumen-hasil
//   GET  /api/notifikasi
// Autentikasi memakai session cookie, dikirim otomatis oleh browser lewat proxy Vite.
//
// Pengiriman pengajuan memakai fetch sendiri karena apiRequest di api.js belum
// mendukung FormData. Kalau api.js nanti mendukungnya, bagian itu bisa diganti apiRequest.
import { ApiError, apiRequest, hapusSesi } from "./api.js";
import { adalahNomorHp, kunciIdentitas } from "../config/formPengajuan.js";

// Untuk halaman yang membuka satu pengajuan: ID tidak valid atau bukan milik mahasiswa = tidak ditemukan.
async function nullJikaTidakAda(ambil) {
  try {
    return await ambil();
  } catch (e) {
    if (e instanceof ApiError && (e.status === 400 || e.status === 404)) return null;
    throw e;
  }
}

// { nim, namaMahasiswa, programStudi, email }
export async function ambilProfil() {
  const hasil = await apiRequest("/pengajuan/profil");
  return hasil.data;
}

// Data form: rincian layanan + profil mahasiswa (untuk mengisi kolom identitas).
export async function ambilDataFormPengajuan(idLayanan) {
  const [layanan, profil] = await Promise.all([
    apiRequest(`/layanan/${idLayanan}`).then((h) => h.data),
    ambilProfil()
  ]);
  return { ...layanan, profil };
}

// `isian`  = { [label isian]: nilai }   (kunci = labelTampilan ?? label dari rincianFormulir)
// `berkas` = { [idDokumen]: File[] }
// Mengembalikan { idPengajuan, kodePengajuan, tanggalPengajuan, statusPengajuan, ... }.
export async function kirimPengajuan({ idLayanan, isian, berkas, kirimSalinanEmail }) {
  const form = new FormData();
  form.append("idLayanan", String(idLayanan));
  form.append("isianFormulir", JSON.stringify(isian));
  if (kirimSalinanEmail !== undefined) form.append("kirimSalinanEmail", String(kirimSalinanEmail));
  for (const [idDokumen, daftarFile] of Object.entries(berkas)) {
    for (const file of daftarFile) form.append(`lampiran[${idDokumen}]`, file, file.name);
  }

  let respons;
  try {
    respons = await fetch("/api/pengajuan", { method: "POST", body: form });
  } catch {
    throw new ApiError("Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.", 0, null);
  }

  const data = await respons.json().catch(() => null);

  if (respons.status === 401) {
    hapusSesi();
    window.dispatchEvent(new Event("sakti:unauthorized"));
  }
  if (!respons.ok) {
    throw new ApiError(data?.message ?? "Pengajuan gagal dikirim.", respons.status, data);
  }
  return data.data;
}

// [{ idPengajuan, kodePengajuan, idLayanan, namaLayanan, tanggalPengajuan, statusPengajuan }]
// Backend mengurutkan dari yang terbaru.
export async function ambilPengajuanSaya({ status = "", kataKunci = "" } = {}) {
  const params = new URLSearchParams();
  if (kataKunci.trim()) params.set("kataKunci", kataKunci.trim());
  if (status) params.set("statusPengajuan", status);
  const query = params.toString();
  const hasil = await apiRequest(`/pengajuan${query ? `?${query}` : ""}`);
  return hasil.data;
}

// Isian yang dikirim mahasiswa, berurutan sesuai kelompok di form. Hanya isian yang sudah
// tampil di bagian "Identitas mahasiswa" (nama, NIM, prodi, email, nomor HP) yang dilewati;
// isian lain di kelompok yang sama (misalnya "Data alumni") tetap ditampilkan.
async function susunIsianFormulir(detail) {
  const isian = detail.isianFormulir;
  if (!isian || Object.keys(isian).length === 0) return null;

  try {
    const { data: layanan } = await apiRequest(`/layanan/${detail.idLayanan}`);
    const hasil = [];

    for (const kelompok of layanan.rincianFormulir ?? []) {
      for (const item of kelompok.isian) {
        if (kunciIdentitas(kelompok.judul, item.label) || adalahNomorHp(item.label)) continue;
        const label = item.labelTampilan ?? item.label;
        if (Object.hasOwn(isian, label)) hasil.push({ label, nilai: isian[label] });
      }
    }
    return hasil.length ? hasil : null;
  } catch {
    // Rincian layanan gagal diambil: tampilkan apa adanya.
    return Object.entries(isian).map(([label, nilai]) => ({ label, nilai }));
  }
}

// Detail satu pengajuan milik mahasiswa; null jika tidak ada. Dipakai halaman Detail,
// Lacak Status, dan Pengajuan Terkirim.
export async function ambilDetailPengajuanSaya(idPengajuan) {
  const detail = await nullJikaTidakAda(async () => (await apiRequest(`/pengajuan/${idPengajuan}`)).data);
  if (!detail) return null;

  const m = detail.mahasiswa;
  return {
    idPengajuan: detail.idPengajuan,
    kodePengajuan: detail.kodePengajuan,
    idLayanan: detail.idLayanan,
    namaLayanan: detail.namaLayanan,
    tanggalPengajuan: detail.tanggalPengajuan,
    statusPengajuan: detail.statusPengajuan,
    alasanPenolakan: detail.alasanPenolakan,
    identitas: {
      namaMahasiswa: m?.namaMahasiswa ?? "-",
      nim: m?.nim ?? "-",
      programStudi: m?.programStudi ?? "-",
      email: m?.email ?? "-",
      noHp: m?.nomorHp ?? ""
    },
    formulir: await susunIsianFormulir(detail), // [{ label, nilai }] atau null
    dokumen: (detail.lampiran ?? []).map((l) => ({
      idDokumenPengajuan: l.idDokumenPengajuan,
      namaDokumen: l.dokumenPersyaratan?.namaDokumen ?? "Lampiran",
      namaFile: l.namaFile,
      statusDokumen: l.statusDokumen
    })),
    riwayat: detail.riwayatStatus ?? [],
    dokumenHasil: detail.dokumenHasil // { idDokumenHasil, namaDokumen, tanggalUpload } atau null
  };
}

// [{ idNotifikasi, idPengajuan, kodePengajuan, namaLayanan, pesan, statusPengajuan, tanggalPerubahan, waktuPerubahan }]
export async function ambilNotifikasi() {
  const hasil = await apiRequest("/notifikasi");
  return hasil.data;
}
