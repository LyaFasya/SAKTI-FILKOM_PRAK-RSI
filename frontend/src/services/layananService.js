
import { apiRequest } from "./api.js";

// LYN-UC01: Melihat daftar layanan
export async function ambilDaftarLayanan({
  kataKunci = "",
  kategoriLayanan = "",
} = {}) {
  const query = new URLSearchParams();

  if (kataKunci) query.set("kataKunci", kataKunci);
  if (kategoriLayanan) query.set("kategoriLayanan", kategoriLayanan);

  const teks = query.toString();
  const hasil = await apiRequest(
    `/layanan${teks ? `?${teks}` : ""}`
  );

  return hasil.data;
}

// LYN-UC03: Melihat detail layanan
export async function ambilDetailLayanan(idLayanan) {
  const hasil = await apiRequest(`/layanan/${idLayanan}`);
  return hasil.data;
}

// LYN-UC04: Melihat persyaratan layanan
export async function ambilPersyaratanLayanan(idLayanan) {
  const hasil = await apiRequest(
    `/layanan/${idLayanan}/persyaratan`
  );

  return hasil.data;
}

// LYN-UC02: Memperbarui informasi layanan
export async function perbaruiInformasiLayanan(
  idLayanan,
  informasiLayanan
) {
  const hasil = await apiRequest(`/layanan/${idLayanan}`, {
    method: "PATCH",
    body: { informasiLayanan },
  });

  return hasil.data;
}

// LYN-UC04: Memperbarui persyaratan layanan
export async function perbaruiPersyaratanLayanan(
  idLayanan,
  dataPersyaratan
) {
  const hasil = await apiRequest(
    `/layanan/${idLayanan}/persyaratan`,
    {
      method: "PATCH",
      body: dataPersyaratan,
    }
  );

  return hasil.data;
}