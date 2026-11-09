import { randomUUID } from "node:crypto";
import { QueryTypes } from "sequelize";
import semuaFormulir from "../config/formulirLayanan.js";
import {
  ambilBucketDokumenHasil,
  ambilBucketLampiranPengajuan,
} from "../config/storage.js";
import {
  DokumenHasil,
  DokumenPengajuan,
  DokumenPersyaratan,
  Layanan,
  Mahasiswa,
  Notifikasi,
  Pengajuan,
  RiwayatStatus,
} from "../models/index.js";
import {
  bacaLampiran,
  kelompokkanLampiran,
  validasiFormulir,
} from "../services/formulirPengajuan.js";
import {
  ambilNomorHp,
  ambilTanggalDanWaktuWib,
  bacaId,
  kodePengajuan,
  KODE_PENGAJUAN_SQL,
  STATUS_PENGAJUAN,
} from "../utils/pengajuan.js";
import { kirimEmailSalinan } from "../services/emailPengajuan.js";
import { kirimTautanBerkas } from "../utils/tautanBerkas.js";

async function ambilProfil(akun) {
  const mahasiswa = await Mahasiswa.findOne({
    where: { idAkun: akun.idAkun },
    attributes: ["nim", "namaMahasiswa", "programStudi"],
    raw: true,
  });

  return mahasiswa ? { ...mahasiswa, email: akun.email } : null;
}

export async function melihatProfilMahasiswa(req, res, next) {
  try {
    const data = await ambilProfil(req.akun);
    if (!data) return res.status(403).json({ message: "Profil mahasiswa belum tersedia." });
    return res.json({ data });
  } catch (error) {
    return next(error);
  }
}

export async function mengirimPengajuan(req, res, next) {
  const idLayanan = bacaId(req.body?.idLayanan);
  const kirimSalinanEmail = req.body?.kirimSalinanEmail;

  if (kirimSalinanEmail !== undefined && !["true", "false"].includes(kirimSalinanEmail)) {
    return res.status(400).json({ message: "Isi kirimSalinanEmail dengan true atau false." });
  }

  if (idLayanan === null) {
    return res.status(400).json({ message: "ID layanan tidak valid." });
  }

  const lokasiDiunggah = [];
  let siapCommit = false;

  try {
    const identitas = await ambilProfil(req.akun);

    if (!identitas) {
      return res.status(403).json({ message: "Profil mahasiswa belum tersedia." });
    }

    const hasil = await Pengajuan.sequelize.transaction(async (transaction) => {
      const layanan = await Layanan.findByPk(idLayanan, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!layanan) return { status: 404, message: "Layanan tidak ditemukan." };

      const formulir = Object.hasOwn(semuaFormulir, layanan.namaLayanan)
        ? semuaFormulir[layanan.namaLayanan]
        : null;

      if (
        layanan.statusLayanan !== "Aktif" || !formulir?.kelompok.length ||
        formulir.statusFormulir === "ditutup"
      ) {
        return { status: 409, message: "Layanan ini tidak menerima pengajuan." };
      }

      if (kirimSalinanEmail === "true" && !formulir.bolehKirimSalinanEmail) {
        return { status: 400, message: "Salinan email tidak tersedia untuk layanan ini." };
      }

      const dokumenMaster = await DokumenPersyaratan.findAll({
        where: { idLayanan },
        transaction,
        raw: true,
      });
      const isian = validasiFormulir(req.body.isianFormulir, formulir, identitas);

      if (isian.message) return { status: 400, ...isian };

      const kelompokBersyarat = new Set(
        formulir.kelompok.filter(({ bersyarat }) => bersyarat).map(({ judul }) => judul)
      );
      const dokumenBerlaku = dokumenMaster.filter(({ kelompokFormulir }) =>
        !kelompokBersyarat.has(kelompokFormulir) || isian.kelompokAktif.has(kelompokFormulir)
      );

      const hasilLampiran = kelompokkanLampiran(req.files ?? [], dokumenBerlaku);
      if (hasilLampiran.message) return { status: 400, ...hasilLampiran };

      const { tanggal, waktu } = ambilTanggalDanWaktuWib();
      const statusPengajuan = "Menunggu Verifikasi";
      const pengajuan = await Pengajuan.create({
        idAkun: req.akun.idAkun,
        idLayanan,
        tanggalPengajuan: tanggal,
        statusPengajuan,
        dataFormulir: {
          isian: isian.data,
          dokumenBerlaku: dokumenBerlaku.map(({ idDokumen }) => idDokumen),
          dokumenWajib: dokumenBerlaku.filter(({ wajib }) => wajib).map(({ idDokumen }) => idDokumen),
        },
      }, { transaction });

      for (const lampiran of hasilLampiran.lampiran) {
        const buffer = await bacaLampiran(lampiran);

        if (!buffer) {
          const error = new Error(`Isi berkas "${lampiran.namaFile}" tidak sesuai format.`);
          error.status = 400;
          throw error;
        }

        const lokasiFile = `pengajuan/${pengajuan.idPengajuan}/${randomUUID()}${lampiran.ekstensi}`;
        lokasiDiunggah.push(lokasiFile);

        const { error } = await ambilBucketLampiranPengajuan().upload(lokasiFile, buffer, {
          contentType: lampiran.contentType,
          upsert: false,
        });

        if (error) throw new Error("Lampiran gagal disimpan di Storage.", { cause: error });

        const { idDokumen, namaFile, formatFile, ukuranFile } = lampiran;
        await DokumenPengajuan.create({
          idPengajuan: pengajuan.idPengajuan,
          idDokumen,
          namaFile,
          formatFile,
          ukuranFile,
          lokasiFile,
        }, { transaction });
      }

      await RiwayatStatus.create({
        idPengajuan: pengajuan.idPengajuan,
        statusPengajuan,
        tanggalStatus: tanggal,
        waktuStatus: waktu,
      }, { transaction });

      siapCommit = true;

      const kode = kodePengajuan(pengajuan);
      return {
        status: 201,
        message: "Pengajuan berhasil dikirim.",
        salinan: kirimSalinanEmail === "true" ? {
          penerima: identitas.email,
          kodePengajuan: kode,
          namaLayanan: layanan.namaLayanan,
          isian: isian.data,
          lampiran: hasilLampiran.lampiran,
        } : null,
        data: {
          idPengajuan: pengajuan.idPengajuan,
          kodePengajuan: kode,
          tanggalPengajuan: tanggal,
          statusPengajuan,
        },
      };
    });

    const { status, salinan, ...respons } = hasil;
    if (salinan) {
      respons.data.statusSalinanEmail = await kirimEmailSalinan(salinan);
    }
    return res.status(status).json(respons);
  } catch (error) {
    if (!siapCommit && lokasiDiunggah.length) {
      try {
        const { error: kesalahanHapus } = await ambilBucketLampiranPengajuan().remove(lokasiDiunggah);
        if (kesalahanHapus) throw kesalahanHapus;
      } catch (kesalahanHapus) {
        console.error("Lampiran sementara gagal dibersihkan dari Storage.", kesalahanHapus.message);
      }
    }

    if (error.status === 400) return res.status(400).json({ message: error.message });
    return next(error);
  }
}

export async function melihatPengajuanSaya(req, res, next) {
  const { kataKunci = "", statusPengajuan = "", idLayanan = "" } = req.query;
  const id = bacaId(idLayanan);

  if (
    typeof kataKunci !== "string" ||
    (statusPengajuan !== "" && !STATUS_PENGAJUAN.includes(statusPengajuan)) ||
    (idLayanan !== "" && id === null)
  ) {
    return res.status(400).json({ message: "Kata kunci atau filter pengajuan tidak valid." });
  }

  const kata = kataKunci.trim().toLowerCase().replace(/[!%_]/g, (karakter) => `!${karakter}`);

  try {
    const data = await Pengajuan.sequelize.query(
      `
        SELECT p.idPengajuan, ${KODE_PENGAJUAN_SQL} AS kodePengajuan,
          p.idLayanan, l.namaLayanan, p.tanggalPengajuan, p.statusPengajuan
        FROM Pengajuan AS p
        JOIN Layanan AS l ON l.idLayanan = p.idLayanan
        WHERE p.idAkun = :idAkun
          AND (:statusPengajuan IS NULL OR p.statusPengajuan = :statusPengajuan)
          AND (:idLayanan IS NULL OR p.idLayanan = :idLayanan)
          AND (
            :pola IS NULL OR LOWER(${KODE_PENGAJUAN_SQL}) LIKE :pola ESCAPE '!'
            OR CAST(p.idPengajuan AS CHAR) LIKE :pola ESCAPE '!'
            OR LOWER(l.namaLayanan) LIKE :pola ESCAPE '!'
          )
        ORDER BY p.tanggalPengajuan DESC, p.idPengajuan DESC
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          idAkun: req.akun.idAkun,
          statusPengajuan: statusPengajuan || null,
          idLayanan: id,
          pola: kata ? `%${kata}%` : null,
        },
      }
    );

    return res.json({
      message: data.length ? "Riwayat pengajuan berhasil diambil." : "Data pengajuan tidak ditemukan.",
      total: data.length,
      data,
    });
  } catch (error) {
    return next(error);
  }
}

function ambilPengajuanMilik(req, idPengajuan, options = {}) {
  return Pengajuan.findOne({
    ...options,
    where: { idPengajuan, idAkun: req.akun.idAkun },
  });
}

function responsPengajuanTidakAda(res) {
  return res.status(404).json({ message: "Data pengajuan tidak ditemukan." });
}

export async function melihatDetailPengajuanSaya(req, res, next) {
  const idPengajuan = bacaId(req.params.idPengajuan);
  if (idPengajuan === null) return res.status(400).json({ message: "ID pengajuan tidak valid." });

  try {
    const pengajuan = await ambilPengajuanMilik(req, idPengajuan, {
      attributes: [
        "idPengajuan", "idLayanan", "tanggalPengajuan", "statusPengajuan",
        "alasanPenolakan", "waktuKeputusan", "dataFormulir",
      ],
      include: [
        { association: "layanan", attributes: ["namaLayanan"] },
        { association: "dokumenHasil", attributes: ["idDokumenHasil", "namaDokumen", "tanggalUpload"] },
      ],
    });

    if (!pengajuan) return responsPengajuanTidakAda(res);

    const [mahasiswa, lampiran, riwayatStatus] = await Promise.all([
      ambilProfil(req.akun),
      DokumenPengajuan.findAll({
        where: { idPengajuan },
        attributes: ["idDokumenPengajuan", "idDokumen", "namaFile", "formatFile", "ukuranFile", "statusDokumen"],
        include: [{ association: "dokumenPersyaratan", attributes: ["namaDokumen"] }],
        order: [["idDokumenPengajuan", "ASC"]],
      }),
      ambilRiwayatStatus(idPengajuan),
    ]);
    const { layanan, dokumenHasil, dataFormulir, alasanPenolakan, ...detail } = pengajuan.toJSON();

    return res.set("Cache-Control", "no-store").json({
      data: {
        ...detail,
        kodePengajuan: kodePengajuan(detail),
        namaLayanan: layanan?.namaLayanan ?? null,
        mahasiswa: mahasiswa ? { ...mahasiswa, nomorHp: ambilNomorHp(dataFormulir) } : null,
        isianFormulir: dataFormulir?.isian ?? null,
        alasanPenolakan: detail.statusPengajuan === "Ditolak" ? alasanPenolakan : null,
        dokumenHasil: detail.statusPengajuan === "Disetujui" ? dokumenHasil : null,
        lampiran,
        riwayatStatus,
      },
    });
  } catch (error) {
    return next(error);
  }
}

function ambilRiwayatStatus(idPengajuan) {
  return RiwayatStatus.findAll({
    where: { idPengajuan },
    attributes: ["statusPengajuan", "tanggalStatus", "waktuStatus"],
    order: [["tanggalStatus", "ASC"], ["waktuStatus", "ASC"], ["idRiwayat", "ASC"]],
  });
}

export async function melacakStatusPengajuan(req, res, next) {
  const idPengajuan = bacaId(req.params.idPengajuan);
  if (idPengajuan === null) return res.status(400).json({ message: "ID pengajuan tidak valid." });

  try {
    const pengajuan = await ambilPengajuanMilik(req, idPengajuan, {
      attributes: ["idPengajuan", "tanggalPengajuan", "statusPengajuan", "alasanPenolakan"],
    });

    if (!pengajuan) return responsPengajuanTidakAda(res);

    return res.set("Cache-Control", "no-store").json({
      data: {
        idPengajuan,
        kodePengajuan: kodePengajuan(pengajuan),
        statusPengajuan: pengajuan.statusPengajuan,
        alasanPenolakan: pengajuan.statusPengajuan === "Ditolak" ? pengajuan.alasanPenolakan : null,
        riwayatStatus: await ambilRiwayatStatus(idPengajuan),
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function mengunduhDokumenHasil(req, res, next) {
  const idPengajuan = bacaId(req.params.idPengajuan);
  if (idPengajuan === null) return res.status(400).json({ message: "ID pengajuan tidak valid." });

  try {
    const pengajuan = await ambilPengajuanMilik(req, idPengajuan, {
      attributes: ["idPengajuan", "statusPengajuan"],
    });

    if (!pengajuan) return responsPengajuanTidakAda(res);

    if (pengajuan.statusPengajuan !== "Disetujui") {
      return res.status(409).json({ message: "Dokumen hasil tersedia setelah pengajuan disetujui." });
    }

    const dokumen = await DokumenHasil.findOne({ where: { idPengajuan } });

    if (!dokumen?.lokasiFile?.startsWith(`pengajuan/${idPengajuan}/`)) {
      return res.status(404).json({ message: "Dokumen hasil tidak tersedia di Storage." });
    }

    return await kirimTautanBerkas(
      res, ambilBucketDokumenHasil(), dokumen.lokasiFile, dokumen.namaDokumen
    );
  } catch (error) {
    return next(error);
  }
}

export async function melihatNotifikasi(req, res, next) {
  try {
    const notifikasi = await Notifikasi.findAll({
      where: { idAkun: req.akun.idAkun },
      attributes: ["idNotifikasi", "idPengajuan", "pesan", "statusPengajuan", "tanggalPerubahan", "waktuPerubahan"],
      include: [{
        association: "pengajuan",
        attributes: ["idPengajuan", "tanggalPengajuan"],
        include: [{ association: "layanan", attributes: ["namaLayanan"] }],
      }],
      order: [["idNotifikasi", "DESC"]],
    });
    const data = notifikasi.map((item) => {
      const { pengajuan, ...isi } = item.toJSON();

      return {
        ...isi,
        kodePengajuan: pengajuan ? kodePengajuan(pengajuan) : null,
        namaLayanan: pengajuan?.layanan?.namaLayanan ?? null,
      };
    });

    return res.set("Cache-Control", "no-store").json({ total: data.length, data });
  } catch (error) {
    return next(error);
  }
}
