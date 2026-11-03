import { DataTypes } from "sequelize";
import database from "../config/database.js";

const RiwayatStatus = database.define(
  "RiwayatStatus",
  {
    idRiwayat: {
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
    statusPengajuan: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        isIn: [
          ["Menunggu Verifikasi", "Diproses", "Disetujui", "Ditolak"],
        ],
      },
    },
    tanggalStatus: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    waktuStatus: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  },
  {
    tableName: "RiwayatStatus",
    timestamps: false,
  }
);

export default RiwayatStatus;