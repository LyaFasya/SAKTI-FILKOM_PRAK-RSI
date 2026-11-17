// Fungsi format tampilan untuk halaman pengajuan mahasiswa (milik DK).

// idPengajuan di database berupa angka. Di layar ditampilkan seperti PJN-2026-006.
export function formatIdPengajuan(idPengajuan, tanggal) {
  const tahun = tanggal ? String(tanggal).slice(0, 4) : new Date().getFullYear();
  return `PJN-${tahun}-${String(idPengajuan).padStart(3, "0")}`;
}

function ubahKeTanggal(tanggal) {
  return new Date(`${String(tanggal).slice(0, 10)}T00:00:00`);
}

// "2026-11-03" -> "3 November 2026"
export function formatTanggal(tanggal) {
  if (!tanggal) return "-";
  const nilai = ubahKeTanggal(tanggal);
  if (Number.isNaN(nilai.getTime())) return String(tanggal);
  return nilai.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

// "2026-10-16" -> "16/10/2026"
export function formatTanggalPendek(tanggal) {
  if (!tanggal) return "-";
  const [tahun, bulan, hari] = String(tanggal).slice(0, 10).split("-");
  return tahun && bulan && hari ? `${hari}/${bulan}/${tahun}` : String(tanggal);
}

// "14:05:30" -> "14.05"
export function formatWaktu(waktu) {
  return waktu ? String(waktu).slice(0, 5).replace(":", ".") : "";
}

// ("2026-10-16", "10:20:00") -> "16 Oktober 2026 · 10.20"
export function formatTanggalWaktu(tanggal, waktu) {
  const jam = formatWaktu(waktu);
  return jam ? `${formatTanggal(tanggal)} · ${jam}` : formatTanggal(tanggal);
}

export function formatUkuranFile(byte) {
  if (byte < 1024) return `${byte} B`;
  if (byte < 1024 * 1024) return `${(byte / 1024).toFixed(0)} KB`;
  return `${(byte / (1024 * 1024)).toFixed(1)} MB`;
}

// 43520 -> "0.04 MB" (format di kartu file terpilih pada Figma)
export function formatUkuranMB(byte) {
  return `${(byte / (1024 * 1024)).toFixed(2)} MB`;
}

// 1048576 -> "1 MB"
export function formatBatasMB(byte) {
  return `${Number((byte / (1024 * 1024)).toFixed(1))} MB`;
}

// Pesan notifikasi yang ditampilkan ke mahasiswa. Untuk status Disetujui teksnya dibakukan di sini
// supaya notifikasi lama (yang sudah tersimpan di database) ikut memakai kalimat yang sama.
export const PESAN_NOTIFIKASI_DISETUJUI =
  "Pengajuan disetujui. Dokumen hasil tersedia dan dikirim melalui email. Silahkan cek inbox atau folder spam.";

export function pesanNotifikasi({ statusPengajuan, pesan }) {
  return statusPengajuan === "Disetujui" ? PESAN_NOTIFIKASI_DISETUJUI : pesan;
}
