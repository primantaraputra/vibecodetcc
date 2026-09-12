# SI-BANSOS | Sistem Cek Kelayakan & Pendataan Terpadu Bansos Kecamatan

Sistem informasi digital modern untuk transparansi pendataan, penilaian kelayakan (Proxy Means Testing bertenaga AI), dan verifikasi persetujuan berjenjang bantuan sosial tingkat kecamatan.

---

## 🚀 Fitur Utama

- **Cek Status Bansos Terbuka:** Masyarakat dapat mengecek status desil dan keterdaftaran secara transparan dengan NIK / No. KK.
- **Workflow Persetujuan 4 Tahap (Multi-Tier RBAC):** Alur verifikasi berjenjang RT $\rightarrow$ RW $\rightarrow$ Kelurahan $\rightarrow$ Kecamatan $\rightarrow$ Dinas Sosial.
- **Pendataan Lapangan Offline-First:** Petugas RT dapat melakukan survei dengan foto rumah dan koordinat GPS bahkan saat tanpa koneksi internet (PWA & IndexedDB).
- **Penilaian Skor PMT & Rekomendasi AI:** Menghitung desil kemiskinan dan kelayakan secara objektif menggunakan algoritma Proxy Means Testing.
- **AI Sanggahan Assistant:** Membantu warga yang layak namun tidak terdata untuk membuat surat sanggahan resmi berbasis fakta lapangan.
- **Peta Transparansi Anggaran:** Menampilkan visualisasi realisasi anggaran dan sebaran penerima bansos secara publik.
- **Audit Trail Forensik:** Pencatatan tidak terhapus (*tamper-evident*) untuk setiap persetujuan dan perubahan status guna pencegahan korupsi.

---

## 📚 Dokumentasi Role & Alur Kerja

Penjelasan mendalam mengenai wewenang 6 role pengguna, diagram alur persetujuan, dan matriks hak akses dapat dibaca di:
👉 **[Panduan Role & Alur Kerja Aplikasi (docs/PANDUAN_ROLE_DAN_ALUR_KERJA.md)](docs/PANDUAN_ROLE_DAN_ALUR_KERJA.md)**

---

## 🛠️ Menjalankan Aplikasi Secara Lokal

### 1. Instalasi Dependensi
```bash
npm.cmd install
```

### 2. Jalankan Development Server
```bash
npm.cmd run dev
```
Buka browser di **[http://localhost:3000](http://localhost:3000)**.

### 3. Akun Pengujian Instan (1-Click Login)
Buka halaman login di **[http://localhost:3000/login](http://localhost:3000/login)** dan gunakan tombol **1-Click Quick Login** untuk langsung masuk sebagai:
- **Super Admin Dinsos** (`admin@bansos.gov`)
- **Petugas Kecamatan** (`kecamatan@bansos.gov`)
- **Petugas Kelurahan** (`kelurahan@bansos.gov`)
- **Petugas RW 01** (`rw01@bansos.gov`)
- **Petugas RT 01** (`rt01@bansos.gov`)
- **Warga Budi Santoso** (`budi.santoso@warga.id`)
- **Warga Siti Aminah** (`siti.aminah@warga.id`)
*(Semua akun demo menggunakan password bawaan: `Password123!`)*
