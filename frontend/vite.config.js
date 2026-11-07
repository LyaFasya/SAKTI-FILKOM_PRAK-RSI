import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Semua request yang diawali /api diteruskan ke backend (Express, port 3000),
// jadi frontend tidak perlu menulis alamat lengkap dan tidak kena masalah CORS.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000"
    }
  }
});
