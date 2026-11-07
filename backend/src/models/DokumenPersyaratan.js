import { DataTypes } from "sequelize";
import database from "../config/database.js";

const DokumenPersyaratan = database.define(
  "DokumenPersyaratan",
  {
    idDokumen: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    idLayanan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Layanan",
        key: "idLayanan",
      },
    },
    namaDokumen: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    wajib: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "DokumenPersyaratan",
    timestamps: false,
  }
);

export default DokumenPersyaratan;