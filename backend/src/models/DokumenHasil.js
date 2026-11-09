import { DataTypes } from "sequelize";
import database from "../config/database.js";

const DokumenHasil = database.define(
  "DokumenHasil",
  {
    idDokumenHasil: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    idPengajuan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "Pengajuan",
        key: "idPengajuan",
      },
    },
    namaDokumen: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    lokasiFile: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    tanggalUpload: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    tableName: "DokumenHasil",
    timestamps: false,
  }
);

export default DokumenHasil;