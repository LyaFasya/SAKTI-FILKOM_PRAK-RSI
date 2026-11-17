
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ambilPersyaratanLayanan,
  perbaruiPersyaratanLayanan,
} from "../../services/layananService.js";

import "./EditPersyaratanLayananPage.css";

function buatDokumenBaru() {
  return {
    idDokumen: null,
    namaDokumen: "",
    petunjukUnggahan: "",
    wajib: false,
  };
}

function ambilTeksPersyaratan(data) {
  const daftar = data?.persyaratanUmum ?? data?.persyaratan ?? [];

  if (typeof daftar === "string") {
    return daftar;
  }

  if (Array.isArray(daftar)) {
    return daftar
      .map((item) =>
        typeof item === "string"
          ? item
          : item?.deskripsiPersyaratan ?? ""
      )
      .filter(Boolean)
      .join("\n");
  }

  return "";
}

export default function EditPersyaratanLayananPage() {
  const { idLayanan } = useParams();
  const navigate = useNavigate();

  const [persyaratanUmum, setPersyaratanUmum] = useState("");
  const [dokumen, setDokumen] = useState([]);
  const [namaLayanan, setNamaLayanan] = useState("");

  const [memuat, setMemuat] = useState(true);
  const [menyimpan, setMenyimpan] = useState(false);

  const [pesanError, setPesanError] = useState("");
  const [pesanSukses, setPesanSukses] = useState("");

  useEffect(() => {
    let masihAktif = true;

    async function muatData() {
      try {
        setMemuat(true);
        setPesanError("");

        const data = await ambilPersyaratanLayanan(idLayanan);

        if (!masihAktif) return;

        setNamaLayanan(
          data?.namaLayanan || data?.nama || "Layanan"
        );

        setPersyaratanUmum(ambilTeksPersyaratan(data));

        const daftarDokumen = Array.isArray(
          data?.dokumenPersyaratan
        )
          ? data.dokumenPersyaratan
          : [];

        setDokumen(
          daftarDokumen.map((item) => ({
            idDokumen: item.idDokumen ?? item.id ?? null,
            namaDokumen: item.namaDokumen ?? "",
            petunjukUnggahan: item.petunjukUnggahan ?? "",
            wajib: Boolean(item.wajib),
          }))
        );
      } catch (error) {
        if (!masihAktif) return;

        setPesanError(
          error.message || "Gagal memuat persyaratan layanan."
        );
      } finally {
        if (masihAktif) {
          setMemuat(false);
        }
      }
    }

    muatData();

    return () => {
      masihAktif = false;
    };
  }, [idLayanan]);

  function ubahDokumen(index, field, value) {
    setDokumen((sebelumnya) =>
      sebelumnya.map((item, i) =>
        i === index
          ? { ...item, [field]: value }
          : item
      )
    );

    setPesanSukses("");
  }

  function tambahDokumen() {
    setDokumen((sebelumnya) => [
      ...sebelumnya,
      buatDokumenBaru(),
    ]);

    setPesanSukses("");
  }

  function hapusDokumen(index) {
    setDokumen((sebelumnya) =>
      sebelumnya.filter((_, i) => i !== index)
    );

    setPesanSukses("");
  }

  async function handleSimpan(event) {
    event.preventDefault();

    setPesanError("");
    setPesanSukses("");

    const daftarPetunjuk = persyaratanUmum
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    if (daftarPetunjuk.some((item) => item.length > 255)) {
      setPesanError(
        "Setiap petunjuk persyaratan umum maksimal 255 karakter."
      );
      return;
    }

    if (dokumen.some((item) => !item.namaDokumen.trim())) {
      setPesanError("Nama setiap dokumen wajib diisi.");
      return;
    }

    const dokumenPersyaratan = dokumen.map((item) => {
      const data = {
        namaDokumen: item.namaDokumen.trim(),
        petunjukUnggahan: item.petunjukUnggahan.trim(),
        wajib: Boolean(item.wajib),
      };

      // ID hanya dikirim untuk dokumen yang sudah tersimpan.
      if (
        item.idDokumen !== null &&
        item.idDokumen !== undefined
      ) {
        data.idDokumen = Number(item.idDokumen);
      }

      return data;
    });

    const idTidakValid = dokumenPersyaratan.some(
      (item) =>
        item.idDokumen !== undefined &&
        (!Number.isSafeInteger(item.idDokumen) ||
          item.idDokumen <= 0)
    );

    if (idTidakValid) {
      setPesanError(
        "ID dokumen tidak valid. Muat ulang halaman sebelum menyimpan."
      );
      return;
    }

    try {
      setMenyimpan(true);

      await perbaruiPersyaratanLayanan(idLayanan, {
        persyaratanUmum,
        dokumenPersyaratan,
      });

      setPesanSukses(
        "Persyaratan layanan berhasil diperbarui."
      );
    } catch (error) {
      setPesanError(
        error.message ||
          "Gagal menyimpan perubahan persyaratan layanan."
      );
    } finally {
      setMenyimpan(false);
    }
  }

  function handleBatal() {
    navigate(`/staf/layanan/${idLayanan}`);
  }

  if (memuat) {
    return (
      <section className="edit-persyaratan">
        <p className="edit-persyaratan__status">
          Memuat persyaratan layanan...
        </p>
      </section>
    );
  }

  return (
    <section className="edit-persyaratan">
      <header className="edit-persyaratan__heading">
        <h1>Edit persyaratan {namaLayanan}</h1>
        <p>
          Atur petunjuk layanan, jenis dokumen, dan kewajiban unggahan.
        </p>
      </header>

      {pesanError && (
        <div className="edit-persyaratan__alert edit-persyaratan__alert--error">
          {pesanError}
        </div>
      )}

      {pesanSukses && (
        <div className="edit-persyaratan__alert edit-persyaratan__alert--success">
          {pesanSukses}
        </div>
      )}

      <form
        className="edit-persyaratan__card"
        onSubmit={handleSimpan}
      >
        <div className="edit-persyaratan__field edit-persyaratan__field--umum">
          <label htmlFor="persyaratanUmum">
            Persyaratan umum — satu petunjuk per baris
          </label>

          <textarea
            id="persyaratanUmum"
            value={persyaratanUmum}
            onChange={(event) => {
              setPersyaratanUmum(event.target.value);
              setPesanSukses("");
            }}
            placeholder="Masukkan persyaratan umum..."
            rows={3}
          />
        </div>

        <div className="edit-persyaratan__section">
          <div className="edit-persyaratan__section-heading">
            <h2>Master dokumen layanan</h2>
          </div>

          <div className="edit-persyaratan__document-list">
            {dokumen.map((item, index) => (
              <div
                className="edit-persyaratan__document"
                key={item.idDokumen ?? `baru-${index}`}
              >
                <div className="edit-persyaratan__document-fields">
                  <div className="edit-persyaratan__field">
                    <label htmlFor={`namaDokumen-${index}`}>
                      Nama dokumen
                    </label>

                    <input
                      id={`namaDokumen-${index}`}
                      type="text"
                      value={item.namaDokumen}
                      onChange={(event) =>
                        ubahDokumen(
                          index,
                          "namaDokumen",
                          event.target.value
                        )
                      }
                      placeholder="Contoh: Dokumen Pendukung"
                      maxLength={150}
                    />
                  </div>

                  <div className="edit-persyaratan__field">
                    <label htmlFor={`petunjuk-${index}`}>
                      Petunjuk unggahan
                    </label>

                    <input
                      id={`petunjuk-${index}`}
                      type="text"
                      value={item.petunjukUnggahan}
                      onChange={(event) =>
                        ubahDokumen(
                          index,
                          "petunjukUnggahan",
                          event.target.value
                        )
                      }
                      placeholder="Masukkan petunjuk unggahan..."
                    />
                  </div>
                </div>

                <div className="edit-persyaratan__document-controls">
                  <label className="edit-persyaratan__checkbox">
                    <input
                      type="checkbox"
                      checked={item.wajib}
                      onChange={(event) =>
                        ubahDokumen(
                          index,
                          "wajib",
                          event.target.checked
                        )
                      }
                    />
                    <span>Wajib</span>
                  </label>

                  <button
                    type="button"
                    className="edit-persyaratan__delete"
                    onClick={() => hapusDokumen(index)}
                    disabled={menyimpan}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="edit-persyaratan__add"
            onClick={tambahDokumen}
            disabled={menyimpan}
          >
            <span>＋</span>
            Tambah dokumen
          </button>
        </div>

        <div className="edit-persyaratan__actions">
          <button
            type="submit"
            className="edit-persyaratan__save"
            disabled={menyimpan}
          >
            {menyimpan ? "Menyimpan..." : "Simpan Perubahan"}
          </button>

          <button
            type="button"
            className="edit-persyaratan__cancel"
            onClick={handleBatal}
            disabled={menyimpan}
          >
            Batal
          </button>
        </div>
      </form>
    </section>
  );
}