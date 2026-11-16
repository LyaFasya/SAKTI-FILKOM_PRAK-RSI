// Konstanta khusus form pengajuan mahasiswa. File ini milik DK.
// Struktur form (kelompok, isian, lampiran) datang dari backend lewat
// GET /api/layanan/:id -> rincianFormulir, jadi di sini hanya ada aturan tampilan.

export const PROGRAM_STUDI = [
  "Teknik Informatika",
  "Teknik Komputer",
  "Sistem Informasi",
  "Teknologi Informasi",
  "Pendidikan Teknologi Informasi",
  "Ilmu Komputer"
];

// Kelompok yang isiannya diisi otomatis oleh backend dari akun mahasiswa.
export const KELOMPOK_IDENTITAS = ["Identitas dan kontak", "Data alumni"];

// Label isian -> kunci profil. Salinan dari services/formulirPengajuan.js di backend.
// Label lain di kelompok identitas (misalnya No. HP) tetap diisi mahasiswa.
const LABEL_IDENTITAS = new Map([
  ["nama mahasiswa", "namaMahasiswa"], ["nama pengaju", "namaMahasiswa"], ["nama lengkap dan gelar", "namaMahasiswa"],
  ["nim mahasiswa", "nim"], ["nim pengaju", "nim"], ["nim", "nim"],
  ["asal prodi", "programStudi"], ["program studi", "programStudi"], ["prodi", "programStudi"], ["prodi pengaju", "programStudi"],
  ["email", "email"], ["email pengaju", "email"], ["alamat email", "email"], ["email aktif", "email"]
]);

// Label nomor HP yang ditampilkan di bagian identitas (sama dengan utils/pengajuan.js di backend).
const LABEL_NOMOR_HP = new Set([
  "no. hp", "no. hp pengaju", "nomor hp/wa", "nomor whatsapp pengaju", "nomor whatsapp aktif", "nomor telephone"
]);
export const adalahNomorHp = (label) => LABEL_NOMOR_HP.has(label.toLowerCase());

export function kunciIdentitas(judulKelompok, label) {
  return KELOMPOK_IDENTITAS.includes(judulKelompok) ? LABEL_IDENTITAS.get(label.toLowerCase()) : undefined;
}

// Format file yang diterima backend (services/formulirPengajuan.js). Kunci = dokumen.format.
const GAMBAR = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
export const FORMAT_FILE = {
  "PDF": [".pdf"],
  "PDF atau gambar": [".pdf", ...GAMBAR],
  "PDF atau dokumen Word": [".pdf", ".doc", ".docx"],
  "Spreadsheet (Excel)": [".xls", ".xlsx"],
  "Berkas": [".pdf", ...GAMBAR, ".doc", ".docx", ".xls", ".xlsx"]
};

// Petunjuk singkat di bawah label (teks dari Figma; backend tidak menyediakannya).
const PETUNJUK = [
  [/^email$/i, "Cantumkan email UB yang aktif."],
  [/^email\b/i, "Cantumkan email yang aktif."],
  [/\b(no\.?\s?hp|nomor\s(hp|whatsapp)|no\.?\s?whatsapp)/i, "Cantumkan nomor WhatsApp yang aktif."],
  [/^lokasi kegiatan/i, "Nama tempat / kota / negara pelaksanaan kegiatan."],
  [/^(other response|topik lainnya)/i, "Isi pilihan lainnya."]
];

export function petunjukIsian(label) {
  return PETUNJUK.find(([pola]) => pola.test(label))?.[1];
}

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
