import jwt from "jsonwebtoken";

import { Akun } from "../models/index.js";
import { jwtSecret } from "../config/auth.js";

export async function wajibLogin(req, res, next) {
  const authorization = req.get("Authorization") || "";
  const bagian = authorization.trim().split(/\s+/);

  if (
    bagian.length !== 2 ||
    bagian[0].toLowerCase() !== "bearer" ||
    !bagian[1]
  ) {
    return res.status(401).json({
      message: "Silakan login terlebih dahulu.",
    });
  }

  let payload;

  try {
    payload = jwt.verify(bagian[1], jwtSecret, {
      algorithms: ["HS256"],
    });
  } catch {
    return res.status(401).json({
      message: "Token tidak valid atau sudah kedaluwarsa.",
    });
  }

  const idAkun = Number(payload.sub);

  if (!Number.isSafeInteger(idAkun) || idAkun <= 0) {
    return res.status(401).json({
      message: "Identitas pada token tidak valid.",
    });
  }

  try {
    const akun = await Akun.findByPk(idAkun, {
      attributes: ["idAkun", "email", "role"],
    });

    if (!akun) {
      return res.status(401).json({
        message: "Akun tidak ditemukan.",
      });
    }

    req.akun = akun;

    next();
  } catch (error) {
    next(error);
  }
}

export function khususStaf(req, res, next) {
  if (!req.akun) {
    return res.status(401).json({
      message: "Silakan login terlebih dahulu.",
    });
  }

  if (req.akun.role !== "staf") {
    return res.status(403).json({
      message: "Fitur ini hanya dapat diakses oleh staf.",
    });
  }

  next();
}