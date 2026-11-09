import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { IkonKalender, IkonPanah } from "../../components/mahasiswa/Icons.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import {
  ATURAN_FILE,
  DESKRIPSI_DOKUMEN,
  LABEL_PERAN,
  PERAN_KEGIATAN,
  PROGRAM_STUDI
} from "../../config/formPengajuan.js";
import { useAuth } from "../../context/AuthContext.jsx";
import useAmbilData from "../../hooks/useAmbilData.js";
import { ambilDataFormPengajuan, kirimPengajuan } from "../../services/pengajuanMahasiswaService.js";
import { formatBatasMB, formatUkuranMB } from "../../utils/formatPengajuan.js";

// PGJ-UI01 Isi Formulir Pengajuan | PGJ-UI02 Formulir Terisi | PGJ-UI03 Data Tidak Lengkap
// PGJ-UC01 Mengajukan Layanan Kemahasiswaan
// Ketiga UI itu adalah kondisi dari satu halaman yang sama.
export default function FormPengajuanPage() {
  const { idLayanan } = useParams();
  const { user } = useAuth();
  const { data, memuat, error } = useAmbilData(() => ambilDataFormPengajuan(idLayanan), [idLayanan]);

  if (memuat) {
    return (
      <>
        <PageHeader judul="Formulir pengajuan" />
        <p className="teks-redup">Memuat formulir...</p>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <PageHeader judul="Formulir pengajuan" />
        <p className="pesan pesan--error" role="alert">{error || "Layanan tidak ditemukan."}</p>
        <Link to="/layanan" className="tombol tombol--garis">Kembali ke Layanan</Link>
      </>
    );
  }

  // `key` memaksa isian dikosongkan jika mahasiswa pindah ke layanan lain.
  return <IsiFormulir key={idLayanan} layanan={data} emailAkun={user.email} />;
}

function IsiFormulir({ layanan, emailAkun }) {
  const navigate = useNavigate();
  const ringkasanRef = useRef(null);

  const [isian, setIsian] = useState({
    noHp: "",
    email: emailAkun ?? "",
    namaKegiatan: "",
    lokasiKegiatan: "",
    peran: "",
    peranLain: "",
    tanggalAwal: "",
    tanggalAkhir: ""
  });
  const [berkas, setBerkas] = useState({});            // { [idDokumen]: File }
  const [galatBerkas, setGalatBerkas] = useState({});  // format/ukuran file salah
  const [galat, setGalat] = useState({});              // validasi saat kirim
  const [dokumenKurang, setDokumenKurang] = useState([]);
  const [kirimSalinan, setKirimSalinan] = useState(false);
  const [percobaan, setPercobaan] = useState(0);
  const [pesanGagal, setPesanGagal] = useState("");
  const [mengirim, setMengirim] = useState(false);

  const adaGalat = Object.keys(galat).length > 0 || dokumenKurang.length > 0;
  // Catatan di panel kanan berubah setelah mahasiswa mulai mengisi (sesuai Figma).
  const sudahMulai =
    percobaan > 0 ||
    Boolean(isian.noHp || isian.namaKegiatan || isian.lokasiKegiatan || isian.peran || isian.tanggalAwal || isian.tanggalAkhir) ||
    Object.keys(berkas).length > 0;

  // Fokus ke ringkasan galat setiap kali kirim gagal validasi, supaya terbaca pembaca layar.
  useEffect(() => {
    if (percobaan > 0 && adaGalat) ringkasanRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percobaan]);

  function ubah(nama, nilai) {
    setIsian((lama) => ({ ...lama, [nama]: nilai }));
    setGalat((lama) => {
      if (!lama[nama]) return lama;
      const baru = { ...lama };
      delete baru[nama];
      return baru;
    });
  }

  // Atribut umum untuk satu kolom isian.
  const sifat = (nama) => ({
    id: nama,
    value: isian[nama],
    onChange: (e) => ubah(nama, e.target.value),
    "aria-invalid": Boolean(galat[nama]),
    "aria-required": true,
    "aria-describedby": `petunjuk-${nama}`
  });

  function pilihBerkas(dok, file) {
    const aturan = dok.wajib ? ATURAN_FILE.wajib : ATURAN_FILE.opsional;
    const ekstensi = `.${file.name.split(".").pop().toLowerCase()}`;
    let pesan = "";

    if (!aturan.ekstensi.includes(ekstensi)) {
      pesan = `Format file tidak sesuai. Gunakan file ${aturan.pesanFormat}.`;
    } else if (file.size > aturan.maksUkuran) {
      pesan = `Ukuran file ${formatUkuranMB(file.size)} melebihi batas ${formatBatasMB(aturan.maksUkuran)}.`;
    }

    setGalatBerkas((lama) => ({ ...lama, [dok.idDokumen]: pesan }));
    if (pesan) return;

    setBerkas((lama) => ({ ...lama, [dok.idDokumen]: file }));
    setDokumenKurang((lama) => lama.filter((d) => d.idDokumen !== dok.idDokumen));
  }

  function hapusBerkas(dok) {
    setBerkas((lama) => {
      const baru = { ...lama };
      delete baru[dok.idDokumen];
      return baru;
    });
    setGalatBerkas((lama) => ({ ...lama, [dok.idDokumen]: "" }));
  }

  // Urutan pesan mengikuti urutan kolom di formulir (sama dengan ringkasan di Figma).
  function validasi() {
    const hasil = {};
    const wajib = (nama, label) => {
      if (!String(isian[nama]).trim()) hasil[nama] = `Lengkapi ${label}.`;
    };

    wajib("noHp", "No. HP");
    wajib("email", "Email");
    wajib("namaKegiatan", "Nama Kegiatan/Lomba");
    wajib("lokasiKegiatan", "Lokasi Kegiatan/Lomba");
    if (!isian.peran) hasil.peran = "Lengkapi Sebagai.";
    else if (isian.peran === "Other") wajib("peranLain", "Other response");
    wajib("tanggalAwal", "Tanggal Awal Pelaksanaan Kegiatan");
    wajib("tanggalAkhir", "Tanggal Akhir Pelaksanaan Kegiatan");

    if (isian.email.trim() && !/^\S+@\S+\.\S+$/.test(isian.email.trim())) {
      hasil.email = "Format Email tidak valid.";
    }
    if (isian.tanggalAwal && isian.tanggalAkhir && isian.tanggalAkhir < isian.tanggalAwal) {
      hasil.tanggalAkhir = "Tanggal Akhir Pelaksanaan Kegiatan tidak boleh sebelum tanggal awal.";
    }

    const kurang = layanan.dokumen.filter((d) => d.wajib && !berkas[d.idDokumen]);
    return { hasil, kurang };
  }

  async function kirim(event) {
    event.preventDefault();
    setPesanGagal("");

    const { hasil, kurang } = validasi();
    setGalat(hasil);
    setDokumenKurang(kurang);
    setPercobaan((n) => n + 1);
    if (Object.keys(hasil).length > 0 || kurang.length > 0) return;

    setMengirim(true);
    try {
      const { idPengajuan } = await kirimPengajuan({
        idLayanan: layanan.idLayanan,
        namaLayanan: layanan.namaLayanan,
        email: isian.email.trim(),
        isian,
        berkas,
        dokumen: layanan.dokumen,
        kirimSalinan // belum dipakai backend; disiapkan untuk fitur salinan email
      });
      navigate(`/pengajuan-saya/terkirim/${idPengajuan}`, { replace: true });
    } catch (e) {
      setPesanGagal(e.message || "Pengajuan gagal disimpan. Kirim ulang beberapa saat lagi.");
      setMengirim(false);
    }
  }

  const { profil } = layanan;

  return (
    <>
      <PageHeader
        judul={`Formulir ${layanan.namaLayanan}`}
        deskripsi="Kolom bertanda * wajib diisi. Pilihan tertentu menampilkan bagian tambahan."
      />

      <div className="grid-form">
        <form onSubmit={kirim} noValidate className="kartu kartu-form">
          <div className="bagian-judul">
            <span className="nomor-bagian" aria-hidden="true">01</span>
            <h2 id="judul-identitas">Identitas dan kontak</h2>
          </div>

          <div className="field">
            <label htmlFor="namaMahasiswa" className="field__label">Nama Pengaju <span className="tanda-wajib" aria-hidden="true">*</span></label>
            <input id="namaMahasiswa" value={profil.namaMahasiswa} readOnly />
          </div>
          <div className="field">
            <label htmlFor="nim" className="field__label">NIM Pengaju <span className="tanda-wajib" aria-hidden="true">*</span></label>
            <input id="nim" value={profil.nim} readOnly />
          </div>

          <fieldset className="grup-pilihan" disabled>
            <legend>Asal Prodi <span className="tanda-wajib" aria-hidden="true">*</span></legend>
            <div className="grup-pilihan__daftar">
              {PROGRAM_STUDI.map((prodi) => (
                <label key={prodi} className="pilihan">
                  <input type="radio" name="prodi" value={prodi} checked={profil.programStudi === prodi} readOnly />
                  {prodi}
                </label>
              ))}
            </div>
          </fieldset>

          <Isian label="No. HP" nama="noHp" petunjuk="Cantumkan nomor WhatsApp yang aktif.">
            <input type="tel" inputMode="tel" autoComplete="tel" {...sifat("noHp")} />
          </Isian>
          <Isian label="Email" nama="email" petunjuk="Cantumkan email UB yang aktif.">
            <input type="email" autoComplete="email" {...sifat("email")} />
          </Isian>

          <hr className="pemisah-bagian" />

          <div className="bagian-judul">
            <span className="nomor-bagian" aria-hidden="true">02</span>
            <h2 id="judul-kegiatan">Detil kegiatan / lomba</h2>
          </div>

          <Isian label="Nama Kegiatan/Lomba" nama="namaKegiatan">
            <input {...sifat("namaKegiatan")} />
          </Isian>

          <Isian label="Lokasi Kegiatan/Lomba" nama="lokasiKegiatan" petunjuk="Nama tempat / kota / negara pelaksanaan kegiatan.">
            <input {...sifat("lokasiKegiatan")} />
          </Isian>

          <fieldset className="grup-pilihan" aria-describedby="petunjuk-peran">
            <legend>Sebagai <span className="tanda-wajib" aria-hidden="true">*</span></legend>
            <div className="grup-pilihan__daftar" aria-invalid={Boolean(galat.peran)}>
              {PERAN_KEGIATAN.map((peran) => (
                <label key={peran} className="pilihan">
                  <input
                    type="radio" name="peran" value={peran}
                    checked={isian.peran === peran} onChange={() => ubah("peran", peran)}
                  />
                  {LABEL_PERAN[peran] ?? peran}
                </label>
              ))}
            </div>
            <span id="petunjuk-peran" className="sr-only">Pilih salah satu peran.</span>
          </fieldset>

          {isian.peran === "Other" && (
            <Isian label="Other response" nama="peranLain" petunjuk="Isi pilihan lainnya.">
              <input {...sifat("peranLain")} />
            </Isian>
          )}

          <Isian label="Tanggal Awal Pelaksanaan Kegiatan" nama="tanggalAwal">
            <InputTanggal {...sifat("tanggalAwal")} />
          </Isian>
          <Isian label="Tanggal Akhir Pelaksanaan Kegiatan" nama="tanggalAkhir">
            <InputTanggal {...sifat("tanggalAkhir")} min={isian.tanggalAwal || undefined} />
          </Isian>

          {layanan.dokumen.map((dok) => (
            <SlotUnggah
              key={dok.idDokumen}
              dok={dok}
              file={berkas[dok.idDokumen]}
              galat={galatBerkas[dok.idDokumen]}
              belumDiunggah={dokumenKurang.some((d) => d.idDokumen === dok.idDokumen)}
              onPilih={(file) => pilihBerkas(dok, file)}
              onHapus={() => hapusBerkas(dok)}
            />
          ))}

          <label className="kotak-centang">
            <input type="checkbox" checked={kirimSalinan} onChange={(e) => setKirimSalinan(e.target.checked)} />
            <span>Kirim salinan jawaban ke email saya {kirimSalinan && <small>(simulasi)</small>}</span>
          </label>

          {adaGalat && (
            <div className="ringkasan-galat" role="alert" tabIndex={-1} ref={ringkasanRef}>
              <strong>Periksa kembali formulir</strong>
              <ul>
                {Object.entries(galat).map(([nama, pesan]) => <li key={nama}>{pesan}</li>)}
                {dokumenKurang.map((d) => <li key={d.idDokumen}>Lampiran wajib belum tersedia: {d.namaDokumen}.</li>)}
              </ul>
            </div>
          )}

          {pesanGagal && <p className="pesan pesan--error" role="alert">{pesanGagal}</p>}

          <div className="aksi-form">
            <button type="submit" className="tombol" disabled={mengirim}>
              {mengirim ? "Mengirim..." : <>Kirim Formulir <IkonPanah ukuran={14} /></>}
            </button>
            <Link to="/layanan" className="tombol tombol--garis">Kembali</Link>
          </div>
        </form>

        <aside className="kartu panel-layanan" aria-labelledby="judul-layanan">
          <span className="eyebrow">Layanan dipilih</span>
          <h2 id="judul-layanan">{layanan.namaLayanan}</h2>
          <ol className="langkah-form">
            <li><span>01</span>Identitas dan kontak</li>
            <li><span>02</span>Detil kegiatan / lomba</li>
          </ol>
          <div className="kotak-info">
            {layanan.dokumen.filter((d) => d.wajib).length} jenis lampiran wajib,{" "}
            {layanan.dokumen.filter((d) => !d.wajib).length} opsional. Perhatikan jenis file, jumlah, dan ukuran pada setiap unggahan.
          </div>
          <p className="catatan">
            {sudahMulai
              ? "Data dan file hanya digunakan selama sesi prototipe ini. Gunakan data contoh; formulir tidak terhubung ke layanan FILKOM."
              : "Pastikan seluruh data dan lampiran sudah benar sebelum mengirim formulir."}
          </p>
        </aside>
      </div>
    </>
  );
}

// Pembungkus label + petunjuk untuk satu kolom isian.
function Isian({ label, nama, petunjuk, children }) {
  return (
    <div className="field">
      <label htmlFor={nama} className="field__label">
        {label} <span className="tanda-wajib" aria-hidden="true">*</span>
      </label>
      {/* Id petunjuk selalu ada karena dipakai aria-describedby. */}
      <small id={`petunjuk-${nama}`} className={petunjuk ? "field__petunjuk" : "sr-only"}>
        {petunjuk ?? ""}
      </small>
      {children}
    </div>
  );
}

// Kolom tanggal: placeholder "Pilih tanggal" saat kosong, lalu berubah menjadi
// pemilih tanggal bawaan browser saat difokuskan. Nilai tetap berformat YYYY-MM-DD.
function InputTanggal({ value, min, ...sisa }) {
  const ref = useRef(null);
  const [fokus, setFokus] = useState(false);
  const tampilTanggal = fokus || Boolean(value);

  useEffect(() => {
    if (!fokus) return;
    try {
      ref.current?.showPicker?.();
    } catch {
      // showPicker bisa ditolak browser; pengguna tetap bisa mengetik tanggal.
    }
  }, [fokus]);

  return (
    <div className="input-tanggal">
      <input
        {...sisa}
        ref={ref}
        type={tampilTanggal ? "date" : "text"}
        placeholder="Pilih tanggal"
        value={value}
        min={min}
        onFocus={() => setFokus(true)}
        onBlur={() => setFokus(false)}
      />
      <IkonKalender ukuran={18} />
    </div>
  );
}

function SlotUnggah({ dok, file, galat, belumDiunggah, onPilih, onHapus }) {
  const [versi, setVersi] = useState(0); // mengosongkan input file setelah dipilih
  const aturan = dok.wajib ? ATURAN_FILE.wajib : ATURAN_FILE.opsional;
  const idInput = `berkas-${dok.idDokumen}`;
  const deskripsi = DESKRIPSI_DOKUMEN[dok.idDokumen];

  function saatDipilih(event) {
    const terpilih = event.target.files?.[0];
    if (terpilih) onPilih(terpilih);
    setVersi((v) => v + 1);
  }

  return (
    <div className={`slot-unggah ${belumDiunggah || galat ? "slot-unggah--galat" : ""}`}>
      <div className="slot-unggah__judul">
        <span>
          {dok.namaDokumen}
          {dok.wajib && <> <span className="tanda-wajib" aria-hidden="true">*</span></>}
        </span>
        <span className="badge badge--netral">{dok.wajib ? "Wajib" : "Opsional"}</span>
      </div>
      {deskripsi && <p>{deskripsi}</p>}
      <p>{aturan.label} · 1 file · maksimal {formatBatasMB(aturan.maksUkuran)} per file</p>

      {file && (
        <div className="berkas-terpilih">
          <span className="berkas__ikon" aria-hidden="true">FILE</span>
          <span className="berkas__info">
            <span className="berkas__nama">{file.name}</span>
            <span className="berkas__ket">{formatUkuranMB(file.size)}</span>
          </span>
          <button type="button" className="tautan-teks" onClick={onHapus} aria-label={`Hapus ${file.name}`}>Hapus</button>
        </div>
      )}

      <label htmlFor={idInput} className="slot-unggah__label">{file ? "Ganti file" : "Pilih file"}</label>
      <input
        key={versi} id={idInput} type="file"
        accept={aturan.ekstensi.join(",")} onChange={saatDipilih}
        aria-invalid={Boolean(belumDiunggah || galat)}
        aria-required={dok.wajib}
      />
      {galat && <p className="field__galat" role="alert" style={{ marginTop: 8 }}>{galat}</p>}
    </div>
  );
}
