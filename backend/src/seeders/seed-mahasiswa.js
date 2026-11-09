import "dotenv/config";
import bcrypt from "bcryptjs";
import { database, Akun, Mahasiswa } from "../models/index.js";

try {
  const email = process.env.SEED_MAHASISWA_EMAIL?.trim();
  const password = process.env.SEED_MAHASISWA_PASSWORD;
  const nim = process.env.SEED_MAHASISWA_NIM?.trim();
  const namaMahasiswa = process.env.SEED_MAHASISWA_NAMA?.trim();
  const programStudi = process.env.SEED_MAHASISWA_PRODI?.trim();

  if (!email || !password || !nim || !namaMahasiswa || !programStudi) {
    throw new Error("Isi konfigurasi SEED_MAHASISWA di backend/.env.");
  }

  if (!/^\d{1,15}$/.test(nim) || password.length < 12 || Buffer.byteLength(password) > 72) {
    throw new Error("Gunakan NIM 1–15 digit dan password minimal 12 karakter, maksimal 72 byte.");
  }

  const akunLama = await Akun.findOne({ where: { email } });
  const nimLama = await Mahasiswa.findByPk(nim);

  if (akunLama || nimLama) {
    if (akunLama?.role !== "mahasiswa" || !nimLama || nimLama.idAkun !== akunLama.idAkun) {
      throw new Error("Email atau NIM sudah dipakai akun lain.");
    }

    console.log("Akun mahasiswa uji sudah tersedia.");
  } else {
    const passwordHash = await bcrypt.hash(password, 12);

    await database.transaction(async (transaction) => {
      const akun = await Akun.create({ email, password: passwordHash, role: "mahasiswa" }, { transaction });
      await Mahasiswa.create({
        idAkun: akun.idAkun,
        nim,
        namaMahasiswa,
        programStudi,
      }, { transaction });
    });

    console.log("Akun mahasiswa uji berhasil dibuat.");
  }
} catch (error) {
  console.error("Gagal membuat akun mahasiswa:", error.message);
  process.exitCode = 1;
} finally {
  await database.close();
}
