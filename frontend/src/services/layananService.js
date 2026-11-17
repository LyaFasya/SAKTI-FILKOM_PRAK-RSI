import { apiRequest } from "./api.js";

// LYN-UC01
export async function ambilDaftarLayanan({ kataKunci = "", kategoriLayanan = "" } = {}) {
  const query = new URLSearchParams();
  if (kataKunci) query.set("kataKunci", kataKunci);
  if (kategoriLayanan) query.set("kategoriLayanan", kategoriLayanan);
  const teks = query.toString();
  const hasil = await apiRequest(`/layanan${teks ? `?${teks}` : ""}`);
  return hasil.data;
}

// LYN-UC03
export async function ambilDetailLayanan(idLayanan) {
  const hasil = await apiRequest(`/layanan/${idLayanan}`);
  return hasil.data;
}

// LYN-UC04 (bukan bagian NC), belum dipakai
export async function ambilPersyaratanLayanan(idLayanan) {
  const hasil = await apiRequest(`/layanan/${idLayanan}/persyaratan`);
  return hasil.data;
}

// LYN-UC02: backend cuma terima field informasiLayanan
export async function perbaruiInformasiLayanan(idLayanan, informasiLayanan) {
  const hasil = await apiRequest(`/layanan/${idLayanan}`, {
    method: "PATCH",
    body: { informasiLayanan }
  });
  return hasil.data;
}
