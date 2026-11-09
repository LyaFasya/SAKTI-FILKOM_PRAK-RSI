import { Router } from "express";
import {
  melihatRekapitulasiPengajuan,
  mengunduhRekapitulasiPengajuan,
} from "../controllers/RekapitulasiController.js";
import { wajibLogin, khususStaf } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", wajibLogin, khususStaf, melihatRekapitulasiPengajuan);
router.get("/unduh", wajibLogin, khususStaf, mengunduhRekapitulasiPengajuan);

export default router;