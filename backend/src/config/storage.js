import { createClient } from "@supabase/supabase-js";

let supabase;

function ambilBucket(nama) {
  if (!supabase) {
    const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;

    if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
      throw new Error("Konfigurasi Supabase Storage belum lengkap.");
    }

    supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return supabase.storage.from(nama);
}

export function ambilBucketDokumenHasil() {
  return ambilBucket("dokumen-hasil");
}

export function ambilBucketLampiranPengajuan() {
  return ambilBucket("lampiran-pengajuan");
}
