import express from "express";
import layananRoutes from "./routes/layananRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import sessionMiddleware from "./config/session.js";
import rekapitulasiRoutes from "./routes/rekapitulasiRoutes.js";
import pengajuanStafRoutes from "./routes/pengajuanStafRoutes.js";

import pengajuanMahasiswaRoutes from "./routes/pengajuanMahasiswaRoutes.js";
import { melihatNotifikasi } from "./controllers/PengajuanMahasiswaController.js";
import { wajibLogin, khususMahasiswa } from "./middlewares/authMiddleware.js";

const app = express();

app.use(sessionMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API SAKTI FILKOM berjalan.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/layanan", layananRoutes);
app.use("/api/rekapitulasi", rekapitulasiRoutes);
app.use("/api/pengajuan/staf", pengajuanStafRoutes);
app.use("/api/pengajuan", pengajuanMahasiswaRoutes);
app.get("/api/notifikasi", wajibLogin, khususMahasiswa, melihatNotifikasi);

app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint tidak ditemukan.",
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  const status = error.status === 400 ? 400 : 500;

  res.status(status).json({
    message:
      status === 400
        ? "Format permintaan tidak valid."
        : "Terjadi kesalahan pada server.",
  });
});

export default app;