import { Router } from "express";

import {
  melihatDaftarLayanan,
  melihatDetailLayanan,
  melihatPersyaratanLayanan,
  memperbaruiInformasiLayanan,
  memperbaruiPersyaratanLayanan,
} from "../controllers/LayananController.js";

import {
  wajibLogin,
  khususStaf,
} from "../middlewares/authMiddleware.js";

const router = Router();

router.use(wajibLogin);

router.get("/", melihatDaftarLayanan);

router.get(
  "/:idLayanan/persyaratan",
  melihatPersyaratanLayanan
);

router.get("/:idLayanan", melihatDetailLayanan);

router.patch(
  "/:idLayanan",
  khususStaf,
  memperbaruiInformasiLayanan
);

router.patch(
  "/:idLayanan/persyaratan",
  khususStaf,
  memperbaruiPersyaratanLayanan
);

export default router;