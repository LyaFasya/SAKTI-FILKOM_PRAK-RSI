// Service rekapitulasi pengajuan sisi STAF (PJN-UC14 dan PJN-UC15), memanggil API asli backend:
//   GET /api/rekapitulasi?idLayanan=&statusPengajuan=&tanggalMulai=&tanggalAkhir=
//   GET /api/rekapitulasi/unduh?format=pdf|xlsx&(filter yang sama)
//   GET /api/layanan   (isi dropdown "Jenis layanan")
// Hanya akun staf yang boleh memanggilnya (mahasiswa dibalas 403).
import { ApiError, apiRequest, hapusSesi } from "./api.js";

// Tanggal berformat YYYY-MM-DD (nilai langsung dari <input type="date">).
// Nilai kosong berarti "Semua" dan tidak dikirim ke backend.
function buatQuery({ idLayanan, statusPengajuan, tanggalMulai, tanggalAkhir } = {}) {
  const q = new URLSearchParams();
  if (idLayanan) q.set("idLayanan", idLayanan);
  if (statusPengajuan) q.set("statusPengajuan", statusPengajuan);
  if (tanggalMulai) q.set("tanggalMulai", tanggalMulai);
  if (tanggalAkhir) q.set("tanggalAkhir", tanggalAkhir);
  return q.toString();
}

// -> { total, kriteria, data: [{ idPengajuan, kodePengajuan, namaMahasiswa, nim, idLayanan,
//      namaLayanan, tanggalPengajuan, statusPengajuan }] }
// Hasil kosong BUKAN galat: backend membalas 200 dengan total 0 dan data [].
export async function ambilRekapitulasi(kriteria) {
  const query = buatQuery(kriteria);
  const hasil = await apiRequest(`/rekapitulasi${query ? `?${query}` : ""}`);
  return { total: hasil.total, kriteria: hasil.kriteria, data: hasil.data };
}

// -> [{ idLayanan, namaLayanan }]
export async function ambilDaftarLayananRekap() {
  const hasil = await apiRequest("/layanan");
  return hasil.data.map(({ idLayanan, namaLayanan }) => ({ idLayanan, namaLayanan }));
}

// -> { blob, nama }. Pakai kriteria yang SEDANG DITAMPILKAN, bukan isian form yang belum
// ditekan "Tampilkan Rekapitulasi". Memakai fetch + blob (bukan tautan biasa) supaya galat
// 400/409/500 dari backend bisa ditampilkan di dialog.
export async function unduhRekapitulasi(format, kriteria) {
  const query = buatQuery(kriteria);
  let respons;
  try {
    respons = await fetch(`/api/rekapitulasi/unduh?format=${format}${query ? `&${query}` : ""}`);
  } catch {
    throw new ApiError("Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.", 0, null);
  }

  if (respons.status === 401) {
    hapusSesi();
    window.dispatchEvent(new Event("sakti:unauthorized"));
  }
  if (!respons.ok) {
    const data = await respons.json().catch(() => null);
    throw new ApiError(data?.message ?? "File rekapitulasi gagal dibuat.", respons.status, data);
  }

  const nama = /filename="?([^";]+)"?/i.exec(respons.headers.get("content-disposition") ?? "")?.[1]
    ?? `rekapitulasi-pengajuan.${format}`;
  return { blob: await respons.blob(), nama };
}

// Memicu penyimpanan file di browser.
export function simpanBerkas({ blob, nama }) {
  const url = URL.createObjectURL(blob);
  const tautan = Object.assign(document.createElement("a"), { href: url, download: nama });
  document.body.appendChild(tautan);
  tautan.click();
  tautan.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
