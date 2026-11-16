import { Router } from "express";
import {
  melihatRingkasanPengajuan,
  melihatDaftarPengajuan,
  melihatDetailPengajuan,
  melihatDataVerifikasi,
  menyimpanHasilVerifikasi,
  melihatBerkasPengajuan,
  melihatDokumenHasilStaf,
  mengunggahDokumenHasil,
  menyetujuiPengajuan,
  menolakPengajuan,
} from "../controllers/PengajuanStafController.js";
import { wajibLogin, khususStaf } from "../middlewares/authMiddleware.js";
import { menerimaDokumenHasil } from "../middlewares/unggahDokumenHasil.js";

const router = Router();

router.use(wajibLogin, khususStaf);
router.get("/ringkasan", melihatRingkasanPengajuan);
router.get("/", melihatDaftarPengajuan);
router.get("/:idPengajuan/verifikasi", melihatDataVerifikasi);
router.patch("/:idPengajuan/verifikasi/:idDokumenPengajuan", menyimpanHasilVerifikasi);
router.get("/:idPengajuan/berkas/:idDokumenPengajuan", melihatBerkasPengajuan);
router.get("/:idPengajuan/dokumen-hasil", melihatDokumenHasilStaf);
router.post("/:idPengajuan/dokumen-hasil", menerimaDokumenHasil, mengunggahDokumenHasil);
router.patch("/:idPengajuan/setujui", menyetujuiPengajuan);
router.patch("/:idPengajuan/tolak", menolakPengajuan);
router.get("/:idPengajuan", melihatDetailPengajuan);

export default router;
