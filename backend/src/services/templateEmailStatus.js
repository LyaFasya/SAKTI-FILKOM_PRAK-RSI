const TAMPILAN_STATUS = {
  Diproses: {
    judul: "Pengajuanmu sedang diproses",
    isi: "Staf Kemahasiswaan sedang memeriksa pengajuan dan berkas yang kamu kirim.",
    langkah: "Kamu bisa memantau perkembangan pengajuan di menu Riwayat Pengajuan pada SAKTI FILKOM.",
    warna: "#1d4ed8",
    latar: "#dbeafe",
  },
  Disetujui: {
    judul: "Pengajuanmu disetujui",
    isi: "Dokumen hasil pengajuanmu sudah siap dan kami sertakan sebagai lampiran PDF dalam email ini.",
    langkah: "Unduh PDF dari lampiran dan simpan untuk keperluanmu. Kamu juga bisa mengunduhnya dari detail pengajuan di SAKTI FILKOM.",
    warna: "#166534",
    latar: "#dcfce7",
  },
  Ditolak: {
    judul: "Pengajuanmu belum dapat disetujui",
    isi: "Staf Kemahasiswaan telah meninjau pengajuanmu. Alasan penolakan tercantum di bawah ini.",
    langkah: "Buka detail pengajuan di SAKTI FILKOM untuk melihat riwayat status dan catatan sebelum mengajukan kembali.",
    warna: "#9f1239",
    latar: "#ffe4e6",
  },
};

function escapeHtml(teks) {
  const karakterHtml = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return teks.replace(/[&<>"']/g, (karakter) => karakterHtml[karakter]);
}

export function buatEmailStatus({ status, detail, namaDokumen, alasanPenolakan }) {
  const { judul, isi, langkah, warna, latar } = TAMPILAN_STATUS[status];
  const { namaMahasiswa, kodePengajuan, namaLayanan } = detail;
  const sapaan = namaMahasiswa ? `Halo, ${namaMahasiswa}!` : "Halo!";
  const ringkasan = [
    ["Kode pengajuan", kodePengajuan],
    ["Layanan", namaLayanan],
  ];
  const catatan = alasanPenolakan
    ? ["Alasan penolakan", alasanPenolakan]
    : namaDokumen && ["Lampiran PDF", namaDokumen];
  const penutup = "Salam, Tim SAKTI FILKOM";
  const footer = "Email ini dikirim otomatis oleh SAKTI FILKOM. Untuk melihat detail pengajuan, buka akun SAKTI FILKOM kamu.";

  const text = [
    sapaan, "", judul, isi, "",
    ...ringkasan.map(([label, nilai]) => `${label}: ${nilai}`),
    `Status: ${status}`,
    ...(catatan ? ["", `${catatan[0]}: ${catatan[1]}`] : []),
    "", langkah, "", penutup, "", footer,
  ].join("\n");

  const barisRingkasan = ringkasan.map(([label, nilai]) => `
    <tr><td style="padding:8px 16px;font-size:13px;color:#475569">${label}</td>
    <td style="padding:8px 16px;font-size:14px;font-weight:700;color:#0f172a;overflow-wrap:anywhere">${escapeHtml(nilai)}</td></tr>`).join("");
  const kotakCatatan = catatan ? `
    <p style="margin:20px 0 0;padding:14px 16px;border-left:4px solid ${warna};background-color:${latar};color:${warna};overflow-wrap:anywhere">
      <strong>${catatan[0]}</strong><br>${escapeHtml(catatan[1]).replace(/\r?\n/g, "<br>")}
    </p>` : "";

  const html = `<!doctype html>
<html lang="id">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${judul}</title></head>
<body style="margin:0;padding:0;background-color:#eef2f7;font-family:Arial,sans-serif;color:#0f172a">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#eef2f7">
    <tr><td align="center" style="padding:24px 12px">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#ffffff;border:1px solid #dbe3ef;border-radius:16px">
        <tr><td style="padding:24px;background-color:#142d56;color:#ffffff;border-radius:15px 15px 0 0">
          <div style="font-size:21px;font-weight:700;letter-spacing:0.5px">SAKTI FILKOM</div>
          <div style="margin-top:5px;font-size:13px;color:#dbeafe">Layanan Kemahasiswaan</div>
        </td></tr>
        <tr><td style="padding:24px;font-size:15px;line-height:1.6">
          <span style="display:inline-block;padding:4px 12px;border-radius:20px;background-color:${latar};color:${warna};font-size:13px;font-weight:700">${status}</span>
          <h1 style="margin:12px 0 16px;font-size:24px;line-height:1.25">${judul}</h1>
          <p style="margin:0 0 8px">${escapeHtml(sapaan)}</p>
          <p style="margin:0 0 20px">${isi}</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9;border-radius:8px">
            ${barisRingkasan}
          </table>
          ${kotakCatatan}
          <p style="margin:20px 0 16px">${langkah}</p>
          <p style="margin:0">${penutup}</p>
        </td></tr>
        <tr><td style="padding:16px 24px;border-top:1px solid #e2e8f0;color:#475569;font-size:12px;line-height:1.5">${footer}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject: `SAKTI FILKOM | ${kodePengajuan} · ${status}`, text, html };
}
