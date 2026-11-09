export async function kirimTautanBerkas(res, bucket, lokasiFile, download) {
  const berlakuDetik = 120;
  const { data, error } = await bucket.createSignedUrl(lokasiFile, berlakuDetik, {
    download,
  });

  if (error || !data?.signedUrl) {
    const tidakDitemukan = ["404", "NoSuchKey", "not_found"].includes(
      String(error?.statusCode ?? error?.status ?? error?.code)
    );
    return res.status(tidakDitemukan ? 404 : 502).json({
      message: tidakDitemukan
        ? "Berkas tidak ditemukan di Storage."
        : "Tautan berkas belum bisa dibuat. Coba lagi.",
    });
  }

  return res.set("Cache-Control", "no-store").json({
    data: { url: data.signedUrl, berlakuDetik },
  });
}
