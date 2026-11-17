import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  GraduationCap,
  LayoutGrid,
  FileText,
  Bell,
  LogOut,
  Search,
  Clock3,
  ChevronRight,
  Mail,
  Heart,
  ArrowRight,
} from "lucide-react";

import "./DashboardMahasiswa.css";
import "./LayananTidakTersedia.css";

import bannerIllus from "../../assets/Section kotak biru.png";import logoFilkom from "../../assets/Image (FILKOM Universitas Brawijaya).png";

const SERVICE_CATEGORIES = [
  { id: "kegiatan", title: "Kegiatan" },
  { id: "dokumen", title: "Dokumen lainnya" },
  { id: "beasiswa", title: "Beasiswa" },
  { id: "rekomendasi", title: "Rekomendasi" },
  { id: "wisuda", title: "Wisuda" },
  { id: "surat", title: "Surat" },
  { id: "alumni", title: "Alumni" },
  { id: "pendampingan", title: "Pendampingan" },
  { id: "akademik", title: "Akademik" },
];

function LayananTidakTersedia() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchedService = searchParams.get("search") || "";

  const [search, setSearch] = useState(searchedService);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("layanan");

  const handleSearch = (event) => {
    event.preventDefault();

    const query = search.trim();

    if (!query) return;

    setSearchParams({ search: query });
  };

  const handleReset = () => {
    setSearch("");
    setSelectedCategory("all");
    setSearchParams({});
  };

  return (
    <div className="dash-page layanan-unavailable-page">
      {/* TOP NAVBAR */}
      <header className="dash-navbar">
        <div className="nav-brand">
          <div className="brand-logo-box">
            <GraduationCap size={19} strokeWidth={1.9} />
          </div>

          <span className="brand-title">SAKTI FILKOM</span>
        </div>

        <nav className="nav-links">
          <button
            type="button"
            className={`nav-item ${
              activeTab === "layanan" ? "active" : ""
            }`}
            onClick={() => setActiveTab("layanan")}
          >
            <span className="nav-icon">
              <LayoutGrid size={15} strokeWidth={1.8} />
            </span>
            <span>Layanan</span>
          </button>

          <button
            type="button"
            className={`nav-item ${
              activeTab === "pengajuan" ? "active" : ""
            }`}
            onClick={() => setActiveTab("pengajuan")}
          >
            <span className="nav-icon">
              <FileText size={15} strokeWidth={1.8} />
            </span>
            <span>Pengajuan Saya</span>
          </button>

          <button
            type="button"
            className={`nav-item ${
              activeTab === "notifikasi" ? "active" : ""
            }`}
            onClick={() => setActiveTab("notifikasi")}
          >
            <span className="nav-icon">
              <Bell size={15} strokeWidth={1.8} />
            </span>
            <span>Notifikasi</span>
          </button>
        </nav>

        <div className="nav-profile">
          <div className="avatar-circle">NP</div>

          <div className="profile-info">
            <strong>Nanda Purwa</strong>
            <span>Mahasiswa · Sistem Informasi</span>
          </div>

          <button
            type="button"
            className="logout-icon-btn"
            title="Keluar"
            onClick={logout}
          >
            <LogOut size={16} strokeWidth={1.8} />
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="dash-container">
        {/* BREADCRUMB */}
        <div className="breadcrumb">
          Portal Mahasiswa / Layanan Kemahasiswaan
        </div>

        {/* HERO BANNER */}
        <section className="hero-banner">
          <img
            src={bannerIllus}
            alt="Ilustrasi Layanan Kampus"
            className="hero-banner-img"
          />
        </section>

        {/* MAIN CONTENT */}
        <div className="dash-grid">
          <div className="dash-main-col">
            {/* SEARCH CARD */}
            <section className="search-card">
              <span className="section-eyebrow">
                MULAI DARI SINI
              </span>

              <h2 className="search-heading">
                Layanan apa yang kamu butuhkan?
              </h2>

              <form
                className="search-bar-box"
                onSubmit={handleSearch}
              >
                <span className="search-icon">
                  <Search size={17} strokeWidth={1.8} />
                </span>

                <input
                  type="text"
                  placeholder="Misalnya: rekomendasi, dispensasi…"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />

                <button
                  type="submit"
                  className="search-btn"
                >
                  Cari layanan
                  <ArrowRight size={14} />
                </button>
              </form>

              <div className="filter-row">
                <div className="filter-left">
                  <span>Jelajahi berdasarkan</span>

                  <select
                    value={selectedCategory}
                    onChange={(event) =>
                      setSelectedCategory(event.target.value)
                    }
                    className="category-select"
                  >
                    <option value="all">Semua kategori</option>

                    {SERVICE_CATEGORIES.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  className="reset-link"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </section>

            {/* DIRECTORY HEADER */}
            <div className="directory-header">
              <h3>Direktori layanan SAKTI FILKOM</h3>

              <span>
                Temukan, pilih, lalu lihat persyaratannya.
              </span>
            </div>

            {/* EMPTY STATE */}
            <section className="lu-empty-state">
              <div className="lu-empty-illustration">
                <svg
                  viewBox="0 0 64 64"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect
                    x="13"
                    y="10"
                    width="38"
                    height="44"
                    rx="6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />

                  <path
                    d="M23 23h18M23 31h18M23 39h10"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  <circle
                    cx="45"
                    cy="45"
                    r="9"
                    fill="#F5F9FF"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />

                  <path
                    d="m51.5 51.5 5 5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h3>
                {searchedService
                  ? `Layanan "${searchedService}" Belum Tersedia`
                  : "Layanan Tidak Ditemukan"}
              </h3>

              <p>
                {searchedService
                  ? `Maaf, layanan "${searchedService}" belum tersedia dalam sistem SAKTI FILKOM. Coba nama layanan atau kategori lain.`
                  : "Coba nama layanan atau kategori lain."}
              </p>

              <button
                type="button"
                className="lu-show-all-btn"
                onClick={() => navigate(-1)}
              >
                Tampilkan semua layanan
              </button>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="dash-sidebar">
            {/* PENGAJUAN TERAKHIR */}
            <div className="sidebar-card">
              <div className="sidebar-card-header">
                <div>
                  <h4>Pengajuan terakhir</h4>
                  <p>Cek progres transaksi terbarumu</p>
                </div>

                <span className="clock-icon">
                  <Clock3 size={17} strokeWidth={1.8} />
                </span>
              </div>

              <div className="submission-item">
                <span className="sub-code">
                  PRK-2026-004 · 20/03/2026
                </span>

                <div className="sub-title-row">
                  <strong>
                    Proposal kegiatan dan bantuan dana
                  </strong>

                  <ChevronRight size={16} strokeWidth={1.8} />
                </div>

                <span className="status-badge status-blue">
                  Diproses
                </span>
              </div>

              <div className="submission-item">
                <span className="sub-code">
                  SKM-2026-011 · 20/10/2026
                </span>

                <div className="sub-title-row">
                  <strong>
                    Surat Keterangan Aktif Mahasiswa
                  </strong>

                  <ChevronRight size={16} strokeWidth={1.8} />
                </div>

                <span className="status-badge status-amber">
                  Menunggu Verifikasi
                </span>
              </div>

              <button
                type="button"
                className="view-all-link"
              >
                Semua pengajuan saya
                <ArrowRight size={14} />
              </button>
            </div>

            {/* NOTIFICATION CARD */}
            <div className="sidebar-card info-highlight-card">
              <div className="mail-badge">
                <Mail size={16} strokeWidth={1.8} />
              </div>

              <h4>Kabar pengajuanmu</h4>

              <p>
                Perubahan status layanan akan tampil di notifikasi
                dan email kampusmu.
              </p>

              <button
                type="button"
                className="outline-pill-btn"
              >
                Lihat notifikasi
                <ArrowRight size={13} />
              </button>
            </div>

            {/* HELP NOTE */}
            <div className="sidebar-help-note">
              <span>
                <Heart size={15} strokeWidth={1.8} />
              </span>

              <p>
                Butuh bantuan administrasi? Hubungi bagian
                kemahasiswaan FILKOM.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="dash-footer">
        <div className="footer-inner">
          <span className="footer-label">
            PORTAL RESMI
          </span>

          <img
            src={logoFilkom}
            alt="Logo FILKOM UB"
            className="footer-logo"
          />

          <span className="footer-divider">|</span>

          <span className="footer-copy">
            © 2026 SAKTI FILKOM · Universitas Brawijaya
          </span>
        </div>
      </footer>
    </div>
  );
}

export default LayananTidakTersedia;
