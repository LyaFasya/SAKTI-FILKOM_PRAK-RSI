import "dotenv/config";
import { Sequelize } from "sequelize";

const database = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
    timezone: "+07:00",
    logging: false,

    define: {
      timestamps: false,
      freezeTableName: true
    }
  }
);

export default database;