import { Router } from "express";
import {
  melihatProfilMahasiswa,
  mengirimPengajuan,
  melihatPengajuanSaya,
  melihatDetailPengajuanSaya,
  melacakStatusPengajuan,
  mengunduhDokumenHasil,
} from "../controllers/PengajuanMahasiswaController.js";
import { wajibLogin, khususMahasiswa } from "../middlewares/authMiddleware.js";
import { menerimaLampiranPengajuan } from "../middlewares/unggahLampiranPengajuan.js";

const router = Router();

router.use(wajibLogin, khususMahasiswa);
router.get("/profil", melihatProfilMahasiswa);
router.get("/", melihatPengajuanSaya);
router.post("/", menerimaLampiranPengajuan, mengirimPengajuan);
router.get("/:idPengajuan/status", melacakStatusPengajuan);
router.get("/:idPengajuan/dokumen-hasil", mengunduhDokumenHasil);
router.get("/:idPengajuan", melihatDetailPengajuanSaya);

export default router;
