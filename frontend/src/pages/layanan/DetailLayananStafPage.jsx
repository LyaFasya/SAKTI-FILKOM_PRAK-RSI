import { Link, useLocation, useParams } from "react-router-dom";

import PageHeader from "../../components/PageHeader.jsx";
import { IkonPercik } from "../../components/staf/Icons.jsx";
import useAmbilData from "../../hooks/useAmbilData.js";
import { ambilDetailLayanan } from "../../services/layananService.js";
import "./layanan.css";

// LYN-UI02 | LYN-UC03 Melihat Persyaratan Layanan
// Sumber desain: Figma "Detail Layanan".
// Data: GET /api/layanan/:id (informasi, persyaratan umum, dan rincianFormulir).

function ringkasanKelompok(k) {
  const bagian = [`${k.jumlahIsian ?? k.isian?.length ?? 0} isian`, `${k.jumlahLampiran ?? k.lampiran?.length ?? 0} lampiran`];
  if (k.bersyarat) bagian.push("sesuai pilihan");
  return bagian.join(" · ");
}

function BarisIsian({ isian }) {
  return (
    <li className="layanan-isian">
      <span className="layanan-isian__label">{isian.label}</span>
      <strong className="layanan-isian__tipe">
        {isian.wajib ? "Wajib" : "Opsional"} · {isian.tipe}
      </strong>
    </li>
  );
}

function KartuLampiran({ dokumen }) {
  return (
    <li className="layanan-lampiran">
      <div>
        <strong>{dokumen.namaDokumen}</strong>
        {dokumen.ketentuanUnggahan && <p className="layanan-lampiran__ketentuan">{dokumen.ketentuanUnggahan}</p>}
        {dokumen.petunjukUnggahan && <p className="layanan-lampiran__petunjuk">{dokumen.petunjukUnggahan}</p>}
      </div>
      <span className="staf-pill">{dokumen.wajib ? "Wajib" : "Opsional"}</span>
    </li>
  );
}

export default function DetailLayananStafPage() {
  const { idLayanan } = useParams();
  const { state } = useLocation();
  const { data: layanan, memuat, error } = useAmbilData(() => ambilDetailLayanan(idLayanan), [idLayanan]);

  const daftarKembali = (
    <Link to="/staf/layanan" className="tombol tombol--garis">Kembali ke Layanan</Link>
  );

  if (memuat && !layanan) {
    return (
      <>
        <PageHeader judul="Detail layanan" />
        <p className="teks-redup">Memuat data...</p>
      </>
    );
  }

  if (error || !layanan) {
    return (
      <>
        <PageHeader judul="Detail layanan" />
        <p className="pesan pesan--error" role="alert">{error || "Layanan belum tersedia."}</p>
        {daftarKembali}
      </>
    );
  }

  const persyaratan = layanan.persyaratan ?? [];
  const rincian = layanan.rincianFormulir ?? [];

  return (
    <>
      <PageHeader judul={layanan.namaLayanan} deskripsi="Informasi dan kelengkapan layanan yang kamu pilih." />

      {state?.pesan && <p className="layanan-sukses" role="status">{state.pesan}</p>}

      <div className="layanan-detail">
        <section className="staf-panel layanan-detail__utama">
          <p className="layanan-kartu__kategori">{layanan.kategoriLayanan}</p>
          <h2 className="layanan-judul">Informasi layanan</h2>
          <p className="layanan-informasi">{layanan.informasiLayanan}</p>
          {layanan.catatan && <p className="layanan-catatan">{layanan.catatan}</p>}

          <h3 className="layanan-subjudul">Persyaratan umum</h3>
          {persyaratan.length === 0 ? (
            <p className="teks-redup">Persyaratan layanan belum tersedia.</p>
          ) : (
            <ul className="layanan-persyaratan">
              {persyaratan.map((p) => <li key={p.idPersyaratan}>{p.deskripsiPersyaratan}</li>)}
            </ul>
          )}

          <h3 className="layanan-subjudul">Rincian formulir</h3>
          {rincian.length === 0 ? (
            <p className="teks-redup">Dokumen persyaratan belum terdaftar.</p>
          ) : (
            rincian.map((k) => (
              <details key={k.judul} className="layanan-kelompok" open>
                <summary>
                  <span className="layanan-kelompok__judul">{k.judul}</span>
                  <span className="layanan-kelompok__ringkas">{ringkasanKelompok(k)}</span>
                </summary>
                {k.isian?.length > 0 && (
                  <ul className="layanan-isian-daftar">
                    {k.isian.map((i, idx) => <BarisIsian key={`${i.label}-${idx}`} isian={i} />)}
                  </ul>
                )}
                {k.lampiran?.length > 0 && (
                  <ul className="layanan-lampiran-daftar">
                    {k.lampiran.map((d) => <KartuLampiran key={d.idDokumen} dokumen={d} />)}
                  </ul>
                )}
              </details>
            ))
          )}

          <div className="layanan-aksi">
            <Link to={`/staf/layanan/${layanan.idLayanan}/edit`} className="tombol tombol--garis">Edit Layanan</Link>
            <Link to={`/staf/layanan/${layanan.idLayanan}/persyaratan`} className="tombol tombol--garis">Edit Persyaratan</Link>
          </div>
        </section>

        <aside className="staf-panel layanan-detail__samping">
          <span className="layanan-kartu__ikon"><IkonPercik ukuran={18} /></span>
          <h2 className="layanan-judul">Pengelolaan layanan</h2>
          <p className="teks-redup">Kelola informasi dan persyaratan layanan melalui tombol yang tersedia.</p>
          {daftarKembali}
          <p className="layanan-catatan layanan-catatan--tengah">
            Pastikan informasi dan persyaratan layanan sesuai ketentuan yang berlaku.
          </p>
        </aside>
      </div>
    </>
  );
}
