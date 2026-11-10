// DATA DUMMY sementara, sampai backend RF punya endpoint pengajuan.
// Isinya sengaja disamakan dengan contoh di desain Figma Dashboard Staf.
// Nama field mengikuti tabel Pengajuan, Mahasiswa, dan Layanan di sql/schema.sql.
// Saat endpoint sudah ada, cukup ubah isi pengajuanService.js; halaman tidak perlu diubah.
// Urutan array = urutan tampil di dropdown dan bar Dashboard (sesuai desain Figma).
export const layananDummy = [
  { idLayanan: 4, namaLayanan: "Proposal kegiatan dan bantuan dana" },
  { idLayanan: 2, namaLayanan: "Rekomendasi lomba, beasiswa, atau PKL jalur kompetisi" },
  { idLayanan: 1, namaLayanan: "Surat Keterangan Aktif Mahasiswa" },
  { idLayanan: 5, namaLayanan: "Laporan pertanggungjawaban kegiatan (LPJ)" },
  { idLayanan: 3, namaLayanan: "Dispensasi lomba atau kegiatan" },
  { idLayanan: 6, namaLayanan: "Bimbingan dan konseling" }
];

const nama = (idLayanan) =>
  layananDummy.find((l) => l.idLayanan === idLayanan).namaLayanan;

export const pengajuanDummy = [
  { idPengajuan: 1, nim: "255150401111009", namaMahasiswa: "Nanda Purwa Apta Cahyarani", idLayanan: 1, namaLayanan: nama(1), tanggalPengajuan: "2026-10-20", statusPengajuan: "Menunggu Verifikasi", alasanPenolakan: null },
  { idPengajuan: 2, nim: "255150401111009", namaMahasiswa: "Nanda Purwa Apta Cahyarani", idLayanan: 2, namaLayanan: nama(2), tanggalPengajuan: "2026-10-18", statusPengajuan: "Disetujui", alasanPenolakan: null },
  { idPengajuan: 3, nim: "255150401111009", namaMahasiswa: "Nanda Purwa Apta Cahyarani", idLayanan: 3, namaLayanan: nama(3), tanggalPengajuan: "2026-10-16", statusPengajuan: "Ditolak", alasanPenolakan: "karena berkas yang diberikan tidak sesuai dengan arahan. silahkan unggah kembali dokumen sesuai dengan yang ada di persyaratan layanan" },
  { idPengajuan: 4, nim: "255150401111009", namaMahasiswa: "Nanda Purwa Apta Cahyarani", idLayanan: 4, namaLayanan: nama(4), tanggalPengajuan: "2026-10-20", statusPengajuan: "Diproses", alasanPenolakan: null },
  { idPengajuan: 5, nim: "255150400000001", namaMahasiswa: "Mahasiswa Contoh", idLayanan: 5, namaLayanan: nama(5), tanggalPengajuan: "2026-10-19", statusPengajuan: "Menunggu Verifikasi", alasanPenolakan: null }
];

const dok = (idDokumen, jenisDokumen, namaFile, hasilVerifikasi) => ({
  idDokumen, jenisDokumen, namaFile, wajib: true, hasilVerifikasi
});

// Kunci = idPengajuan
export const lampiranDummy = {
  1: [dok(11, "Kartu Tanda Mahasiswa (KTM)", "Kartu_Tanda_Mahasiswa_KTM_.pdf", "Belum Diverifikasi")],
  2: [dok(21, "Surat permohonan rekomendasi", "Surat_Permohonan_Rekomendasi.pdf", "Sesuai")],
  3: [dok(31, "Bukti undangan atau surat tugas lomba", "Bukti_Undangan_Lomba.pdf", "Tidak Sesuai")],
  4: [dok(41, "Proposal kegiatan beserta RAB", "Proposal_kegiatan_beserta_RAB.pdf", "Tidak Sesuai")],
  5: [
    dok(51, "Laporan pelaksanaan kegiatan", "Laporan_pelaksanaan_kegiatan.pdf", "Belum Diverifikasi"),
    dok(52, "Laporan keuangan dan bukti pengeluaran", "Laporan_keuangan_dan_bukti_pengeluaran.pdf", "Belum Diverifikasi"),
    dok(53, "Dokumentasi kegiatan", "Dokumentasi_kegiatan.pdf", "Belum Diverifikasi"),
    dok(54, "Salinan surat tugas dan/atau sertifikat kegiatan", "Salinan_surat_tugas_dan_atau_sertifikat_kegiatan.pdf", "Belum Diverifikasi")
  ]
};

// Keputusan akhir (hanya untuk pengajuan Disetujui atau Ditolak). Kunci = idPengajuan
export const keputusanDummy = {
  2: { diputuskanOleh: "Staf Kemahasiswaan", waktu: "2026-10-25T00:59:00", dokumenHasil: "Surat_Rekomendasi.pdf" },
  3: { diputuskanOleh: "Staf Kemahasiswaan", waktu: "2026-10-25T01:04:00", dokumenHasil: null }
};
