
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ambilPersyaratanLayanan } from "../../services/layananService.js";
import "./EditPersyaratanLayananPage.css";

const DATA_CONTOH = {
  namaLayanan: "Izin peminjaman barang atau ruangan untuk ormawa",
  persyaratanUmum:
    "Lengkapi seluruh kolom bertanda bintang.\n" +
    "Lampiran mengikuti pilihan pada formulir dan batas ukuran setiap jenis file.\n" +
    "Periksa kembali isian sebelum mengirim formulir.",
  dokumenPersyaratan: [
    {
      idDokumen: "contoh-1",
      namaDokumen: "Dokumen Pendukung",
      petunjukUnggahan:
        "Lampirkan bukti dukung berupa sertifikat / surat tugas / dokumen lain.",
      wajib: false,
    },
  ],
};

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

  if (typeof daftar === "string") return daftar;

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
          data?.namaLayanan || data?.nama || DATA_CONTOH.namaLayanan
        );

        setPersyaratanUmum(
          ambilTeksPersyaratan(data) || DATA_CONTOH.persyaratanUmum
        );

        const daftarDokumen = Array.isArray(data?.dokumenPersyaratan)
          ? data.dokumenPersyaratan
          : [];

        setDokumen(
          daftarDokumen.length > 0
            ? daftarDokumen.map((item) => ({
                idDokumen: item.idDokumen ?? item.id ?? null,
                namaDokumen: item.namaDokumen ?? "",
                petunjukUnggahan: item.petunjukUnggahan ?? "",
                wajib: Boolean(item.wajib),
              }))
            : DATA_CONTOH.dokumenPersyaratan
        );
      } catch {
        if (!masihAktif) return;

        setNamaLayanan(DATA_CONTOH.namaLayanan);
        setPersyaratanUmum(DATA_CONTOH.persyaratanUmum);
        setDokumen(DATA_CONTOH.dokumenPersyaratan);
      } finally {
        if (masihAktif) setMemuat(false);
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
        i === index ? { ...item, [field]: value } : item
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

  function handleSimpan(event) {
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

    setPesanError(
      "Perubahan belum dapat disimpan karena endpoint penyimpanan persyaratan belum tersedia."
    );
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

      <form className="edit-persyaratan__card" onSubmit={handleSimpan}>
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
          >
            <span>＋</span>
            Tambah dokumen
          </button>
        </div>

        <div className="edit-persyaratan__actions">
          <button
            type="submit"
            className="edit-persyaratan__save"
          >
            Simpan Perubahan
          </button>

          <button
            type="button"
            className="edit-persyaratan__cancel"
            onClick={handleBatal}
          >
            Batal
          </button>
        </div>
      </form>
    </section>
  );
}