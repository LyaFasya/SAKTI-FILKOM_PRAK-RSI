// Ikon SVG sederhana untuk area mahasiswa. Warna mengikuti warna teks sekitarnya.
function Ikon({ children, ukuran = 20, ...sisa }) {
  return (
    <svg width={ukuran} height={ukuran} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...sisa}>
      {children}
    </svg>
  );
}

export const IkonTopi = (p) => (
  <Ikon {...p}><path d="M22 10 12 5 2 10l10 5 10-5z" /><path d="M6 12v5c3 2 9 2 12 0v-5" /></Ikon>
);
export const IkonLayanan = (p) => (
  <Ikon {...p}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
  </Ikon>
);
export const IkonDokumen = (p) => (
  <Ikon {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h6" /></Ikon>
);
export const IkonLonceng = (p) => (
  <Ikon {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></Ikon>
);
export const IkonKeluar = (p) => (
  <Ikon {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></Ikon>
);
export const IkonCentang = (p) => (<Ikon {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></Ikon>);
export const IkonHati = (p) => (
  <Ikon {...p}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" /></Ikon>
);
export const IkonSurat = (p) => (
  <Ikon {...p}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3.5 7.5 8.5 6 8.5-6" /></Ikon>
);
export const IkonPanah = (p) => (<Ikon {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Ikon>);
export const IkonKalender = (p) => (
  <Ikon {...p}><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M8 3v4M16 3v4M3.5 10h17" /></Ikon>
);
