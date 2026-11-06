import "dotenv/config";
import app from "./app.js";
import { database } from "./models/index.js";

const port = Number(process.env.PORT || 3000);

async function jalankanServer() {
  try {
    await database.authenticate();

    console.log("Koneksi database berhasil.");

    const server = app.listen(port, () => {
      console.log(`Server berjalan di http://localhost:${port}`);
    });

    server.on("error", async (error) => {
      console.error("Server gagal berjalan:", error.message);
      process.exitCode = 1;
      await database.close();
    });
  } catch (error) {
    console.error("Koneksi database gagal:", error.message);
    process.exitCode = 1;
    await database.close();
  }
}

jalankanServer();