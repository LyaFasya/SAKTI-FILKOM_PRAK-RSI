import "dotenv/config";
import { DataTypes, QueryTypes } from "sequelize";
import database from "../config/database.js";

const query = database.getQueryInterface();

async function tambahKolomJikaPerlu(tabel, kolom) {
  const kolomSaatIni = await query.describeTable(tabel);

  for (const [nama, type] of Object.entries(kolom)) {
    if (!Object.hasOwn(kolomSaatIni, nama)) {
      await query.addColumn(tabel, nama, { type, allowNull: true });
    }
  }
}

async function migrasi() {
  await tambahKolomJikaPerlu("Pengajuan", { dataFormulir: DataTypes.JSON });
  await tambahKolomJikaPerlu("DokumenPersyaratan", {
    petunjukUnggahan: DataTypes.TEXT,
    kelompokFormulir: DataTypes.STRING(150),
    format: DataTypes.STRING(100),
    maksimalFile: DataTypes.INTEGER,
    maksimalUkuranMb: DataTypes.INTEGER,
    ketentuanUnggahan: DataTypes.STRING(255),
  });

  const hasil = await database.query(
    `SELECT CONSTRAINT_NAME AS nama
       FROM information_schema.TABLE_CONSTRAINTS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'DokumenPengajuan'
        AND CONSTRAINT_TYPE = 'CHECK'`,
    { type: QueryTypes.SELECT }
  );
  const tersedia = new Set(hasil.map(({ nama }) => nama));
  const perubahan = [];

  if (tersedia.has("chk_dokumenpengajuan_format")) {
    perubahan.push("DROP CHECK chk_dokumenpengajuan_format");
  }

  if (tersedia.has("chk_dokumenpengajuan_ukuran")) {
    perubahan.push("DROP CHECK chk_dokumenpengajuan_ukuran");
  }

  if (!tersedia.has("chk_dokumenpengajuan_format_diizinkan")) {
    perubahan.push(`ADD CONSTRAINT chk_dokumenpengajuan_format_diizinkan
      CHECK (formatFile IN ('PDF', 'JPG', 'PNG', 'WEBP', 'GIF', 'DOC', 'DOCX', 'XLS', 'XLSX'))`);
  }

  if (!tersedia.has("chk_dokumenpengajuan_ukuran_maks")) {
    perubahan.push(`ADD CONSTRAINT chk_dokumenpengajuan_ukuran_maks
      CHECK (ukuranFile BETWEEN 1 AND 104857600)`);
  }

  if (perubahan.length > 0) {
    await database.query(`ALTER TABLE DokumenPengajuan ${perubahan.join(", ")}`);
  }

  console.log("Skema pengajuan sudah siap.");
}

try {
  await migrasi();
} catch (error) {
  console.error("Migrasi pengajuan gagal:", error.message);
  process.exitCode = 1;
} finally {
  await database.close();
}
