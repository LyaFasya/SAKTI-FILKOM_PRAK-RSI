// Ikon tambahan untuk halaman rekapitulasi staf. Warna mengikuti warna teks sekitarnya.
function Ikon({ children, ukuran = 20, ...sisa }) {
  return (
    <svg width={ukuran} height={ukuran} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...sisa}>
      {children}
    </svg>
  );
}

export const IkonGrafik = (p) => (
  <Ikon {...p}><path d="M4 20h16" /><path d="M7 20v-6" /><path d="M12 20V6" /><path d="M17 20v-10" /></Ikon>
);
export const IkonUnduh = (p) => (
  <Ikon {...p}><path d="M12 4v11" /><path d="m7 11 5 5 5-5" /><path d="M5 20h14" /></Ikon>
);
export const IkonTutup = (p) => (<Ikon {...p}><path d="M6 6l12 12M18 6 6 18" /></Ikon>);
