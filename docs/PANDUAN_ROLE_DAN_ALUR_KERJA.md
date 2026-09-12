# Panduan Role & Alur Kerja Aplikasi SI-BANSOS
**Sistem Informasi Cek Kelayakan & Pendataan Terpadu Bantuan Sosial Tingkat Kecamatan**

---

## 1. Pendahuluan

Aplikasi **SI-BANSOS** dirancang untuk mendigitalkan dan mentransparansikan proses pengusulan, verifikasi, validasi, dan penetapan penerima bantuan sosial (Bansos) seperti **PKH**, **BPNT**, **BLT**, **Bansos Lansia**, dan **Asistensi Disabilitas**.

Sistem ini menerapkan prinsip **Role-Based Access Control (RBAC)** berjenjang yang mencerminkan hierarki administrasi pemerintahan di Indonesia:
$$\text{Warga / RT} \longrightarrow \text{RW} \longrightarrow \text{Kelurahan / Desa} \longrightarrow \text{Kecamatan} \longrightarrow \text{Dinas Sosial}$$

Dengan sistem ini, proses seleksi menjadi **objektif, akuntabel, bebas manipulasi (anti korupsi)** melalui audit trail digital dan integrasi penilaian **Proxy Means Testing (PMT) berbasis AI**.

---

## 2. Rincian 6 Role Pengguna & Kewenangannya

### 👤 1. `masyarakat` (Warga Masyarakat)
* **Pengguna:** Penduduk/Kepala Keluarga yang ingin memeriksa kepesertaan bansos atau merasa layak mendapatkan bantuan.
* **Tujuan & Tanggung Jawab:**
  - Memeriksa desil status sosial ekonomi keluarga secara transparan.
  - Memantau status pengajuan bantuan sosial yang diajukan oleh RT.
  - Mengajukan sanggahan resmi jika merasa berhak namun belum menerima atau tidak terdata.
* **Halaman yang Dapat Diakses:**
  - `/profil` — Data pribadi, desil kemiskinan, kartu digital bansos, dan riwayat bantuan yang pernah diterima.
  - `/sanggahan` — Pengajuan sanggahan resmi yang dilengkapi fitur **AI Sanggahan Assistant** (otomatis membuat draf surat resmi berdasarkan bukti lapangan).
  - Portal Publik: `/cek-status` (Cek NIK/KK), `/peta-transparansi` (Peta persebaran bansos & anggaran), `/simulasi` (Kalkulator mandiri desil PMT), dan `/pengaduan`.

---

### 📋 2. `petugas_rt` (Petugas Rukun Tetangga / RT)
* **Pengguna:** Ketua RT atau kader/relawan pendataan di lingkungan RT.
* **Tujuan & Tanggung Jawab:**
  - Ujung tombak pendataan lapangan langsung ke rumah warga.
  - Menginput kondisi objektif rumah tangga dan indikator ekonomi warga.
  - Mengajukan usulan awal warga yang paling membutuhkan bantuan.
* **Halaman yang Dapat Diakses:**
  - `/survei` — Formulir pendataan lapangan langsung dengan indikator PMT (lantai, dinding, atap, daya listrik, sanitasi, pendapatan, tanggungan, koordinat GPS, serta unggah foto rumah). Mendukung mode **offline-first (PWA / IndexedDB)** saat berada di lokasi blank spot.
  - `/approval` — Mengajukan calon penerima bansos ke tahap RW (`diusulkan_rt`).
  - `/dashboard` — Ringkasan data warga dan status pengajuan di lingkungan RT setempat.

---

### 🏘️ 3. `petugas_rw` (Petugas Rukun Warga / RW)
* **Pengguna:** Ketua RW atau Tim Musyawarah Rukun Warga.
* **Tujuan & Tanggung Jawab:**
  - Memverifikasi usulan dari seluruh RT di bawah naungan RW terkait.
  - Menghindari konflik kepentingan, nepotisme, atau favoritisme di tingkat RT melalui musyawarah lingkungan.
* **Halaman yang Dapat Diakses:**
  - `/approval` — Melakukan verifikasi Tahap 2: Menyetujui usulan RT (`disetujui_rw`) atau menolak/mengembalikan data jika tidak sesuai kondisi riil warga.
  - `/dashboard` — Memantau statistik komparasi usulan antar-RT di wilayah RW-nya.

---

### 🏛️ 4. `petugas_kelurahan` (Petugas Kelurahan / Desa)
* **Pengguna:** Kepala Seksi Kesejahteraan Sosial (Kasi Kesos) atau staf verifikator kantor kelurahan/desa.
* **Tujuan & Tanggung Jawab:**
  - Melakukan verifikasi data administratif kependudukan (padan Dukcapil dan DTKS Kemensos).
  - Memeriksa kuota bantuan per kelurahan dan memastikan tidak terjadi tumpang tindih program bansos yang dilarang.
* **Halaman yang Dapat Diakses:**
  - `/approval` — Melakukan validasi Tahap 3: Memberikan status `diverifikasi_kelurahan`.
  - `/analitik` — Memantau sebaran desil kemiskinan, anomali data, dan ketersediaan kuota program bansos per RW di kelurahan tersebut.
  - `/dashboard` — Monitoring progres pendataan dan approval di tingkat kelurahan.

---

### 🏢 5. `petugas_kecamatan` (Petugas Kecamatan)
* **Pengguna:** Camat, Sekretaris Kecamatan (Sekcam), atau Tim Verifikasi Bansos Kecamatan.
* **Tujuan & Tanggung Jawab:**
  - Melakukan pengecekan data akhir dan rekapitulasi usulan bantuan sosial se-kecamatan.
  - Memverifikasi kelengkapan berkas hasil validasi kelurahan sebelum diajukan ke Petugas Pusat.
  - Menindaklanjuti sanggahan masyarakat yang masuk dari tingkat kelurahan.
* **Halaman yang Dapat Diakses:**
  - `/approval` — Tahap 4: Memberikan rekomendasi lolos pengecekan kecamatan (`disetujui_kecamatan`) untuk diteruskan ke Pusat, atau `ditolak_kecamatan`.
  - `/dashboard` — Dashboard rekapitulasi data kelurahan se-kecamatan.
  - `/analitik` — Analisis sebaran dan anomali data usulan per kelurahan.

---

### 👑 6. `super_admin` (Petugas Pusat / Administrator Utama)
* **Pengguna:** Kementerian Sosial, Dinas Sosial Kabupaten/Kota, atau Administrator Utama Pusat.
* **Tujuan & Tanggung Jawab:**
  - **Pemegang wewenang tunggal yang MENETAPKAN keputusan akhir penerima bansos.**
  - Menerbitkan Surat Keputusan (SK) resmi penetapan penerima bantuan sosial (`tersalurkan`).
  - Mengalokasikan anggaran, kuota bantuan, dan instruksi pencairan ke perbankan (Himbara) / PT Pos.
  - Pengawasan forensik data, audit kepatuhan, dan pencegahan kecurangan lintas wilayah.
* **Halaman yang Dapat Diakses:**
  - Seluruh modul petugas dan masyarakat tanpa batasan wilayah (*all access*).
  - `/approval` — Tahap Akhir / Final Approval: Menetapkan penerima bansos resmi atau membatalkan usulan.
  - `/audit-log` — Log audit forensik lengkap mencatat seluruh riwayat pengecekan dan keputusan penetapan.

---

## 3. Alur Workflow Pengecekan Berjenjang & Penetapan Pusat

Berikut alur kerja penetapan bantuan sosial dari survei lapangan hingga penetapan pusat:

```mermaid
flowchart TD
    Start([Mulai: Warga Membutuhkan]) --> S1[1. Pengecekan Lapangan RT: Survei & Foto Rumah]
    S1 --> PMT[Sistem AI & PMT Menghitung Skor Kelayakan & Desil]
    PMT --> A1{Pengecekan RT Lolos?}
    
    A1 -- Ya --> St1[Status: diusulkan_rt]
    A1 -- Tidak --> EndDitolak([Tidak Diusulkan])
    
    St1 --> A2{2. Pengecekan RW:\nMusyawarah Lingkungan}
    A2 -- Lolos --> St2[Status: disetujui_rw]
    A2 -- Tidak / Revisi --> RejRW[Status: ditolak / perlu_revisi_rw]
    
    St2 --> A3{3. Pengecekan Kelurahan:\nValidasi DTKS & Dukcapil}
    A3 -- Lolos --> St3[Status: diverifikasi_kelurahan]
    A3 -- Tidak / Revisi --> RejKel[Status: ditolak / perlu_revisi_kelurahan]
    
    St3 --> A4{4. Pengecekan Kecamatan:\nRekapitulasi Wilayah}
    A4 -- Lolos --> St4[Status: disetujui_kecamatan\n(Lolos Pengecekan Wilayah)]
    A4 -- Tidak --> RejKec[Status: ditolak_kecamatan]
    
    St4 --> A5{5. Penetapan Petugas Pusat:\nFinal Approval & SK Resmi}
    A5 -- Ditetapkan --> StFinal[Status: tersalurkan\nSK Terbit & Siap Cair]
    A5 -- Ditolak --> RejPusat([Ditolak Pusat])
    
    StFinal --> WargaView[Warga Melihat Status di /status-bansos]
    RejPusat --> SanggahFlow[Warga Mengajukan /sanggahan via AI]
```

---

## 4. Matriks Hak Akses Antar-Role (Permission Matrix)

| Fitur / Modul | Masyarakat | Petugas RT | Petugas RW | Petugas Kelurahan | Petugas Kecamatan | Super Admin |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Cek Status & Profil Sendiri** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Pengajuan Sanggahan AI** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Input Survei Lapangan (Offline/GPS)** | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Approval Tahap 1 (RT)** | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Approval Tahap 2 (RW)** | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| **Approval Tahap 3 (Kelurahan)** | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Final Approval Tahap 4 (Kecamatan)** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Dashboard Statistik Eksekutif** | ❌ | Parsial (RT) | Parsial (RW) | Parsial (Kel) | ✅ (Kecamatan) | ✅ (Semua) |
| **Menu Analitik & Kuota** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Audit Log Forensik** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 5. Akun Pengujian Siap Pakai (1-Click Quick Testing)

Aplikasi telah dilengkapi akun uji coba (*mock user*) dengan data realistis. Di halaman login `http://localhost:3000/login`, Anda dapat mengklik tombol **1-Click Quick Login Testing**:

| Role | Nama Pengguna Contoh | Email Login | Password Demo | Wilayah |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | Super Admin Dinsos | `admin@bansos.gov` | `Password123!` | Lintas Seluruh Wilayah |
| **Petugas Kecamatan** | Bambang Hidayat | `kecamatan@bansos.gov` | `Password123!` | Kecamatan Sukamaju |
| **Petugas Kelurahan** | Dewi Lestari | `kelurahan@bansos.gov` | `Password123!` | Kelurahan Mekarjaya |
| **Petugas RW** | H. Mulyadi | `rw01@bansos.gov` | `Password123!` | RW 01 Mekarjaya |
| **Petugas RT** | Ahmad Subarjo | `rt01@bansos.gov` | `Password123!` | RT 01 / RW 01 |
| **Warga Masyarakat** | Budi Santoso | `budi.santoso@warga.id` | `Password123!` | Warga RT 01 / RW 01 |
| **Warga Masyarakat** | Siti Aminah | `siti.aminah@warga.id` | `Password123!` | Warga RT 01 / RW 01 |

---

## 6. Struktur File Terkait Autentikasi & Otorisasi

- [`lib/auth/roles.ts`](file:///e:/Antigravity/si-bansos/lib/auth/roles.ts) — Definisi enum role, badge warna, dan fungsi validasi wewenang approval per tahapan.
- [`lib/auth/demo-users.ts`](file:///e:/Antigravity/si-bansos/lib/auth/demo-users.ts) — Master data akun demo bawaan untuk testing instan.
- [`lib/auth/session.ts`](file:///e:/Antigravity/si-bansos/lib/auth/session.ts) — Helper server-side untuk membaca sesi aktif (mendukung session cookie dan Supabase Auth).
- [`middleware.ts`](file:///e:/Antigravity/si-bansos/middleware.ts) — Route guard Next.js yang melindungi rute petugas dan masyarakat secara otomatis.
- [`lib/actions/approval.ts`](file:///e:/Antigravity/si-bansos/lib/actions/approval.ts) — Server actions untuk alur persetujuan berjenjang dan pencatatan riwayat verifikasi.
