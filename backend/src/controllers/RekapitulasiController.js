import { Op } from "sequelize";
import { Pengajuan, Mahasiswa, Layanan } from "../models/index.js";
import { buatFileRekapitulasi } from "../utils/fileRekapitulasi.js";
import { bacaId, kodePengajuan, STATUS_PENGAJUAN } from "../utils/pengajuan.js";

function tanggalValid(nilai) {
  if (typeof nilai !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(nilai)) {
    return false;
  }

  const tanggal = new Date(`${nilai}T00:00:00.000Z`);

  return (
    Number.isFinite(tanggal.getTime()) &&
    tanggal.toISOString().slice(0, 10) === nilai
  );
}

async function prosesRekapitulasi(req, res, next, format = null) {
  try {
    const { idLayanan, statusPengajuan, tanggalMulai, tanggalAkhir } = req.query;
    const filter = {};

    if (idLayanan !== undefined) {
      const id = bacaId(idLayanan);
      if (id === null) {
        return res.status(400).json({
          message: "ID layanan tidak valid.",
        });
      }

      filter.idLayanan = id;
    }

    if (statusPengajuan !== undefined) {
      if (typeof statusPengajuan !== "string" || !STATUS_PENGAJUAN.includes(statusPengajuan.trim())) {
        return res.status(400).json({
          message: "Status pengajuan tidak valid.",
        });
      }

      filter.statusPengajuan = statusPengajuan.trim();
    }

    if (
      (tanggalMulai !== undefined && !tanggalValid(tanggalMulai)) ||
      (tanggalAkhir !== undefined && !tanggalValid(tanggalAkhir))
    ) {
      return res.status(400).json({
        message: "Gunakan tanggal yang valid dengan format YYYY-MM-DD.",
      });
    }

    if (tanggalMulai && tanggalAkhir && tanggalMulai > tanggalAkhir) {
      return res.status(400).json({
        message: "Tanggal mulai harus sebelum atau sama dengan tanggal akhir.",
      });
    }

    if (tanggalMulai || tanggalAkhir) {
      filter.tanggalPengajuan = {};

      if (tanggalMulai) {
        filter.tanggalPengajuan[Op.gte] = tanggalMulai;
      }

      if (tanggalAkhir) {
        filter.tanggalPengajuan[Op.lte] = tanggalAkhir;
      }
    }

    const kriteria = {
      idLayanan: filter.idLayanan ?? null,
      namaLayanan: null,
      statusPengajuan: filter.statusPengajuan ?? null,
      tanggalMulai: tanggalMulai ?? null,
      tanggalAkhir: tanggalAkhir ?? null,
    };

    const pengajuan = await Pengajuan.findAll({
      where: filter,
      attributes: [
        "idPengajuan",
        "idAkun",
        "idLayanan",
        "tanggalPengajuan",
        "statusPengajuan",
      ],
      order: [
        ["tanggalPengajuan", "DESC"],
        ["idPengajuan", "DESC"],
      ],
      raw: true,
    });

    if (pengajuan.length === 0) {
      if (format) {
        return res.status(409).json({ message: "Tidak ada data rekapitulasi yang dapat diunduh." });
      }

      const adaFilter = Object.keys(filter).length > 0;

      return res.status(200).json({
        message: adaFilter
          ? "Tidak ada pengajuan yang sesuai dengan filter."
          : "Belum ada data pengajuan.",
        total: 0,
        kriteria,
        data: [],
      });
    }

    const idAkunList = [...new Set(pengajuan.map((item) => item.idAkun))];
    const idLayananList = [...new Set(pengajuan.map((item) => item.idLayanan))];

    const [mahasiswa, layanan] = await Promise.all([
      Mahasiswa.findAll({
        where: { idAkun: { [Op.in]: idAkunList } },
        attributes: ["idAkun", "nim", "namaMahasiswa"],
        raw: true,
      }),
      Layanan.findAll({
        where: { idLayanan: { [Op.in]: idLayananList } },
        attributes: ["idLayanan", "namaLayanan"],
        raw: true,
      }),
    ]);

    const mahasiswaPerAkun = new Map(
      mahasiswa.map((item) => [item.idAkun, item])
    );
    const namaPerLayanan = new Map(
      layanan.map((item) => [item.idLayanan, item.namaLayanan])
    );

    const data = pengajuan.map((item) => {
      const pemohon = mahasiswaPerAkun.get(item.idAkun);

      return {
        idPengajuan: item.idPengajuan,
        kodePengajuan: kodePengajuan(item),
        namaMahasiswa: pemohon?.namaMahasiswa ?? null,
        nim: pemohon?.nim ?? null,
        idLayanan: item.idLayanan,
        namaLayanan: namaPerLayanan.get(item.idLayanan) ?? null,
        tanggalPengajuan: item.tanggalPengajuan,
        statusPengajuan: item.statusPengajuan,
      };
    });

    kriteria.namaLayanan = namaPerLayanan.get(filter.idLayanan) ?? null;

    if (format) {
      const file = await buatFileRekapitulasi(data, format, kriteria);

      res.attachment(file.nama);
      res.type(file.tipe);
      return res.send(file.isi);
    }

    return res.status(200).json({
      message: "Rekapitulasi pengajuan berhasil diambil.",
      total: data.length,
      kriteria,
      data,
    });
  } catch (error) {
    return next(error);
  }
}

export function melihatRekapitulasiPengajuan(req, res, next) {
  return prosesRekapitulasi(req, res, next);
}

export function mengunduhRekapitulasiPengajuan(req, res, next) {
  const { format } = req.query;

  if (format !== "pdf" && format !== "xlsx") {
    return res.status(400).json({
      message: "Pilih format unduhan pdf atau xlsx.",
    });
  }

  return prosesRekapitulasi(req, res, next, format);
}
