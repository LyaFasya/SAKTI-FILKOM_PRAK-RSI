// MASIH MEMAKAI DATA DUMMY. Backend belum punya endpoint pengajuan.
// Bentuk nilai kembalian sengaja dibuat mirip dengan yang kemungkinan dikirim backend.
// Nanti ganti isi fungsi dengan apiRequest(...); komponen yang memanggilnya tidak berubah.
import { pengajuanDummy } from "../mocks/pengajuan.js";
import { DAFTAR_STATUS } from "../config/constants.js";

const tunda = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

function saring(daftar, { status, idLayanan, kataKunci } = {}) {
  const kunci = kataKunci?.trim().toLowerCase();

  return daftar.filter((item) => {
    if (status && item.statusPengajuan !== status) return false;
    if (idLayanan && item.idLayanan !== Number(idLayanan)) return false;
    if (
      kunci &&
      !`${item.namaMahasiswa} ${item.nim} ${item.idPengajuan}`
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

// PJN-UC08: detail satu pengajuan
export async function ambilDetailPengajuan(idPengajuan) {
  await tunda();
  return (
    pengajuanDummy.find((item) => item.idPengajuan === Number(idPengajuan)) ??
    null
  );
}
