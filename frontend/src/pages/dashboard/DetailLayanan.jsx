import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ambilDetailLayanan } from "../../services/layananService.js";
import HeaderMahasiswa from "../../components/mahasiswa/HeaderMahasiswa.jsx";
import { ASET } from "../../config/aset.js";
import "./DetailLayanan.css";

function KartuLampiran({ dokumen, bersyarat }) {
  const ukuran =
    dokumen.maksimalUkuranEfektifMb ?? dokumen.maksimalUkuranMb;

  const ketentuan = [
    dokumen.format,
    dokumen.maksimalFile ? `${dokumen.maksimalFile} file` : null,
    ukuran ? `maksimal ${ukuran} MB per file` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="dl-upload-box">
      <div className="dl-upload-content">
        <h4>{dokumen.namaDokumen}</h4>

        <span className="dl-upload-format">
          {ketentuan ||
            dokumen.ketentuanUnggahan ||
            "Ketentuan berkas belum tersedia."}
        </span>

        {dokumen.petunjukUnggahan && (
          <p>{dokumen.petunjukUnggahan}</p>
        )}
      </div>

      <span className="dl-upload-status">
        {dokumen.wajib ? "Wajib" : "Opsional"}
        {bersyarat ? " sesuai pilihan" : ""}
      </span>
    </div>
  );
}

function KelompokFormulir({ kelompok }) {
  const isian = kelompok.isian ?? [];
  const lampiran = kelompok.lampiran ?? [];

  return (
    <section className="dl-field-group">
      <div className="dl-group-heading">
        <span className="dl-chevron" aria-hidden="true">
          ▾
        </span>

        <div>
          <h3>{kelompok.judul}</h3>
          <p>
            {isian.length} isian · {lampiran.length} lampiran
            {kelompok.bersyarat
              ? " · Sesuai pilihan pada formulir"
              : ""}
          </p>
        </div>
      </div>

      <div className="dl-field-list">
        {isian.map((item, index) => (
          <div
            className="dl-field-row"
            key={`${item.label}-${index}`}
          >
            <span>{item.labelTampilan ?? item.label}</span>

            <strong>
              {item.wajib ? "Wajib" : "Opsional"} ·{" "}
              {item.tipe ?? "Isian"}
              {item.bersyarat || kelompok.bersyarat
                ? " · Sesuai pilihan"
                : ""}
            </strong>
          </div>
        ))}
      </div>

      {lampiran.length > 0 && (
        <div className="dl-upload-list">
          {lampiran.map((dokumen) => (
            <KartuLampiran
              key={dokumen.idDokumen}
              dokumen={dokumen}
              bersyarat={kelompok.bersyarat}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default function DetailLayanan() {
  const { idLayanan } = useParams();
  const navigate = useNavigate();

  const [percobaan, setPercobaan] = useState(0);
  const [hasil, setHasil] = useState({
    id: null,
    data: null,
    memuat: true,
    error: "",
    status: null,
  });

  useEffect(() => {
    let aktif = true;

    setHasil({
      id: idLayanan,
      data: null,
      memuat: true,
      error: "",
      status: null,
    });

    async function muatDetail() {
      try {
        if (!/^[1-9]\d*$/.test(idLayanan ?? "")) {
          setHasil({
            id: idLayanan,
            data: null,
            memuat: false,
            error: "ID layanan tidak valid.",
            status: 400,
          });
          return;
        }

        // Respons detail sudah memuat persyaratan dan rincian formulir.
        const data = await ambilDetailLayanan(idLayanan);

        if (aktif) {
          setHasil({
            id: idLayanan,
            data,
            memuat: false,
            error: "",
            status: null,
          });
        }
      } catch (error) {
        if (aktif) {
          setHasil({
            id: idLayanan,
            data: null,
            memuat: false,
            error: error.message || "Gagal memuat detail layanan.",
            status: error.status,
          });
        }
      }
    }

    muatDetail();

    return () => {
      aktif = false;
    };
  }, [idLayanan, percobaan]);

  const memuat = hasil.memuat || hasil.id !== idLayanan;
  const layanan = memuat ? null : hasil.data;
  const persyaratan = layanan?.persyaratan ?? [];
  const rincian = layanan?.rincianFormulir ?? [];
  const menerimaPengajuan = layanan?.menerimaPengajuan === true;

  return (
    <div className="detail-layanan-page">
      <HeaderMahasiswa />

      <main className="dl-container">
        <div className="dl-breadcrumb">
          Portal Mahasiswa / Detail Layanan
        </div>

        {memuat ? (
          <p className="dl-description" role="status">
            Memuat detail layanan...
          </p>
        ) : hasil.error || !layanan ? (
          <section className="dl-information-card">
            <h1>
              {hasil.status === 404
                ? "Layanan tidak ditemukan"
                : "Detail layanan tidak tersedia"}
            </h1>

            <p role="alert">
              {hasil.error || "Data layanan belum tersedia."}
            </p>

            {hasil.status !== 400 && hasil.status !== 404 && (
              <button
                type="button"
                className="dl-fill-button"
                onClick={() => setPercobaan((nilai) => nilai + 1)}
              >
                Coba lagi
              </button>
            )}

            <p>
              <Link to="/layanan">Kembali ke daftar layanan</Link>
            </p>
          </section>
        ) : (
          <>
            <section className="dl-page-heading">
              <h1>{layanan.namaLayanan}</h1>
              <p>
                Informasi dan kelengkapan layanan yang kamu pilih.
              </p>
            </section>

            <div className="dl-content-grid">
              <section className="dl-information-card">
                <span className="dl-category">
                  {layanan.kategoriLayanan}
                </span>

                <h2 className="dl-information-title">
                  Informasi layanan
                </h2>

                <p
                  className="dl-description"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {layanan.informasiLayanan}
                </p>

                {layanan.catatan && (
                  <p className="dl-description">
                    {layanan.catatan}
                  </p>
                )}

                <h3 className="dl-form-title">
                  Persyaratan umum
                </h3>

                {persyaratan.length > 0 ? (
                  <ul className="dl-description">
                    {persyaratan.map((item) => (
                      <li key={item.idPersyaratan}>
                        {item.deskripsiPersyaratan}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="dl-description">
                    Persyaratan umum belum tersedia.
                  </p>
                )}

                <h3 className="dl-form-title">
                  Rincian formulir dan lampiran
                </h3>

                {rincian.length > 0 ? (
                  rincian.map((kelompok) => (
                    <KelompokFormulir
                      key={kelompok.judul}
                      kelompok={kelompok}
                    />
                  ))
                ) : (
                  <p className="dl-description">
                    Rincian formulir belum tersedia untuk layanan ini.
                  </p>
                )}

                <div className="dl-card-bottom-line" />
              </section>

              <aside className="dl-action-card">
                <h2>
                  {menerimaPengajuan
                    ? "Siap mengisi?"
                    : "Pengajuan belum tersedia"}
                </h2>

                <p>
                  {menerimaPengajuan
                    ? "Lengkapi formulir sesuai layanan dan periksa ketentuan setiap lampiran."
                    : layanan.catatan ||
                      "Layanan ini belum menerima pengajuan melalui formulir."}
                </p>

                {menerimaPengajuan && (
                  <button
                    type="button"
                    className="dl-fill-button"
                    onClick={() =>
                      navigate(`/layanan/${idLayanan}/ajukan`)
                    }
                  >
                    Isi Formulir
                  </button>
                )}
              </aside>
            </div>
          </>
        )}
      </main>

      <footer className="dl-footer">
        <div className="dl-footer-brand">
          <span>PORTAL RESMI</span>
          <img
            src={ASET.logoFilkomUb}
            alt="Logo FILKOM Universitas Brawijaya"
          />
        </div>

        <p>© 2026 SAKTI FILKOM · Universitas Brawijaya</p>
      </footer>
    </div>
  );
}