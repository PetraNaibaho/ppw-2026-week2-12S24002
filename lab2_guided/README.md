# Pengembangan-Halaman-Web-Portofolio-Layanan-Interaktif-Accessible-Berbasis-HTML5-dan-Modern-CSS


Deskripsi Tugas
Setiap mahasiswa diwajibkan membangun sebuah halaman web portofolio profil profesional tunggal
(Single Page Showcase Webpage) yang menyajikan identitas akademik, tabel rekapitulasi capaian/proyek,
galeri keahlian terstruktur, serta formulir pemesanan layanan konsultasi/kontak resmi yang sepenuhnya
estetik, rapi, responsif, dan accessible (WCAG 2.2 Level AA).

5.3 Spesifikasi Teknis Wajib (Requirements Checklist)
1. Struktur Semantik HTML5 (Bobot 20%): Wajib menggunakan tag (logo & navigasi), <nav> ,
<main> , minimal 3 buah <section> (Tentang Saya, Portofolio Karya, Formulir Layanan), <aside> , dan
<footer> . Hindari pembungkus <div> tanpa makna.
2. Penyajian Data Tabular & Lists (Bobot 15%): Wajib memuat satu tabel data semantik lengkap ( ,
, , , , dan atribut scope="col/row" ) yang menyajikan daftar riwayat
matakuliah/proyek, serta minimal dua jenis HTML Lists ( <ul> dan <ol> ).
3. Komponen Formulir Interaktif & Accessible (Bobot 20%): Formulir dikelompokkan dengan minimal 2
blok dan . Memuat minimal 6 tipe kontrol input (text, email, tel, number, radio,
checkbox, select, textarea). Seluruh input wajib memiliki pasangan eksplisit dan atribut
validasi native ( ).
4. Estetika & Tata Letak CSS Modern (Bobot 25%): Wajib menggunakan CSS eksternal ( ) dengan
Universal Box Sizing Reset. Menerapkan palet warna terencana (aturan 60-30-10), tipografi modern, sudut
membulat ( ), bayangan lembut( box-shadow ), tata letak berbasis CSS Flexbox atau CSS Grid,
serta responsif di berbagai resolusi layar via Media Queries ( @media (max-width: 768px) ).
5. Pengelolaan Git & GitHub Pages Deployment (Bobot 20%): Kode dikelola menggunakan repositori
publik GitHub bernama
dipublikasikan secara live di GitHub Pages.
, memuat berkas yang informatif, dan
VI. PANDUAN PENGUMPULAN TUGAS
1. Inisialisasi & Unggah Repositori GitHub:
<header>
<thead> <tbody> <tfoot> <caption>
<fieldset> <legend>
ppw-2026-week2-[NIM] README.md
Pengembangan Halaman Web Portofolio & Layanan Interaktif Accessible Berbasis HTML5 dan
Modern CSS
18
2. Aktivasi GitHub Pages: Buka tab Settings > Pages > Pada opsi Branch pilihmain > Klik Save.
3. Submisi URL: Kirimkan tautan repositori GitHub dan URL live demo GitHub Pages melalui Google Form resmi
perkuliahan atau portal submisi lokal di https://forms.gle/XSsAm2Ukb4Av5pjLA .
git init
git add .
git commit -m "feat: complete week 2 html5 and modern css assignment"
git remote add origin https://github.com/[username]/ppw-2026-week2-[NIM].git
git branch -M main
git push -u origin main
Batas Waktu Pengumpulan (Deadline):
Senin, 02 Februari 2026, Pukul 23.59 WIB. Keterlambatan tanpa izin resmi akan dikenakan sanksi penalti
pengurangan nilai 10% per hari.