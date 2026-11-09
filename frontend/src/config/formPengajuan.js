// Konstanta khusus form pengajuan mahasiswa (PGJ-UI01 sampai PGJ-UI03).
// File ini milik DK.

export const PROGRAM_STUDI = [
  "Teknik Informatika",
  "Teknik Komputer",
  "Sistem Informasi",
  "Teknologi Informasi",
  "Pendidikan Teknologi Informasi",
  "Ilmu Komputer"
];

export const PERAN_KEGIATAN = ["Peserta", "MC", "Juri", "Pemateri", "Panitia", "Other"];

// Teks tampilan di form jika berbeda dari nilai yang disimpan.
export const LABEL_PERAN = { MC: "MC (Master of Ceremony)" };

const MB = 1024 * 1024;

// PERHATIAN: sketsa UI (PGJ-UI01) menyebut lampiran wajib = spreadsheet (maks 1 MB)
// dan pendukung = PDF (maks 10 MB), tetapi sql/schema.sql membatasi formatFile hanya
// 'PDF' dan ukuran maks 10 MB. Selisih ini perlu diputuskan bersama RF.
// Ubah aturan format dan ukuran di sini saja.
export const ATURAN_FILE = {
  wajib: {
    ekstensi: [".xlsx", ".xls", ".csv"],
    label: "Spreadsheet (Excel)",
    pesanFormat: "spreadsheet (XLSX, XLS, atau CSV)",
    maksUkuran: 1 * MB
  },
  opsional: {
    ekstensi: [".pdf"],
    label: "PDF",
    pesanFormat: "PDF",
    maksUkuran: 10 * MB
  }
};

// Keterangan di bawah judul slot unggah. Kuncinya idDokumen; dokumen dari
// database yang tidak terdaftar di sini hanya menampilkan baris format file.
export const DESKRIPSI_DOKUMEN = {
  lampiran: "Daftar nama anggota dan mata kuliah yang diajukan dispensasi. Gunakan format MS Excel / spreadsheet.",
  pendukung: "Bukti pendukung berupa undangan / surat tugas / dokumen lain."
};

// Label status tiap dokumen yang dilampirkan (kolom statusDokumen).
export const STATUS_DOKUMEN = {
  BELUM: "Belum Diverifikasi",
  SESUAI: "Sesuai",
  TIDAK_SESUAI: "Tidak Sesuai"
};

export const KELAS_STATUS_DOKUMEN = {
  [STATUS_DOKUMEN.BELUM]: "badge--netral",
  [STATUS_DOKUMEN.SESUAI]: "badge--disetujui",
  [STATUS_DOKUMEN.TIDAK_SESUAI]: "badge--ditolak"
};
