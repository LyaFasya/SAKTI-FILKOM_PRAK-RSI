import { apiRequest } from "./api.js";

// Semua fungsi di sini memanggil API asli milik RF (branch feat/backend-foundation).
// Respons backend berbentuk { message, data }, jadi yang dikembalikan adalah `data`.

// GET /api/layanan?kataKunci=&kategoriLayanan=
// Filter bersifat opsional. Tanpa argumen, semua layanan dikembalikan.
export async function ambilDaftarLayanan({ kataKunci = "", kategoriLayanan = "" } = {}) {
  const query = new URLSearchParams();
  if (kataKunci) query.set("kataKunci", kataKunci);
  if (kategoriLayanan) query.set("kategoriLayanan", kategoriLayanan);
  const teks = query.toString();
  const hasil = await apiRequest(`/layanan${teks ? `?${teks}` : ""}`);
  return hasil.data;
}

// GET /api/layanan/:id
export async function ambilDetailLayanan(idLayanan) {
  const hasil = await apiRequest(`/layanan/${idLayanan}`);
  return hasil.data;
}

// GET /api/layanan/:id/persyaratan
// data: { ...layanan, persyaratan: [...], dokumenPersyaratan: [...] }
export async function ambilPersyaratanLayanan(idLayanan) {
  const hasil = await apiRequest(`/layanan/${idLayanan}/persyaratan`);
  return hasil.data;
}

// PATCH /api/layanan/:id  (khusus staf)
// Saat ini backend HANYA menerima field "informasiLayanan".
export async function perbaruiInformasiLayanan(idLayanan, informasiLayanan) {
  const hasil = await apiRequest(`/layanan/${idLayanan}`, {
    method: "PATCH",
    body: { informasiLayanan }
  });
  return hasil.data;
}
