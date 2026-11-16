import nodemailer from "nodemailer";
import { ambilBucketDokumenHasil } from "../config/storage.js";
import { buatEmailStatus } from "./templateEmailStatus.js";

function emailDikonfigurasi() {
  if (process.env.EMAIL_TRANSPORT === "gmail") {
    return Boolean(process.env.GMAIL_USER?.trim() && process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, ""));
  }
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_PENGIRIM);
}

async function kirimEmail(isi, idempotencyKey) {
  if (process.env.EMAIL_TRANSPORT === "gmail") {
    const user = process.env.GMAIL_USER.trim();
    const smtp = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass: process.env.GMAIL_APP_PASSWORD.replace(/\s/g, "") },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 30000,
    });

    await smtp.sendMail({
      ...isi,
      from: { name: "SAKTI FILKOM", address: user },
      attachments: isi.attachments?.map((lampiran) => ({ ...lampiran, encoding: "base64" })),
    });
    return;
  }

  const { RESEND_API_KEY, EMAIL_PENGIRIM } = process.env;
  const respons = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({ from: EMAIL_PENGIRIM, ...isi }),
    signal: AbortSignal.timeout(10000),
  });

  if (!respons.ok) {
    throw new Error(`Layanan email mengembalikan HTTP ${respons.status}.`);
  }
}

export async function kirimEmailStatus({ notifikasi, detail, dokumen, alasanPenolakan }) {
  if (!emailDikonfigurasi()) return;

  let statusPengirimanEmail = "Terkirim";
  let keteranganEmail = null;

  try {
    const isi = {
      to: [detail.email],
      ...buatEmailStatus({
        status: notifikasi.statusPengajuan,
        detail,
        namaDokumen: dokumen?.namaDokumen,
        alasanPenolakan,
      }),
    };

    if (dokumen) {
      const { data, error } = await ambilBucketDokumenHasil()
        .download(dokumen.lokasiFile, {}, { signal: AbortSignal.timeout(10000) });

      if (error || !data) throw new Error("PDF tidak dapat diambil dari Storage.");

      isi.attachments = [{
        filename: dokumen.namaDokumen,
        content: Buffer.from(await data.arrayBuffer()).toString("base64"),
      }];
    }

    await kirimEmail(isi, `sakti-notifikasi-${notifikasi.idNotifikasi}`);
  } catch (error) {
    statusPengirimanEmail = "Gagal";
    keteranganEmail = String(error.message ?? "Pengiriman email gagal.").slice(0, 255);
  }

  try {
    await notifikasi.update({ statusPengirimanEmail, keteranganEmail });
  } catch (error) {
    console.error("Status pengiriman email gagal dicatat.", error.message);
  }
}


export async function kirimEmailSalinan({ penerima, kodePengajuan, namaLayanan, isian, lampiran }) {
  if (!emailDikonfigurasi()) return "Belum dikonfigurasi";

  const jawaban = Object.entries(isian).map(([label, nilai]) => `${label}: ${nilai}`);
  const namaBerkas = lampiran.map(({ namaFile }) => `- ${namaFile}`);

  try {
    await kirimEmail({
      to: [penerima],
      subject: `SAKTI FILKOM · Salinan ${kodePengajuan}`,
      text: [
        `Pengajuan ${kodePengajuan} – ${namaLayanan}`,
        "",
        ...jawaban,
        "",
        "Lampiran yang dikirim:",
        ...(namaBerkas.length ? namaBerkas : ["Tidak ada lampiran."]),
      ].join("\n"),
    }, `sakti-salinan-${kodePengajuan}`);

    return "Terkirim";
  } catch (error) {
    console.error("Salinan jawaban gagal dikirim.", error.message);
    return "Gagal";
  }
}
