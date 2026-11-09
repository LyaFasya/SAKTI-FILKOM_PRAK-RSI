// Judul halaman. `aksi` (opsional) = tombol di sisi kanan judul.
export default function PageHeader({ judul, deskripsi, aksi }) {
  return (
    <header className="page-header">
      <div>
        <h1>{judul}</h1>
        {deskripsi && <p className="teks-redup">{deskripsi}</p>}
      </div>
      {aksi && <div>{aksi}</div>}
    </header>
  );
}
