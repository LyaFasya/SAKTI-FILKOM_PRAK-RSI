// Harus persis sama dengan nilai di database
export const STATUS_PENGAJUAN = {
  MENUNGGU_VERIFIKASI: "Menunggu Verifikasi",
  DIPROSES: "Diproses",
  DISETUJUI: "Disetujui",
  DITOLAK: "Ditolak"
};

export const DAFTAR_STATUS = Object.values(STATUS_PENGAJUAN);

// Role di tabel Akun
// TODO: cek nilai role mahasiswa ke RF
export const ROLE = {
  STAF: "staf",
  MAHASISWA: "mahasiswa"
};
