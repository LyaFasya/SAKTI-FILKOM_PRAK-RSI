import { DataTypes } from "sequelize";
import database from "../config/database.js";

const Pengajuan = database.define(
  "Pengajuan",
  {
    idPengajuan: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    idAkun: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Akun",
        key: "idAkun",
      },
    },
    idLayanan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Layanan",
        key: "idLayanan",
      },
    },
    tanggalPengajuan: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    statusPengajuan: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "Menunggu Verifikasi",
      validate: {
        isIn: [
          ["Menunggu Verifikasi", "Diproses", "Disetujui", "Ditolak"],
        ],
      },
    },
    dataFormulir: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    alasanPenolakan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    idStaf: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "StafKemahasiswaan",
        key: "idStaf",
      },
    },
    waktuKeputusan: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "Pengajuan",
    timestamps: false,
  }
);

export default Pengajuan;