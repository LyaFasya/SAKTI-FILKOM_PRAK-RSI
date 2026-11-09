import { extname } from "node:path";
import { readFile } from "node:fs/promises";

const MB = 1024 * 1024;
const namaIdentitas = new Map([
  ["nama mahasiswa", "namaMahasiswa"],
  ["nama pengaju", "namaMahasiswa"],
  ["nama lengkap dan gelar", "namaMahasiswa"],
  ["nim mahasiswa", "nim"],
  ["nim pengaju", "nim"],
  ["nim", "nim"],
  ["asal prodi", "programStudi"],
  ["program studi", "programStudi"],
  ["prodi", "programStudi"],
  ["prodi pengaju", "programStudi"],
  ["email", "email"],
  ["email pengaju", "email"],
  ["alamat email", "email"],
  ["email aktif", "email"],
]);

export function kondisiFormulirAktif(kondisi, isian) {
  if (!kondisi) return true;
  const nilai = isian?.[kondisi.field];
  return typeof nilai === "string" && kondisi.nilai.includes(nilai.trim());
}

export function validasiFormulir(isianJson, formulir, identitas) {
  if (isianJson !== undefined && typeof isianJson !== "string") {
    return { message: "Kirim field isianFormulir satu kali." };
  }

  let isian;

  try {
    isian = JSON.parse(isianJson ?? "{}");
  } catch {
    return { message: "Field isianFormulir harus berisi objek JSON." };
  }

  if (!isian || typeof isian !== "object" || Array.isArray(isian)) {
    return { message: "Field isianFormulir harus berisi objek JSON." };
  }

  function nilaiInput(label) {
    return Object.hasOwn(isian, label) ? isian[label] : undefined;
  }

  const data = Object.create(null);
  const belumDiisi = [];
  const kelompokAktif = new Set();

  for (const kelompok of formulir.kelompok) {
    if (!kondisiFormulirAktif(kelompok.aktifJika, isian)) continue;
    kelompokAktif.add(kelompok.judul);

    for (const item of kelompok.isian) {
      if (!kondisiFormulirAktif(item.aktifJika, isian)) continue;

      const { label, labelTampilan = label, wajib, tipe, pilihan } = item;
      const kunciIdentitas = ["Identitas dan kontak", "Data alumni"].includes(kelompok.judul)
        ? namaIdentitas.get(label.toLowerCase())
        : undefined;
      const nilai = kunciIdentitas
        ? identitas[kunciIdentitas]
        : nilaiInput(labelTampilan) ?? nilaiInput(label);
      const teks = typeof nilai === "number" && tipe === "Angka"
        ? String(nilai)
        : typeof nilai === "string" ? nilai.trim() : null;

      if (nilai === undefined || nilai === null || teks === "") {
        if (wajib) belumDiisi.push(labelTampilan);
        continue;
      }

      if (teks === null || teks.length > 5000) {
        return { message: `Isian "${labelTampilan}" harus berupa teks yang valid.` };
      }

      if (!kunciIdentitas && pilihan && !pilihan.includes(teks)) {
        return { message: `Pilih salah satu opsi yang tersedia pada "${labelTampilan}".` };
      }

      if (tipe === "Email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(teks)) {
        return { message: `Alamat email pada "${labelTampilan}" tidak valid.` };
      }

      if (tipe === "Angka" && (!/^\d+$/.test(teks) || !Number.isSafeInteger(Number(teks)))) {
        return { message: `Gunakan angka bulat yang valid pada "${labelTampilan}".` };
      }

      if (tipe === "Tanggal") {
        const tanggal = new Date(`${teks}T00:00:00.000Z`);
        if (
          !/^\d{4}-\d{2}-\d{2}$/.test(teks) ||
          !Number.isFinite(tanggal.getTime()) ||
          tanggal.toISOString().slice(0, 10) !== teks
        ) {
          return { message: `Gunakan tanggal YYYY-MM-DD yang valid pada "${labelTampilan}".` };
        }
      }

      data[labelTampilan] = teks;
    }
  }

  if (belumDiisi.length) {
    return { message: "Lengkapi isian formulir wajib.", belumDiisi };
  }

  return { data, kelompokAktif };
}

const tipeBerkas = {
  ".pdf": ["PDF", "application/pdf"],
  ".jpg": ["JPG", "image/jpeg"],
  ".jpeg": ["JPG", "image/jpeg"],
  ".png": ["PNG", "image/png"],
  ".webp": ["WEBP", "image/webp"],
  ".gif": ["GIF", "image/gif"],
  ".doc": ["DOC", "application/msword"],
  ".docx": ["DOCX", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  ".xls": ["XLS", "application/vnd.ms-excel"],
  ".xlsx": ["XLSX", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
};

const pdf = [".pdf"];
const formatDiizinkan = new Map([
  ["PDF", pdf],
  ["PDF atau gambar", [...pdf, ".jpg", ".jpeg", ".png", ".webp", ".gif"]],
  ["PDF atau dokumen Word", [...pdf, ".doc", ".docx"]],
  ["Spreadsheet (Excel)", [".xls", ".xlsx"]],
  ["Berkas", Object.keys(tipeBerkas)],
]);

function periksaIsi(buffer, format) {
  const awal = buffer.subarray(0, 12).toString("latin1");

  switch (format) {
    case "PDF":
      return /^%PDF-\d\.\d/.test(awal) &&
        buffer.subarray(-1024).toString("latin1").trimEnd().endsWith("%%EOF");
    case "JPG":
      return buffer.subarray(0, 3).toString("hex") === "ffd8ff";
    case "PNG":
      return buffer.subarray(0, 8).toString("hex") === "89504e470d0a1a0a";
    case "WEBP":
      return awal.startsWith("RIFF") && awal.slice(8, 12) === "WEBP";
    case "GIF":
      return awal.startsWith("GIF87a") || awal.startsWith("GIF89a");
    case "DOC":
    case "XLS":
      return buffer.subarray(0, 8).toString("hex") === "d0cf11e0a1b11ae1";
    case "DOCX":
    case "XLSX":
      return buffer.subarray(0, 4).toString("hex") === "504b0304" &&
        buffer.includes("[Content_Types].xml") &&
        buffer.includes(format === "DOCX" ? "word/document.xml" : "xl/workbook.xml");
    default:
      return false;
  }
}

export function batasUkuranLampiranMb(maksimalUkuranMb) {
  const batasStorage = Number(process.env.SUPABASE_LAMPIRAN_MAX_MB ?? 50);
  const batas = Number.isInteger(batasStorage) && batasStorage > 0 ? batasStorage : 50;
  return Math.min(maksimalUkuranMb || 10, batas, 100);
}

export function kelompokkanLampiran(files, persyaratan) {
  const master = new Map(persyaratan.map((dokumen) => [String(dokumen.idDokumen), dokumen]));
  const perDokumen = new Map();
  const lampiran = [];

  for (const file of files) {
    // Multer menerima nama field literal, misalnya lampiran[12].
    const id = /^lampiran\[([1-9]\d*)\]$/.exec(file.fieldname)?.[1];
    const dokumen = master.get(id);

    if (!dokumen) {
      return { message: "Gunakan field lampiran[ID_DOKUMEN] sesuai persyaratan layanan." };
    }

    const jumlah = (perDokumen.get(id) ?? 0) + 1;
    perDokumen.set(id, jumlah);

    if (jumlah > (dokumen.maksimalFile || 1)) {
      return { message: `Jumlah file untuk "${dokumen.namaDokumen}" melebihi batas.` };
    }

    const maksimalMb = batasUkuranLampiranMb(dokumen.maksimalUkuranMb);
    if (file.size < 1 || file.size > maksimalMb * MB) {
      return {
        status: file.size > maksimalMb * MB ? 413 : 400,
        message: `Ukuran file "${dokumen.namaDokumen}" harus lebih dari 0 dan maksimal ${maksimalMb} MB.`,
      };
    }

    const namaFile = file.originalname.split(/[\\/]/).pop().replace(/[\u0000-\u001f\u007f]/g, "").trim();
    const ekstensi = extname(namaFile).toLowerCase();
    const ekstensiDiizinkan = formatDiizinkan.get(dokumen.format ?? "PDF") ?? pdf;

    if (!ekstensiDiizinkan.includes(ekstensi)) {
      return { message: `Format "${dokumen.namaDokumen}" harus ${dokumen.format ?? "PDF"}.` };
    }

    const [formatFile, contentType] = tipeBerkas[ekstensi];
    lampiran.push({
      idDokumen: dokumen.idDokumen,
      namaFile: namaFile.slice(0, 255),
      formatFile,
      contentType,
      ekstensi,
      ukuranFile: file.size,
      pathSementara: file.path,
    });
  }

  const dokumenBelumLengkap = persyaratan.filter(
    ({ idDokumen, wajib }) => wajib && !perDokumen.has(String(idDokumen))
  ).map(({ idDokumen, namaDokumen }) => ({ idDokumen, namaDokumen }));

  if (dokumenBelumLengkap.length) {
    return { message: "Unggah seluruh dokumen wajib.", dokumenBelumLengkap };
  }

  return { lampiran };
}

export async function bacaLampiran(lampiran) {
  const buffer = await readFile(lampiran.pathSementara);
  return periksaIsi(buffer, lampiran.formatFile) ? buffer : null;
}
