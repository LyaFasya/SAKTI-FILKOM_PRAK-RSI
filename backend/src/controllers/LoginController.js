import { promisify } from "node:util";
import bcrypt from "bcryptjs";
import { Akun, Mahasiswa } from "../models/index.js";

export async function login(req, res, next) {
  try {
    const body = req.body;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({
        message: "Body login harus berupa objek JSON.",
      });
    }

    const fieldTambahan = Object.keys(body).filter(
      (field) => field !== "email" && field !== "password"
    );

    if (fieldTambahan.length > 0) {
      return res.status(400).json({
        message: "Body login hanya boleh berisi email dan password.",
        fields: fieldTambahan,
      });
    }

    const { email: identitas, password } = body;

    if (
      typeof identitas !== "string" ||
      !identitas.trim() ||
      typeof password !== "string" ||
      !password.trim()
    ) {
      return res.status(400).json({
        message: "NIM atau email dan kata sandi wajib diisi.",
      });
    }

    if (Buffer.byteLength(password, "utf8") > 72) {
      return res.status(400).json({
        message: "Kata sandi maksimal 72 byte.",
      });
    }

    const nilaiIdentitas = identitas.trim();

    let akun = await Akun.findOne({
      where: { email: nilaiIdentitas },
    });

    // Kolom login pada UI menerima email atau NIM.
    if (!akun && /^\d{1,15}$/.test(nilaiIdentitas)) {
      const mahasiswa = await Mahasiswa.findByPk(nilaiIdentitas);

      if (mahasiswa) {
        akun = await Akun.findByPk(mahasiswa.idAkun);
      }
    }

    if (!akun || !(await bcrypt.compare(password, akun.password))) {
      return res.status(401).json({
        message: "NIM/email atau kata sandi tidak valid.",
      });
    }

    await promisify(req.session.regenerate).call(req.session);
    req.session.idAkun = akun.idAkun;
    await promisify(req.session.save).call(req.session);

    return res.status(200).json({
      message: "Login berhasil.",
      data: {
        idAkun: akun.idAkun,
        email: akun.email,
        role: akun.role,
      },
    });
  } catch (error) {
    return next(error);
  }
}