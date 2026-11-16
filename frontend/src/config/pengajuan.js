import { STATUS_PENGAJUAN } from "./constants.js";

export const HASIL_VERIFIKASI = {
  BELUM: "Belum Diverifikasi",
  SESUAI: "Sesuai",
  TIDAK_SESUAI: "Tidak Sesuai"
};

// Sementara tetap, API login belum kirim nama staf
export const NAMA_STAF = "Staf Kemahasiswaan";

// PDF maks 10 MB
export const MAKS_UKURAN_DOKUMEN_HASIL = 10 * 1024 * 1024;

// Disetujui / Ditolak = final
export function sudahDiputuskan(status) {
  return status === STATUS_PENGAJUAN.DISETUJUI || status === STATUS_PENGAJUAN.DITOLAK;
}
