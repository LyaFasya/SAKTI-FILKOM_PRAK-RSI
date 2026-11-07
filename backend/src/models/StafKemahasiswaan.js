import { DataTypes } from "sequelize";
import database from "../config/database.js";

const StafKemahasiswaan = database.define(
  "StafKemahasiswaan",
  {
    idStaf: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    idAkun: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "Akun",
        key: "idAkun",
      },
    },
    namaStaf: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "StafKemahasiswaan",
    timestamps: false,
  }
);

export default StafKemahasiswaan;