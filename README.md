# Modernisasi & Refactoring Personal Portfolio & Service Portal (Bootstrap 5.3 + Advanced Custom CSS)

Repositori ini telah direfaktor dan dimodernisasi dari proyek Minggu 2 ke standar **Bootstrap 5.3.3 CDN** dan **Advanced Custom CSS Variables** untuk memenuhi seluruh kriteria evaluasi praktikum Minggu 3 dengan kualifikasi **Sangat Baik [85 - 100]**.

---

## 🚀 Tabel Komparasi: Sebelum vs Sesudah Integrasi Framework

| Parameter Evaluasi | Sebelum Integrasi (Minggu 2 - Pure CSS) | Sesudah Integrasi Framework (Minggu 3 - Bootstrap 5.3 + Custom CSS) |
| :--- | :--- | :--- |
| **Sistem Grid & Layout** | Flexbox & CSS Grid manual, tanpa breakpoint terstandarisasi. | **Bootstrap 12-Kolom Responsive Grid** (`row-cols-1 row-cols-md-2 row-cols-lg-4 g-4`) responsif mulus di mobile (<576px), tablet (>=768px), hingga monitor lebar (>=1200px) tanpa overflow horizontal. |
| **Navigasi & Interaktivitas** | Header & Nav statis tanpa menu responsive mobile collapse. | **Sticky Navbar Responsive** (`.navbar-expand-lg`) lengkap dengan brand identity `Petra.Del` dan tombol hamburger toggle collapse (`.navbar-toggler`) yang berfungsi tanpa error console. |
| **Komponen Portofolio** | Teks deskripsi statis tanpa interaksi modal dialog. | **4 Kartu Proyek Interaktif (`.card`)** yang terhubung langsung ke **4 Bootstrap Modal Dialog (`.modal`)** berdetail lengkap, accessible (`aria-*`), dan informatif. |
| **Formulir Layanan** | Formulir HTML dasar dengan styling form sederhana. | **Modern Floating Labels (`.form-floating`)**, Input Groups berikon (`.input-group`), Select category, Checkbox persetujuan, dan **Visual Validation Feedback State** (`.needs-validation`, `.valid-feedback`, `.invalid-feedback`). |
| **Arsitektur CSS & Specificity** | Penataan gaya manual tanpa arsitektur variabel global. | **`:root` Variables Architecture (8+ variabel global)**, warna identitas personal unik (Royal Azure Blue & Warm Amber), animasi hover micro-interaction, dan **Zero `!important` Policy** (0% penggunaan !important). |
| **Praktikum Lab Terbimbing** | Belum ada berkas pengujian khusus spesifisitas. | **DILENGKAPI Berkas `lab1_specificity.html`** untuk mendemonstrasikan algoritma Cascade, skor spesifisitas $(A, B, C, D)$, combinators (`>`, `+`, `~`), pseudo-classes (`:focus-within`, `:nth-child()`, `:is()`, `:not()`), dan pseudo-elements (`::before`). |

---

## 🛠️ Fitur Utama & Arsitektur Kode

1. **Bootstrap 5.3.3 CDN & Bootstrap Icons**:
   - Dimuat secara terstandarisasi melalui CDN resmi tanpa jQuery.
   - Script JS Bundle (`bootstrap.bundle.min.js`) diletakkan sebelum penutup `</body>` untuk menjamin semua komponen interaktif (collapse navbar dan modal dialog) berjalan optimal.
2. **Advanced CSS Variables (`:root`)**:
   - `--primary-brand`: `#0284c7`
   - `--primary-hover`: `#0369a1`
   - `--accent-gold`: `#f59e0b`
   - `--dark-surface`: `#0f172a`
   - `--light-bg`: `#f8fafc`
   - `--card-radius`: `16px`
   - `--shadow-lift`: `0 12px 28px -5px rgba(2, 132, 199, 0.18)`
   - `--transition-smooth`: `all 0.3s cubic-bezier(...)`
3. **Modal Dialog Detail Proyek**:
   - Modal 1: *Smart Farming IoT Monitoring System*
   - Modal 2: *Portal Publikasi Riset SIMASI Vol. 6*
   - Modal 3: *Platform E-Learning Kampus Accessible*
   - Modal 4: *Analytics Esai Teknologi Nasional*
4. **Formulir Interaktif & Validasi**:
   - Real-time client-side validation dengan visual feedback `.is-valid` dan `.is-invalid`.
   - Mengirimkan pesan terformat rapi langsung ke WhatsApp aktif `085122082758`.

---

## 🌐 Tautan Publikasi & Repositori

- **GitHub Pages Live Deployment**: `https://[username-github-anda].github.io/ppw-2026-week2-12S24002/`
- **Tautan Berkas Lab 1 Specificity**: `lab1_specificity.html`
- **NIM / Identitas**: Petra Ignatius Pengayoman Naibaho (12S24002)

---

## 🧪 Langkah Verifikasi Lokal

1. Buka berkas `index.html` menggunakan browser modern (Google Chrome / Microsoft Edge / Firefox) atau VS Code Live Server.
2. Tekan `F12` atau `Ctrl+Shift+I` untuk membuka **DevTools**:
   - Buka **Console Tab** dan pastikan tidak terdapat error JavaScript.
   - Buka **Device Emulation** (tombol ponsel/tablet) untuk menguji responsivitas grid 12-kolom pada resolusi 375px (Mobile), 768px (Tablet), dan 1440px (Desktop).
3. Klik tombol hamburger pada layar mobile untuk menguji fitur navbar collapse.
4. Klik tombol **"Lihat Detail Modal"** pada kartu proyek untuk menguji dialog modal interaktif.
5. Isi formulir pada section Layanan untuk menguji state validasi visual dan pengiriman WhatsApp.