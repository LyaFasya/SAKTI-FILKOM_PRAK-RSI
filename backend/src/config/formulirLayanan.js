// Rincian yang ditampilkan pada halaman Detail Layanan SAKTI FILKOM.
// Opsi yang dicantumkan berasal dari kontrol yang diverifikasi di prototipe.
// Kondisi cabang diverifikasi dari formulir pada prototipe mahasiswa.
const semuaFormulir = {
  "Proposal kegiatan dan bantuan dana": {
    "kategoriLayanan": "Kegiatan",
    "jenisLayanan": "Layanan",
    "statusFormulir": "ditutup",
    "informasiLayanan": "Pengajuan proposal kegiatan organisasi mahasiswa beserta rencana anggaran untuk diperiksa dan diproses oleh kemahasiswaan.",
    "catatan": "Formulir proposal lomba sedang ditutup. Informasi isian dan batas unggahan ditampilkan sebagai panduan persiapan dokumen.",
    "kelompok": [
      {
        "judul": "Identitas dan kontak",
        "bersyarat": false,
        "isian": [
          {
            "label": "Nama Pengaju",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "NIM Pengaju",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Program Studi",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Nomor WhatsApp Pengaju",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Email Pengaju",
            "tipe": "Email",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [],
        "jumlahIsian": 5,
        "jumlahLampiran": 0
      },
      {
        "judul": "Informasi perlombaan",
        "bersyarat": false,
        "isian": [
          {
            "label": "Nama Perlombaan",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Penyelenggara Lomba",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Tingkat Perlombaan",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Kategori / Bidang Lomba",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Tautan Informasi Lomba",
            "tipe": "Isian",
            "wajib": false,
            "bersyarat": false
          },
          {
            "label": "Lokasi / Media Pelaksanaan",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Tanggal Mulai Lomba",
            "tipe": "Tanggal",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Tanggal Selesai Lomba",
            "tipe": "Tanggal",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [],
        "jumlahIsian": 8,
        "jumlahLampiran": 0
      },
      {
        "judul": "Peserta dan proposal",
        "bersyarat": false,
        "isian": [
          {
            "label": "Judul Proposal",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Bentuk Keikutsertaan",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false,
            "pilihan": [
              "Individu",
              "Tim"
            ]
          },
          {
            "label": "Nama Tim (sesuai pilihan)",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": true,
            "aktifJika": {
              "field": "Bentuk Keikutsertaan",
              "nilai": [
                "Tim"
              ]
            },
            "labelTampilan": "Nama Tim"
          },
          {
            "label": "Daftar Anggota Tim (sesuai pilihan)",
            "tipe": "Isian panjang",
            "wajib": true,
            "bersyarat": true,
            "aktifJika": {
              "field": "Bentuk Keikutsertaan",
              "nilai": [
                "Tim"
              ]
            },
            "labelTampilan": "Daftar Anggota Tim"
          },
          {
            "label": "Nama Dosen Pembimbing",
            "tipe": "Isian",
            "wajib": false,
            "bersyarat": false
          },
          {
            "label": "Ringkasan Rencana Keikutsertaan",
            "tipe": "Isian panjang",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [],
        "jumlahIsian": 6,
        "jumlahLampiran": 0
      },
      {
        "judul": "Pengajuan bantuan dana",
        "bersyarat": false,
        "isian": [
          {
            "label": "Mengajukan Bantuan Dana?",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false,
            "pilihan": [
              "Ya",
              "Tidak"
            ]
          },
          {
            "label": "Nominal Dana yang Diajukan (Rp) (sesuai pilihan)",
            "tipe": "Angka",
            "wajib": true,
            "bersyarat": true,
            "aktifJika": {
              "field": "Mengajukan Bantuan Dana?",
              "nilai": [
                "Ya"
              ]
            },
            "labelTampilan": "Nominal Dana yang Diajukan (Rp)"
          }
        ],
        "lampiran": [],
        "jumlahIsian": 2,
        "jumlahLampiran": 0
      },
      {
        "judul": "Berkas proposal",
        "bersyarat": false,
        "isian": [],
        "lampiran": [
          {
            "namaDokumen": "Proposal Lomba",
            "format": "PDF",
            "maksimalFile": 1,
            "maksimalUkuranMb": 10,
            "wajib": true,
            "petunjukUnggahan": "Memuat rencana kegiatan, data peserta, jadwal, serta RAB jika mengajukan bantuan dana.",
            "ketentuanUnggahan": "PDF · 1 file · maksimal 10 MB per file"
          },
          {
            "namaDokumen": "Dokumen Pendukung Lomba",
            "format": "PDF",
            "maksimalFile": 1,
            "maksimalUkuranMb": 10,
            "wajib": false,
            "petunjukUnggahan": "Jika ada: poster, panduan lomba, atau undangan. Gabungkan dalam satu PDF.",
            "ketentuanUnggahan": "PDF · 1 file · maksimal 10 MB per file"
          }
        ],
        "jumlahIsian": 0,
        "jumlahLampiran": 2
      }
    ]
  },
  "Laporan pertanggungjawaban kegiatan (LPJ)": {
    "kategoriLayanan": "Kegiatan",
    "jenisLayanan": "Layanan",
    "statusFormulir": null,
    "informasiLayanan": "Penyampaian pertanggungjawaban kegiatan ormawa yang telah selesai, meliputi pelaksanaan, keuangan, dan kelengkapan bukti.",
    "catatan": null,
    "kelompok": [
      {
        "judul": "Identitas dan kontak",
        "bersyarat": false,
        "isian": [
          {
            "label": "Nama Pengaju",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "NIM Pengaju",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Prodi Pengaju",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "No. HP Pengaju",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Email Pengaju",
            "tipe": "Email",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [],
        "jumlahIsian": 5,
        "jumlahLampiran": 0
      },
      {
        "judul": "Informasi kegiatan",
        "bersyarat": false,
        "isian": [
          {
            "label": "Judul Kegiatan/Perlombaan",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Nama Penyelenggara",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Jenis Kegiatan/Perlombaan",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Tingkat Kegiatan",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Lokasi Pelaksanaan",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Tanggal Mulai",
            "tipe": "Tanggal",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Tanggal Selesai",
            "tipe": "Tanggal",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Nama Ketua Pelaksana Kegiatan",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "NIM Ketua Pelaksana Kegiatan",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "No. HP Ketua Pelaksana Kegiatan",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Email Ketua Pelaksana Kegiatan",
            "tipe": "Email",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [],
        "jumlahIsian": 11,
        "jumlahLampiran": 0
      },
      {
        "judul": "Informasi pertanggungjawaban",
        "bersyarat": false,
        "isian": [
          {
            "label": "Jenis Pendanaan LPJ",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false,
            "pilihan": [
              "Dana",
              "Non-Dana"
            ]
          },
          {
            "label": "Melaporkan LPJ sebagai (Lembaga/Tim/Individu)",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false,
            "pilihan": [
              "Dewan Perwakilan Mahasiswa",
              "Badan Eksekutif Mahasiswa",
              "Himpunan KBMDSI",
              "Himpunan HMDTIF",
              "DISPLAY",
              "Raion Studio",
              "BIOS",
              "LKI-AMD",
              "BCC",
              "ROBOTIKA",
              "GDGoC",
              "POROS",
              "K-RISMA",
              "OPTIIK",
              "Tim / Kelompok",
              "Individu / Personal",
              "Other"
            ]
          },
          {
            "label": "Other response (sesuai pilihan)",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": true,
            "aktifJika": {
              "field": "Melaporkan LPJ sebagai (Lembaga/Tim/Individu)",
              "nilai": [
                "Other"
              ]
            },
            "labelTampilan": "Other response"
          },
          {
            "label": "Bentuk Pelaksanaan LPJ",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "No. Kendali",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [],
        "jumlahIsian": 5,
        "jumlahLampiran": 0
      },
      {
        "judul": "Bukti dukung keuangan",
        "bersyarat": true,
        "isian": [
          {
            "label": "Nominal Penggunaan Dana",
            "tipe": "Angka",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [
          {
            "namaDokumen": "Unggah Bukti ACC Keuangan",
            "format": "PDF",
            "maksimalFile": 1,
            "maksimalUkuranMb": 10,
            "wajib": true,
            "petunjukUnggahan": "Memo atau screenshot WhatsApp yang menyatakan persetujuan bagian Keuangan FILKOM.",
            "ketentuanUnggahan": "PDF · 1 file · maksimal 10 MB per file"
          }
        ],
        "jumlahIsian": 1,
        "jumlahLampiran": 1,
        "aktifJika": {
          "field": "Jenis Pendanaan LPJ",
          "nilai": [
            "Dana"
          ]
        }
      },
      {
        "judul": "Bukti dukung",
        "bersyarat": false,
        "isian": [],
        "lampiran": [
          {
            "namaDokumen": "Unggah Laporan Pertanggungjawaban",
            "format": "PDF",
            "maksimalFile": 1,
            "maksimalUkuranMb": 10,
            "wajib": true,
            "petunjukUnggahan": "Wajib dilengkapi scan bukti dukung LPJ.",
            "ketentuanUnggahan": "PDF · 1 file · maksimal 10 MB per file"
          },
          {
            "namaDokumen": "Unggah Kartu Kendali BEM",
            "format": "PDF",
            "maksimalFile": 1,
            "maksimalUkuranMb": 10,
            "wajib": false,
            "petunjukUnggahan": null,
            "ketentuanUnggahan": "PDF · 1 file · maksimal 10 MB per file"
          },
          {
            "namaDokumen": "Unggah Bukti Pengisian Prestasi di SIAM",
            "format": "PDF atau gambar",
            "maksimalFile": 1,
            "maksimalUkuranMb": 10,
            "wajib": true,
            "petunjukUnggahan": "Khusus yang mengikuti perlombaan. Screenshot pengisian data prestasi di SIAM memuat surat tugas dosen pembimbing lomba, KTM, KTP, buku tabungan, sertifikat kejuaraan, dan foto kegiatan / penyerahan piala juara.",
            "ketentuanUnggahan": "PDF atau gambar · 1 file · maksimal 10 MB per file"
          },
          {
            "namaDokumen": "Sertifikat Pemenang Lomba",
            "format": "Berkas",
            "maksimalFile": 1,
            "maksimalUkuranMb": 10,
            "wajib": false,
            "petunjukUnggahan": "Khusus yang mengikuti perlombaan. Gabungkan semua data dalam satu folder lalu kompres RAR / ZIP / format lain.",
            "ketentuanUnggahan": "Berkas · 1 file · maksimal 10 MB per file"
          }
        ],
        "jumlahIsian": 0,
        "jumlahLampiran": 4
      }
    ],
    "bolehKirimSalinanEmail": true
  },
  "Keterangan tidak menerima beasiswa ganda": {
    "kategoriLayanan": "Beasiswa",
    "jenisLayanan": "Layanan",
    "statusFormulir": null,
    "informasiLayanan": "Permohonan surat keterangan tidak sedang menerima beasiswa lain untuk melengkapi administrasi beasiswa.",
    "catatan": null,
    "kelompok": [
      {
        "judul": "Identitas dan kontak",
        "bersyarat": false,
        "isian": [
          {
            "label": "Nama Mahasiswa",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "NIM Mahasiswa",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Asal Prodi",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "No. HP",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Email",
            "tipe": "Email",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [],
        "jumlahIsian": 5,
        "jumlahLampiran": 0
      },
      {
        "judul": "Surat keterangan tidak menerima beasiswa ganda",
        "bersyarat": false,
        "isian": [
          {
            "label": "Jenis Dokumen yang dibutuhkan",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Nama Beasiswa",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Batas Pendaftaran",
            "tipe": "Tanggal",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Link Info Beasiswa",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [
          {
            "namaDokumen": "Unggah Surat Pernyataan Tidak Menerima Beasiswa Ganda",
            "format": "PDF atau dokumen Word",
            "maksimalFile": 1,
            "maksimalUkuranMb": 10,
            "wajib": true,
            "petunjukUnggahan": null,
            "ketentuanUnggahan": "PDF atau dokumen Word · 1 file · maksimal 10 MB per file"
          },
          {
            "namaDokumen": "Format Khusus",
            "format": "PDF",
            "maksimalFile": 1,
            "maksimalUkuranMb": 10,
            "wajib": false,
            "petunjukUnggahan": "Jika ada format khusus / template dari penyedia beasiswa.",
            "ketentuanUnggahan": "PDF · 1 file · maksimal 10 MB per file"
          }
        ],
        "jumlahIsian": 4,
        "jumlahLampiran": 2
      }
    ]
  },
  "Rekomendasi lomba, beasiswa, atau PKL jalur kompetisi": {
    "kategoriLayanan": "Rekomendasi",
    "jenisLayanan": "Layanan",
    "statusFormulir": null,
    "informasiLayanan": "Permohonan rekomendasi fakultas untuk mengikuti lomba, mendaftar beasiswa, atau keperluan PKL melalui jalur kompetisi.",
    "catatan": "Rekomendasi untuk Magang Mandiri / MBKM / MSIB diajukan ke bagian Akademik melalui PROAKSI.",
    "kelompok": [
      {
        "judul": "Identitas dan kontak",
        "bersyarat": false,
        "isian": [
          {
            "label": "Nama Mahasiswa",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "NIM Mahasiswa",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Asal Prodi",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "No. HP",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Email",
            "tipe": "Email",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [],
        "jumlahIsian": 5,
        "jumlahLampiran": 0
      },
      {
        "judul": "Jenis rekomendasi",
        "bersyarat": false,
        "isian": [
          {
            "label": "Jenis Rekomendasi yang Diajukan",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false,
            "pilihan": [
              "Rekomendasi Beasiswa",
              "Rekomendasi Lomba",
              "Rekomendasi PKL Jalur Kompetisi",
              "Other"
            ]
          },
          {
            "label": "Other response (sesuai pilihan)",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": true,
            "aktifJika": {
              "field": "Jenis Rekomendasi yang Diajukan",
              "nilai": [
                "Other"
              ]
            },
            "labelTampilan": "Other response"
          }
        ],
        "lampiran": [],
        "jumlahIsian": 2,
        "jumlahLampiran": 0
      },
      {
        "judul": "Surat rekomendasi beasiswa / lomba / lainnya",
        "bersyarat": true,
        "isian": [
          {
            "label": "Alamat",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Kota Lahir",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Tanggal Lahir",
            "tipe": "Tanggal",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Semester",
            "tipe": "Angka",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Rekomendasi yang Diajukan",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Link Info Rekomendasi",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [],
        "jumlahIsian": 6,
        "jumlahLampiran": 0,
        "aktifJika": {
          "field": "Jenis Rekomendasi yang Diajukan",
          "nilai": [
            "Rekomendasi Beasiswa",
            "Rekomendasi Lomba",
            "Other"
          ]
        }
      },
      {
        "judul": "Surat rekomendasi PKL jalur prestasi",
        "bersyarat": true,
        "isian": [
          {
            "label": "Nama Perlombaan",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Kategori Lomba",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Penyelenggara Lomba",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "URL Web Lomba",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Tingkat Lomba",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Juara ke",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Produk Lomba",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Dosen Pembimbing",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Tanggal Mulai Perlombaan",
            "tipe": "Tanggal",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Tanggal Akhir Perlombaan",
            "tipe": "Tanggal",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [
          {
            "namaDokumen": "Unggah Dokumen Pendukung",
            "format": "PDF",
            "maksimalFile": 1,
            "maksimalUkuranMb": 100,
            "wajib": true,
            "petunjukUnggahan": "Jadikan satu PDF: scan/foto KTM, sertifikat pemenang, pengumuman lomba yang memuat nama tim / peserta, dan surat tugas lomba jika ada.",
            "ketentuanUnggahan": "PDF · 1 file · maksimal 100 MB per file"
          }
        ],
        "jumlahIsian": 10,
        "jumlahLampiran": 1,
        "aktifJika": {
          "field": "Jenis Rekomendasi yang Diajukan",
          "nilai": [
            "Rekomendasi PKL Jalur Kompetisi"
          ]
        }
      }
    ],
    "bolehKirimSalinanEmail": true
  },
  "Dispensasi lomba atau kegiatan": {
    "kategoriLayanan": "Kegiatan",
    "jenisLayanan": "Layanan",
    "statusFormulir": null,
    "informasiLayanan": "Permohonan dispensasi untuk keikutsertaan mahasiswa dalam lomba atau kegiatan kemahasiswaan.",
    "catatan": null,
    "kelompok": [
      {
        "judul": "Identitas dan kontak",
        "bersyarat": false,
        "isian": [
          {
            "label": "Nama Pengaju",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "NIM Pengaju",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Asal Prodi",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "No. HP",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Email",
            "tipe": "Email",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [],
        "jumlahIsian": 5,
        "jumlahLampiran": 0
      },
      {
        "judul": "Detil kegiatan / lomba",
        "bersyarat": false,
        "isian": [
          {
            "label": "Nama Kegiatan/Lomba",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Lokasi Kegiatan/Lomba",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Sebagai",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false,
            "pilihan": [
              "Peserta",
              "MC (Master of Ceremony)",
              "Juri",
              "Pemateri",
              "Panitia",
              "Other"
            ]
          },
          {
            "label": "Other response (sesuai pilihan)",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": true,
            "aktifJika": {
              "field": "Sebagai",
              "nilai": [
                "Other"
              ]
            },
            "labelTampilan": "Other response"
          },
          {
            "label": "Tanggal Awal Pelaksanaan Kegiatan",
            "tipe": "Tanggal",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Tanggal Akhir Pelaksanaan Kegiatan",
            "tipe": "Tanggal",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [
          {
            "namaDokumen": "Unggah Data Lampiran",
            "format": "Spreadsheet (Excel)",
            "maksimalFile": 1,
            "maksimalUkuranMb": 1,
            "wajib": true,
            "petunjukUnggahan": "Daftar nama anggota dan mata kuliah yang diajukan dispensasi. Gunakan format MS Excel / spreadsheet.",
            "ketentuanUnggahan": "Spreadsheet (Excel) · 1 file · maksimal 1 MB per file"
          },
          {
            "namaDokumen": "Unggah Data Pendukung",
            "format": "PDF",
            "maksimalFile": 1,
            "maksimalUkuranMb": 10,
            "wajib": false,
            "petunjukUnggahan": "Bukti pendukung berupa undangan / surat tugas / dokumen lain.",
            "ketentuanUnggahan": "PDF · 1 file · maksimal 10 MB per file"
          }
        ],
        "jumlahIsian": 6,
        "jumlahLampiran": 2
      }
    ],
    "bolehKirimSalinanEmail": true
  },
  "Surat permohonan mitra": {
    "kategoriLayanan": "Surat",
    "jenisLayanan": "Layanan",
    "statusFormulir": null,
    "informasiLayanan": "Permohonan surat kepada calon mitra yang akan dilibatkan dalam kegiatan mahasiswa atau organisasi mahasiswa.",
    "catatan": null,
    "kelompok": [
      {
        "judul": "Identitas dan kontak",
        "bersyarat": false,
        "isian": [
          {
            "label": "Nama Mahasiswa",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "NIM Mahasiswa",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Asal Prodi",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "No. HP",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Email",
            "tipe": "Email",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [],
        "jumlahIsian": 5,
        "jumlahLampiran": 0
      },
      {
        "judul": "Permohonan mitra",
        "bersyarat": false,
        "isian": [
          {
            "label": "Ditujukan Kepada",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Alamat Instansi Mitra",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Kota Instansi Mitra",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Nama Lomba",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Kategori/Divisi/Bidang Lomba",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Judul Proposal Lomba",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Dosen Pembimbing Lomba",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [
          {
            "namaDokumen": "Unggah Daftar Anggota",
            "format": "Spreadsheet (Excel)",
            "maksimalFile": 1,
            "maksimalUkuranMb": 1,
            "wajib": true,
            "petunjukUnggahan": "Daftar nama anggota dalam format Excel / spreadsheet.",
            "ketentuanUnggahan": "Spreadsheet (Excel) · 1 file · maksimal 1 MB per file"
          }
        ],
        "jumlahIsian": 7,
        "jumlahLampiran": 1
      }
    ],
    "bolehKirimSalinanEmail": true
  },
  "Penugasan dosen pembimbing lomba": {
    "kategoriLayanan": "Surat",
    "jenisLayanan": "Layanan",
    "statusFormulir": null,
    "informasiLayanan": "Permohonan penugasan dosen untuk mendampingi mahasiswa dalam kegiatan lomba.",
    "catatan": "Pengajuan surat tugas diproses sebelum pelaksanaan lomba. Konfirmasikan kesediaan dosen terlebih dahulu.",
    "kelompok": [
      {
        "judul": "Identitas dan kontak",
        "bersyarat": false,
        "isian": [
          {
            "label": "Nama Mahasiswa",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "NIM Mahasiswa",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Asal Prodi",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "No. HP",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Email",
            "tipe": "Email",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [],
        "jumlahIsian": 5,
        "jumlahLampiran": 0
      },
      {
        "judul": "Informasi lomba dan pembimbing",
        "bersyarat": false,
        "isian": [
          {
            "label": "Nama Perlombaan",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Penyelenggara Lomba",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Tingkat Perlombaan",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Pendanaan Lomba",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Tanggal Awal Pelaksanaan Lomba",
            "tipe": "Tanggal",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Tanggal Akhir Pelaksanaan Lomba",
            "tipe": "Tanggal",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Nama Dosen Pembimbing",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Apakah Dosen Benar Membimbing?",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false,
            "pilihan": [
              "Ya, Benar Membimbing",
              "Tidak, pengurusan surat tugas ini hanya untuk kebutuhan administrasi"
            ]
          },
          {
            "label": "Link Informasi Lomba",
            "tipe": "Isian",
            "wajib": false,
            "bersyarat": false
          }
        ],
        "lampiran": [
          {
            "namaDokumen": "Unggah Data Anggota",
            "format": "Spreadsheet (Excel)",
            "maksimalFile": 1,
            "maksimalUkuranMb": 1,
            "wajib": true,
            "petunjukUnggahan": "Nama seluruh tim (ketua dan anggota), format MS Excel / spreadsheet.",
            "ketentuanUnggahan": "Spreadsheet (Excel) · 1 file · maksimal 1 MB per file"
          },
          {
            "namaDokumen": "Unggah Bukti Dukung",
            "format": "PDF",
            "maksimalFile": 1,
            "maksimalUkuranMb": 100,
            "wajib": true,
            "petunjukUnggahan": "Poster informasi lomba, pengumuman finalis, atau undangan peserta. Gabungkan jika lebih dari satu bukti.",
            "ketentuanUnggahan": "PDF · 1 file · maksimal 100 MB per file"
          }
        ],
        "jumlahIsian": 9,
        "jumlahLampiran": 2
      },
      {
        "judul": "Kesediaan dosen pembimbing",
        "bersyarat": true,
        "isian": [],
        "lampiran": [
          {
            "namaDokumen": "Unggah Surat Kesediaan Dosen Pembimbing",
            "format": "PDF atau dokumen Word",
            "maksimalFile": 1,
            "maksimalUkuranMb": 1,
            "wajib": true,
            "petunjukUnggahan": "Surat kesediaan dosen pembimbing dalam format MS Word / PDF.",
            "ketentuanUnggahan": "PDF atau dokumen Word · 1 file · maksimal 1 MB per file"
          }
        ],
        "jumlahIsian": 0,
        "jumlahLampiran": 1,
        "aktifJika": {
          "field": "Apakah Dosen Benar Membimbing?",
          "nilai": [
            "Ya, Benar Membimbing"
          ]
        }
      }
    ]
  },
  "Legalisasi sertifikat kegiatan oleh WD III": {
    "kategoriLayanan": "Dokumen lainnya",
    "jenisLayanan": "Layanan",
    "statusFormulir": null,
    "informasiLayanan": "Permohonan pemeriksaan dan legalisasi sertifikat kegiatan yang memerlukan pengesahan Wakil Dekan Bidang Kemahasiswaan.",
    "catatan": null,
    "kelompok": [
      {
        "judul": "Identitas dan kontak",
        "bersyarat": false,
        "isian": [
          {
            "label": "Nama Mahasiswa",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "NIM Mahasiswa",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Asal Prodi",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "No. HP",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Email",
            "tipe": "Email",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [],
        "jumlahIsian": 5,
        "jumlahLampiran": 0
      },
      {
        "judul": "Dokumen kegiatan organisasi mahasiswa",
        "bersyarat": false,
        "isian": [
          {
            "label": "Jenis Dokumen",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Nama Kegiatan",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [
          {
            "namaDokumen": "Dokumen Pendukung",
            "format": "PDF",
            "maksimalFile": 1,
            "maksimalUkuranMb": 10,
            "wajib": false,
            "petunjukUnggahan": "Lampirkan bukti dukung berupa sertifikat / surat tugas / dokumen lain.",
            "ketentuanUnggahan": "PDF · 1 file · maksimal 10 MB per file"
          }
        ],
        "jumlahIsian": 2,
        "jumlahLampiran": 1
      }
    ],
    "bolehKirimSalinanEmail": true
  },
  "Bantuan tenaga kependidikan untuk kegiatan ormawa": {
    "kategoriLayanan": "Dokumen lainnya",
    "jenisLayanan": "Layanan",
    "statusFormulir": null,
    "informasiLayanan": "Permohonan dukungan tenaga kependidikan untuk membantu pelaksanaan kegiatan organisasi mahasiswa.",
    "catatan": null,
    "kelompok": [
      {
        "judul": "Identitas dan kontak",
        "bersyarat": false,
        "isian": [
          {
            "label": "Nama Mahasiswa",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "NIM Mahasiswa",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Asal Prodi",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "No. HP",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Email",
            "tipe": "Email",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [],
        "jumlahIsian": 5,
        "jumlahLampiran": 0
      },
      {
        "judul": "Dokumen kegiatan organisasi mahasiswa",
        "bersyarat": false,
        "isian": [
          {
            "label": "Jenis Dokumen",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Nama Kegiatan",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [
          {
            "namaDokumen": "Dokumen Pendukung",
            "format": "PDF",
            "maksimalFile": 1,
            "maksimalUkuranMb": 10,
            "wajib": false,
            "petunjukUnggahan": "Lampirkan bukti dukung berupa sertifikat / surat tugas / dokumen lain.",
            "ketentuanUnggahan": "PDF · 1 file · maksimal 10 MB per file"
          }
        ],
        "jumlahIsian": 2,
        "jumlahLampiran": 1
      }
    ],
    "bolehKirimSalinanEmail": true
  },
  "Izin kunjungan selain SMA, SMK, dan sekolah": {
    "kategoriLayanan": "Dokumen lainnya",
    "jenisLayanan": "Layanan",
    "statusFormulir": null,
    "informasiLayanan": "Permohonan izin kunjungan untuk kegiatan selain kunjungan SMA, SMK, atau sekolah.",
    "catatan": null,
    "kelompok": [
      {
        "judul": "Identitas dan kontak",
        "bersyarat": false,
        "isian": [
          {
            "label": "Nama Mahasiswa",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "NIM Mahasiswa",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Asal Prodi",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "No. HP",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Email",
            "tipe": "Email",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [],
        "jumlahIsian": 5,
        "jumlahLampiran": 0
      },
      {
        "judul": "Dokumen kegiatan organisasi mahasiswa",
        "bersyarat": false,
        "isian": [
          {
            "label": "Jenis Dokumen",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Nama Kegiatan",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [
          {
            "namaDokumen": "Dokumen Pendukung",
            "format": "PDF",
            "maksimalFile": 1,
            "maksimalUkuranMb": 10,
            "wajib": false,
            "petunjukUnggahan": "Lampirkan bukti dukung berupa sertifikat / surat tugas / dokumen lain.",
            "ketentuanUnggahan": "PDF · 1 file · maksimal 10 MB per file"
          }
        ],
        "jumlahIsian": 2,
        "jumlahLampiran": 1
      }
    ],
    "bolehKirimSalinanEmail": true
  },
  "Legalisasi surat kegiatan ormawa oleh WD III": {
    "kategoriLayanan": "Dokumen lainnya",
    "jenisLayanan": "Layanan",
    "statusFormulir": null,
    "informasiLayanan": "Permohonan pengesahan surat berkaitan dengan kegiatan organisasi mahasiswa oleh Wakil Dekan Bidang Kemahasiswaan.",
    "catatan": null,
    "kelompok": [
      {
        "judul": "Identitas dan kontak",
        "bersyarat": false,
        "isian": [
          {
            "label": "Nama Mahasiswa",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "NIM Mahasiswa",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Asal Prodi",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "No. HP",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Email",
            "tipe": "Email",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [],
        "jumlahIsian": 5,
        "jumlahLampiran": 0
      },
      {
        "judul": "Dokumen kegiatan organisasi mahasiswa",
        "bersyarat": false,
        "isian": [
          {
            "label": "Jenis Dokumen",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Nama Kegiatan",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [
          {
            "namaDokumen": "Dokumen Pendukung",
            "format": "PDF",
            "maksimalFile": 1,
            "maksimalUkuranMb": 10,
            "wajib": false,
            "petunjukUnggahan": "Lampirkan bukti dukung berupa sertifikat / surat tugas / dokumen lain.",
            "ketentuanUnggahan": "PDF · 1 file · maksimal 10 MB per file"
          }
        ],
        "jumlahIsian": 2,
        "jumlahLampiran": 1
      }
    ],
    "bolehKirimSalinanEmail": true
  },
  "SK Dekan pemenang lomba internal FILKOM": {
    "kategoriLayanan": "Dokumen lainnya",
    "jenisLayanan": "Layanan",
    "statusFormulir": null,
    "informasiLayanan": "Permohonan penyusunan SK Dekan untuk penetapan pemenang lomba yang diselenggarakan di lingkungan internal FILKOM.",
    "catatan": null,
    "kelompok": [
      {
        "judul": "Identitas dan kontak",
        "bersyarat": false,
        "isian": [
          {
            "label": "Nama Mahasiswa",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "NIM Mahasiswa",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Asal Prodi",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "No. HP",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Email",
            "tipe": "Email",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [],
        "jumlahIsian": 5,
        "jumlahLampiran": 0
      },
      {
        "judul": "Dokumen kegiatan organisasi mahasiswa",
        "bersyarat": false,
        "isian": [
          {
            "label": "Jenis Dokumen",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Nama Kegiatan",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [
          {
            "namaDokumen": "Dokumen Pendukung",
            "format": "PDF",
            "maksimalFile": 1,
            "maksimalUkuranMb": 10,
            "wajib": false,
            "petunjukUnggahan": "Lampirkan bukti dukung berupa sertifikat / surat tugas / dokumen lain.",
            "ketentuanUnggahan": "PDF · 1 file · maksimal 10 MB per file"
          }
        ],
        "jumlahIsian": 2,
        "jumlahLampiran": 1
      }
    ],
    "bolehKirimSalinanEmail": true
  },
  "Pengantar pengajuan SSO, email lembaga, atau webhosting ke TIK UB": {
    "kategoriLayanan": "Dokumen lainnya",
    "jenisLayanan": "Layanan",
    "statusFormulir": null,
    "informasiLayanan": "Permohonan surat pengantar ke TIK UB untuk kebutuhan SSO, email lembaga, atau webhosting organisasi.",
    "catatan": null,
    "kelompok": [
      {
        "judul": "Identitas dan kontak",
        "bersyarat": false,
        "isian": [
          {
            "label": "Nama Mahasiswa",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "NIM Mahasiswa",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Asal Prodi",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "No. HP",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Email",
            "tipe": "Email",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [],
        "jumlahIsian": 5,
        "jumlahLampiran": 0
      },
      {
        "judul": "Dokumen kegiatan organisasi mahasiswa",
        "bersyarat": false,
        "isian": [
          {
            "label": "Jenis Dokumen",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Nama Kegiatan",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [
          {
            "namaDokumen": "Dokumen Pendukung",
            "format": "PDF",
            "maksimalFile": 1,
            "maksimalUkuranMb": 10,
            "wajib": false,
            "petunjukUnggahan": "Lampirkan bukti dukung berupa sertifikat / surat tugas / dokumen lain.",
            "ketentuanUnggahan": "PDF · 1 file · maksimal 10 MB per file"
          }
        ],
        "jumlahIsian": 2,
        "jumlahLampiran": 1
      }
    ],
    "bolehKirimSalinanEmail": true
  },
  "Izin peminjaman barang atau ruangan untuk ormawa": {
    "kategoriLayanan": "Dokumen lainnya",
    "jenisLayanan": "Layanan",
    "statusFormulir": null,
    "informasiLayanan": "Permohonan izin peminjaman barang atau ruangan untuk mendukung kegiatan organisasi mahasiswa.",
    "catatan": null,
    "kelompok": [
      {
        "judul": "Identitas dan kontak",
        "bersyarat": false,
        "isian": [
          {
            "label": "Nama Mahasiswa",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "NIM Mahasiswa",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Asal Prodi",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "No. HP",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Email",
            "tipe": "Email",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [],
        "jumlahIsian": 5,
        "jumlahLampiran": 0
      },
      {
        "judul": "Dokumen kegiatan organisasi mahasiswa",
        "bersyarat": false,
        "isian": [
          {
            "label": "Jenis Dokumen",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Nama Kegiatan",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [
          {
            "namaDokumen": "Dokumen Pendukung",
            "format": "PDF",
            "maksimalFile": 1,
            "maksimalUkuranMb": 10,
            "wajib": false,
            "petunjukUnggahan": "Lampirkan bukti dukung berupa sertifikat / surat tugas / dokumen lain.",
            "ketentuanUnggahan": "PDF · 1 file · maksimal 10 MB per file"
          }
        ],
        "jumlahIsian": 2,
        "jumlahLampiran": 1
      }
    ],
    "bolehKirimSalinanEmail": true
  },
  "Permohonan kerja sama kegiatan ormawa": {
    "kategoriLayanan": "Dokumen lainnya",
    "jenisLayanan": "Informasi",
    "statusFormulir": "informasi",
    "informasiLayanan": "Jenis layanan ini tercantum pada daftar sebelumnya, tetapi rincian formulirnya belum dapat dicocokkan dengan pilihan dokumen yang tersedia. Isian dan persyaratan tidak ditambahkan berdasarkan perkiraan.",
    "catatan": "Rincian formulir belum tersedia.",
    "kelompok": []
  },
  "Validasi persyaratan wisuda": {
    "kategoriLayanan": "Wisuda",
    "jenisLayanan": "Layanan",
    "statusFormulir": null,
    "informasiLayanan": "Validasi administrasi pendaftaran wisuda setelah data di SIAM dilengkapi, dengan unggahan sertifikat IT dan TOEFL.",
    "catatan": "Lengkapi seluruh data pendukung di SIAM sebelum mengisi formulir. Setelah unggah, hubungi Subbagian Kemahasiswaan. Lengkapi juga tracer study untuk proses antrean wisuda.",
    "kelompok": [
      {
        "judul": "Identitas dan kontak",
        "bersyarat": false,
        "isian": [
          {
            "label": "Nama Mahasiswa",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "NIM",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Prodi",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Nomor HP/WA",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Alamat Email",
            "tipe": "Email",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [],
        "jumlahIsian": 5,
        "jumlahLampiran": 0
      },
      {
        "judul": "Alamat",
        "bersyarat": false,
        "isian": [
          {
            "label": "Alamat",
            "tipe": "Isian panjang",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [],
        "jumlahIsian": 1,
        "jumlahLampiran": 0
      },
      {
        "judul": "Unggah dokumen pendukung",
        "bersyarat": false,
        "isian": [],
        "lampiran": [
          {
            "namaDokumen": "Unggah Sertifikat IT",
            "format": "PDF",
            "maksimalFile": 1,
            "maksimalUkuranMb": 100,
            "wajib": true,
            "petunjukUnggahan": "Nama file: nama - nim - jenis sertifikat. Contoh: ahmad_ali-123456789-it.pdf.",
            "ketentuanUnggahan": "PDF · 1 file · maksimal 100 MB per file"
          },
          {
            "namaDokumen": "Unggah Sertifikat TOEFL",
            "format": "PDF",
            "maksimalFile": 1,
            "maksimalUkuranMb": 100,
            "wajib": true,
            "petunjukUnggahan": "Nama file: nama - nim - jenis sertifikat. Contoh: ahmad_ali-123456789-toefl.pdf.",
            "ketentuanUnggahan": "PDF · 1 file · maksimal 100 MB per file"
          }
        ],
        "jumlahIsian": 0,
        "jumlahLampiran": 2
      }
    ]
  },
  "Tracer study fakultas": {
    "kategoriLayanan": "Alumni",
    "jenisLayanan": "Layanan",
    "statusFormulir": null,
    "informasiLayanan": "Pendataan alumni melalui identitas, status pekerjaan / studi, bukti pendukung, dan testimoni.",
    "catatan": "Jika bekerja sambil melanjutkan studi, pilih \"Bekerja\" pada status saat ini.",
    "kelompok": [
      {
        "judul": "Data alumni",
        "bersyarat": false,
        "isian": [
          {
            "label": "NAMA LENGKAP DAN GELAR",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "NIM",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Email AKTIF",
            "tipe": "Email",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "JENIS KELAMIN",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "NOMOR TELEPHONE",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "TAHUN ANGKATAN",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "PROGRAM STUDI",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "BULAN LULUS",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "TAHUN LULUS",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "APAKAH SAAT INI ANDA SUDAH BEKERJA/ LANJUT STUDI",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false,
            "pilihan": [
              "Bekerja",
              "Belum Bekerja",
              "Lanjut Studi"
            ]
          }
        ],
        "lampiran": [],
        "jumlahIsian": 10,
        "jumlahLampiran": 0
      },
      {
        "judul": "Pertanyaan tentang pekerjaan",
        "bersyarat": true,
        "isian": [
          {
            "label": "TANGGAL PERTAMA KERJA",
            "tipe": "Tanggal",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "NAMA PERUSAHAAN",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "BIDANG KERJA",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "JENIS PERUSAHAAN",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "STATUS PEKERJAAN",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "APAKAH ANDA BERWIRAUSAHA SELAIN BEKERJA",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "JIKA ANDA BERWIRAUSAHA MAKA SEBUTKAN NAMA DARI USAHA ANDA",
            "tipe": "Isian panjang",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "GAJI",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "TULISKAN KESESUAIAN GAJI (sesuai pendapatan yang diterima)",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "KOTA DIMANA ANDA BEKERJA",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "APAKAH SAAT INI SEDANG MELANJUTKAN STUDI?",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [
          {
            "namaDokumen": "Unggah bukti telah bekerja",
            "format": "Berkas",
            "maksimalFile": 5,
            "maksimalUkuranMb": 10,
            "wajib": true,
            "petunjukUnggahan": "Dapat berupa ID pegawai, screenshot email, atau surat tanda penerimaan sebagai pegawai.",
            "ketentuanUnggahan": "Berkas · 5 file maksimal · maksimal 10 MB per file"
          }
        ],
        "jumlahIsian": 11,
        "jumlahLampiran": 1,
        "aktifJika": {
          "field": "APAKAH SAAT INI ANDA SUDAH BEKERJA/ LANJUT STUDI",
          "nilai": [
            "Bekerja"
          ]
        }
      },
      {
        "judul": "Pertanyaan jika tidak bekerja",
        "bersyarat": true,
        "isian": [
          {
            "label": "APA ALASAN ANDA TIDAK BEKERJA",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false,
            "pilihan": [
              "MENIKAH",
              "ALASAN KELUARGA",
              "ALASAN KESEHATAN",
              "BELUM MENDAPAT PANGGILAN KERJA",
              "MAGANG",
              "Other"
            ]
          },
          {
            "label": "Other response (sesuai pilihan)",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": true,
            "aktifJika": {
              "field": "APA ALASAN ANDA TIDAK BEKERJA",
              "nilai": [
                "Other"
              ]
            },
            "labelTampilan": "Other response"
          },
          {
            "label": "APAKAH ANDA AKTIF MENCARI PEKERJAAN DALAM 2 MINGGU TERAKHIR",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [],
        "jumlahIsian": 3,
        "jumlahLampiran": 0,
        "aktifJika": {
          "field": "APAKAH SAAT INI ANDA SUDAH BEKERJA/ LANJUT STUDI",
          "nilai": [
            "Belum Bekerja"
          ]
        }
      },
      {
        "judul": "Lanjut studi",
        "bersyarat": true,
        "isian": [
          {
            "label": "TAHUN BULAN MULAI STUDI",
            "tipe": "Tanggal",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "TEMPAT STUDI",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "NAMA UNIVERSITAS",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "PROGRAM STUDI",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [
          {
            "namaDokumen": "UPLOAD BUKTI PENERIMAAN",
            "format": "Berkas",
            "maksimalFile": 1,
            "maksimalUkuranMb": 100,
            "wajib": true,
            "petunjukUnggahan": null,
            "ketentuanUnggahan": "Berkas · 1 file · maksimal 100 MB per file"
          }
        ],
        "jumlahIsian": 4,
        "jumlahLampiran": 1,
        "aktifJika": {
          "field": "APAKAH SAAT INI ANDA SUDAH BEKERJA/ LANJUT STUDI",
          "nilai": [
            "Lanjut Studi"
          ]
        }
      },
      {
        "judul": "Testimoni",
        "bersyarat": false,
        "isian": [
          {
            "label": "PESAN UNTUK FILKOM",
            "tipe": "Isian panjang",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [],
        "jumlahIsian": 1,
        "jumlahLampiran": 0
      }
    ]
  },
  "Pendaftaran wisuda ulang": {
    "kategoriLayanan": "Wisuda",
    "jenisLayanan": "Layanan",
    "statusFormulir": null,
    "informasiLayanan": "Permohonan administrasi pendaftaran wisuda ulang. Lengkapi data diri, kontak aktif, serta periode wisuda sebelumnya tanpa unggahan dokumen.",
    "catatan": "Setelah melengkapi, bergabung pada WAG WISUDA ULANG dan konfirmasi ke WAC Kemahasiswaan 0811-3229-9552.",
    "kelompok": [
      {
        "judul": "Pendaftaran wisuda ulang",
        "bersyarat": false,
        "isian": [
          {
            "label": "Nama Lengkap",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "NIM",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Program Studi Asal",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Berasal dari Peserta Wisuda Periode?",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "No. WhatsApp",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Email",
            "tipe": "Email",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [],
        "jumlahIsian": 6,
        "jumlahLampiran": 0
      }
    ]
  },
  "Bimbingan dan konseling": {
    "kategoriLayanan": "Pendampingan",
    "jenisLayanan": "Layanan",
    "statusFormulir": null,
    "informasiLayanan": "Layanan bimbingan dan konseling untuk mahasiswa. Bagian ini memberikan informasi layanan pendampingan, bukan pengajuan surat atau verifikasi berkas akademik.",
    "catatan": "Lengkapi informasi kebutuhan konseling secara ringkas. Tidak perlu mengunggah dokumen atau menceritakan hal pribadi secara rinci.",
    "kelompok": [
      {
        "judul": "Identitas dan kontak",
        "bersyarat": false,
        "isian": [
          {
            "label": "Nama Mahasiswa",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "NIM",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Program Studi",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Nomor WhatsApp Aktif",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Email Aktif",
            "tipe": "Email",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [],
        "jumlahIsian": 5,
        "jumlahLampiran": 0
      },
      {
        "judul": "Kebutuhan pendampingan",
        "bersyarat": false,
        "isian": [
          {
            "label": "Topik yang Ingin Dikonsultasikan",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false,
            "pilihan": [
              "Akademik / Perkuliahan",
              "Penyesuaian Diri",
              "Relasi / Sosial",
              "Pengembangan Diri",
              "Lainnya"
            ]
          },
          {
            "label": "Topik Lainnya (sesuai pilihan)",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": true,
            "aktifJika": {
              "field": "Topik yang Ingin Dikonsultasikan",
              "nilai": [
                "Lainnya"
              ]
            },
            "labelTampilan": "Topik Lainnya"
          },
          {
            "label": "Gambaran Singkat Kebutuhan",
            "tipe": "Isian panjang",
            "wajib": false,
            "bersyarat": false
          }
        ],
        "lampiran": [],
        "jumlahIsian": 3,
        "jumlahLampiran": 0
      },
      {
        "judul": "Preferensi sesi",
        "bersyarat": false,
        "isian": [
          {
            "label": "Preferensi Bentuk Sesi",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Ketersediaan Hari dan Waktu",
            "tipe": "Isian panjang",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Persetujuan Dihubungi",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [],
        "jumlahIsian": 3,
        "jumlahLampiran": 0
      }
    ]
  },
  "Layanan ULTKSP": {
    "kategoriLayanan": "Pendampingan",
    "jenisLayanan": "Layanan",
    "statusFormulir": null,
    "informasiLayanan": "Layanan terpadu kekerasan seksual dan perundungan FILKOM UB. Bukti dukung bersifat opsional.",
    "catatan": null,
    "kelompok": [
      {
        "judul": "ULTKSP – FILKOM – UB",
        "bersyarat": false,
        "isian": [
          {
            "label": "Name",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Email",
            "tipe": "Email",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "NIM",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "NO HP /WA",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "PRODI",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Kejadian Yang dialami",
            "tipe": "Isian panjang",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Terduga Pelaku",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [
          {
            "namaDokumen": "Bukti dukung bila ada",
            "format": "Berkas",
            "maksimalFile": 1,
            "maksimalUkuranMb": 1,
            "wajib": false,
            "petunjukUnggahan": null,
            "ketentuanUnggahan": "Berkas · 1 file · maksimal 1 MB per file"
          }
        ],
        "jumlahIsian": 7,
        "jumlahLampiran": 1
      }
    ]
  },
  "Surat Keterangan Aktif Mahasiswa": {
    "kategoriLayanan": "Akademik",
    "jenisLayanan": "Layanan akademik",
    "statusFormulir": null,
    "informasiLayanan": "Pengajuan surat untuk menerangkan status aktif sebagai mahasiswa. Identitas mahasiswa ditampilkan otomatis dan KTM diunggah sebagai dokumen persyaratan.",
    "catatan": "Contoh layanan dari modul.",
    "kelompok": [
      {
        "judul": "Identitas dan kontak",
        "bersyarat": false,
        "isian": [
          {
            "label": "Nama Mahasiswa",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "NIM Mahasiswa",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Asal Prodi",
            "tipe": "Pilihan",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "No. HP",
            "tipe": "Isian",
            "wajib": true,
            "bersyarat": false
          },
          {
            "label": "Email",
            "tipe": "Email",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [],
        "jumlahIsian": 5,
        "jumlahLampiran": 0
      },
      {
        "judul": "Keperluan surat",
        "bersyarat": false,
        "isian": [
          {
            "label": "Keperluan surat",
            "tipe": "Isian panjang",
            "wajib": true,
            "bersyarat": false
          }
        ],
        "lampiran": [
          {
            "namaDokumen": "Kartu Tanda Mahasiswa (KTM)",
            "format": "PDF",
            "maksimalFile": 1,
            "maksimalUkuranMb": 10,
            "wajib": true,
            "petunjukUnggahan": null,
            "ketentuanUnggahan": "PDF · 1 file · maksimal 10 MB per file"
          }
        ],
        "jumlahIsian": 1,
        "jumlahLampiran": 1
      }
    ]
  }
};

export default semuaFormulir;
