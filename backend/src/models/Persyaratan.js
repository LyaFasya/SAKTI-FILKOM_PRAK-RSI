import { DataTypes } from "sequelize";
import database from "../config/database.js";

const Persyaratan = database.define(
  "Persyaratan",
  {
    idPersyaratan: {
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
    deskripsiPersyaratan: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "Persyaratan",
    timestamps: false,
  }
);

export default Persyaratan;