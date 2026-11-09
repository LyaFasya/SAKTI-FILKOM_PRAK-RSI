// DATA DUMMY milik DK, dipakai sampai backend punya endpoint pengajuan mahasiswa.
// Bentuk field mengikuti tabel Pengajuan, DokumenPengajuan, RiwayatStatus,
// DokumenHasil, dan Notifikasi di sql/schema.sql. Isinya disamakan dengan contoh di Figma.

export const profilDummy = {
  nim: "255150401111009",
  namaMahasiswa: "Nanda Purwa Apta Cahyarani",
  programStudi: "Sistem Informasi",
  noHp: ""
};

const EMAIL = "nanda@student.ub.ac.id";

function buat({ id, idLayanan, namaLayanan, tanggal, status, riwayat, dokumen, alasan = null, hasil = null, formulir = null }) {
  return {
    idPengajuan: id,
    idLayanan,
    namaLayanan,
    tanggalPengajuan: tanggal,
    statusPengajuan: status,
    alasanPenolakan: alasan,
    identitas: { ...profilDummy, email: EMAIL },
    // null = pengajuan lama yang isian formulirnya tidak ditampilkan (sesuai Figma).
    formulir,
    dokumen,
    riwayat: riwayat.map(([statusPengajuan, tanggalStatus, waktuStatus]) => ({
      statusPengajuan,
      tanggalStatus,
      waktuStatus
    })),
    dokumenHasil: hasil
  };
}

export const pengajuanSayaDummy = [
  buat({
    id: 1, idLayanan: 1, namaLayanan: "Surat Keterangan Aktif Mahasiswa", tanggal: "2026-10-20",
    status: "Menunggu Verifikasi",
    riwayat: [["Menunggu Verifikasi", "2026-10-20", "09:00:00"]],
    dokumen: [{ namaDokumen: "Kartu Tanda Mahasiswa (KTM)", namaFile: "Kartu_Tanda_Mahasiswa_KTM_.pdf", statusDokumen: "Belum Diverifikasi" }]
  }),
  buat({
    id: 2, idLayanan: 3, namaLayanan: "Rekomendasi lomba, beasiswa, atau PKL jalur kompetisi", tanggal: "2026-10-18",
    status: "Disetujui",
    riwayat: [["Menunggu Verifikasi", "2026-10-18", "09:00:00"], ["Diproses", "2026-10-19", "08:30:00"], ["Disetujui", "2026-10-19", "10:15:00"]],
    dokumen: [{ namaDokumen: "Surat permohonan rekomendasi", namaFile: "Surat_permohonan_rekomendasi.pdf", statusDokumen: "Sesuai" }],
    hasil: { namaDokumen: "Surat_rekomendasi.pdf" }
  }),
  buat({
    id: 3, idLayanan: 2, namaLayanan: "Dispensasi lomba atau kegiatan", tanggal: "2026-10-16",
    status: "Ditolak",
    alasan: "Bukti kegiatan belum terbaca dengan jelas sehingga keterangan keikutsertaan belum dapat diverifikasi.",
    riwayat: [["Menunggu Verifikasi", "2026-10-16", "10:20:00"], ["Diproses", "2026-10-17", "08:00:00"], ["Ditolak", "2026-10-17", "09:40:00"]],
    dokumen: [
      { namaDokumen: "Kartu Tanda Mahasiswa (KTM)", namaFile: "Kartu_Tanda_Mahasiswa_KTM_.pdf", statusDokumen: "Tidak Sesuai" },
      { namaDokumen: "Bukti kegiatan untuk permohonan dispensasi", namaFile: "Bukti_kegiatan_untuk_permohonan_dispensasi.pdf", statusDokumen: "Tidak Sesuai" }
    ]
  }),
  buat({
    id: 4, idLayanan: 4, namaLayanan: "Proposal kegiatan dan bantuan dana", tanggal: "2026-10-20",
    status: "Diproses",
    riwayat: [["Menunggu Verifikasi", "2026-10-20", "08:10:00"], ["Diproses", "2026-10-20", "09:00:00"]],
    dokumen: [{ namaDokumen: "Proposal kegiatan", namaFile: "Proposal_kegiatan.pdf", statusDokumen: "Sesuai" }]
  })
];

export const notifikasiDummy = [
  { idNotifikasi: 1, idPengajuan: 2, pesan: "Pengajuan disetujui. Dokumen hasil tersedia dan dikirim melalui email.", statusPengajuan: "Disetujui", tanggalPerubahan: "2026-10-19", waktuPerubahan: "10:15:00", statusPengirimanEmail: "Berhasil", keteranganEmail: null },
  { idNotifikasi: 2, idPengajuan: 3, pesan: "Pengajuan ditolak. Dokumen KTM tidak terbaca dengan jelas sehingga identitas belum dapat diverifikasi.", statusPengajuan: "Ditolak", tanggalPerubahan: "2026-10-17", waktuPerubahan: "09:40:00", statusPengirimanEmail: "Berhasil", keteranganEmail: null },
  { idNotifikasi: 3, idPengajuan: 4, pesan: "Pengajuan sedang diproses oleh Staf Kemahasiswaan.", statusPengajuan: "Diproses", tanggalPerubahan: "2026-10-20", waktuPerubahan: "09:00:00", statusPengirimanEmail: "Berhasil", keteranganEmail: null }
];
