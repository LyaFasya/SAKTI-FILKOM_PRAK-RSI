
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

import "./DetailLayanan.css";

import { ASET } from "../../config/aset.js";
const logoFilkom = ASET.logoFilkomUb;

const identityFields = [
  ["Nama Pengaju", "Wajib · Isian"],
  ["NIM Pengaju", "Wajib · Isian"],
  ["Asal Prodi", "Wajib · Pilihan"],
  ["No. HP", "Wajib · Isian"],
  ["Email", "Wajib · Email"],
];

const activityFields = [
  ["Nama Kegiatan/Lomba", "Wajib · Isian"],
  ["Lokasi Kegiatan/Lomba", "Wajib · Isian"],
  ["Sebagai", "Wajib · Pilihan"],
  ["Other response (sesuai pilihan)", "Wajib · Isian"],
  ["Tanggal Awal Pelaksanaan Kegiatan", "Wajib · Tanggal"],
  ["Tanggal Akhir Pelaksanaan Kegiatan", "Wajib · Tanggal"],
];

function FieldGroup({ title, description, fields }) {
  return (
    <section className="dl-field-group">
      <div className="dl-group-heading">
        <span className="dl-chevron">▾</span>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>

      <div className="dl-field-list">
        {fields.map(([name, type]) => (
          <div className="dl-field-row" key={name}>
            <span>{name}</span>
            <strong>{type}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function UploadRequirement({ title, format, description, status }) {
  return (
    <div className="dl-upload-box">
      <div className="dl-upload-content">
        <h4>{title}</h4>
        <span className="dl-upload-format">{format}</span>
        <p>{description}</p>
      </div>
      <span className="dl-upload-status">{status}</span>
    </div>
  );
}

export default function DetailLayanan() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const displayName = user?.name || user?.nama || "Nanda Purwa";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="detail-layanan-page">
      {/* NAVBAR */}
      <header className="dl-navbar">
        <a className="dl-brand" href="/dashboard">
          <div className="dl-brand-icon">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="m3 9 9-5 9 5-9 5-9-5Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path
                d="M7 11.2v4.2c2.8 2.1 7.2 2.1 10 0v-4.2"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span>SAKTI FILKOM</span>
        </a>

        <nav className="dl-nav-links" aria-label="Navigasi utama">
          <button
            type="button"
            className="dl-nav-item"
            onClick={() => navigate("/layanan")}
          >
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <rect x="2.5" y="2.5" width="6" height="6" rx="1" />
              <rect x="11.5" y="2.5" width="6" height="6" rx="1" />
              <rect x="2.5" y="11.5" width="6" height="6" rx="1" />
              <rect x="11.5" y="11.5" width="6" height="6" rx="1" />
            </svg>
            Layanan
          </button>

          <button
            type="button"
            className="dl-nav-item"
            onClick={() => navigate("/pengajuan-saya")}
          >
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 2.5h7l3 3v12H5v-15Z" />
              <path d="M12 2.5v3h3M8 9h4M8 12h4" />
            </svg>
            Pengajuan Saya
          </button>

          <button
            type="button"
            className="dl-nav-item"
            onClick={() => navigate("/notifikasi")}
          >
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M15.5 8a5.5 5.5 0 0 0-11 0c0 6-2 6-2 7h15c0-1-2-1-2-7Z" />
              <path d="M8 17h4" />
            </svg>
            Notifikasi
          </button>
        </nav>

        <div className="dl-profile">
          <div className="dl-avatar">{initials || "NP"}</div>
          <div className="dl-profile-info">
            <strong>{displayName}</strong>
            <span>Mahasiswa · Sistem Informasi</span>
          </div>
          <button
            type="button"
            className="dl-logout"
            onClick={handleLogout}
            title="Keluar"
            aria-label="Keluar"
          >
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M8 3H4v14h4M11 6l4 4-4 4M15 10H7" />
            </svg>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="dl-container">
        <div className="dl-breadcrumb">
          Portal Mahasiswa / Detail Layanan
        </div>

        <section className="dl-page-heading">
          <h1>Dispensasi lomba atau kegiatan</h1>
          <p>Informasi dan kelengkapan layanan yang kamu pilih.</p>
        </section>

        <div className="dl-content-grid">
          {/* LEFT: INFORMATION CARD */}
          <section className="dl-information-card">
            <span className="dl-category">KEGIATAN</span>

            <h2 className="dl-information-title">Informasi layanan</h2>

            <p className="dl-description">
              Permohonan dispensasi untuk keikutsertaan mahasiswa dalam
              lomba atau kegiatan kemahasiswaan.
            </p>

            <h3 className="dl-form-title" id="rincian-formulir">
              Rincian formulir
            </h3>

            <FieldGroup
              title="Identitas dan kontak"
              description="5 isian · 0 lampiran"
              fields={identityFields}
            />

            <FieldGroup
              title="Detil kegiatan / lomba"
              description="6 isian · 2 lampiran"
              fields={activityFields}
            />

            <div className="dl-upload-list">
              <UploadRequirement
                title="Unggah Data Lampiran"
                format="Spreadsheet (Excel) · 1 file · maksimal 1 MB per file"
                description="Daftar nama anggota dan mata kuliah yang diajukan dispensasi. Gunakan format MS Excel / spreadsheet."
                status="Wajib"
              />

              <UploadRequirement
                title="Unggah Data Pendukung"
                format="PDF · 1 file · maksimal 10 MB per file"
                description="Bukti pendukung berupa undangan / surat tugas / dokumen lain."
                status="Opsional"
              />
            </div>

            <div className="dl-card-bottom-line" />
          </section>

          {/* RIGHT: CALL TO ACTION */}
          <aside className="dl-action-card">
            <div className="dl-action-icon">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 2.5 13.7 8l5.3 1.7-5.3 1.7-1.7 5.3-1.7-5.3L5 9.7 10.3 8 12 2.5Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2>Siap mengisi?</h2>
            <p>
              Isi sesuai kebutuhanmu dan periksa ketentuan pada setiap
              lampiran.
            </p>

            <button
              type="button"
              className="dl-fill-button"
              onClick={() =>
                document
                  .getElementById("rincian-formulir")
                  ?.scrollIntoView({ behavior: "smooth", block: "center" })
              }
            >
              Isi Formulir
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M3.5 10h12m-5-5 5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </aside>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="dl-footer">
        <div className="dl-footer-brand">
          <span>PORTAL RESMI</span>
          <img src={logoFilkom} alt="Logo FILKOM Universitas Brawijaya" />
        </div>
        <p>© 2026 SAKTI FILKOM · Universitas Brawijaya</p>
      </footer>
    </div>
  );
}
