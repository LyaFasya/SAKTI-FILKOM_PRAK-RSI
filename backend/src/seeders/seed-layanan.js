import database from "../config/database.js";
import Layanan from "../models/Layanan.js";
import semuaFormulir from "../config/formulirLayanan.js";

const sinkronkanInformasi = process.argv.includes("--sinkron-info");
const sinkronkanStatus = process.argv.includes("--sinkron-status");

try {
  let jumlahBaru = 0;
  let jumlahInformasiDiperbarui = 0;
  let jumlahStatusDiperbarui = 0;
  let jumlahDilewati = 0;

  await database.transaction(async (transaction) => {
    for (const [namaLayanan, konfigurasi] of Object.entries(semuaFormulir)) {
      const { kategoriLayanan, informasiLayanan, statusFormulir } = konfigurasi;
      const statusLayanan = statusFormulir === "ditutup" ? "Nonaktif" : "Aktif";

      const [layanan, dibuat] = await Layanan.findOrCreate({
        where: { namaLayanan },
        defaults: {
          kategoriLayanan,
          informasiLayanan,
          statusLayanan,
        },
        transaction,
      });

      if (dibuat) {
        jumlahBaru += 1;
        continue;
      }

      const perubahan = {};
      if (sinkronkanInformasi && layanan.informasiLayanan !== informasiLayanan) {
        perubahan.informasiLayanan = informasiLayanan;
        jumlahInformasiDiperbarui += 1;
      }
      if (sinkronkanStatus && layanan.statusLayanan !== statusLayanan) {
        perubahan.statusLayanan = statusLayanan;
        jumlahStatusDiperbarui += 1;
      }

      if (Object.keys(perubahan).length === 0) {
        jumlahDilewati += 1;
      } else {
        await layanan.update(perubahan, { transaction });
      }
    }
  });

  console.log(`Layanan baru: ${jumlahBaru}`);
  console.log(`Deskripsi diperbarui: ${jumlahInformasiDiperbarui}`);
  if (sinkronkanStatus) console.log(`Status diperbarui: ${jumlahStatusDiperbarui}`);
  console.log(`Layanan dilewati: ${jumlahDilewati}`);
} catch (error) {
  console.error("Seed layanan gagal:", error.message);
  process.exitCode = 1;
} finally {
  await database.close();
}
