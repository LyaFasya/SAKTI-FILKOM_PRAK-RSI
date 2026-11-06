import database from "./config/database.js";

try {
  await database.authenticate();

  console.log(
    "Koneksi Sequelize ke database sakti_filkom berhasil."
  );
} catch (kesalahan) {
  console.error(
    "Koneksi database gagal:",
    kesalahan.message
  );

  process.exitCode = 1;
} finally {
  await database.close();
}