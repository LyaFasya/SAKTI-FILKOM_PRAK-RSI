import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { Akun } from "../models/index.js";
import { jwtSecret } from "../config/auth.js";

export async function login(req, res, next) {
  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email dan password wajib diisi.",
      });
    }

    if (Buffer.byteLength(password, "utf8") > 72) {
      return res.status(400).json({
        message: "Password maksimal 72 byte.",
      });
    }

    const akun = await Akun.findOne({
      where: {
        email: email.trim(),
      },
    });

    const passwordCocok = akun
      ? await bcrypt.compare(password, akun.password)
      : false;

    if (!akun || !passwordCocok) {
      return res.status(401).json({
        message: "Email atau password salah.",
      });
    }

    const token = jwt.sign({}, jwtSecret, {
      algorithm: "HS256",
      subject: String(akun.idAkun),
      expiresIn: "2h",
    });

    return res.status(200).json({
      message: "Login berhasil.",
      token,
      data: {
        idAkun: akun.idAkun,
        email: akun.email,
        role: akun.role,
      },
    });
  } catch (error) {
    next(error);
  }
}