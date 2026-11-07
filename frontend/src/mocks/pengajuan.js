// DATA DUMMY sementara, sampai backend RF punya endpoint pengajuan.
// Nama field mengikuti tabel Pengajuan, Akun/Mahasiswa, dan Layanan di sql/schema.sql.
// Saat endpoint sudah ada, cukup ubah isi pengajuanService.js; halaman tidak perlu diubah.
export const layananDummy = [
  { idLayanan: 1, namaLayanan: "Surat Keterangan Aktif Kuliah" },
  { idLayanan: 2, namaLayanan: "Legalisir Ijazah" },
  { idLayanan: 3, namaLayanan: "Surat Rekomendasi Beasiswa" }
];

export const pengajuanDummy = [
  { idPengajuan: 101, nim: "255150401111001", namaMahasiswa: "Contoh Mahasiswa A", idLayanan: 1, namaLayanan: "Surat Keterangan Aktif Kuliah", tanggalPengajuan: "2026-11-03", statusPengajuan: "Menunggu Verifikasi", alasanPenolakan: null },
  { idPengajuan: 102, nim: "255150401111002", namaMahasiswa: "Contoh Mahasiswa B", idLayanan: 2, namaLayanan: "Legalisir Ijazah", tanggalPengajuan: "2026-11-03", statusPengajuan: "Diproses", alasanPenolakan: null },
  { idPengajuan: 103, nim: "255150401111003", namaMahasiswa: "Contoh Mahasiswa C", idLayanan: 1, namaLayanan: "Surat Keterangan Aktif Kuliah", tanggalPengajuan: "2026-11-02", statusPengajuan: "Disetujui", alasanPenolakan: null },
  { idPengajuan: 104, nim: "255150401111004", namaMahasiswa: "Contoh Mahasiswa D", idLayanan: 3, namaLayanan: "Surat Rekomendasi Beasiswa", tanggalPengajuan: "2026-11-01", statusPengajuan: "Ditolak", alasanPenolakan: "Dokumen transkrip tidak terbaca." },
  { idPengajuan: 105, nim: "255150401111005", namaMahasiswa: "Contoh Mahasiswa E", idLayanan: 2, namaLayanan: "Legalisir Ijazah", tanggalPengajuan: "2026-10-31", statusPengajuan: "Menunggu Verifikasi", alasanPenolakan: null },
  { idPengajuan: 106, nim: "255150401111006", namaMahasiswa: "Contoh Mahasiswa F", idLayanan: 1, namaLayanan: "Surat Keterangan Aktif Kuliah", tanggalPengajuan: "2026-10-30", statusPengajuan: "Disetujui", alasanPenolakan: null }
];
