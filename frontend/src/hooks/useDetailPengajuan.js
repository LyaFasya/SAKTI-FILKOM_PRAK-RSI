import { ambilDetailPengajuan } from "../services/pengajuanService.js";
import useAmbilData from "./useAmbilData.js";

// Mengambil detail satu pengajuan. Ubah `versi` untuk memaksa data diambil ulang
// (misalnya setelah menyimpan hasil verifikasi).
export default function useDetailPengajuan(idPengajuan, versi = 0) {
  return useAmbilData(() => ambilDetailPengajuan(idPengajuan), [idPengajuan, versi]);
}
