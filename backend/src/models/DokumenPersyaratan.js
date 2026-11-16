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
    petunjukUnggahan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    kelompokFormulir: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    format: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    maksimalFile: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    maksimalUkuranMb: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ketentuanUnggahan: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "DokumenPersyaratan",
    timestamps: false,
  }
);

export default DokumenPersyaratan;