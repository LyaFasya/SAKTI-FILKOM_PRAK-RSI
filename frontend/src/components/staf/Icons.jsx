// Ikon sederhana (SVG) untuk area staf. Warna mengikuti warna teks sekitarnya.
function Ikon({ children, ukuran = 20, ...sisa }) {
  return (
    <svg
      width={ukuran}
      height={ukuran}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...sisa}
    >
      {children}
    </svg>
  );
}

export const IkonRingkasan = (p) => (
  <Ikon {...p}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
  </Ikon>
);

export const IkonDokumen = (p) => (
  <Ikon {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
    <path d="M9 13h6M9 17h4" />
  </Ikon>
);

export const IkonGrafik = (p) => (
  <Ikon {...p}>
    <path d="M4 20V4" />
    <path d="M4 20h16" />
    <path d="M9 20v-7M14 20V9M19 20v-4" />
  </Ikon>
);

export const IkonPengaturan = (p) => (
  <Ikon {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </Ikon>
);

export const IkonKeluar = (p) => (
  <Ikon {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </Ikon>
);

export const IkonTopi = (p) => (
  <Ikon {...p}>
    <path d="M22 9 12 4 2 9l10 5 10-5z" />
    <path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
  </Ikon>
);

export const IkonPanah = (p) => (
  <Ikon {...p}>
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </Ikon>
);
