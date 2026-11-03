import database from "../config/database.js";

import Akun from "./Akun.js";
import Mahasiswa from "./Mahasiswa.js";
import StafKemahasiswaan from "./StafKemahasiswaan.js";
import Layanan from "./Layanan.js";
import Persyaratan from "./Persyaratan.js";
import DokumenPersyaratan from "./DokumenPersyaratan.js";
import Pengajuan from "./Pengajuan.js";
import DokumenPengajuan from "./DokumenPengajuan.js";
import RiwayatStatus from "./RiwayatStatus.js";
import DokumenHasil from "./DokumenHasil.js";
import Notifikasi from "./Notifikasi.js";

const aturanRelasi = {
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
};

// Akun dan profil mahasiswa
Akun.hasOne(Mahasiswa, {
  ...aturanRelasi,
  foreignKey: "idAkun",
  as: "mahasiswa",
});

Mahasiswa.belongsTo(Akun, {
  ...aturanRelasi,
  foreignKey: "idAkun",
  as: "akun",
});

// Akun dan profil staf
Akun.hasOne(StafKemahasiswaan, {
  ...aturanRelasi,
  foreignKey: "idAkun",
  as: "staf",
});

StafKemahasiswaan.belongsTo(Akun, {
  ...aturanRelasi,
  foreignKey: "idAkun",
  as: "akun",
});

// Layanan dan persyaratan
Layanan.hasMany(Persyaratan, {
  ...aturanRelasi,
  foreignKey: "idLayanan",
  as: "persyaratan",
});

Persyaratan.belongsTo(Layanan, {
  ...aturanRelasi,
  foreignKey: "idLayanan",
  as: "layanan",
});

// Layanan dan dokumen persyaratan
Layanan.hasMany(DokumenPersyaratan, {
  ...aturanRelasi,
  foreignKey: "idLayanan",
  as: "dokumenPersyaratan",
});

DokumenPersyaratan.belongsTo(Layanan, {
  ...aturanRelasi,
  foreignKey: "idLayanan",
  as: "layanan",
});

// Akun pemilik pengajuan
Akun.hasMany(Pengajuan, {
  ...aturanRelasi,
  foreignKey: "idAkun",
  as: "pengajuan",
});

Pengajuan.belongsTo(Akun, {
  ...aturanRelasi,
  foreignKey: "idAkun",
  as: "pemohon",
});

// Layanan yang diajukan
Layanan.hasMany(Pengajuan, {
  ...aturanRelasi,
  foreignKey: "idLayanan",
  as: "pengajuan",
});

Pengajuan.belongsTo(Layanan, {
  ...aturanRelasi,
  foreignKey: "idLayanan",
  as: "layanan",
});

// Staf yang memutuskan pengajuan
StafKemahasiswaan.hasMany(Pengajuan, {
  ...aturanRelasi,
  foreignKey: "idStaf",
  as: "pengajuan",
});

Pengajuan.belongsTo(StafKemahasiswaan, {
  ...aturanRelasi,
  foreignKey: "idStaf",
  as: "staf",
});

// Berkas yang diunggah untuk pengajuan
Pengajuan.hasMany(DokumenPengajuan, {
  ...aturanRelasi,
  foreignKey: "idPengajuan",
  as: "dokumenPengajuan",
});

DokumenPengajuan.belongsTo(Pengajuan, {
  ...aturanRelasi,
  foreignKey: "idPengajuan",
  as: "pengajuan",
});

// Jenis dokumen dari berkas pengajuan
DokumenPersyaratan.hasMany(DokumenPengajuan, {
  ...aturanRelasi,
  foreignKey: "idDokumen",
  as: "dokumenPengajuan",
});

DokumenPengajuan.belongsTo(DokumenPersyaratan, {
  ...aturanRelasi,
  foreignKey: "idDokumen",
  as: "dokumenPersyaratan",
});

// Riwayat perubahan status
Pengajuan.hasMany(RiwayatStatus, {
  ...aturanRelasi,
  foreignKey: "idPengajuan",
  as: "riwayatStatus",
});

RiwayatStatus.belongsTo(Pengajuan, {
  ...aturanRelasi,
  foreignKey: "idPengajuan",
  as: "pengajuan",
});

// Dokumen hasil pengajuan
Pengajuan.hasOne(DokumenHasil, {
  ...aturanRelasi,
  foreignKey: "idPengajuan",
  as: "dokumenHasil",
});

DokumenHasil.belongsTo(Pengajuan, {
  ...aturanRelasi,
  foreignKey: "idPengajuan",
  as: "pengajuan",
});

// Akun penerima notifikasi
Akun.hasMany(Notifikasi, {
  ...aturanRelasi,
  foreignKey: "idAkun",
  as: "notifikasi",
});

Notifikasi.belongsTo(Akun, {
  ...aturanRelasi,
  foreignKey: "idAkun",
  as: "penerima",
});

// Pengajuan yang terkait dengan notifikasi
Pengajuan.hasMany(Notifikasi, {
  ...aturanRelasi,
  foreignKey: "idPengajuan",
  as: "notifikasi",
});

Notifikasi.belongsTo(Pengajuan, {
  ...aturanRelasi,
  foreignKey: "idPengajuan",
  as: "pengajuan",
});

export {
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
};