import { DataTypes } from "sequelize";
import database from "../config/database.js";

const Layanan = database.define(
  "Layanan",
  {
    idLayanan: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    namaLayanan: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    kategoriLayanan: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    informasiLayanan: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    statusLayanan: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    tableName: "Layanan",
    timestamps: false,
  }
);

export default Layanan;