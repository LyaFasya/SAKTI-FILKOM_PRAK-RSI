import { useEffect, useId, useRef } from "react";

import "./modal.css";

// Pop-up pakai <dialog> bawaan browser (fokus ketahan, bisa Esc)
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
        // klik area gelap = tutup
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
