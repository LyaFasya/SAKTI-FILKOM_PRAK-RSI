// Nilai status harus PERSIS sama dengan yang ada di database (tabel Pengajuan).
export const STATUS_PENGAJUAN = {
  MENUNGGU_VERIFIKASI: "Menunggu Verifikasi",
  DIPROSES: "Diproses",
  DISETUJUI: "Disetujui",
  DITOLAK: "Ditolak"
};

export const DAFTAR_STATUS = Object.values(STATUS_PENGAJUAN);

// Nilai kolom role pada tabel Akun. "staf" sudah dipastikan dari backend.
// Nilai untuk mahasiswa belum terlihat di kode backend, cek lagi dengan RF.
export const ROLE = {
  STAF: "staf",
  MAHASISWA: "mahasiswa"
};
