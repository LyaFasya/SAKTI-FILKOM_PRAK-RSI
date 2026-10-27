USE sakti_filkom;

-- 1. Akun
CREATE TABLE Akun (
    idAkun INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,

    PRIMARY KEY (idAkun),

    CONSTRAINT uq_akun_email
        UNIQUE (email)
) ENGINE=InnoDB;


-- 2. Mahasiswa
CREATE TABLE Mahasiswa (
    nim VARCHAR(15) NOT NULL,
    idAkun INT NOT NULL,
    namaMahasiswa VARCHAR(100) NOT NULL,
    programStudi VARCHAR(100) NOT NULL,

    PRIMARY KEY (nim),

    CONSTRAINT uq_mahasiswa_akun
        UNIQUE (idAkun),

    CONSTRAINT fk_mahasiswa_akun
        FOREIGN KEY (idAkun)
        REFERENCES Akun(idAkun)
) ENGINE=InnoDB;


-- 3. Staf Kemahasiswaan
CREATE TABLE StafKemahasiswaan (
    idStaf INT NOT NULL AUTO_INCREMENT,
    idAkun INT NOT NULL,
    namaStaf VARCHAR(100) NOT NULL,

    PRIMARY KEY (idStaf),

    CONSTRAINT uq_staf_akun
        UNIQUE (idAkun),

    CONSTRAINT fk_staf_akun
        FOREIGN KEY (idAkun)
        REFERENCES Akun(idAkun)
) ENGINE=InnoDB;


-- 4. Layanan
CREATE TABLE Layanan (
    idLayanan INT NOT NULL AUTO_INCREMENT,
    namaLayanan VARCHAR(100) NOT NULL,
    kategoriLayanan VARCHAR(50) NOT NULL,
    informasiLayanan TEXT NOT NULL,
    statusLayanan VARCHAR(20) NOT NULL,

    PRIMARY KEY (idLayanan)
) ENGINE=InnoDB;


-- 5. Persyaratan
CREATE TABLE Persyaratan (
    idPersyaratan INT NOT NULL AUTO_INCREMENT,
    idLayanan INT NOT NULL,
    deskripsiPersyaratan VARCHAR(255) NOT NULL,

    PRIMARY KEY (idPersyaratan),

    CONSTRAINT fk_persyaratan_layanan
        FOREIGN KEY (idLayanan)
        REFERENCES Layanan(idLayanan)
) ENGINE=InnoDB;


-- 6. Dokumen Persyaratan
CREATE TABLE DokumenPersyaratan (
    idDokumen INT NOT NULL AUTO_INCREMENT,
    idLayanan INT NOT NULL,
    namaDokumen VARCHAR(150) NOT NULL,
    wajib BOOLEAN NOT NULL DEFAULT TRUE,

    PRIMARY KEY (idDokumen),

    CONSTRAINT fk_dokumenpersyaratan_layanan
        FOREIGN KEY (idLayanan)
        REFERENCES Layanan(idLayanan)
) ENGINE=InnoDB;


-- 7. Pengajuan
CREATE TABLE Pengajuan (
    idPengajuan INT NOT NULL AUTO_INCREMENT,
    idAkun INT NOT NULL,
    idLayanan INT NOT NULL,
    tanggalPengajuan DATE NOT NULL,

    statusPengajuan VARCHAR(30) NOT NULL
        DEFAULT 'Menunggu Verifikasi',

    alasanPenolakan TEXT NULL,
    idStaf INT NULL,
    waktuKeputusan TIMESTAMP NULL DEFAULT NULL,

    PRIMARY KEY (idPengajuan),

    CONSTRAINT fk_pengajuan_akun
        FOREIGN KEY (idAkun)
        REFERENCES Akun(idAkun),

    CONSTRAINT fk_pengajuan_layanan
        FOREIGN KEY (idLayanan)
        REFERENCES Layanan(idLayanan),

    CONSTRAINT fk_pengajuan_staf
        FOREIGN KEY (idStaf)
        REFERENCES StafKemahasiswaan(idStaf),

    CONSTRAINT chk_pengajuan_status
        CHECK (
            statusPengajuan IN (
                'Menunggu Verifikasi',
                'Diproses',
                'Disetujui',
                'Ditolak'
            )
        )
) ENGINE=InnoDB;


-- 8. Dokumen Pengajuan
CREATE TABLE DokumenPengajuan (
    idDokumenPengajuan INT NOT NULL AUTO_INCREMENT,
    idPengajuan INT NOT NULL,
    idDokumen INT NOT NULL,
    namaFile VARCHAR(255) NOT NULL,
    formatFile VARCHAR(10) NOT NULL,
    ukuranFile INT NOT NULL,
    lokasiFile VARCHAR(255) NOT NULL,

    statusDokumen VARCHAR(30) NOT NULL
        DEFAULT 'Belum Diverifikasi',

    PRIMARY KEY (idDokumenPengajuan),

    CONSTRAINT fk_dokumenpengajuan_pengajuan
        FOREIGN KEY (idPengajuan)
        REFERENCES Pengajuan(idPengajuan),

    CONSTRAINT fk_dokumenpengajuan_dokumen
        FOREIGN KEY (idDokumen)
        REFERENCES DokumenPersyaratan(idDokumen),

    CONSTRAINT chk_dokumenpengajuan_format
        CHECK (formatFile = 'PDF'),

    CONSTRAINT chk_dokumenpengajuan_ukuran
        CHECK (
            ukuranFile > 0
            AND ukuranFile <= 10485760
        )
) ENGINE=InnoDB;


-- 9. Riwayat Status
CREATE TABLE RiwayatStatus (
    idRiwayat INT NOT NULL AUTO_INCREMENT,
    idPengajuan INT NOT NULL,
    statusPengajuan VARCHAR(30) NOT NULL,
    tanggalStatus DATE NOT NULL,
    waktuStatus TIME NOT NULL,

    PRIMARY KEY (idRiwayat),

    CONSTRAINT fk_riwayatstatus_pengajuan
        FOREIGN KEY (idPengajuan)
        REFERENCES Pengajuan(idPengajuan),

    CONSTRAINT chk_riwayatstatus_status
        CHECK (
            statusPengajuan IN (
                'Menunggu Verifikasi',
                'Diproses',
                'Disetujui',
                'Ditolak'
            )
        )
) ENGINE=InnoDB;


-- 10. Dokumen Hasil
CREATE TABLE DokumenHasil (
    idDokumenHasil INT NOT NULL AUTO_INCREMENT,
    idPengajuan INT NOT NULL,
    namaDokumen VARCHAR(150) NOT NULL,
    lokasiFile VARCHAR(255) NOT NULL,
    tanggalUpload DATE NOT NULL,

    PRIMARY KEY (idDokumenHasil),

    CONSTRAINT uq_dokumenhasil_pengajuan
        UNIQUE (idPengajuan),

    CONSTRAINT fk_dokumenhasil_pengajuan
        FOREIGN KEY (idPengajuan)
        REFERENCES Pengajuan(idPengajuan)
) ENGINE=InnoDB;


-- 11. Notifikasi
CREATE TABLE Notifikasi (
    idNotifikasi INT NOT NULL AUTO_INCREMENT,
    idAkun INT NOT NULL,
    idPengajuan INT NOT NULL,
    pesan TEXT NOT NULL,
    statusPengajuan VARCHAR(30) NOT NULL,
    tanggalPerubahan DATE NOT NULL,
    waktuPerubahan TIME NOT NULL,
    statusPengirimanEmail VARCHAR(20) NULL,
    keteranganEmail VARCHAR(255) NULL,

    PRIMARY KEY (idNotifikasi),

    CONSTRAINT fk_notifikasi_akun
        FOREIGN KEY (idAkun)
        REFERENCES Akun(idAkun),

    CONSTRAINT fk_notifikasi_pengajuan
        FOREIGN KEY (idPengajuan)
        REFERENCES Pengajuan(idPengajuan),

    CONSTRAINT chk_notifikasi_status
        CHECK (
            statusPengajuan IN (
                'Menunggu Verifikasi',
                'Diproses',
                'Disetujui',
                'Ditolak'
            )
        )
) ENGINE=InnoDB;