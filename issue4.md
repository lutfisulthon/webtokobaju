# Issue: Fase 4 - Pengembangan Halaman Utama (Homepage) - UrbanWear

## Deskripsi
Fokus pada fase ini adalah menyusun Halaman Utama (`app/page.tsx`) yang bertindak sebagai etalase depan aplikasi UrbanWear. Halaman ini dirancang untuk memaksimalkan daya tarik visual (premium) dan meningkatkan konversi pelanggan. 

*Catatan Bisnis: Fungsionalitas interaktif di halaman ini (seperti tombol "Tambah ke Keranjang") harus dirancang dengan baik sebagai langkah awal menuju alur Checkout (pada fase mendatang) yang secara spesifik akan mendukung integrasi Payment Gateway otomatis (seperti QRIS dan Virtual Account).*

## Daftar Bagian (Sections) yang Harus Dibangun
1. **Hero Section (Spanduk Utama)**
   - Spanduk *full-width* dengan gambar/video latar belakang berkualitas tinggi.
   - Teks utama yang kuat (*Hero Headline*) dan tombol *Call to Action* (CTA) "Belanja Sekarang".
   - Terapkan efek *gradient overlay* agar teks tetap terbaca, dan animasi masuk yang halus.

2. **Kategori Produk (Category Grid)**
   - Tampilkan kartu visual untuk kategori inti (misal: Pria, Wanita, Aksesoris).
   - Efek *hover zoom* perlahan pada gambar saat interaksi mouse.

3. **Produk Unggulan (Featured Products) & Flash Sale**
   - Buat komponen `ProductCard` *reusable* yang meliputi: Gambar produk, Nama, Harga (dengan format coret jika diskon), Rating, dan Ikon Add-to-Cart.
   - Bagian *Flash Sale* dengan visualisasi waktu mundur (*Countdown Timer*).

4. **Koleksi Terbaru (New Arrivals Slider)**
   - Tampilkan deretan produk terbaru menggunakan tata letak *Carousel/Slider* interaktif (bisa digeser di layar sentuh).

5. **Banner Promosi & Testimoni Pelanggan**
   - Banner sekunder di tengah halaman yang memuat kode voucher atau promo *Free Shipping*.
   - Beberapa kartu ulasan singkat dari pelanggan untuk meningkatkan kepercayaan (*Social Proof*).

## Panduan Teknis (High-Level)
- **Data Fetching**: Tarik data produk (misal 8 produk terbaru) dari database PostgreSQL via Prisma di komponen *Server-Side* agar halaman memiliki skor SEO dan performa (*Initial Load*) yang cepat.
- **State Management**: Saat pengguna menekan "Beli/Add to Cart" di *Product Card*, eksekusi fungsi dari Zustand (`useCartStore`) yang sudah dikonfigurasi di Fase 3, agar *badge* keranjang di Navbar otomatis bertambah.
- **Performa Gambar**: Seluruh aset visual (Hero banner, gambar kategori, foto produk) wajib menggunakan komponen `<Image />` bawaan Next.js dengan ekstensi teroptimasi (WebP).
- **Animasi (Micro-interactions)**: Manfaatkan transisi CSS bawaan Tailwind v4 atau Framer Motion untuk memperhalus interaksi elemen yang muncul saat halaman digulir (*scroll reveal*).

## Kriteria Penerimaan (Acceptance Criteria)
1. Keseluruhan struktur beranda (Hero hingga Testimoni) bersifat *Mobile-First* (responsif sempurna di layar seluler dan rapi di desktop).
2. Data produk yang tampil di halaman utama diambil secara dinamis dari database, bukan sekadar data *hardcode* statis.
3. Fungsionalitas *Add to Cart* berjalan sempurna (memperbarui keranjang global seketika).
4. Tidak terjadi *Layout Shift* (*Cumulative Layout Shift* = 0) saat gambar dimuat, dan aplikasi dapat dibangun (`npm run build`) tanpa error terkait *Client/Server Components*.
