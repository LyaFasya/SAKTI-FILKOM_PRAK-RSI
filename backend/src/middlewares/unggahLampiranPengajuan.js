import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import multer from "multer";
import { batasUkuranLampiranMb } from "../services/formulirPengajuan.js";

const MB = 1024 * 1024;
const BATAS_REQUEST = 210 * MB;

export async function menerimaLampiranPengajuan(req, res, next) {
  if (!req.is("multipart/form-data")) {
    return res.status(415).json({ message: "Gunakan multipart/form-data untuk mengirim pengajuan." });
  }

  if (Number(req.get("content-length")) > BATAS_REQUEST) {
    return res.status(413).json({ message: "Ukuran total unggahan melebihi 210 MB." });
  }

  try {
    req.direktoriLampiran = await mkdtemp(join(tmpdir(), "sakti-lampiran-"));
    const bersihkan = () => rm(req.direktoriLampiran, { recursive: true, force: true })
      .catch((error) => console.error("Direktori sementara gagal dibersihkan.", error.message));

    res.once("finish", bersihkan);
    res.once("close", bersihkan);

    const unggah = multer({
      storage: multer.diskStorage({
        destination: (request, file, callback) => callback(null, request.direktoriLampiran),
      }),
      limits: {
        files: 30,
        fields: 3,
        fieldSize: 128 * 1024,
        fileSize: batasUkuranLampiranMb(100) * MB + 1,
      },
    }).any();

    unggah(req, res, (error) => {
      if (!error) {
        const total = req.files.reduce((jumlah, { size }) => jumlah + size, 0);
        if (total > BATAS_REQUEST) {
          return res.status(413).json({ message: "Ukuran total unggahan melebihi 210 MB." });
        }

        return next();
      }

      if (error instanceof multer.MulterError) {
        return res.status(error.code === "LIMIT_FILE_SIZE" ? 413 : 400).json({
          message: error.code === "LIMIT_FILE_SIZE"
            ? "Ukuran lampiran melebihi batas unggahan."
            : "Jumlah berkas atau ukuran data formulir melebihi batas.",
        });
      }

      if (!error.code) {
        return res.status(400).json({ message: "Format unggahan tidak valid." });
      }

      return next(error);
    });
  } catch (error) {
    return next(error);
  }
}
