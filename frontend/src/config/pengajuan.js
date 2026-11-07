import { STATUS_PENGAJUAN } from "./constants.js";

// Hasil pemeriksaan tiap lampiran (dipakai di halaman Detail dan Verifikasi).
export const HASIL_VERIFIKASI = {
  BELUM: "Belum Diverifikasi",
  SESUAI: "Sesuai",
  TIDAK_SESUAI: "Tidak Sesuai"
};

// Sementara tetap, karena API login belum mengirim nama staf.
export const NAMA_STAF = "Staf Kemahasiswaan";

// PDF, maksimal 10 MB (sesuai teks di desain halaman Persetujuan).
export const MAKS_UKURAN_DOKUMEN_HASIL = 10 * 1024 * 1024;

// Pengajuan yang sudah Disetujui atau Ditolak tidak bisa diproses lagi.
export function sudahDiputuskan(status) {
  return status === STATUS_PENGAJUAN.DISETUJUI || status === STATUS_PENGAJUAN.DITOLAK;
}
