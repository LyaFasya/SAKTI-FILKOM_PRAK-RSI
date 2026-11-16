import { ambilDetailPengajuan } from "../services/pengajuanService.js";
import useAmbilData from "./useAmbilData.js";

// Ubah `versi` untuk ambil ulang data (mis. habis simpan verifikasi)
export default function useDetailPengajuan(idPengajuan, versi = 0) {
  return useAmbilData(() => ambilDetailPengajuan(idPengajuan), [idPengajuan, versi]);
}
