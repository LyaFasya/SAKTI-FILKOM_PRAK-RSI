import { DataTypes } from "sequelize";
import database from "../config/database.js";

const DokumenPengajuan = database.define(
  "DokumenPengajuan",
  {
    idDokumenPengajuan: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    idPengajuan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Pengajuan",
        key: "idPengajuan",
      },
    },
    idDokumen: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "DokumenPersyaratan",
        key: "idDokumen",
      },
    },
    namaFile: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    formatFile: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        isIn: [["PDF"]],
      },
    },
    ukuranFile: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 10485760,
      },
    },
    lokasiFile: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    statusDokumen: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "Belum Diverifikasi",
    },
  },
  {
    tableName: "DokumenPengajuan",
    timestamps: false,
  }
);

export default DokumenPengajuan;