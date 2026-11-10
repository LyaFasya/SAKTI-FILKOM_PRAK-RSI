import { Akun } from "../models/index.js";

export async function wajibLogin(req, res, next) {
  try {
    const idAkun = req.session?.idAkun;

    if (!idAkun) {
      return res.status(401).json({
        message: "Silakan login terlebih dahulu.",
      });
    }

    const akun = await Akun.findByPk(idAkun, {
      attributes: ["idAkun", "email", "role"],
    });

    if (!akun) {
      return res.status(401).json({
        message: "Akun tidak ditemukan. Silakan login kembali.",
      });
    }

    req.akun = akun;
    return next();
  } catch (error) {
    next(error);
  }
}

export function khususStaf(req, res, next) {
  if (req.akun?.role !== "staf") {
    return res.status(403).json({
      message: "Fitur ini hanya dapat diakses oleh staf.",
    });
  }

  return next();
}
export function khususMahasiswa(req, res, next) {
  if (req.akun?.role !== "mahasiswa") {
    return res.status(403).json({
      message: "Fitur ini hanya dapat diakses oleh mahasiswa.",
    });
  }

  return next();
}
