import database from "../config/database.js";
import semuaFormulir from "../config/formulirLayanan.js";
import Layanan from "../models/Layanan.js";
import DokumenPersyaratan from "../models/DokumenPersyaratan.js";
import Persyaratan from "../models/Persyaratan.js";

const persyaratanUmumAwal = [
  "Lengkapi seluruh kolom bertanda bintang.",
  "Lampiran mengikuti pilihan pada formulir dan batas ukuran setiap jenis file.",
  "Periksa kembali isian sebelum mengirim formulir.",
];
try {
  let jumlahBaru = 0;
  let jumlahDilengkapi = 0;
  let jumlahSudahAda = 0;

  await database.transaction(async (transaction) => {
    for (const [namaLayanan, formulir] of Object.entries(semuaFormulir)) {
      const layanan = await Layanan.findOne({
        where: { namaLayanan },
        transaction,
      });

      if (!layanan) {
        throw new Error(
          `Layanan "${namaLayanan}" belum ada. Jalankan npm run seed:layanan dulu.`
        );
      }

      if (formulir.kelompok.length > 0) {
        const jumlahPersyaratan = await Persyaratan.count({
            where: { idLayanan: layanan.idLayanan },
            transaction,
        });

        if (jumlahPersyaratan === 0) {
            await Persyaratan.bulkCreate(
            persyaratanUmumAwal.map((deskripsiPersyaratan) => ({
                idLayanan: layanan.idLayanan,
                deskripsiPersyaratan,
            })),
            { transaction }
            );
        }
    }

      for (const kelompok of formulir.kelompok) {
        for (const lampiran of kelompok.lampiran) {
          const metadata = {
            kelompokFormulir: kelompok.judul,
            format: lampiran.format,
            maksimalFile: lampiran.maksimalFile,
            maksimalUkuranMb: lampiran.maksimalUkuranMb,
            ketentuanUnggahan: lampiran.ketentuanUnggahan,
            petunjukUnggahan: lampiran.petunjukUnggahan ?? null,
          };

          const [dokumen, dibuat] = await DokumenPersyaratan.findOrCreate({
            where: {
              idLayanan: layanan.idLayanan,
              namaDokumen: lampiran.namaDokumen,
            },
            defaults: {
              wajib: lampiran.wajib,
              ...metadata,
            },
            transaction,
          });

          if (dibuat) {
            jumlahBaru += 1;
            continue;
          }

          const metadataKosong = Object.fromEntries(
            Object.entries(metadata).filter(
              ([field, nilai]) =>
                dokumen.get(field) == null && nilai != null
            )
          );

          if (Object.keys(metadataKosong).length > 0) {
            await dokumen.update(metadataKosong, { transaction });
            jumlahDilengkapi += 1;
          } else {
            jumlahSudahAda += 1;
          }
        }
      }
    }
  });

  console.log(`Dokumen baru: ${jumlahBaru}`);
  console.log(`Dokumen lama dilengkapi: ${jumlahDilengkapi}`);
  console.log(`Dokumen sudah tersedia: ${jumlahSudahAda}`);
} catch (error) {
  console.error("Seed persyaratan gagal:", error.message);
  process.exitCode = 1;
} finally {
  await database.close();
}