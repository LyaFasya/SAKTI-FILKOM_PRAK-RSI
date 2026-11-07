import { HASIL_VERIFIKASI } from "../../config/pengajuan.js";

const KELAS = {
  [HASIL_VERIFIKASI.BELUM]: "hasil-pill--belum",
  [HASIL_VERIFIKASI.SESUAI]: "hasil-pill--sesuai",
  [HASIL_VERIFIKASI.TIDAK_SESUAI]: "hasil-pill--tidak"
};

// Lencana hasil pemeriksaan satu lampiran: Belum Diverifikasi / Sesuai / Tidak Sesuai.
export default function HasilBadge({ hasil }) {
  return <span className={`hasil-pill ${KELAS[hasil] ?? ""}`}>{hasil}</span>;
}
