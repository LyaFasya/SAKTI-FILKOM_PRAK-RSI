import {
  database,
  Akun,
  Mahasiswa,
  StafKemahasiswaan,
  Layanan,
  Persyaratan,
  DokumenPersyaratan,
  Pengajuan,
  DokumenPengajuan,
  RiwayatStatus,
  DokumenHasil,
  Notifikasi,
} from "./models/index.js";

const semuaModel = [
  Akun,
  Mahasiswa,
  StafKemahasiswaan,
  Layanan,
  Persyaratan,
  DokumenPersyaratan,
  Pengajuan,
  DokumenPengajuan,
  RiwayatStatus,
  DokumenHasil,
  Notifikasi,
];

try {
  await database.authenticate();

  for (const model of semuaModel) {
    await model.findAll({ limit: 1 });

    console.log(`Model ${model.name}: berhasil membaca tabel.`);
  }

  await Pengajuan.findAll({
    limit: 1,
    include: [
      { association: "pemohon" },
      { association: "layanan" },
      { association: "staf" },
      { association: "dokumenHasil" },
    ],
  });

  await Layanan.findAll({
    limit: 1,
    include: [
      { association: "persyaratan" },
      { association: "dokumenPersyaratan" },
    ],
  });

  console.log("Pemeriksaan 11 model dan query relasi berhasil.");
} catch (kesalahan) {
  console.error("Pemeriksaan model gagal:", kesalahan.message);
  process.exitCode = 1;
} finally {
  await database.close();
}