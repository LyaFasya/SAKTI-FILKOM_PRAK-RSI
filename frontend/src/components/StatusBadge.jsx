import { STATUS_PENGAJUAN } from "../config/constants.js";

const KELAS = {
  [STATUS_PENGAJUAN.MENUNGGU_VERIFIKASI]: "badge--menunggu",
  [STATUS_PENGAJUAN.DIPROSES]: "badge--diproses",
  [STATUS_PENGAJUAN.DISETUJUI]: "badge--disetujui",
  [STATUS_PENGAJUAN.DITOLAK]: "badge--ditolak"
};

// Lencana status pengajuan. Pakai di mana pun status ditampilkan.
export default function StatusBadge({ status }) {
  return <span className={`badge ${KELAS[status] ?? ""}`}>{status}</span>;
}
