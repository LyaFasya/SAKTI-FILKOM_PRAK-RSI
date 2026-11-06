import { DataTypes } from "sequelize";
import database from "../config/database.js";

const Akun = database.define(
  "Akun",
  {
    idAkun: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
  },
  {
    tableName: "Akun",
    timestamps: false,
  }
);

export default Akun;