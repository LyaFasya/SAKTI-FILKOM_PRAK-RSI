import "dotenv/config";
import bcrypt from "bcryptjs";
import {
  database,
  Akun,
  StafKemahasiswaan,
} from "./models/index.js";

async function membuatStafPengujian() {
  try {
    const email = process.env.SEED_STAF_EMAIL?.trim();
    const password = process.env.SEED_STAF_PASSWORD;
    const namaStaf = process.env.SEED_STAF_NAMA?.trim();

    if (!email || !password || !namaStaf) {
      throw new Error("Konfigurasi SEED_STAF di .env belum lengkap.");
    }

    if (
      password.length < 12 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      throw new Error(
        "Password staf harus minimal 12 karakter dan maksimal 72 byte."
      );
    }

    await database.authenticate();

    const akunLama = await Akun.findOne({
      where: { email },
    });

    if (akunLama) {
      console.log(
        "Email sudah terdaftar. Akun lama tidak diubah."
      );
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await database.transaction(async (transaction) => {
      const akun = await Akun.create(
        {
          email,
          password: passwordHash,
          role: "staf",
        },
        { transaction }
      );

      await StafKemahasiswaan.create(
        {
          idAkun: akun.idAkun,
          namaStaf,
        },
        { transaction }
      );
    });

    console.log("Akun staf pengujian berhasil dibuat.");
  } catch (error) {
    console.error("Gagal membuat akun staf:", error.message);
    process.exitCode = 1;
  } finally {
    await database.close();
  }
}

membuatStafPengujian();