# Pedoman & Aturan Bisnis SI-BANSOS (AGENTS.md)

Dokumen ini berisi prinsip arsitektur, aturan bisnis, dan panduan desain yang **wajib dipatuhi** oleh AI agent saat mengembangkan atau memodifikasi aplikasi SI-BANSOS.

---

## 1. Aturan Bisnis Hierarki Role & Alur Bansos (PENTING)

### Prinsip Utama:
1. **Role Lapangan (RT, RW, Kelurahan, Kecamatan) HANYA melakukan PENGECEKAN DATA:**
   - **Petugas RT**: Pengecekan & pendataan fisik langsung ke rumah warga (survei 14 kriteria BPS, foto rumah, GPS).
   - **Petugas RW**: Pengecekan & musyawarah lingkungan tingkat RW (memastikan usulan objektif & bebas data ganda).
   - **Petugas Kelurahan**: Pengecekan administratif & validasi kesesuaian data dengan DTKS Kemensos/Dukcapil.
   - **Petugas Kecamatan**: Pengecekan akhir & rekapitulasi data usulan se-kecamatan.
2. **Kewenangan PENETAPAN Penerima Bansos HANYA dipegang oleh PETUGAS PUSAT / ADMIN:**
   - Kecamatan **TIDAK** menetapkan penerima bansos.
   - Satu-satunya pihak yang berwenang menerbitkan Surat Keputusan (SK) resmi penetapan penerima dan alokasi pencairan adalah **Petugas Pusat / Admin (Super Admin / Dinsos / Kementerian)**.

---

## 2. Pedoman Desain & Tipografi (UI/UX Guidelines)

1. **Skala Tipografi Proporsional (Anti-Jomplang):**
   - Di dalam card, ukuran font harus serasi dan harmonis.
   - **Judul Card / Tahapan**: `text-sm font-bold` (14px) atau maksimal `text-sm sm:text-base font-bold` (14–16px).
   - **Deskripsi & Body Text**: `text-xs` (12px).
   - **Label, Badge & Meta Info**: `text-xs` (12px) atau `text-[11px]`.
   - **DILARANG** menggunakan ukuran font raksasa yang jomplang (`text-xl` / 20px, `text-2xl` / 24px) di dalam card berdampingan langsung dengan teks 11–12px.

2. **Penggunaan Ikon:**
   - Hindari penggunaan ikon dekoratif yang tidak penting/berlebihan. Utamakan tampilan yang bersih, minimalis, dan fungsional.

3. **Aturan Tanggal & Waktu Alur Verifikasi:**
   - Tahap yang sedang aktif (`current`): Cukup tampilkan teks **"Sedang Berlangsung"** (tanpa tanggal atau rentang tanggal estimasi sembarangan).
   - Tanggal dan jam perubahannya baru dicatat dan ditampilkan secara resmi jika tahapan tersebut **sudah selesai dilewati (`completed`)**.
   - Tahap berikutnya: Cukup berstatus **"Belum Dimulai"**.

4. **Bahasa & Responsivitas:**
   - Seluruh teks antarmuka menggunakan **100% Bahasa Indonesia**.
   - Tata letak harus dioptimalkan untuk mobile maupun desktop (hindari tampilan yang hanya menyerupai layar HP di tengah desktop).
