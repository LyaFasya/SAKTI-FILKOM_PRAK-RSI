// Daftar identitas mahasiswa (Nama, NIM, Program studi, Email, HP/WA). Dipakai di
// halaman Detail, Verifikasi, dan Persetujuan.
export default function IdentitasMahasiswa({ detail }) {
  const baris = [
    ["Nama", detail.namaMahasiswa],
    ["NIM", detail.nim],
    ["Program studi", detail.mahasiswa.programStudi],
    ["Email", detail.mahasiswa.email],
    ["HP / WA", detail.mahasiswa.noHp ?? "—"]
  ];

  return (
    <dl className="identitas">
      {baris.map(([label, nilai]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{nilai}</dd>
        </div>
      ))}
    </dl>
  );
}
