import { HASIL_VERIFIKASI } from "../../config/pengajuan.js";

const KELAS = {
  [HASIL_VERIFIKASI.BELUM]: "hasil-pill--belum",
  [HASIL_VERIFIKASI.SESUAI]: "hasil-pill--sesuai",
  [HASIL_VERIFIKASI.TIDAK_SESUAI]: "hasil-pill--tidak"
};

// Badge hasil periksa satu lampiran
export default function HasilBadge({ hasil }) {
  return <span className={`hasil-pill ${KELAS[hasil] ?? ""}`}>{hasil}</span>;
}
