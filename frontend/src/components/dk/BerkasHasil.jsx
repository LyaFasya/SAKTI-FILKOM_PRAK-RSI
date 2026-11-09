import { IkonSurat } from "../mahasiswa/Icons.jsx";

// Kartu "Dokumen hasil tersedia" (PJN-UI04 dan PJN-UI07).
// Dokumen hasil dikirim ke email mahasiswa, jadi di sini hanya informasi.
export default function BerkasHasil({ dokumenHasil, email }) {
  if (!dokumenHasil) return null;

  return (
    <section className="kartu kartu--info" aria-labelledby="judul-dokumen-hasil">
      <span className="kotak-ikon"><IkonSurat ukuran={20} /></span>
      <h2 id="judul-dokumen-hasil">Dokumen hasil tersedia</h2>
      <p className="teks-redup">{dokumenHasil.namaDokumen}</p>
      <p className="teks-redup">Dokumen hasil dikirim sebagai lampiran email ke akun mahasiswa.</p>
      <p className="teks-redup" style={{ marginTop: 12 }}>Dikirim ke {email ?? "email mahasiswa"}</p>
    </section>
  );
}
