import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import PageHeader from "../../components/PageHeader.jsx";
import { IkonCentang, IkonPengaturan } from "../../components/staf/Icons.jsx";
import useAmbilData from "../../hooks/useAmbilData.js";
import { ambilDetailLayanan, perbaruiInformasiLayanan } from "../../services/layananService.js";
import "./layanan.css";

// LYN-UI03 | LYN-UC02 Memperbarui Informasi Layanan
// Sumber desain: Figma "Edit Informasi layanan".
// Backend hanya menerima field informasiLayanan (PATCH /api/layanan/:id).
export default function EditLayananStafPage() {
  const { idLayanan } = useParams();
  const navigate = useNavigate();
  const { data: layanan, memuat, error } = useAmbilData(() => ambilDetailLayanan(idLayanan), [idLayanan]);

  const [informasi, setInformasi] = useState("");
  const [kesalahan, setKesalahan] = useState("");
  const [menyimpan, setMenyimpan] = useState(false);

  useEffect(() => {
    if (layanan) setInformasi(layanan.informasiLayanan ?? "");
  }, [layanan]);

  async function simpan(event) {
    event.preventDefault();
    if (!informasi.trim()) {
      setKesalahan("Informasi layanan wajib diisi.");
      return;
    }
    setKesalahan("");
    setMenyimpan(true);
    try {
      await perbaruiInformasiLayanan(idLayanan, informasi.trim());
      navigate(`/staf/layanan/${idLayanan}`, {
        state: { pesan: "Informasi layanan berhasil diperbarui." }
      });
    } catch (e) {
      setKesalahan(e.message);
      setMenyimpan(false);
    }
  }

  if (memuat && !layanan) {
    return (
      <>
        <PageHeader judul="Edit layanan" />
        <p className="teks-redup">Memuat data...</p>
      </>
    );
  }

  if (error || !layanan) {
    return (
      <>
        <PageHeader judul="Edit layanan" />
        <p className="pesan pesan--error" role="alert">{error || "Layanan belum tersedia."}</p>
        <Link to="/staf/layanan" className="tombol tombol--garis">Kembali ke Layanan</Link>
      </>
    );
  }

  const aktif = layanan.statusLayanan === "Aktif";

  return (
    <>
      <PageHeader judul="Edit Layanan" deskripsi="Perbarui informasi layanan yang ditampilkan kepada mahasiswa." />

      <form className="staf-panel layanan-form" onSubmit={simpan} noValidate>
        <div className="layanan-form__kepala">
          <span className="layanan-kartu__ikon layanan-kartu__ikon--besar"><IkonPengaturan ukuran={20} /></span>
          <div>
            <p className="layanan-kartu__kategori">Informasi layanan</p>
            <h2 className="layanan-judul">{layanan.namaLayanan}</h2>
          </div>
        </div>

        <div className="layanan-ringkas">
          <div><strong>{layanan.kategoriLayanan}</strong> <span>Kategori</span></div>
          <div className="layanan-ringkas__status">
            <span><strong>Status</strong></span>
            <span className={aktif ? "layanan-status layanan-status--aktif" : "layanan-status"}>
              {layanan.statusLayanan}
            </span>
          </div>
        </div>

        <label className="layanan-field" htmlFor="informasiLayanan">
          <span className="layanan-field__label">Informasi layanan <em aria-hidden="true">*</em></span>
          <span className="layanan-field__bantuan">
            Jelaskan tujuan dan kegunaan layanan. Daftar isian dan lampiran tetap dikelola melalui Edit Persyaratan.
          </span>
          <textarea
            id="informasiLayanan"
            rows={7}
            value={informasi}
            aria-invalid={Boolean(kesalahan)}
            onChange={(e) => setInformasi(e.target.value)}
          />
        </label>

        {kesalahan && <p className="pesan pesan--error" role="alert">{kesalahan}</p>}

        <div className="layanan-aksi">
          <button type="submit" className="tombol tombol--ikon" disabled={menyimpan}>
            <IkonCentang ukuran={16} /> {menyimpan ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          <Link to={`/staf/layanan/${idLayanan}`} className="tombol tombol--garis">Batal</Link>
        </div>
      </form>
    </>
  );
}
