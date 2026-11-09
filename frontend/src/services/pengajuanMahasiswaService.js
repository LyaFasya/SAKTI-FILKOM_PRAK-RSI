// Service pengajuan sisi MAHASISWA (milik DK). Terpisah dari pengajuanService.js
// yang dipakai halaman staf, supaya tidak bentrok saat merge.
//
// Status backend:
// - ambilDataFormPengajuan: memakai API asli layanan (GET /api/layanan/:id/persyaratan)
//   + profil mahasiswa dummy (belum ada endpoint profil).
// - fungsi lainnya masih DATA DUMMY di memori. Saat endpoint RF sudah ada,
//   ganti isi fungsi dengan apiRequest(...). Halaman tidak perlu diubah.
import { STATUS_PENGAJUAN } from "../config/constants.js";
import { notifikasiDummy, pengajuanSayaDummy, profilDummy } from "../mocks/pengajuanMahasiswa.js";
import { formatIdPengajuan } from "../utils/formatPengajuan.js";
import { ambilPersyaratanLayanan } from "./layananService.js";

const tunda = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

// Salinan data di memori supaya pengajuan baru langsung muncul di daftar
// selama halaman belum di-refresh.
let daftarPengajuan = structuredClone(pengajuanSayaDummy);
let daftarNotifikasi = structuredClone(notifikasiDummy);

function sekarang() {
  const d = new Date();
  const dua = (n) => String(n).padStart(2, "0");
  return {
    tanggal: `${d.getFullYear()}-${dua(d.getMonth() + 1)}-${dua(d.getDate())}`,
    waktu: `${dua(d.getHours())}:${dua(d.getMinutes())}:${dua(d.getSeconds())}`
  };
}

// PGJ-UI01: data untuk menampilkan formulir pengajuan.
// Jika layanan belum punya DokumenPersyaratan di database, dipakai dua slot
// bawaan sesuai sketsa: Data Lampiran (wajib) dan Data Pendukung (opsional).
export async function ambilDataFormPengajuan(idLayanan) {
  const layanan = await ambilPersyaratanLayanan(idLayanan);
  await tunda(100);

  const dokumen = layanan.dokumenPersyaratan?.length
    ? layanan.dokumenPersyaratan.map((d) => ({
        idDokumen: d.idDokumen,
        namaDokumen: d.namaDokumen,
        wajib: Boolean(d.wajib)
      }))
    : [
        { idDokumen: "lampiran", namaDokumen: "Unggah Data Lampiran", wajib: true },
        { idDokumen: "pendukung", namaDokumen: "Unggah Data Pendukung", wajib: false }
      ];

  return {
    idLayanan: layanan.idLayanan,
    namaLayanan: layanan.namaLayanan,
    informasiLayanan: layanan.informasiLayanan,
    persyaratan: (layanan.persyaratan ?? []).map((p) => p.deskripsiPersyaratan),
    dokumen,
    profil: profilDummy
  };
}

// PGJ-UC01: kirim pengajuan. `berkas` = { [idDokumen]: File }.
// Nanti: kirim sebagai multipart/form-data (api.js saat ini hanya mengirim JSON,
// jadi perlu dukungan FormData; kabari grup karena api.js file bersama).
export async function kirimPengajuan({ idLayanan, namaLayanan, isian, berkas, dokumen, email }) {
  await tunda(500);

  const { tanggal, waktu } = sekarang();
  const idBaru = Math.max(0, ...daftarPengajuan.map((p) => p.idPengajuan)) + 1;

  daftarPengajuan = [
    ...daftarPengajuan,
    {
      idPengajuan: idBaru,
      idLayanan: Number(idLayanan),
      namaLayanan,
      tanggalPengajuan: tanggal,
      statusPengajuan: STATUS_PENGAJUAN.MENUNGGU_VERIFIKASI,
      alasanPenolakan: null,
      identitas: { ...profilDummy, email, noHp: isian.noHp },
      formulir: {
        namaKegiatan: isian.namaKegiatan,
        lokasiKegiatan: isian.lokasiKegiatan,
        peran: isian.peran,
        peranLain: isian.peran === "Other" ? isian.peranLain.trim() : null,
        tanggalAwal: isian.tanggalAwal,
        tanggalAkhir: isian.tanggalAkhir
      },
      dokumen: dokumen
        .filter((d) => berkas[d.idDokumen])
        .map((d) => ({
          namaDokumen: d.namaDokumen,
          namaFile: berkas[d.idDokumen].name,
          // Hanya berlaku selama halaman belum di-refresh. Backend nanti memberi URL unduhan.
          urlFile: URL.createObjectURL(berkas[d.idDokumen]),
          statusDokumen: "Belum Diverifikasi"
        })),
      riwayat: [{ statusPengajuan: STATUS_PENGAJUAN.MENUNGGU_VERIFIKASI, tanggalStatus: tanggal, waktuStatus: waktu }],
      dokumenHasil: null
    }
  ];

  daftarNotifikasi = [
    {
      idNotifikasi: daftarNotifikasi.length + 1,
      idPengajuan: idBaru,
      pesan: `Pengajuan ${formatIdPengajuan(idBaru, tanggal)} diterima dan menunggu verifikasi.`,
      statusPengajuan: STATUS_PENGAJUAN.MENUNGGU_VERIFIKASI,
      tanggalPerubahan: tanggal,
      waktuPerubahan: waktu,
      statusPengirimanEmail: "Berhasil",
      keteranganEmail: null
    },
    ...daftarNotifikasi
  ];

  return { idPengajuan: idBaru };
}

// PJN-UC01 dan PJN-UC02: riwayat pengajuan milik mahasiswa + cari + filter status.
export async function ambilPengajuanSaya({ status, kataKunci } = {}) {
  await tunda();
  const kunci = kataKunci?.trim().toLowerCase();

  return daftarPengajuan
    .filter((p) => {
      if (status && p.statusPengajuan !== status) return false;
      if (kunci) {
        const gudang = `${formatIdPengajuan(p.idPengajuan, p.tanggalPengajuan)} ${p.idPengajuan} ${p.namaLayanan}`.toLowerCase();
        if (!gudang.includes(kunci)) return false;
      }
      return true;
    })
    .sort((a, b) => b.idPengajuan - a.idPengajuan);
}

// PJN-UC03 sampai PJN-UC06: detail satu pengajuan (identitas, isian, lampiran,
// riwayat status, alasan penolakan, dokumen hasil). Mengembalikan null jika tidak ada.
export async function ambilDetailPengajuanSaya(idPengajuan) {
  await tunda();
  return daftarPengajuan.find((p) => p.idPengajuan === Number(idPengajuan)) ?? null;
}

// PJN-UC07: notifikasi perubahan status, terbaru di atas.
export async function ambilNotifikasi() {
  await tunda();
  const namaLayanan = (id) => daftarPengajuan.find((p) => p.idPengajuan === id)?.namaLayanan ?? "";
  return daftarNotifikasi.map((n) => ({ ...n, namaLayanan: namaLayanan(n.idPengajuan) })).sort((a, b) =>
    `${b.tanggalPerubahan}${b.waktuPerubahan}`.localeCompare(`${a.tanggalPerubahan}${a.waktuPerubahan}`)
  );
}
