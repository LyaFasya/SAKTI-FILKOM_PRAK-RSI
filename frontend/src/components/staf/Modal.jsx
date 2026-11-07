import { useEffect, useId, useRef } from "react";

import "./modal.css";

// Pop-up konfirmasi memakai elemen <dialog> bawaan browser:
// otomatis menahan fokus di dalam pop-up dan bisa ditutup dengan tombol Esc.
export default function Modal({ terbuka, onTutup, eyebrow, judul, children }) {
  const dialogRef = useRef(null);
  const idJudul = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (terbuka && !dialog.open) dialog.showModal();
    if (!terbuka && dialog.open) dialog.close();
  }, [terbuka]);

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby={idJudul}
      onClose={onTutup}
      onClick={(e) => {
        // klik di area gelap di luar kotak = tutup
        if (e.target === dialogRef.current) onTutup();
      }}
    >
      <div className="modal__kepala">
        <div>
          {eyebrow && <p className="staf-eyebrow">{eyebrow}</p>}
          <h2 id={idJudul} className="modal__judul">{judul}</h2>
        </div>
        <button type="button" className="modal__tutup" onClick={onTutup} aria-label="Tutup">
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
}
