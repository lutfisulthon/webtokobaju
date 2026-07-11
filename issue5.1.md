# Issue: Fase 5.1 - Perancangan Halaman Kategori Utama & Pengalaman Belanja Lanjutan

## Deskripsi Umum
Fase 5.1 berfokus pada perombakan dan peningkatan pengalaman berbelanja (*shopping experience*) di halaman kategori utama untuk target pengguna: **Pria**, **Wanita**, dan **Anak-anak**. Desain harus mencerminkan identitas *premium fashion brand* dengan antarmuka yang minimalis, responsif (*mobile-first*), elegan, serta memberikan navigasi yang sangat intuitif.

---

## 1. Navigasi & Mega Menu
Setiap kategori utama akan dilengkapi dengan **Mega Menu** interaktif pada navigasi header.
- **Struktur Mega Menu**: Menampilkan gambar visual representatif dari kategori, daftar subkategori lengkap, tautan ke produk populer/terbaru, dan *banner* promo yang sedang berlangsung.
- **Daftar Subkategori**:
  - **Pria**: Kaos, Kemeja, Hoodie, Jaket, Celana Jeans, Chino, Sepatu, Aksesori, dll.
  - **Wanita**: Dress, Blouse, Outer, Rok, Celana, Hijab, Tas, Perhiasan, dll.
  - **Anak-anak**: Dibagi berdasarkan umur (Bayi 0-2 Tahun, Anak 3-7 Tahun, Remaja 8-15 Tahun).

## 2. Struktur Halaman Kategori
### Hero Banner
Di bagian paling atas halaman kategori, tampilkan *Hero Banner* dinamis:
- Foto model profesional beresolusi tinggi yang relevan dengan kategori.
- Tipografi judul besar (misal: "Fashion Pria Modern").
- Deskripsi singkat dan *Call-to-Action* (CTA) utama (misal: "Belanja Sekarang").

### Banner Promo Antar Kategori
- Sisipkan *banner* promosi horizontal di sela-sela *grid* produk (misal: setelah baris ke-3).
- Konten promo: Diskon hingga 50%, Gratis Ongkir, Flash Sale, atau Promo Bundling.

## 3. Sistem Filter & Penyortiran
Sidebar filter harus modern, *sticky* di desktop, dan mudah diakses via *drawer* di perangkat *mobile*.
- **Filter Harga**: *Slider* interaktif untuk rentang harga.
- **Filter Ukuran & Warna**: Gunakan UI *Color Picker* (bulatan warna) dan *Size Box* (XS, S, M, L, XL).
- **Filter Spesifik**: Brand (Checklist/Multi-select), Rating (Bintang), Promo (Diskon, Gratis Ongkir), dan Ketersediaan (Ready Stock, Pre-Order).
- **Penyortiran (Sorting)**: Fitur untuk mengurutkan berdasarkan Terbaru, Terlaris, Harga (Termurah/Termahal), dan Rating Tertinggi.
- **Pencarian**: Kotak pencarian produk *real-time*.

## 4. Tampilan Grid & Kartu Produk
### Grid Responsif
- **Desktop**: 4 kolom
- **Tablet**: 3 kolom
- **Mobile**: 2 kolom

### Fitur Kartu Produk (Product Card)
- **Gambar HD**: Foto utama bergaya editorial, otomatis berganti ke foto kedua (alternatif) saat di-*hover*.
- **Informasi**: Nama produk, Harga Coret (Normal vs Diskon), Rating (Bintang & Ulasan).
- **Badge Status**: "New", "Sale", atau "Best Seller".
- **Varian Warna**: *Swatches* mini warna yang tersedia.
- **Aksi Cepat**: Tombol *Quick View*, *Wishlist* (ikon hati), dan *Add to Cart*.

## 5. Fitur Interaktif Tambahan
Untuk meningkatkan retensi dan konversi pengguna:
- **Quick View**: Modal *pop-up* untuk melihat detail singkat dan varian produk tanpa berpindah halaman.
- **Wishlist & Perbandingan**: Fungsionalitas simpan produk dan membandingkan fitur produk.
- **Recently Viewed & Rekomendasi**: Menampilkan produk yang baru saja dilihat atau direkomendasikan.
- **Breadcrumb Navigation**: Memudahkan pelacakan lokasi halaman pengguna.
- **Infinite Scroll / Pagination**: Pemuatan halaman yang mulus.

## 6. Gaya Visual & Panduan UI/UX
- **Palet Warna**: Dominasi Putih, Hitam, dan Abu-abu muda dengan aksen netral yang berkelas (memberikan *white space* yang lega).
- **Tipografi**: Gunakan font *sans-serif* modern seperti Inter, Manrope, atau Poppins.
- **Aset Visual**: Ikon garis minimalis (Lucide Icons), foto produk bergaya katalog premium, sudut kartu agak membulat (*rounded corners*) dengan bayangan yang sangat halus (*soft shadow*).
- **Animasi & Performa**: Transisi mikro dan animasi *hover* yang halus menggunakan Framer Motion. Terapkan *Skeleton Loading* saat memuat data dan *Lazy Loading* pada gambar.
- **Aksesibilitas**: Standar WCAG dengan dukungan pembaca layar dan navigasi *keyboard*.

---

## Kriteria Penerimaan (Acceptance Criteria) High-Level
Dokumen perancangan ini bertujuan agar fase pengembangan selanjutnya dapat:
1. Membangun struktur *Mega Menu* dan *Hero Banner* pada masing-masing halaman kategori.
2. Mengembangkan komponen filter tingkat lanjut (*Advanced Filters*) seperti *slider* harga dan *color swatches*.
3. Mengubah komponen `ProductCard` agar mendukung *hover image swapping*, *Quick View*, dan lencana diskon.
4. Menerapkan gaya visual elegan yang ditekankan melalui tipografi modern, *white space*, dan animasi Framer Motion yang ringan.
