import {
  database,
  Layanan,
  Persyaratan,
  DokumenPersyaratan,
} from "../models/index.js";
import { batasUkuranLampiranMb } from "../services/formulirPengajuan.js";
import semuaFormulir from "../config/formulirLayanan.js";

function membacaIdLayanan(nilai) {
  if (!/^[1-9]\d*$/.test(nilai)) {
    return null;
  }

  const idLayanan = Number(nilai);

  return Number.isSafeInteger(idLayanan) ? idLayanan : null;
}

export async function melihatDaftarLayanan(req, res, next) {
  const { kataKunci = "", kategoriLayanan = "" } = req.query;

  if (typeof kataKunci !== "string" || typeof kategoriLayanan !== "string") {
    return res.status(400).json({ message: "Pencarian atau kategori layanan tidak valid." });
  }

  try {
    const where = {};
    if (req.akun.role === "mahasiswa") where.statusLayanan = "Aktif";
    if (kategoriLayanan.trim()) where.kategoriLayanan = kategoriLayanan.trim();

    const daftarLayanan = await Layanan.findAll({
      where,
      order: [["idLayanan", "ASC"]],
    });

    const kata = kataKunci.trim().toLowerCase();
    const data = daftarLayanan.filter(({ namaLayanan }) =>
      namaLayanan.toLowerCase().includes(kata)
    );

    return res.status(200).json({
      message: "Daftar layanan berhasil diambil.",
      data,
    });
  } catch (error) {
    return next(error);
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

    const layanan = await Layanan.findByPk(idLayanan, {
      include: [
        { association: "persyaratan" },
        { association: "dokumenPersyaratan" },
      ],
    });

    if (!layanan) {
      return res.status(404).json({
        message: "Layanan tidak ditemukan.",
      });
    }

    const data = layanan.toJSON();
    const formulir = Object.hasOwn(semuaFormulir, data.namaLayanan)
      ? semuaFormulir[data.namaLayanan]
      : null;

    const dokumenPersyaratan = [...data.dokumenPersyaratan].sort(
      (a, b) => a.idDokumen - b.idDokumen
    ).map((dokumen) => req.akun.role === "mahasiswa"
      ? { ...dokumen, maksimalUkuranEfektifMb: batasUkuranLampiranMb(dokumen.maksimalUkuranMb) }
      : dokumen
    );

    const rincianFormulir = (formulir?.kelompok ?? []).map((kelompok) => {
      const lampiran = dokumenPersyaratan.filter(
        (dokumen) => dokumen.kelompokFormulir === kelompok.judul
      );

      return {
        ...kelompok,
        lampiran,
        jumlahLampiran: lampiran.length,
      };
    });

    const lampiranTanpaKelompok = dokumenPersyaratan.filter(
      (dokumen) =>
        !rincianFormulir.some(
          (kelompok) => kelompok.judul === dokumen.kelompokFormulir
        )
    );

    if (lampiranTanpaKelompok.length > 0) {
      rincianFormulir.push({
        judul: "Lampiran",
        bersyarat: false,
        isian: [],
        lampiran: lampiranTanpaKelompok,
        jumlahIsian: 0,
        jumlahLampiran: lampiranTanpaKelompok.length,
      });
    }

    return res.status(200).json({
      message: "Detail layanan berhasil diambil.",
      data: {
        ...data,
        dokumenPersyaratan,
        jenisLayanan: formulir?.jenisLayanan ?? null,
        statusFormulir: formulir?.statusFormulir ?? null,
        menerimaPengajuan: data.statusLayanan === "Aktif" &&
          Boolean(formulir?.kelompok.length) && formulir.statusFormulir !== "ditutup",
        bolehKirimSalinanEmail: formulir?.bolehKirimSalinanEmail === true,
        catatan: formulir?.catatan ?? null,
        rincianFormulir,
      },
    });
  } catch (error) {
    return next(error);
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

export async function memperbaruiPersyaratanLayanan(req, res, next) {
  try {
    const idLayanan = membacaIdLayanan(req.params.idLayanan);

    if (idLayanan === null) {
      return res.status(400).json({
        message: "ID layanan harus berupa bilangan bulat positif.",
      });
    }

    const body = req.body;
    const fieldDiizinkan = ["persyaratanUmum", "dokumenPersyaratan"];

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body) ||
      Object.keys(body).length === 0 ||
      Object.keys(body).some((field) => !fieldDiizinkan.includes(field))
    ) {
      return res.status(400).json({
        message: "Isi persyaratanUmum dan/atau dokumenPersyaratan.",
      });
    }

    let daftarPersyaratan;

    if (Object.hasOwn(body, "persyaratanUmum")) {
      if (typeof body.persyaratanUmum !== "string") {
        return res.status(400).json({
          message: "Persyaratan umum harus berupa teks.",
        });
      }

      daftarPersyaratan = body.persyaratanUmum
        .split(/\r?\n/)
        .map((baris) => baris.trim())
        .filter(Boolean);

      if (daftarPersyaratan.some((baris) => [...baris].length > 255)) {
        return res.status(400).json({
          message: "Setiap baris persyaratan maksimal 255 karakter.",
        });
      }
    }

    const daftarDokumen = body.dokumenPersyaratan;
    const idDokumenDikirim = new Set();

    if (Object.hasOwn(body, "dokumenPersyaratan")) {
      if (!Array.isArray(daftarDokumen)) {
        return res.status(400).json({
          message: "Dokumen persyaratan harus berupa array.",
        });
      }

      for (const dokumen of daftarDokumen) {
        if (
          !dokumen ||
          typeof dokumen !== "object" ||
          Array.isArray(dokumen) ||
          typeof dokumen.namaDokumen !== "string" ||
          !dokumen.namaDokumen.trim() ||
          [...dokumen.namaDokumen.trim()].length > 150 ||
          typeof dokumen.wajib !== "boolean"
        ) {
          return res.status(400).json({
            message: "Nama dokumen wajib diisi, maksimal 150 karakter, dan wajib harus true atau false.",
          });
        }

        if (
          dokumen.petunjukUnggahan != null &&
          (
            typeof dokumen.petunjukUnggahan !== "string" ||
            Buffer.byteLength(dokumen.petunjukUnggahan, "utf8") > 65535
          )
        ) {
          return res.status(400).json({
            message: "Petunjuk unggahan harus berupa teks maksimal 65.535 byte.",
          });
        }

        if (Object.hasOwn(dokumen, "idDokumen")) {
          const id = dokumen.idDokumen;

          if (!Number.isSafeInteger(id) || id <= 0 || idDokumenDikirim.has(id)) {
            return res.status(400).json({
              message: "ID dokumen harus berupa bilangan bulat positif dan unik.",
            });
          }

          idDokumenDikirim.add(id);
        }
      }
    }

    const hasil = await database.transaction(async (transaction) => {
      const layanan = await Layanan.findByPk(idLayanan, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!layanan) {
        return {
          status: 404,
          message: "Layanan tidak ditemukan.",
        };
      }

      if (layanan.namaLayanan === "Permohonan kerja sama kegiatan ormawa") {
        return {
          status: 409,
          message: "Layanan informasi ini tidak memiliki form persyaratan.",
        };
      }

      const perubahanTersimpan = {
        persyaratanUmum: false,
        dokumenPersyaratan: {
          ditambah: 0,
          diperbarui: 0,
          dihapus: 0,
        },
      };

      if (daftarDokumen !== undefined) {
        const dokumenLama = await DokumenPersyaratan.findAll({
          where: { idLayanan },
          transaction,
        });

        const dokumenMenurutId = new Map(
          dokumenLama.map((dokumen) => [dokumen.idDokumen, dokumen])
        );

        for (const id of idDokumenDikirim) {
          if (!dokumenMenurutId.has(id)) {
            return {
              status: 400,
              message: "Ada ID dokumen yang tidak termasuk dalam layanan ini.",
            };
          }
        }

        // Array dokumen mewakili daftar akhir yang disimpan dari form.
        for (const dokumen of dokumenLama) {
          if (!idDokumenDikirim.has(dokumen.idDokumen)) {
            await dokumen.destroy({ transaction });
            perubahanTersimpan.dokumenPersyaratan.dihapus += 1;
          }
        }

        for (const dokumen of daftarDokumen) {
          const perubahan = {
            namaDokumen: dokumen.namaDokumen.trim(),
            wajib: dokumen.wajib,
          };

          if (Object.hasOwn(dokumen, "petunjukUnggahan")) {
            perubahan.petunjukUnggahan =
              dokumen.petunjukUnggahan?.trim() || null;
          }

          if (Object.hasOwn(dokumen, "idDokumen")) {
            const dokumenTersimpan = dokumenMenurutId.get(dokumen.idDokumen);

            dokumenTersimpan.set(perubahan);

            if (dokumenTersimpan.changed()) {
              await dokumenTersimpan.save({ transaction });
              perubahanTersimpan.dokumenPersyaratan.diperbarui += 1;
            }
          } else {
            await DokumenPersyaratan.create(
              { idLayanan, ...perubahan },
              { transaction }
            );

            perubahanTersimpan.dokumenPersyaratan.ditambah += 1;
          }
        }
      }

      if (daftarPersyaratan !== undefined) {
        const persyaratanLama = await Persyaratan.findAll({
          where: { idLayanan },
          attributes: ["deskripsiPersyaratan"],
          order: [["idPersyaratan", "ASC"]],
          transaction,
        });

        const teksLama = persyaratanLama.map(
          (item) => item.deskripsiPersyaratan
        );

        const teksBerubah =
          teksLama.length !== daftarPersyaratan.length ||
          teksLama.some((teks, indeks) => teks !== daftarPersyaratan[indeks]);

        if (teksBerubah) {
          await Persyaratan.destroy({
            where: { idLayanan },
            transaction,
          });

          if (daftarPersyaratan.length > 0) {
            await Persyaratan.bulkCreate(
              daftarPersyaratan.map((deskripsiPersyaratan) => ({
                idLayanan,
                deskripsiPersyaratan,
              })),
              { transaction }
            );
          }

          perubahanTersimpan.persyaratanUmum = true;
        }
      }

      const { ditambah, diperbarui, dihapus } =
        perubahanTersimpan.dokumenPersyaratan;

      const adaPerubahan =
        perubahanTersimpan.persyaratanUmum ||
        ditambah > 0 ||
        diperbarui > 0 ||
        dihapus > 0;

      return {
        status: 200,
        message: adaPerubahan
          ? "Persyaratan layanan berhasil diperbarui."
          : "Tidak ada perubahan pada persyaratan layanan.",
        data: {
          idLayanan,
          perubahan: perubahanTersimpan,
        },
      };
    });

    const { status, ...respons } = hasil;
    return res.status(status).json(respons);
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(409).json({
        message: "Dokumen yang sudah dipakai pada pengajuan tidak dapat dihapus.",
      });
    }

    return next(error);
  }
}