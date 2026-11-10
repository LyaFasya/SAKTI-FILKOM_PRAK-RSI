import { randomUUID } from "node:crypto";
import { QueryTypes } from "sequelize";
import semuaFormulir from "../config/formulirLayanan.js";
import { kondisiFormulirAktif } from "../services/formulirPengajuan.js";
import {
  ambilBucketDokumenHasil,
  ambilBucketLampiranPengajuan,
} from "../config/storage.js";
import { MAKS_UKURAN_DOKUMEN_HASIL } from "../middlewares/unggahDokumenHasil.js";
import { kirimTautanBerkas } from "../utils/tautanBerkas.js";
import {
  KODE_PENGAJUAN_SQL,
  STATUS_PENGAJUAN,
  ambilNomorHp,
  ambilTanggalDanWaktuWib,
  bacaId,
} from "../utils/pengajuan.js";
import { kirimEmailStatus } from "../services/emailPengajuan.js";
import {
  DokumenHasil,
  DokumenPengajuan,
  Notifikasi,
  Pengajuan,
  RiwayatStatus,
  StafKemahasiswaan,
} from "../models/index.js";

const HASIL_VERIFIKASI = ["Sesuai", "Tidak Sesuai"];
const BATAS_PENGAJUAN_TERBARU = 5;

const KOLOM_DAFTAR = `
  p.idPengajuan,
  ${KODE_PENGAJUAN_SQL} AS kodePengajuan,
  m.namaMahasiswa,
  m.nim,
  p.idLayanan,
  l.namaLayanan,
  p.tanggalPengajuan,
  p.statusPengajuan
`;

const SUMBER_PENGAJUAN = `
  FROM Pengajuan AS p
  JOIN Layanan AS l ON l.idLayanan = p.idLayanan
  LEFT JOIN Mahasiswa AS m ON m.idAkun = p.idAkun
`;

const FILTER_PENGAJUAN = `
  WHERE (:statusPengajuan IS NULL OR p.statusPengajuan = :statusPengajuan)
    AND (:idLayanan IS NULL OR p.idLayanan = :idLayanan)
    AND (
      :pola IS NULL
      OR LOWER(${KODE_PENGAJUAN_SQL}) LIKE :pola ESCAPE '!'
      OR CAST(p.idPengajuan AS CHAR) LIKE :pola ESCAPE '!'
      OR LOWER(m.namaMahasiswa) LIKE :pola ESCAPE '!'
      OR m.nim LIKE :pola ESCAPE '!'
      OR LOWER(l.namaLayanan) LIKE :pola ESCAPE '!'
    )
`;

function bacaFilter(query) {
  const { kataKunci = "", statusPengajuan = "", idLayanan = "" } = query;

  if (typeof kataKunci !== "string") {
    return { error: "Kata kunci harus berupa teks." };
  }

  if (statusPengajuan !== "" && !STATUS_PENGAJUAN.includes(statusPengajuan)) {
    return { error: "Status pengajuan tidak valid." };
  }

  const id = bacaId(idLayanan);

  if (idLayanan !== "" && id === null) {
    return { error: "ID layanan tidak valid." };
  }

  const kata = kataKunci.trim().toLowerCase();
  const kataLiteral = kata.replace(/[!%_]/g, (karakter) => `!${karakter}`);

  return {
    replacements: {
      statusPengajuan: statusPengajuan || null,
      idLayanan: id,
      pola: kata ? `%${kataLiteral}%` : null,
    },
  };
}

function querySelect(sql, replacements = {}, transaction) {
  return Pengajuan.sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements,
    transaction,
  });
}

function ambilDaftarPengajuan(replacements, batas) {
  const adaBatas = batas !== undefined;

  return querySelect(
    `
      SELECT ${KOLOM_DAFTAR}
      ${SUMBER_PENGAJUAN}
      ${FILTER_PENGAJUAN}
      ORDER BY p.tanggalPengajuan DESC, p.idPengajuan DESC
      ${adaBatas ? "LIMIT :batas" : ""}
    `,
    adaBatas ? { ...replacements, batas } : replacements
  );
}

async function ambilIdentitasPengajuan(idPengajuan, transaction) {
  const [data] = await querySelect(
    `
      SELECT ${KOLOM_DAFTAR}, m.programStudi, a.email, p.dataFormulir, p.alasanPenolakan, p.waktuKeputusan
      ${SUMBER_PENGAJUAN}
      JOIN Akun AS a ON a.idAkun = p.idAkun
      WHERE p.idPengajuan = :idPengajuan
    `,
    { idPengajuan },
    transaction
  );

  return data ? { ...data, nomorHp: ambilNomorHp(data.dataFormulir) } : null;
}

async function ambilDokumenVerifikasi(idPengajuan, idLayanan, transaction, dataFormulir) {
  const baris = await querySelect(
    `
      SELECT
        dp.idDokumen,
        dp.namaDokumen,
        dp.wajib,
        dp.kelompokFormulir,
        l.namaLayanan,
        d.idDokumenPengajuan,
        d.namaFile,
        d.formatFile,
        d.ukuranFile,
        d.statusDokumen
      FROM DokumenPersyaratan AS dp
      JOIN Layanan AS l ON l.idLayanan = dp.idLayanan
      LEFT JOIN DokumenPengajuan AS d
        ON d.idDokumen = dp.idDokumen
        AND d.idPengajuan = :idPengajuan
      WHERE dp.idLayanan = :idLayanan
      ORDER BY dp.idDokumen ASC, d.idDokumenPengajuan ASC
    `,
    { idPengajuan, idLayanan },
    transaction
  );

  const perJenisDokumen = new Map();
  const wajibSaatPengajuan = Array.isArray(dataFormulir?.dokumenWajib)
    ? new Set(dataFormulir.dokumenWajib.map(Number))
    : null;

  const berlakuSaatPengajuan = Array.isArray(dataFormulir?.dokumenBerlaku)
    ? new Set(dataFormulir.dokumenBerlaku.map(Number))
    : null;
  const namaLayanan = baris[0]?.namaLayanan;
  const formulir = Object.hasOwn(semuaFormulir, namaLayanan)
    ? semuaFormulir[namaLayanan]
    : null;
  const kondisiKelompok = new Map(
    (formulir?.kelompok ?? []).map(({ judul, aktifJika }) => [judul, aktifJika])
  );

  for (const { idDokumen, namaDokumen, wajib, kelompokFormulir, namaLayanan: _, ...berkas } of baris) {
    const punyaBerkas = berkas.idDokumenPengajuan != null;
    const id = Number(idDokumen);
    const berlaku = berlakuSaatPengajuan
      ? berlakuSaatPengajuan.has(id)
      : !dataFormulir?.isian ||
        kondisiFormulirAktif(kondisiKelompok.get(kelompokFormulir), dataFormulir.isian);

    // Berkas lama tetap dapat diperiksa meski aturan formulir sekarang berbeda.
    if (!punyaBerkas && !berlaku && !wajibSaatPengajuan?.has(id)) continue;

    if (!perJenisDokumen.has(idDokumen)) {
      perJenisDokumen.set(idDokumen, {
        idDokumen,
        namaDokumen,
        wajib: wajibSaatPengajuan ? wajibSaatPengajuan.has(Number(idDokumen)) : Number(wajib) === 1,
        berkas: [],
      });
    }

    if (punyaBerkas) {
      perJenisDokumen.get(idDokumen).berkas.push(berkas);
    }
  }

  const dokumenPersyaratan = [...perJenisDokumen.values()];
  const dokumenWajibBelumTerpenuhi = dokumenPersyaratan
    .filter(
      ({ wajib, berkas }) =>
        wajib &&
        (berkas.length === 0 ||
          berkas.some(({ statusDokumen }) => statusDokumen !== "Sesuai"))
    )
    .map(({ idDokumen, namaDokumen, berkas }) => ({
      idDokumen,
      namaDokumen,
      alasan: berkas.length === 0
        ? "Belum diunggah"
        : "Belum semua berkas dinyatakan sesuai",
    }));

  const berkasBelumDiperiksa = dokumenPersyaratan
    .flatMap(({ berkas }) => berkas)
    .filter(({ statusDokumen }) => !HASIL_VERIFIKASI.includes(statusDokumen));

  return {
    dokumenPersyaratan,
    dokumenWajibBelumTerpenuhi,
    berkasBelumDiperiksa,
    dokumenWajibTerpenuhi: dokumenWajibBelumTerpenuhi.length === 0,
  };
}

function tindakanPengajuan(statusPengajuan, verifikasi) {
  const diproses = statusPengajuan === "Diproses";

  return {
    bisaVerifikasi: diproses,
    bisaLanjutPersetujuan: diproses && verifikasi.dokumenWajibTerpenuhi,
    bisaTolakPengajuan: diproses && verifikasi.berkasBelumDiperiksa.length === 0,
  };
}

function kunciPengajuan(idPengajuan, transaction) {
  return Pengajuan.findByPk(idPengajuan, {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });
}

async function hapusBerkasHasil(lokasiFile) {
  const polaObjek = /^pengajuan\/[1-9]\d*\/[a-f0-9-]{36}\.pdf$/;
  if (!polaObjek.test(lokasiFile ?? "")) return;

  try {
    const { error } = await ambilBucketDokumenHasil().remove([lokasiFile]);
    if (error) throw error;
  } catch (error) {
    console.error("Gagal membersihkan dokumen hasil di Storage.", error.message);
  }
}

export async function melihatRingkasanPengajuan(req, res, next) {
  const filter = bacaFilter(req.query);

  if (filter.error) {
    return res.status(400).json({ message: filter.error });
  }

  try {
    const [statusGlobal, rincianLayanan, pengajuanTerbaru] = await Promise.all([
      querySelect(`
        SELECT statusPengajuan, COUNT(*) AS jumlah
        FROM Pengajuan
        GROUP BY statusPengajuan
      `),
      querySelect(
        `
          SELECT
            layanan.idLayanan,
            layanan.namaLayanan,
            COALESCE(hasil.jumlah, 0) AS jumlah
          FROM Layanan AS layanan
          LEFT JOIN (
            SELECT p.idLayanan, COUNT(*) AS jumlah
            ${SUMBER_PENGAJUAN}
            ${FILTER_PENGAJUAN}
            GROUP BY p.idLayanan
          ) AS hasil ON hasil.idLayanan = layanan.idLayanan
          ORDER BY jumlah DESC, layanan.namaLayanan ASC
        `,
        filter.replacements
      ),
      ambilDaftarPengajuan(filter.replacements, BATAS_PENGAJUAN_TERBARU),
    ]);

    const jumlahPerStatus = new Map(
      statusGlobal.map(({ statusPengajuan, jumlah }) => [
        statusPengajuan,
        Number(jumlah),
      ])
    );

    const total = statusGlobal.reduce(
      (hasil, { jumlah }) => hasil + Number(jumlah),
      0
    );

    const totalHasil = rincianLayanan.reduce(
      (hasil, { jumlah }) => hasil + Number(jumlah),
      0
    );

    const perLayanan = rincianLayanan.map(({ idLayanan, namaLayanan, jumlah }) => ({
      idLayanan,
      namaLayanan,
      jumlah: Number(jumlah),
      persentase: totalHasil
        ? Math.round((Number(jumlah) / totalHasil) * 100)
        : 0,
    }));

    let message = "Ringkasan pengajuan berhasil diambil.";

    if (total === 0) {
      message = "Belum ada data pengajuan.";
    } else if (totalHasil === 0) {
      message = "Tidak ada pengajuan untuk kriteria ini.";
    }

    return res.status(200).json({
      message,
      data: {
        total,
        menungguVerifikasi: jumlahPerStatus.get("Menunggu Verifikasi") ?? 0,
        diproses: jumlahPerStatus.get("Diproses") ?? 0,
        disetujui: jumlahPerStatus.get("Disetujui") ?? 0,
        ditolak: jumlahPerStatus.get("Ditolak") ?? 0,
        totalHasil,
        perLayanan,
        pengajuanTerbaru,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function melihatDaftarPengajuan(req, res, next) {
  const filter = bacaFilter(req.query);

  if (filter.error) {
    return res.status(400).json({ message: filter.error });
  }

  try {
    const data = await ambilDaftarPengajuan(filter.replacements);

    return res.status(200).json({
      message: data.length
        ? "Daftar pengajuan berhasil diambil."
        : "Data pengajuan tidak ditemukan.",
      total: data.length,
      data,
    });
  } catch (error) {
    return next(error);
  }
}

export async function melihatDetailPengajuan(req, res, next) {
  const idPengajuan = bacaId(req.params.idPengajuan);

  if (idPengajuan === null) {
    return res.status(400).json({ message: "ID pengajuan tidak valid." });
  }

  res.set("Cache-Control", "no-store");
  let detailSebelumPerubahan;

  try {
    const hasil = await Pengajuan.sequelize.transaction(async (transaction) => {
      const pengajuan = await kunciPengajuan(idPengajuan, transaction);
      if (!pengajuan) return null;

      const detail = await ambilIdentitasPengajuan(idPengajuan, transaction);
      const verifikasi = await ambilDokumenVerifikasi(
        idPengajuan,
        pengajuan.idLayanan,
        transaction,
        pengajuan.dataFormulir
      );

      const lampiran = verifikasi.dokumenPersyaratan.flatMap(
        ({ idDokumen, namaDokumen, berkas }) =>
          berkas.map((file) => ({ idDokumen, namaDokumen, ...file }))
      );

      const data = {
        ...detail,
        lampiran,
        ...tindakanPengajuan(pengajuan.statusPengajuan, verifikasi),
      };

      if (pengajuan.statusPengajuan !== "Menunggu Verifikasi") {
        return { data, statusBerubah: false };
      }

      detailSebelumPerubahan = data;
      const { tanggal, waktu } = ambilTanggalDanWaktuWib();
      const statusBaru = "Diproses";

      await pengajuan.update({ statusPengajuan: statusBaru }, { transaction });

      await RiwayatStatus.create(
        {
          idPengajuan,
          statusPengajuan: statusBaru,
          tanggalStatus: tanggal,
          waktuStatus: waktu,
        },
        { transaction }
      );

      const notifikasi = await Notifikasi.create(
        {
          idAkun: pengajuan.idAkun,
          idPengajuan,
          pesan: `Pengajuan ${detail.kodePengajuan} (${detail.namaLayanan}) sedang diproses.`,
          statusPengajuan: statusBaru,
          tanggalPerubahan: tanggal,
          waktuPerubahan: waktu,
        },
        { transaction }
      );

      return {
        data: {
          ...data,
          statusPengajuan: statusBaru,
          ...tindakanPengajuan(statusBaru, verifikasi),
        },
        statusBerubah: true,
        email: { notifikasi, detail },
      };
    });

    if (!hasil) {
      return res.status(404).json({ message: "Data pengajuan tidak ditemukan." });
    }

    const { email, ...respons } = hasil;
    if (email) await kirimEmailStatus(email);

    return res.status(200).json({
      message: "Detail pengajuan berhasil diambil.",
      ...respons,
    });
  } catch (error) {
    if (!detailSebelumPerubahan) return next(error);

    console.error("Perubahan status pengajuan gagal disimpan.", error.message);

    return res.status(200).json({
      message: "Perubahan status gagal disimpan.",
      data: detailSebelumPerubahan,
      statusBerubah: false,
    });
  }
}

export async function melihatDataVerifikasi(req, res, next) {
  const idPengajuan = bacaId(req.params.idPengajuan);

  if (idPengajuan === null) {
    return res.status(400).json({ message: "ID pengajuan tidak valid." });
  }

  try {
    const pengajuan = await ambilIdentitasPengajuan(idPengajuan);

    if (!pengajuan) {
      return res.status(404).json({ message: "Data pengajuan tidak ditemukan." });
    }

    const verifikasi = await ambilDokumenVerifikasi(
      idPengajuan,
      pengajuan.idLayanan,
      undefined,
      pengajuan.dataFormulir
    );

    return res.status(200).json({
      message: "Data verifikasi pengajuan berhasil diambil.",
      data: {
        ...pengajuan,
        ...verifikasi,
        ...tindakanPengajuan(pengajuan.statusPengajuan, verifikasi),
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function menyimpanHasilVerifikasi(req, res, next) {
  const idPengajuan = bacaId(req.params.idPengajuan);
  const idDokumenPengajuan = bacaId(req.params.idDokumenPengajuan);
  const statusDokumen = req.body?.statusDokumen;

  if (idPengajuan === null || idDokumenPengajuan === null) {
    return res.status(400).json({
      message: "ID pengajuan atau ID berkas tidak valid.",
    });
  }

  if (!HASIL_VERIFIKASI.includes(statusDokumen)) {
    return res.status(400).json({
      message: "Pilih hasil verifikasi Sesuai atau Tidak Sesuai.",
    });
  }

  try {
    const hasil = await Pengajuan.sequelize.transaction(async (transaction) => {
      const pengajuan = await kunciPengajuan(idPengajuan, transaction);

      if (!pengajuan) {
        return { status: 404, message: "Data pengajuan tidak ditemukan." };
      }

      if (pengajuan.statusPengajuan !== "Diproses") {
        return {
          status: 409,
          message: "Verifikasi hanya bisa disimpan untuk pengajuan berstatus Diproses.",
        };
      }

      const berkas = await DokumenPengajuan.findOne({
        where: { idPengajuan, idDokumenPengajuan },
        transaction,
      });

      if (!berkas) {
        return { status: 404, message: "Berkas tidak ditemukan pada pengajuan ini." };
      }

      await berkas.update({ statusDokumen }, { transaction });

      const verifikasi = await ambilDokumenVerifikasi(
        idPengajuan,
        pengajuan.idLayanan,
        transaction,
        pengajuan.dataFormulir
      );

      return {
        status: 200,
        message: "Hasil verifikasi dokumen berhasil disimpan.",
        data: {
          idPengajuan,
          idDokumenPengajuan,
          statusDokumen,
          statusPengajuan: pengajuan.statusPengajuan,
          dokumenWajibBelumTerpenuhi: verifikasi.dokumenWajibBelumTerpenuhi,
          berkasBelumDiperiksa: verifikasi.berkasBelumDiperiksa,
          ...tindakanPengajuan(pengajuan.statusPengajuan, verifikasi),
        },
      };
    });

    const { status, ...respons } = hasil;
    return res.status(status).json(respons);
  } catch (error) {
    return next(error);
  }
}

export async function mengunggahDokumenHasil(req, res, next) {
  const idPengajuan = bacaId(req.params.idPengajuan);
  const file = req.file;

  if (idPengajuan === null) {
    return res.status(400).json({ message: "ID pengajuan tidak valid." });
  }

  if (!file) {
    return res.status(400).json({
      message: "Silakan pilih dokumen hasil terlebih dahulu.",
    });
  }

  if (file.size > MAKS_UKURAN_DOKUMEN_HASIL) {
    return res.status(413).json({ message: "Ukuran dokumen hasil maksimal 10 MB." });
  }

  const namaAsli = file.originalname.split(/[\\/]/).pop().trim();
  const headerPdf = file.buffer.subarray(0, 8).toString("latin1");
  const akhirPdf = file.buffer.subarray(-1024).toString("latin1").trimEnd();

  if (
    !/\.pdf$/i.test(namaAsli) ||
    !/^%PDF-\d\.\d$/.test(headerPdf) ||
    !akhirPdf.endsWith("%%EOF")
  ) {
    return res.status(400).json({ message: "Dokumen hasil harus berformat PDF." });
  }

  let lokasiBaru;
  let penulisanDatabaseSelesai = false;

  try {
    const hasil = await Pengajuan.sequelize.transaction(async (transaction) => {
      const pengajuan = await kunciPengajuan(idPengajuan, transaction);

      if (!pengajuan) {
        return { status: 404, message: "Data pengajuan tidak ditemukan." };
      }

      if (pengajuan.statusPengajuan !== "Diproses") {
        return {
          status: 409,
          message: "Dokumen hasil hanya dapat diunggah saat pengajuan Diproses.",
        };
      }

      const verifikasi = await ambilDokumenVerifikasi(
        idPengajuan,
        pengajuan.idLayanan,
        transaction,
        pengajuan.dataFormulir
      );

      if (!verifikasi.dokumenWajibTerpenuhi) {
        return {
          status: 409,
          message: "Pengajuan belum memenuhi persyaratan.",
          data: {
            dokumenWajibBelumTerpenuhi: verifikasi.dokumenWajibBelumTerpenuhi,
          },
        };
      }

      const dokumenLama = await DokumenHasil.findOne({
        where: { idPengajuan },
        transaction,
      });

      const lokasiLama = dokumenLama?.lokasiFile;
      const pathObjek = `pengajuan/${idPengajuan}/${randomUUID()}.pdf`;
      const bucket = ambilBucketDokumenHasil();
      lokasiBaru = pathObjek;

      const { error: errorUnggah } = await bucket.upload(
        pathObjek,
        new Blob([file.buffer], { type: "application/pdf" }),
        { contentType: "application/pdf", upsert: false }
      );

      if (errorUnggah) {
        throw new Error("Dokumen hasil gagal diunggah ke Storage.", {
          cause: errorUnggah,
        });
      }

      const { tanggal } = ambilTanggalDanWaktuWib();
      const nilai = {
        idPengajuan,
        namaDokumen: `${namaAsli.slice(0, -4).slice(0, 146)}.pdf`,
        lokasiFile: pathObjek,
        tanggalUpload: tanggal,
      };

      const dokumen = dokumenLama
        ? await dokumenLama.update(nilai, { transaction })
        : await DokumenHasil.create(nilai, { transaction });

      penulisanDatabaseSelesai = true;

      return {
        status: dokumenLama ? 200 : 201,
        message: dokumenLama
          ? "Dokumen hasil berhasil diganti."
          : "Dokumen hasil berhasil diunggah.",
        lokasiLama,
        data: {
          idDokumenHasil: dokumen.idDokumenHasil,
          idPengajuan,
          namaDokumen: dokumen.namaDokumen,
          tanggalUpload: dokumen.tanggalUpload,
          ukuranFile: file.size,
          statusPengajuan: pengajuan.statusPengajuan,
          versiDokumenHasil: pathObjek.split("/").pop(),
          bisaTinjauPersetujuan: true,
        },
      };
    });

    const { status, lokasiLama, ...respons } = hasil;
    await hapusBerkasHasil(lokasiLama);

    return res.status(status).json(respons);
  } catch (error) {
    // Jika hasil commit belum pasti, pertahankan PDF yang mungkin sudah dirujuk MySQL.
    if (!penulisanDatabaseSelesai) {
      await hapusBerkasHasil(lokasiBaru);
    }

    return next(error);
  }
}

export async function menyetujuiPengajuan(req, res, next) {
  const idPengajuan = bacaId(req.params.idPengajuan);
  const idAkunStaf = req.akun.idAkun;
  const versiDokumenHasil = req.body?.versiDokumenHasil;

  if (idPengajuan === null) {
    return res.status(400).json({
      message: "ID pengajuan tidak valid.",
    });
  }

  if (!idAkunStaf) {
    return res.status(401).json({
      message: "Sesi staf tidak valid. Silakan login kembali.",
    });
  }

  if (
    typeof versiDokumenHasil !== "string" ||
    !/^[a-f0-9-]{36}\.pdf$/.test(versiDokumenHasil)
  ) {
    return res.status(400).json({
      message: "Tinjau dokumen hasil sebelum mengonfirmasi persetujuan.",
    });
  }

  try {
    const hasil = await Pengajuan.sequelize.transaction(async (transaction) => {
      const pengajuan = await kunciPengajuan(idPengajuan, transaction);

      if (!pengajuan) {
        return { status: 404, message: "Data pengajuan tidak ditemukan." };
      }

      if (["Disetujui", "Ditolak"].includes(pengajuan.statusPengajuan)) {
        return {
          status: 409,
          message: "Pengajuan telah memiliki keputusan akhir.",
        };
      }

      if (pengajuan.statusPengajuan !== "Diproses") {
        return {
          status: 409,
          message: "Buka detail dan proses pengajuan sebelum menyetujuinya.",
        };
      }

      const staf = await StafKemahasiswaan.findOne({
        where: { idAkun: idAkunStaf },
        attributes: ["idStaf"],
        transaction,
      });

      if (!staf) {
        return { status: 403, message: "Data staf tidak ditemukan." };
      }

      const verifikasi = await ambilDokumenVerifikasi(
        idPengajuan,
        pengajuan.idLayanan,
        transaction,
        pengajuan.dataFormulir
      );

      if (!verifikasi.dokumenWajibTerpenuhi) {
        return {
          status: 409,
          message: "Pengajuan belum memenuhi persyaratan.",
          data: {
            dokumenWajibBelumTerpenuhi: verifikasi.dokumenWajibBelumTerpenuhi,
          },
        };
      }

      const dokumen = await DokumenHasil.findOne({
        where: { idPengajuan },
        transaction,
      });

      if (!dokumen?.lokasiFile) {
        return {
          status: 409,
          message: "Unggah dokumen hasil PDF sebelum menyetujui pengajuan.",
        };
      }

      const pathDitinjau = `pengajuan/${idPengajuan}/${versiDokumenHasil}`;

      if (dokumen.lokasiFile !== pathDitinjau) {
        return {
          status: 409,
          message: "Versi dokumen hasil berbeda. Tinjau PDF terbaru sebelum menyetujui.",
        };
      }

      const { data: infoFile, error: errorStorage } =
        await ambilBucketDokumenHasil().info(dokumen.lokasiFile);

      if (errorStorage) {
        const tidakDitemukan =
          Number(errorStorage.statusCode ?? errorStorage.status) === 404;

        return {
          status: tidakDitemukan ? 409 : 502,
          message: tidakDitemukan
            ? "PDF tidak ditemukan di Storage. Unggah ulang dokumen hasil."
            : "Dokumen hasil belum bisa diperiksa di Storage. Coba lagi.",
        };
      }

      const ukuranFile = Number(infoFile?.size);

      if (
        !Number.isFinite(ukuranFile) ||
        ukuranFile <= 0 ||
        ukuranFile > MAKS_UKURAN_DOKUMEN_HASIL
      ) {
        return {
          status: 409,
          message: "Unggah ulang dokumen hasil PDF dengan ukuran maksimal 10 MB.",
        };
      }

      const detail = await ambilIdentitasPengajuan(idPengajuan, transaction);
      const waktuKeputusan = new Date();
      const { tanggal, waktu } = ambilTanggalDanWaktuWib(waktuKeputusan);

      await pengajuan.update(
        {
          statusPengajuan: "Disetujui",
          idStaf: staf.idStaf,
          waktuKeputusan,
        },
        { transaction }
      );

      await RiwayatStatus.create(
        {
          idPengajuan,
          statusPengajuan: "Disetujui",
          tanggalStatus: tanggal,
          waktuStatus: waktu,
        },
        { transaction }
      );

      const notifikasi = await Notifikasi.create(
        {
          idAkun: pengajuan.idAkun,
          idPengajuan,
          pesan: `Pengajuan ${detail.kodePengajuan} (${detail.namaLayanan}) disetujui. Dokumen hasil sudah tersedia.`,
          statusPengajuan: "Disetujui",
          tanggalPerubahan: tanggal,
          waktuPerubahan: waktu,
        },
        { transaction }
      );

      return {
        status: 200,
        message: "Pengajuan berhasil disetujui.",
        email: { notifikasi, detail, dokumen },
        data: {
          idPengajuan,
          statusPengajuan: "Disetujui",
          idStaf: staf.idStaf,
          waktuKeputusan,
          idDokumenHasil: dokumen.idDokumenHasil,
        },
      };
    });

    const { status, email, ...respons } = hasil;
    if (email) await kirimEmailStatus(email);
    return res.status(status).json(respons);
  } catch (error) {
    return next(error);
  }
}
export async function menolakPengajuan(req, res, next) {
  const idPengajuan = bacaId(req.params.idPengajuan);
  const alasanPenolakan = typeof req.body?.alasanPenolakan === "string"
    ? req.body.alasanPenolakan.trim()
    : "";

  if (idPengajuan === null || !alasanPenolakan || alasanPenolakan.length > 2000) {
    return res.status(400).json({
      message: "Gunakan ID pengajuan yang valid dan isi alasan penolakan (maksimal 2.000 karakter).",
    });
  }

  try {
    const hasil = await Pengajuan.sequelize.transaction(async (transaction) => {
      const pengajuan = await kunciPengajuan(idPengajuan, transaction);

      if (!pengajuan) {
        return { status: 404, message: "Data pengajuan tidak ditemukan." };
      }

      if (pengajuan.statusPengajuan !== "Diproses") {
        return { status: 409, message: "Pengajuan harus berstatus Diproses agar dapat ditolak." };
      }

      const staf = await StafKemahasiswaan.findOne({
        where: { idAkun: req.akun.idAkun },
        attributes: ["idStaf"],
        transaction,
      });

      if (!staf) {
        return { status: 403, message: "Data staf tidak ditemukan." };
      }

      const verifikasi = await ambilDokumenVerifikasi(
        idPengajuan, pengajuan.idLayanan, transaction, pengajuan.dataFormulir
      );
      const { berkasBelumDiperiksa } = verifikasi;

      if (berkasBelumDiperiksa.length > 0) {
        return {
          status: 409,
          message: "Periksa hasil verifikasi setiap berkas sebelum menolak pengajuan.",
          data: { berkasBelumDiperiksa },
        };
      }

      const detail = await ambilIdentitasPengajuan(idPengajuan, transaction);
      const waktuKeputusan = new Date();
      const { tanggal, waktu } = ambilTanggalDanWaktuWib(waktuKeputusan);
      const statusPengajuan = "Ditolak";

      await pengajuan.update(
        { statusPengajuan, alasanPenolakan, idStaf: staf.idStaf, waktuKeputusan },
        { transaction }
      );

      await RiwayatStatus.create(
        { idPengajuan, statusPengajuan, tanggalStatus: tanggal, waktuStatus: waktu },
        { transaction }
      );

      const notifikasi = await Notifikasi.create({
        idAkun: pengajuan.idAkun,
        idPengajuan,
        pesan: `Pengajuan ${detail.kodePengajuan} (${detail.namaLayanan}) ditolak. Alasan: ${alasanPenolakan}`,
        statusPengajuan,
        tanggalPerubahan: tanggal,
        waktuPerubahan: waktu,
      }, { transaction });

      return {
        status: 200,
        message: "Pengajuan berhasil ditolak.",
        email: { notifikasi, detail, alasanPenolakan },
        data: { idPengajuan, statusPengajuan, alasanPenolakan, idStaf: staf.idStaf, waktuKeputusan },
      };
    });

    const { status, email, ...respons } = hasil;
    if (email) await kirimEmailStatus(email);
    return res.status(status).json(respons);
  } catch (error) {
    return next(error);
  }
}

export async function melihatBerkasPengajuan(req, res, next) {
  const idPengajuan = bacaId(req.params.idPengajuan);
  const idDokumenPengajuan = bacaId(req.params.idDokumenPengajuan);

  if (idPengajuan === null || idDokumenPengajuan === null) {
    return res.status(400).json({ message: "ID pengajuan atau ID berkas tidak valid." });
  }

  try {
    const berkas = await DokumenPengajuan.findOne({
      where: { idPengajuan, idDokumenPengajuan },
    });

    if (!berkas || !berkas.lokasiFile.startsWith(`pengajuan/${idPengajuan}/`)) {
      return res.status(404).json({ message: "Berkas pengajuan tidak tersedia di Storage." });
    }

    const unduh = berkas.formatFile === "PDF" ? false : berkas.namaFile;
    return await kirimTautanBerkas(res, ambilBucketLampiranPengajuan(), berkas.lokasiFile, unduh);
  } catch (error) {
    return next(error);
  }
}

export async function melihatDokumenHasilStaf(req, res, next) {
  const idPengajuan = bacaId(req.params.idPengajuan);

  if (idPengajuan === null) {
    return res.status(400).json({ message: "ID pengajuan tidak valid." });
  }

  try {
    const dokumen = await DokumenHasil.findOne({ where: { idPengajuan } });

    if (!dokumen?.lokasiFile?.startsWith(`pengajuan/${idPengajuan}/`)) {
      return res.status(404).json({ message: "Dokumen hasil belum tersedia di Storage." });
    }

    const { data, error } = await ambilBucketDokumenHasil()
      .createSignedUrl(dokumen.lokasiFile, 120);

    if (error || !data?.signedUrl) {
      return res.status(502).json({ message: "Dokumen hasil belum bisa ditinjau di Storage." });
    }

    return res.set("Cache-Control", "no-store").json({
      data: {
        idPengajuan,
        idDokumenHasil: dokumen.idDokumenHasil,
        namaDokumen: dokumen.namaDokumen,
        tanggalUpload: dokumen.tanggalUpload,
        versiDokumenHasil: dokumen.lokasiFile.split("/").pop(),
        url: data.signedUrl,
        berlakuDetik: 120,
      },
    });
  } catch (error) {
    return next(error);
  }
}
