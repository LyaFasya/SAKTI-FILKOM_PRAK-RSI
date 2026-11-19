
import React, { useEffect, useState } from "react";import { useNavigate } from "react-router-dom";
import { ambilDaftarLayanan } from "../../services/layananService.js";
import { ambilPengajuanSaya } from "../../services/pengajuanMahasiswaService.js";
import { formatIdPengajuan, formatTanggalPendek } from "../../utils/formatPengajuan.js";
import {
  GraduationCap,
  LayoutGrid,
  FileText,
  Bell,
  LogOut,
  Search,
  Sparkles,
  Clock3,
  ChevronRight,
  Mail,
  Heart,
  ArrowRight,
} from "lucide-react";

import HeaderMahasiswa from "../../components/mahasiswa/HeaderMahasiswa.jsx";
import "./DashboardMahasiswa.css";
import { ASET } from "../../config/aset.js";
const logoFilkom = ASET.logoFilkomUb;
const bannerIllus = ASET.bannerLayanan;

const SERVICE_CATEGORIES = [
  {
    id: "kegiatan",
    title: "Kegiatan",
    iconBg: "#E3EFFA",
    iconColor: "#5590C1",
    items: [
      { name: "Proposal kegiatan dan bantuan dana" },
      { name: "Laporan pertanggungjawaban kegiatan (LPJ)" },
      { name: "Dispensasi lomba atau kegiatan" },
    ],
  },
  {
    id: "dokumen",
    title: "Dokumen lainnya",
    iconBg: "#E7EEFB",
    iconColor: "#4E77C2",
    items: [
      { name: "Legalisasi sertifikat kegiatan oleh WD III" },
      { name: "Bantuan tenaga kependidikan untuk kegiatan ormawa" },
      { name: "Izin kunjungan selain SMA, SMK, dan sekolah" },
      { name: "Legalisasi surat kegiatan ormawa oleh WD III" },
      { name: "SK Dekan pemenang lomba internal FILKOM" },
      { name: "Pengantar pengajuan SSO, email lembaga, atau webhosting ke TIK UB" },
      { name: "Izin peminjaman barang atau ruangan untuk ormawa" },
      { name: "Permohonan kerja sama kegiatan ormawa", tag: "Informasi layanan" },
    ],
  },
  {
    id: "beasiswa",
    title: "Beasiswa",
    iconBg: "#F6EDDE",
    iconColor: "#B29360",
    items: [
      { name: "Keterangan tidak menerima beasiswa ganda" },
    ],
  },
  {
    id: "rekomendasi",
    title: "Rekomendasi",
    iconBg: "#E6F0EB",
    iconColor: "#4F9A78",
    items: [
      { name: "Rekomendasi lomba, beasiswa, atau PKL jalur kompetisi" },
    ],
  },
  {
    id: "wisuda",
    title: "Wisuda",
    iconBg: "#F9ECE6",
    iconColor: "#C97B57",
    items: [
      { name: "Validasi persyaratan wisuda" },
      { name: "Pendaftaran wisuda ulang" },
    ],
  },
  {
    id: "surat",
    title: "Surat",
    iconBg: "#EFE9FA",
    iconColor: "#7C5AC2",
    items: [
      { name: "Surat permohonan mitra" },
      { name: "Penugasan dosen pembimbing lomba" },
    ],
  },
  {
    id: "alumni",
    title: "Alumni",
    iconBg: "#E6F2F4",
    iconColor: "#4B8E9B",
    items: [
      { name: "Tracer study fakultas" },
    ],
  },
  {
    id: "pendampingan",
    title: "Pendampingan",
    iconBg: "#FBEAF0",
    iconColor: "#C46489",
    items: [
      { name: "Bimbingan dan konseling" },
      { name: "Layanan ULTKSP" },
    ],
  },
  {
    id: "akademik",
    title: "Akademik",
    iconBg: "#FDF3E1",
    iconColor: "#C5933E",
    items: [
      { name: "Surat Keterangan Aktif Mahasiswa", tag: "Dalam layanan terpisah" },
    ],
  },
];

// Warna badge sesuai status pengajuan
const KELAS_STATUS = {
  "Menunggu Verifikasi": "status-amber",
  Diproses: "status-blue",
  Disetujui: "status-green",
  Ditolak: "status-red",
};

export default function DashboardMahasiswa() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [daftarLayanan, setDaftarLayanan] = useState([]);
  const [pengajuanTerakhir, setPengajuanTerakhir] = useState([]);

  useEffect(() => {
    ambilPengajuanSaya()
      .then((data) => setPengajuanTerakhir(Array.isArray(data) ? data.slice(0, 2) : []))
      .catch((error) => console.error("Gagal memuat pengajuan terakhir:", error));
  }, []);

  useEffect(() => {
    const muatLayanan = async () => {
      try {
        const data = await ambilDaftarLayanan();
        setDaftarLayanan(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Gagal memuat daftar layanan:", error);
      }
    };

    muatLayanan();
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredCategories = SERVICE_CATEGORIES
    .filter((cat) => {
      return selectedCategory === "all" || cat.id === selectedCategory;
    })
    .map((cat) => {
      const layananKategori = daftarLayanan
        .filter((layanan) => layanan.kategoriLayanan === cat.title)
        .map((layanan) => {
          const itemStatis = cat.items.find(
            (item) => item.name === layanan.namaLayanan
          );

          return {
            idLayanan: layanan.idLayanan,
            name: layanan.namaLayanan,
            tag: itemStatis?.tag,
          };
        });

      const categoryMatches =
        normalizedQuery &&
        cat.title.toLowerCase().includes(normalizedQuery);

      const filteredItems =
        !normalizedQuery || categoryMatches
          ? layananKategori
          : layananKategori.filter((item) =>
              item.name.toLowerCase().includes(normalizedQuery)
            );

      return {
        ...cat,
        items: filteredItems,
      };
    })
    .filter((cat) => cat.items.length > 0);
  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return;

    const hasMatch = daftarLayanan.some((layanan) => {
      const kategori = SERVICE_CATEGORIES.find(
        (cat) => cat.title === layanan.kategoriLayanan
      );

      if (
        selectedCategory !== "all" &&
        kategori?.id !== selectedCategory
      ) {
        return false;
      }

      return (
        layanan.namaLayanan.toLowerCase().includes(query) ||
        layanan.kategoriLayanan.toLowerCase().includes(query)
      );
    });

    if (!hasMatch) {
      navigate(
        `/layanan?search=${encodeURIComponent(searchQuery.trim())}`
      );
    }
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  const handleServiceClick = (item) => {
    if (!item.idLayanan) return;

    navigate(`/layanan/${item.idLayanan}/ajukan`);
  };

  return (
    <div className="dash-page">
      {/* TOP NAVBAR */}
      <HeaderMahasiswa />

      {/* MAIN CONTAINER */}
      <main className="dash-container">
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

        {/* CONTENT 2 KOLOM */}
        <div className="dash-grid">
          <div className="dash-main-col">
            {/* SEARCH CARD */}
            <section className="search-card">
              <span className="section-eyebrow">MULAI DARI SINI</span>

              <h2 className="search-heading">
                Layanan apa yang kamu butuhkan?
              </h2>

              <div className="search-bar-box">
                <span className="search-icon">
                  <Search size={17} strokeWidth={1.8} />
                </span>

                <input
                  type="text"
                  placeholder="Misalnya: rekomendasi, dispensasi…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />

                <button
                  type="button"
                  className="search-btn"
                  onClick={handleSearch}
                >
                  Cari layanan <ArrowRight size={14} />
                </button>
              </div>

              <div className="filter-row">
                <div className="filter-left">
                  <span>Jelajahi berdasarkan</span>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="category-select"
                  >
                    <option value="all">Semua kategori</option>

                    {SERVICE_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.title}
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

            {/* DIREKTORI HEADER */}
            <div className="directory-header">
              <h3>Direktori layanan SAKTI FILKOM</h3>
              <span>Temukan, pilih, lalu lihat persyaratannya.</span>
            </div>

            {/* DIRECTORY CARDS */}
            <div className="directory-grid">
              {filteredCategories.map((cat) => (
                <div key={cat.id} className="service-card">
                  <div className="service-card-header">
                    <div
                      className="cat-icon"
                      style={{
                        backgroundColor: cat.iconBg,
                        color: cat.iconColor,
                      }}
                    >
                      <Sparkles size={16} strokeWidth={1.8} />
                    </div>

                    <h4>{cat.title}</h4>

                    <span className="service-count">
                      {cat.items.length} layanan
                    </span>
                  </div>

                  <ul className="service-list">
                    {cat.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="service-item"
                        onClick={() => handleServiceClick(item)}
                      >
                        <div className="service-item-text">
                          <span>{item.name}</span>

                          {item.tag && (
                            <small className="service-tag">
                              {item.tag}
                            </small>
                          )}
                        </div>

                        <span className="chevron">
                          <ChevronRight size={16} strokeWidth={1.8} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* SIDEBAR KANAN */}
          <aside className="dash-sidebar">
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

              {pengajuanTerakhir.length === 0 && (
                <p className="sub-code">Belum ada pengajuan.</p>
              )}

              {pengajuanTerakhir.map((p) => (
                <div
                  key={p.idPengajuan}
                  className="submission-item"
                  role="button"
                  tabIndex={0}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/pengajuan-saya/${p.idPengajuan}`)}
                >
                  <span className="sub-code">
                    {p.kodePengajuan ?? formatIdPengajuan(p.idPengajuan, p.tanggalPengajuan)} · {formatTanggalPendek(p.tanggalPengajuan)}
                  </span>

                  <div className="sub-title-row">
                    <strong>{p.namaLayanan}</strong>
                    <ChevronRight size={16} strokeWidth={1.8} />
                  </div>

                  <span className={`status-badge ${KELAS_STATUS[p.statusPengajuan] ?? "status-blue"}`}>
                    {p.statusPengajuan}
                  </span>
                </div>
              ))}

             <button
              type="button"
              className="view-all-link"
              onClick={() => navigate("/pengajuan-saya")}
            >
              Semua pengajuan saya <ArrowRight size={14} />
            </button>
            </div>

            <div className="sidebar-card info-highlight-card">
              <div className="mail-badge">
                <Mail size={16} strokeWidth={1.8} />
              </div>

              <h4>Kabar pengajuanmu</h4>

              <p>
                Perubahan status layanan akan tampil di notifikasi dan email
                kampusmu.
              </p>

              <button
              type="button"
              className="outline-pill-btn"
              onClick={() => navigate("/notifikasi")}
            >
              Lihat notifikasi <ArrowRight size={13} />
            </button>
            </div>

            <div className="sidebar-help-note">
              <span>
                <Heart size={15} strokeWidth={1.8} />
              </span>
              <p>
                Butuh bantuan administrasi? Hubungi bagian kemahasiswaan FILKOM.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="dash-footer">
        <div className="footer-inner">
          <span className="footer-label">PORTAL RESMI</span>

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