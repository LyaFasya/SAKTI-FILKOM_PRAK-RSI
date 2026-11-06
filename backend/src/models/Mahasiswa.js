import { DataTypes } from "sequelize";
import database from "../config/database.js";

const Mahasiswa = database.define(
  "Mahasiswa",
  {
    nim: {
      type: DataTypes.STRING(15),
      primaryKey: true,
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
    namaMahasiswa: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    programStudi: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "Mahasiswa",
    timestamps: false,
  }
);

export default Mahasiswa;