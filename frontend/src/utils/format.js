// Fungsi kecil untuk menampilkan data pengajuan sesuai desain.

// "2026-10-20" -> "20/10/2026"
export function formatTanggal(isoTanggal) {
  if (!isoTanggal) return "-";
  const [tahun, bulan, hari] = isoTanggal.split("-");
  return `${hari}/${bulan}/${tahun}`;
}

// idPengajuan 1 + tanggal 2026-10-20 -> "PJN-2026-001"
// CATATAN: format kode ini ditebak dari desain Figma. Cek dengan RF apakah backend
// punya kolom kode sendiri; kalau ada, pakai itu dan hapus fungsi ini.
export function kodePengajuan(pengajuan) {
  const tahun = pengajuan.tanggalPengajuan?.slice(0, 4) ?? "----";
  return `PJN-${tahun}-${String(pengajuan.idPengajuan).padStart(3, "0")}`;
}

// 2 -> "02"
export function duaDigit(angka) {
  return String(angka).padStart(2, "0");
}

// "2026-10-25T00:59:00" -> "25 Oktober 2026 pukul 00.59"
export function formatWaktuKeputusan(isoWaktu) {
  if (!isoWaktu) return "-";
  const waktu = new Date(isoWaktu);
  const tanggal = waktu.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const jam = waktu.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  return `${tanggal} pukul ${jam}`;
}

// 1234567 -> "1,2 MB"
export function formatUkuranBerkas(byte) {
  if (byte < 1024 * 1024) return `${Math.max(1, Math.round(byte / 1024))} KB`;
  return `${(byte / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}
