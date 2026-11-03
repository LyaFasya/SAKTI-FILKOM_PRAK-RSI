import { DataTypes } from "sequelize";
import database from "../config/database.js";

const Notifikasi = database.define(
  "Notifikasi",
  {
    idNotifikasi: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    idAkun: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Akun",
        key: "idAkun",
      },
    },
    idPengajuan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Pengajuan",
        key: "idPengajuan",
      },
    },
    pesan: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    statusPengajuan: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        isIn: [
          ["Menunggu Verifikasi", "Diproses", "Disetujui", "Ditolak"],
        ],
      },
    },
    tanggalPerubahan: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    waktuPerubahan: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    statusPengirimanEmail: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    keteranganEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "Notifikasi",
    timestamps: false,
  }
);

export default Notifikasi;