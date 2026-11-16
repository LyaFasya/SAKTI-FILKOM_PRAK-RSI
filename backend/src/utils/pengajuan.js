export const STATUS_PENGAJUAN = [
  "Menunggu Verifikasi", "Diproses", "Disetujui", "Ditolak",
];

export function bacaId(nilai) {
  if (typeof nilai !== "string" || !/^[1-9]\d*$/.test(nilai)) return null;
  const id = Number(nilai);
  return Number.isSafeInteger(id) && id <= 2147483647 ? id : null;
}

// Semua kueri kode pengajuan memakai alias p untuk tabel Pengajuan.
export const KODE_PENGAJUAN_SQL = `
  CONCAT('PJN-', YEAR(p.tanggalPengajuan), '-',
    LPAD(p.idPengajuan, GREATEST(3, CHAR_LENGTH(p.idPengajuan)), '0'))
`;

const labelNomorHp = [
  "No. HP",
  "No. HP Pengaju",
  "Nomor HP/WA",
  "Nomor WhatsApp Pengaju",
  "Nomor WhatsApp Aktif",
  "NOMOR TELEPHONE",
];

export function ambilNomorHp(dataFormulir) {
  return labelNomorHp
    .map((label) => dataFormulir?.isian?.[label])
    .find((nilai) => typeof nilai === "string" && nilai.trim()) ?? null;
}

export function kodePengajuan({ idPengajuan, tanggalPengajuan }) {
  return `PJN-${tanggalPengajuan.slice(0, 4)}-${String(idPengajuan).padStart(3, "0")}`;
}

const formatWaktuWib = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Jakarta",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

export function ambilTanggalDanWaktuWib(sekarang = new Date()) {
  const bagian = Object.fromEntries(
    formatWaktuWib.formatToParts(sekarang).map(({ type, value }) => [type, value])
  );

  return {
    tanggal: `${bagian.year}-${bagian.month}-${bagian.day}`,
    waktu: `${bagian.hour}:${bagian.minute}:${bagian.second}`,
  };
}
