import {
  Layanan,
  Persyaratan,
  DokumenPersyaratan,
} from "../models/index.js";

function membacaIdLayanan(nilai) {
  if (!/^[1-9]\d*$/.test(nilai)) {
    return null;
  }

  const idLayanan = Number(nilai);

  return Number.isSafeInteger(idLayanan) ? idLayanan : null;
}

export async function melihatDaftarLayanan(req, res, next) {
  try {
    const daftarLayanan = await Layanan.findAll({
      order: [["idLayanan", "ASC"]],
    });

    return res.status(200).json({
      message: "Daftar layanan berhasil diambil.",
      data: daftarLayanan,
    });
  } catch (error) {
    next(error);
  }
}

export async function melihatDetailLayanan(req, res, next) {
  try {
    const idLayanan = membacaIdLayanan(req.params.idLayanan);

    if (idLayanan === null) {
      return res.status(400).json({
        message: "ID layanan harus berupa bilangan bulat positif.",
      });
    }

    const layanan = await Layanan.findByPk(idLayanan);

    if (!layanan) {
      return res.status(404).json({
        message: "Layanan tidak ditemukan.",
      });
    }

    return res.status(200).json({
      message: "Detail layanan berhasil diambil.",
      data: layanan,
    });
  } catch (error) {
    next(error);
  }
}

export async function melihatPersyaratanLayanan(req, res, next) {
  try {
    const idLayanan = membacaIdLayanan(req.params.idLayanan);

    if (idLayanan === null) {
      return res.status(400).json({
        message: "ID layanan harus berupa bilangan bulat positif.",
      });
    }

    const layanan = await Layanan.findByPk(idLayanan, {
      include: [
        {
          model: Persyaratan,
          as: "persyaratan",
        },
        {
          model: DokumenPersyaratan,
          as: "dokumenPersyaratan",
        },
      ],
      order: [
        [
          { model: Persyaratan, as: "persyaratan" },
          "idPersyaratan",
          "ASC",
        ],
        [
          {
            model: DokumenPersyaratan,
            as: "dokumenPersyaratan",
          },
          "idDokumen",
          "ASC",
        ],
      ],
    });

    if (!layanan) {
      return res.status(404).json({
        message: "Layanan tidak ditemukan.",
      });
    }

    return res.status(200).json({
      message: "Persyaratan layanan berhasil diambil.",
      data: layanan,
    });
  } catch (error) {
    next(error);
  }
}

export async function memperbaruiInformasiLayanan(req, res, next) {
  try {
    const idLayanan = membacaIdLayanan(req.params.idLayanan);

    if (idLayanan === null) {
      return res.status(400).json({
        message: "ID layanan harus berupa bilangan bulat positif.",
      });
    }

    const body = req.body;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({
        message: "Body harus berupa objek JSON.",
      });
    }

    const fieldDiizinkan = ["informasiLayanan"];
    const daftarField = Object.keys(body);

    if (daftarField.length === 0) {
      return res.status(400).json({
        message: "Isi minimal satu field yang ingin diperbarui.",
      });
    }

    const fieldTidakDikenal = daftarField.filter(
      (field) => !fieldDiizinkan.includes(field)
    );

    if (fieldTidakDikenal.length > 0) {
      return res.status(400).json({
        message: "Terdapat field yang tidak dapat diperbarui.",
        fields: fieldTidakDikenal,
      });
    }

    const perubahan = {};

    for (const field of daftarField) {
      if (
        typeof body[field] !== "string" ||
        body[field].trim() === ""
      ) {
        return res.status(400).json({
          message: `${field} harus berupa teks dan tidak boleh kosong.`,
        });
      }

      perubahan[field] = body[field].trim();
    }

    if (
      perubahan.namaLayanan !== undefined &&
      [...perubahan.namaLayanan].length > 100
    ) {
      return res.status(400).json({
        message: "Nama layanan maksimal 100 karakter.",
      });
    }

    if (
      perubahan.informasiLayanan !== undefined &&
      Buffer.byteLength(perubahan.informasiLayanan, "utf8") > 65535
    ) {
      return res.status(400).json({
        message: "Informasi layanan melebihi kapasitas kolom TEXT.",
      });
    }

    const layanan = await Layanan.findByPk(idLayanan);

    if (!layanan) {
      return res.status(404).json({
        message: "Layanan tidak ditemukan.",
      });
    }

    await layanan.update(perubahan, {
      fields: fieldDiizinkan,
    });

    return res.status(200).json({
      message: "Informasi layanan berhasil diperbarui.",
      data: layanan,
    });
  } catch (error) {
    next(error);
  }
}