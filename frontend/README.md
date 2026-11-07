# Frontend SAKTI FILKOM

React + Vite. Letaknya sejajar dengan `backend/` dan `sql/`.

## Menjalankan

1. Jalankan backend dulu (port 3000), lihat panduan di README backend.
2. Di folder ini:

```bash
npm install
npm run dev
```

Buka http://localhost:5173. Request yang diawali `/api` otomatis diteruskan ke backend
(lihat `vite.config.js`), jadi tidak perlu mengurus CORS.

## Struktur

```
src/
├── components/     komponen bersama (layout, StatusBadge, PageHeader)
├── config/         konstanta (status pengajuan, role)
├── context/        AuthContext (login, logout, sesi)
├── hooks/          useAmbilData (loading dan error)
├── mocks/          data dummy sementara
├── pages/          halaman, dikelompokkan per fitur
├── routes/         ncRoutes / akRoutes / dkRoutes, digabung di index.jsx
├── services/       semua panggilan ke backend (api.js, layananService.js, ...)
└── styles/         global.css (warna dan font ada di blok :root)
```

## Aturan kerja tim

- **Daftarkan halamanmu di routes file milikmu sendiri** (`ncRoutes.jsx`, `akRoutes.jsx`,
  atau `dkRoutes.jsx`), bukan di `App.jsx`. Dengan begitu tidak ada konflik saat merge.
- **Panggilan ke backend ditaruh di `services/`**, jangan langsung di komponen.
- **Pakai nilai status persis seperti di database** lewat `config/constants.js`.
- Warna dan font diganti di `src/styles/global.css` (blok `:root`), jangan ditulis langsung di komponen.
- File bersama (`components/`, `config/`, `styles/`) kalau diubah, kabari grup.

## Status integrasi backend

| Bagian | Sumber data |
|---|---|
| Login | API asli |
| Layanan (daftar, detail, persyaratan, ubah informasi) | API asli |
| Pengajuan dan Dashboard | **Data dummy** (`mocks/` + `services/pengajuanService.js`), menunggu endpoint dari RF |
