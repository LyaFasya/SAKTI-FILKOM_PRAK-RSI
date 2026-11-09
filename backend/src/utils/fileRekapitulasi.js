import { buffer } from "node:stream/consumers";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

const kolom = [
  { judul: "ID Pengajuan", lebarExcel: 18, lebarPdf: 82 },
  { judul: "Nama Mahasiswa", lebarExcel: 32, lebarPdf: 135 },
  { judul: "NIM", lebarExcel: 22, lebarPdf: 95 },
  { judul: "Layanan", lebarExcel: 55, lebarPdf: 230 },
  { judul: "Tanggal", lebarExcel: 16, lebarPdf: 80 },
  { judul: "Status", lebarExcel: 24, lebarPdf: 125 },
];

const formatTanggal = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function buatBaris(data) {
  return data.map((item) => [
    item.kodePengajuan ?? String(item.idPengajuan),
    item.namaMahasiswa ?? "",
    String(item.nim ?? ""),
    item.namaLayanan ?? "",
    item.tanggalPengajuan
      ? formatTanggal.format(new Date(item.tanggalPengajuan))
      : "",
    item.statusPengajuan ?? "",
  ]);
}

function ringkasanKriteria(kriteria) {
  return [
    ["Jenis layanan", kriteria.namaLayanan ?? "Semua layanan"],
    ["Status", kriteria.statusPengajuan ?? "Semua status"],
    ["Tanggal awal", kriteria.tanggalMulai ?? "Semua tanggal"],
    ["Tanggal akhir", kriteria.tanggalAkhir ?? "Semua tanggal"],
  ];
}

async function buatExcel(baris, kriteria) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Rekapitulasi");

  sheet.columns = kolom.map(({ judul, lebarExcel }) => ({
    header: judul,
    width: lebarExcel,
  }));

  sheet.getRow(1).font = { bold: true };
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  sheet.addRows(baris);

  const filter = workbook.addWorksheet("Kriteria Filter");
  filter.columns = [
    { header: "Kriteria", width: 22 },
    { header: "Nilai", width: 64 },
  ];
  filter.getRow(1).font = { bold: true };
  filter.addRows(ringkasanKriteria(kriteria));

  return Buffer.from(await workbook.xlsx.writeBuffer());
}

async function buatPdf(baris, kriteria) {
  const pdf = new PDFDocument({
    size: "A4",
    layout: "landscape",
    margin: 36,
  });

  const xAwal = 36;
  const lebarTabel = kolom.reduce((total, item) => total + item.lebarPdf, 0);

  function tinggiBaris(nilai) {
    return Math.max(
      ...nilai.map((teks, index) =>
        pdf.heightOfString(teks, { width: kolom[index].lebarPdf - 10 })
      )
    ) + 10;
  }

  function tulisBaris(nilai, y, tinggi) {
    let x = xAwal;

    nilai.forEach((teks, index) => {
      const { lebarPdf } = kolom[index];
      pdf.text(teks, x + 5, y + 5, { width: lebarPdf - 10 });
      x += lebarPdf;
    });

    pdf
      .moveTo(xAwal, y + tinggi)
      .lineTo(xAwal + lebarTabel, y + tinggi)
      .strokeColor("#D1D5DB")
      .stroke();

    return y + tinggi;
  }

  function tulisKepalaHalaman() {
    pdf
      .font("Helvetica-Bold")
      .fontSize(16)
      .text("Rekapitulasi Pengajuan SAKTI FILKOM", xAwal, 36);

    pdf.font("Helvetica").fontSize(9);
    const keterangan = ringkasanKriteria(kriteria)
      .map(([label, nilai]) => `${label}: ${nilai}`)
      .join(" | ");
    pdf.text(keterangan, xAwal, 58, { width: lebarTabel });

    const yTabel = pdf.y + 8;
    pdf.font("Helvetica-Bold").fontSize(9);
    const judulKolom = kolom.map(({ judul }) => judul);
    const y = tulisBaris(judulKolom, yTabel, tinggiBaris(judulKolom));

    pdf.font("Helvetica");
    return y;
  }

  let y = tulisKepalaHalaman();

  for (const nilai of baris) {
    const tinggi = tinggiBaris(nilai);

    if (y + tinggi > pdf.page.height - pdf.page.margins.bottom) {
      pdf.addPage();
      y = tulisKepalaHalaman();
    }

    y = tulisBaris(nilai, y, tinggi);
  }

  const file = buffer(pdf);
  pdf.end();
  return file;
}

export async function buatFileRekapitulasi(data, format, kriteria = {}) {
  const baris = buatBaris(data);

  if (format === "xlsx") {
    return {
      nama: "rekapitulasi-pengajuan.xlsx",
      tipe: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      isi: await buatExcel(baris, kriteria),
    };
  }

  return {
    nama: "rekapitulasi-pengajuan.pdf",
    tipe: "application/pdf",
    isi: await buatPdf(baris, kriteria),
  };
}
