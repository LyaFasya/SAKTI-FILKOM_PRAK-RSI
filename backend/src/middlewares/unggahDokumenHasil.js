import multer from "multer";

export const MAKS_UKURAN_DOKUMEN_HASIL = 10 * 1024 * 1024;

const unggah = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAKS_UKURAN_DOKUMEN_HASIL + 1, files: 1, fields: 0 },
}).single("dokumenHasil");

export function menerimaDokumenHasil(req, res, next) {
  unggah(req, res, (error) => {
    if (error?.code === "LIMIT_FILE_SIZE" || req.file?.size > MAKS_UKURAN_DOKUMEN_HASIL) {
      return res.status(413).json({ message: "Ukuran dokumen hasil maksimal 10 MB." });
    }

    if (error) {
      return res.status(400).json({ message: "Kirim satu berkas pada field dokumenHasil." });
    }

    return next();
  });
}
