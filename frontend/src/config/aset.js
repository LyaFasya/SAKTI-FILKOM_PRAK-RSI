// Gambar tampilan disimpan di Supabase (bucket public aset-frontend), bukan di repo
const BASE = "https://lfycgknkqalhwskvvgzu.supabase.co/storage/v1/object/public/aset-frontend";

export const ASET = {
  logoFilkom: `${BASE}/logo-filkom.png`,
  logoFilkomUb: `${BASE}/logo-filkom-ub.png`,
  bannerLogin: `${BASE}/banner-login.png`,
  bannerLayanan: `${BASE}/banner-layanan.png`
};
