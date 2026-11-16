import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { IkonKalender, IkonPanah } from "../../components/mahasiswa/Icons.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import { FORMAT_FILE, kunciIdentitas, petunjukIsian, PROGRAM_STUDI } from "../../config/formPengajuan.js";
import useAmbilData from "../../hooks/useAmbilData.js";
import { ambilDataFormPengajuan, kirimPengajuan } from "../../services/pengajuanMahasiswaService.js";
import { formatBatasMB, formatUkuranMB } from "../../utils/formatPengajuan.js";

const MB = 1024 * 1024;

// PGJ-UI01 Isi Formulir | PGJ-UI02 Formulir Terisi | PGJ-UI03 Data Tidak Lengkap
// PGJ-UC01 Mengajukan Layanan Kemahasiswaan
// Isi form dibangun dari GET /api/layanan/:id -> rincianFormulir, jadi satu halaman ini
// melayani semua layanan. Kunci tiap isian = labelTampilan ?? label (sama dengan backend).
const kunciIsian = (item) => item.labelTampilan ?? item.label;

// aktifJika: { field, nilai: [..] } -> aktif bila isian `field` bernilai salah satu dari `nilai`.
function kondisiAktif(kondisi, isian) {
  if (!kondisi) return true;
  const nilai = isian[kondisi.field];
  return typeof nilai === "string" && kondisi.nilai.includes(nilai.trim());
}

export default function FormPengajuanPage() {
  const { idLayanan } = useParams();
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

  if (!data.menerimaPengajuan || !data.rincianFormulir?.length) {
    // statusFormulir dari backend: "informasi" = layanan tanpa formulir, "ditutup" = formulir ditutup sementara.
    const hanyaInformasi = data.statusFormulir === "informasi";
    return (
      <>
        <PageHeader
          judul={data.namaLayanan}
          deskripsi={hanyaInformasi ? "Layanan ini bersifat informasi dan tidak memerlukan pengajuan formulir." : "Layanan ini sedang tidak menerima pengajuan."}
        />
        {data.catatan && <p className="kotak-info">{data.catatan}</p>}
        {hanyaInformasi && data.informasiLayanan && <p className="kotak-info">{data.informasiLayanan}</p>}
        <Link to="/layanan" className="tombol tombol--garis">Kembali ke Layanan</Link>
      </>
    );
  }

  // `key` memaksa isian dikosongkan jika mahasiswa pindah ke layanan lain.
  return <IsiFormulir key={idLayanan} layanan={data} />;
}

function IsiFormulir({ layanan }) {
  const navigate = useNavigate();
  const ringkasanRef = useRef(null);
  const { profil } = layanan;

  const [isian, setIsian] = useState({});             // { [kunci isian]: string }
  const [berkas, setBerkas] = useState({});           // { [idDokumen]: File[] }
  const [galatBerkas, setGalatBerkas] = useState({}); // format/ukuran/jumlah file salah
  const [galat, setGalat] = useState({});             // { [kunci isian]: pesan } saat kirim
  const [dokumenKurang, setDokumenKurang] = useState([]);
  const [galatServer, setGalatServer] = useState([]); // daftar isian dari respons 400 backend
  const [kirimSalinan, setKirimSalinan] = useState(false);
  const [percobaan, setPercobaan] = useState(0);
  const [pesanGagal, setPesanGagal] = useState("");
  const [mengirim, setMengirim] = useState(false);

  // Kelompok bersyarat (aktifJika) hanya tampil bila kondisinya terpenuhi.
  const kelompokAktif = layanan.rincianFormulir
    .map((kelompok, indeks) => ({ ...kelompok, indeks }))
    .filter((kelompok) => kondisiAktif(kelompok.aktifJika, isian));
  const lampiranAktif = kelompokAktif.flatMap((k) => k.lampiran ?? []);

  const adaGalat = Object.keys(galat).length > 0 || dokumenKurang.length > 0 || galatServer.length > 0;
  const sudahMulai = percobaan > 0 || Object.values(isian).some(Boolean) || Object.keys(berkas).length > 0;

  // Fokus ke ringkasan galat setiap kali kirim gagal validasi, supaya terbaca pembaca layar.
  useEffect(() => {
    if (percobaan > 0 && adaGalat) ringkasanRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percobaan]);

  function ubah(kunci, nilai) {
    setIsian((lama) => ({ ...lama, [kunci]: nilai }));
    setGalat((lama) => {
      if (!lama[kunci]) return lama;
      const baru = { ...lama };
      delete baru[kunci];
      return baru;
    });
  }

  function pilihBerkas(dok, terpilih) {
    const diizinkan = FORMAT_FILE[dok.format ?? "PDF"] ?? FORMAT_FILE.PDF;
    const maksFile = dok.maksimalFile || 1;
    const maksByte = (dok.maksimalUkuranEfektifMb ?? dok.maksimalUkuranMb ?? 10) * MB;
    const baru = maksFile === 1 ? [] : [...(berkas[dok.idDokumen] ?? [])];
    let pesan = "";

    for (const file of terpilih) {
      const ekstensi = `.${file.name.split(".").pop().toLowerCase()}`;
      if (!diizinkan.includes(ekstensi)) {
        pesan = `Format file tidak sesuai. Gunakan file ${dok.format ?? "PDF"}.`;
      } else if (file.size < 1) {
        pesan = "File kosong tidak dapat diunggah.";
      } else if (file.size > maksByte) {
        pesan = `Ukuran file ${formatUkuranMB(file.size)} melebihi batas ${formatBatasMB(maksByte)}.`;
      } else if (baru.length >= maksFile) {
        pesan = `Jumlah file untuk ${dok.namaDokumen} maksimal ${maksFile}.`;
      } else {
        baru.push(file);
      }
    }

    setGalatBerkas((lama) => ({ ...lama, [dok.idDokumen]: pesan }));
    if (!baru.length) return;

    setBerkas((lama) => ({ ...lama, [dok.idDokumen]: baru }));
    setDokumenKurang((lama) => lama.filter((d) => d.idDokumen !== dok.idDokumen));
  }

  function hapusBerkas(dok, file) {
    setBerkas((lama) => {
      const sisa = (lama[dok.idDokumen] ?? []).filter((f) => f !== file);
      const baru = { ...lama };
      if (sisa.length) baru[dok.idDokumen] = sisa;
      else delete baru[dok.idDokumen];
      return baru;
    });
    setGalatBerkas((lama) => ({ ...lama, [dok.idDokumen]: "" }));
  }

  // Pesan galat berurutan sesuai urutan kolom di form (sama dengan ringkasan di Figma).
  function validasi() {
    const hasil = {};

    for (const kelompok of kelompokAktif) {
      for (const item of kelompok.isian) {
        if (kunciIdentitas(kelompok.judul, item.label)) continue; // diisi backend dari akun
        if (!kondisiAktif(item.aktifJika, isian)) continue;

        const kunci = kunciIsian(item);
        const nilai = String(isian[kunci] ?? "").trim();

        if (!nilai) {
          if (item.wajib) hasil[kunci] = `Lengkapi ${kunci}.`;
        } else if (item.tipe === "Email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nilai)) {
          hasil[kunci] = `Alamat email pada "${kunci}" tidak valid.`;
        } else if (item.tipe === "Angka" && !/^\d+$/.test(nilai)) {
          hasil[kunci] = `Gunakan angka bulat yang valid pada "${kunci}".`;
        }
      }

      // Tanggal akhir/selesai tidak boleh sebelum tanggal awal/mulai dalam satu kelompok.
      const tanggal = kelompok.isian.filter((i) => i.tipe === "Tanggal" && kondisiAktif(i.aktifJika, isian));
      const awal = tanggal.find((i) => /awal|mulai/i.test(i.label));
      const akhir = tanggal.find((i) => /akhir|selesai/i.test(i.label));
      if (awal && akhir && isian[kunciIsian(awal)] && isian[kunciIsian(akhir)] && !hasil[kunciIsian(akhir)]
        && isian[kunciIsian(akhir)] < isian[kunciIsian(awal)]) {
        hasil[kunciIsian(akhir)] = `${kunciIsian(akhir)} tidak boleh sebelum ${kunciIsian(awal)}.`;
      }
    }

    const kurang = lampiranAktif.filter((d) => d.wajib && !berkas[d.idDokumen]?.length);
    return { hasil, kurang };
  }

  async function kirim(event) {
    event.preventDefault();
    setPesanGagal("");
    setGalatServer([]);

    const { hasil, kurang } = validasi();
    setGalat(hasil);
    setDokumenKurang(kurang);
    setPercobaan((n) => n + 1);
    if (Object.keys(hasil).length > 0 || kurang.length > 0) return;

    // Hanya isian dan lampiran milik kelompok aktif yang dikirim.
    const isianKirim = {};
    for (const kelompok of kelompokAktif) {
      for (const item of kelompok.isian) {
        if (kunciIdentitas(kelompok.judul, item.label) || !kondisiAktif(item.aktifJika, isian)) continue;
        const nilai = String(isian[kunciIsian(item)] ?? "").trim();
        if (nilai) isianKirim[kunciIsian(item)] = nilai;
      }
    }
    const berkasKirim = {};
    for (const dok of lampiranAktif) {
      if (berkas[dok.idDokumen]?.length) berkasKirim[dok.idDokumen] = berkas[dok.idDokumen];
    }

    setMengirim(true);
    try {
      const { idPengajuan } = await kirimPengajuan({
        idLayanan: layanan.idLayanan,
        isian: isianKirim,
        berkas: berkasKirim,
        kirimSalinanEmail: layanan.bolehKirimSalinanEmail ? kirimSalinan : undefined
      });
      navigate(`/pengajuan-saya/terkirim/${idPengajuan}`, { replace: true });
    } catch (e) {
      setPesanGagal(e.message || "Pengajuan gagal disimpan. Kirim ulang beberapa saat lagi.");
      setGalatServer([
        ...(e.data?.belumDiisi ?? []).map((label) => `Lengkapi ${label}.`),
        ...(e.data?.dokumenBelumLengkap ?? []).map((d) => `Lampiran wajib belum tersedia: ${d.namaDokumen}.`)
      ]);
      setMengirim(false);
    }
  }

  const jumlahWajib = lampiranAktif.filter((d) => d.wajib).length;
  const jumlahOpsional = lampiranAktif.length - jumlahWajib;

  return (
    <>
      <PageHeader
        judul={`Formulir ${layanan.namaLayanan}`}
        deskripsi="Kolom bertanda * wajib diisi. Pilihan tertentu menampilkan bagian tambahan."
      />

      <div className="grid-form">
        <form onSubmit={kirim} noValidate className="kartu kartu-form">
          {layanan.catatan && <p className="kotak-info">{layanan.catatan}</p>}

          {kelompokAktif.map((kelompok, urutan) => (
            <section key={kelompok.indeks} aria-labelledby={`judul-kelompok-${kelompok.indeks}`}>
              {urutan > 0 && <hr className="pemisah-bagian" />}
              <div className="bagian-judul">
                <span className="nomor-bagian" aria-hidden="true">{String(urutan + 1).padStart(2, "0")}</span>
                <h2 id={`judul-kelompok-${kelompok.indeks}`}>{kelompok.judul}</h2>
              </div>

              {kelompok.isian.map((item, i) => {
                if (!kondisiAktif(item.aktifJika, isian)) return null;
                const kunci = kunciIsian(item);
                const kunciProfil = kunciIdentitas(kelompok.judul, item.label);
                return (
                  <KolomIsian
                    key={`${kelompok.indeks}-${i}`}
                    id={`f-${kelompok.indeks}-${i}`}
                    item={item}
                    label={kunci}
                    nilai={kunciProfil ? profil[kunciProfil] ?? "" : isian[kunci] ?? ""}
                    otomatis={Boolean(kunciProfil)}
                    galat={Boolean(galat[kunci])}
                    onUbah={(nilai) => ubah(kunci, nilai)}
                  />
                );
              })}

              {(kelompok.lampiran ?? []).map((dok) => (
                <SlotUnggah
                  key={dok.idDokumen}
                  dok={dok}
                  daftarFile={berkas[dok.idDokumen] ?? []}
                  galat={galatBerkas[dok.idDokumen]}
                  belumDiunggah={dokumenKurang.some((d) => d.idDokumen === dok.idDokumen)}
                  onPilih={(files) => pilihBerkas(dok, files)}
                  onHapus={(file) => hapusBerkas(dok, file)}
                />
              ))}
            </section>
          ))}

          {layanan.bolehKirimSalinanEmail && (
            <label className="kotak-centang">
              <input type="checkbox" checked={kirimSalinan} onChange={(e) => setKirimSalinan(e.target.checked)} />
              <span>Kirim salinan jawaban ke email saya</span>
            </label>
          )}

          {adaGalat && (
            <div className="ringkasan-galat" role="alert" tabIndex={-1} ref={ringkasanRef}>
              <strong>Periksa kembali formulir</strong>
              <ul>
                {Object.entries(galat).map(([kunci, pesan]) => <li key={kunci}>{pesan}</li>)}
                {dokumenKurang.map((d) => <li key={d.idDokumen}>Lampiran wajib belum tersedia: {d.namaDokumen}.</li>)}
                {galatServer.map((pesan) => <li key={pesan}>{pesan}</li>)}
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
            {kelompokAktif.map((kelompok, urutan) => (
              <li key={kelompok.indeks}><span>{String(urutan + 1).padStart(2, "0")}</span>{kelompok.judul}</li>
            ))}
          </ol>
          {lampiranAktif.length > 0 && (
            <div className="kotak-info">
              {jumlahWajib} jenis lampiran wajib, {jumlahOpsional} opsional. Perhatikan jenis file, jumlah, dan ukuran pada setiap unggahan.
            </div>
          )}
          <p className="catatan">
            {sudahMulai
              ? "Pengajuan akan dikirim ke kemahasiswaan FILKOM dan tidak dapat diubah setelah terkirim. Periksa kembali isian dan lampiran."
              : "Pastikan seluruh data dan lampiran sudah benar sebelum mengirim formulir."}
          </p>
        </aside>
      </div>
    </>
  );
}

// Satu kolom isian; bentuknya mengikuti item.tipe dari backend.
function KolomIsian({ id, item, label, nilai, otomatis, galat, onUbah }) {
  const petunjuk = petunjukIsian(label);
  const sifat = {
    id,
    "aria-invalid": galat,
    "aria-required": item.wajib,
    "aria-describedby": `petunjuk-${id}`,
    maxLength: 5000 // batas isian di backend (validasiFormulir)
  };

  // Pilihan dengan daftar opsi tampil sebagai kartu radio; tanpa daftar opsi menjadi isian bebas.
  const adaOpsi = item.tipe === "Pilihan" && (item.pilihan?.length || otomatis);

  if (adaOpsi) {
    const opsi = otomatis ? PROGRAM_STUDI : item.pilihan;
    return (
      <fieldset className="grup-pilihan" disabled={otomatis} aria-describedby={`petunjuk-${id}`}>
        <legend>{label} {item.wajib && <span className="tanda-wajib" aria-hidden="true">*</span>}</legend>
        <div className="grup-pilihan__daftar" aria-invalid={galat}>
          {opsi.map((pilihan) => (
            <label key={pilihan} className="pilihan">
              <input
                type="radio" name={id} value={pilihan}
                checked={nilai === pilihan} onChange={() => onUbah(pilihan)}
              />
              {pilihan}
            </label>
          ))}
        </div>
        <span id={`petunjuk-${id}`} className={petunjuk ? "field__petunjuk" : "sr-only"}>{petunjuk ?? ""}</span>
      </fieldset>
    );
  }

  let kontrol;
  if (otomatis) {
    kontrol = <input id={id} value={nilai} readOnly aria-describedby={`petunjuk-${id}`} />;
  } else if (item.tipe === "Isian panjang") {
    kontrol = <textarea rows={4} {...sifat} value={nilai} onChange={(e) => onUbah(e.target.value)} />;
  } else if (item.tipe === "Tanggal") {
    kontrol = <InputTanggal {...sifat} value={nilai} onChange={(e) => onUbah(e.target.value)} />;
  } else {
    const jenis = { Email: { type: "email", autoComplete: "email" }, Angka: { type: "text", inputMode: "numeric" } }[item.tipe] ?? {};
    kontrol = <input {...jenis} {...sifat} value={nilai} onChange={(e) => onUbah(e.target.value)} />;
  }

  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label} {item.wajib && <span className="tanda-wajib" aria-hidden="true">*</span>}
      </label>
      {/* Id petunjuk selalu ada karena dipakai aria-describedby. */}
      <small id={`petunjuk-${id}`} className={petunjuk ? "field__petunjuk" : "sr-only"}>{petunjuk ?? ""}</small>
      {kontrol}
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

function SlotUnggah({ dok, daftarFile, galat, belumDiunggah, onPilih, onHapus }) {
  const [versi, setVersi] = useState(0); // mengosongkan input file setelah dipilih
  const maksFile = dok.maksimalFile || 1;
  const idInput = `berkas-${dok.idDokumen}`;
  const diizinkan = FORMAT_FILE[dok.format ?? "PDF"] ?? FORMAT_FILE.PDF;
  const bisaTambah = maksFile === 1 || daftarFile.length < maksFile;

  function saatDipilih(event) {
    const terpilih = Array.from(event.target.files ?? []);
    if (terpilih.length) onPilih(terpilih);
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
      {dok.petunjukUnggahan && <p>{dok.petunjukUnggahan}</p>}
      {dok.ketentuanUnggahan && <p>{dok.ketentuanUnggahan}</p>}

      {daftarFile.map((file) => (
        <div key={`${file.name}-${file.size}-${file.lastModified}`} className="berkas-terpilih">
          <span className="berkas__ikon" aria-hidden="true">FILE</span>
          <span className="berkas__info">
            <span className="berkas__nama">{file.name}</span>
            <span className="berkas__ket">{formatUkuranMB(file.size)}</span>
          </span>
          <button type="button" className="tautan-teks" onClick={() => onHapus(file)} aria-label={`Hapus ${file.name}`}>Hapus</button>
        </div>
      ))}

      {bisaTambah && (
        <>
          <label htmlFor={idInput} className="slot-unggah__label">
            {daftarFile.length === 0 ? "Pilih file" : maksFile === 1 ? "Ganti file" : "Tambah file"}
          </label>
          <input
            key={versi} id={idInput} type="file" multiple={maksFile > 1}
            accept={diizinkan.join(",")} onChange={saatDipilih}
            aria-invalid={Boolean(belumDiunggah || galat)}
            aria-required={dok.wajib}
          />
        </>
      )}
      {galat && <p className="field__galat" role="alert" style={{ marginTop: 8 }}>{galat}</p>}
    </div>
  );
}
