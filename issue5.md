# Issue: Fase 5 - Pengembangan Halaman Shop & Detail Produk - UrbanWear

## Deskripsi
Fokus pada fase ini adalah membangun pengalaman penjelajahan produk yang komprehensif melalui dua halaman utama: **Halaman Katalog/Shop (`app/shop/page.tsx`)** dan **Halaman Detail Produk (`app/shop/[slug]/page.tsx`)**. 
Antarmuka harus dirancang secara premium, responsif (*mobile-first*), dan memudahkan pengguna untuk menemukan serta memilih produk yang tepat hingga menambahkannya ke keranjang.

## Daftar Bagian (Sections) yang Harus Dibangun

### 1. Halaman Katalog / Shop (`app/shop/page.tsx`)
Halaman ini berfungsi sebagai etalase utama pencarian seluruh produk UrbanWear.
- **Sidebar Filter Kompleks**: Sediakan fitur pemfilteran interaktif (misal: berdasarkan Kategori, Rentang Harga, Ukuran, Warna). Di tampilan *mobile*, filter ini harus masuk ke dalam laci geser (*Drawer/Off-canvas*).
- **Pengurutan (Sorting)**: Dropdown untuk mengurutkan produk (Terbaru, Harga Termurah, Harga Termahal, Terpopuler).
- **Grid Produk & Status**: Menampilkan daftar produk menggunakan komponen `ProductCard` yang sudah dibuat pada Fase 4. Sediakan *Skeleton Loader* saat memuat filter baru, dan *Empty State* yang elegan jika filter tidak membuahkan hasil.
- **Navigasi Pagination**: Kontrol penomoran halaman yang modern (bukan sekadar Infinite Scroll, agar footer tetap bisa diakses).

### 2. Halaman Detail Produk (`app/shop/[slug]/page.tsx`)
Halaman ini harus memuat informasi lengkap tentang satu produk secara spesifik, yang didesain untuk meyakinkan pelanggan melakukan pembelian.
- **Breadcrumb Navigation**: Jejak rekam navigasi di bagian atas (misal: `Home > Pria > Kemeja > Nama Produk`) untuk memudahkan orientasi pengguna.
- **Galeri Gambar (Image Gallery)**: Menampilkan gambar utama yang responsif, dilengkapi deretan *thumbnail* (karena 1 produk bisa memiliki lebih dari 1 macam gambar pendukung). Disertai efek *zoom* saat kursor diarahkan ke gambar utama.
- **Pemilihan Varian & Preview Warna**: UI interaktif untuk memilih **Warna** (misal dalam bentuk bulatan warna) dan **Ukuran** (kotak S, M, L, XL). 
  - **Fitur Khusus (Color Preview)**: Ketika pengguna memilih warna tertentu, gambar utama di galeri harus otomatis berubah menampilkan foto produk dengan warna tersebut.
  - Pemilihan ini juga wajib mempengaruhi harga dan ketersediaan stok yang ditampilkan.
- **Informasi Ekstra**: Tabulasi (Tabs) atau Accordion untuk memuat "Deskripsi Detail", "Panduan Ukuran (Size Guide)", dan "Kebijakan Pengiriman/Retur".
- **Call to Action (CTA)**: 
  - Tombol utama "Tambah ke Keranjang" yang terhubung ke Zustand `useCartStore`.
  - Di tampilan *mobile*, tombol ini idealnya dibuat *sticky* di bagian bawah layar saat halaman di-*scroll* (Sticky Add to Cart).
- **Produk Terkait (Related Products)**: Slider atau grid produk rekomendasi dari kategori yang sama di bagian bawah halaman.

## Panduan Teknis (High-Level)
- **Data Fetching & SEO**: Kedua halaman ini harus di-render menggunakan *React Server Components* (SSR). Gunakan fungsi `generateMetadata` di Next.js untuk membuat meta-tag dinamis (Title, Description, OpenGraph Image) pada halaman detail produk agar sangat optimal di mesin pencari.
- **Pembaruan Skema Database (Varian Warna)**: Tambahkan *field* opsional `imageUrl String?` pada model `ProductVariant` di `schema.prisma`. Hal ini bertujuan agar setiap varian warna (misal: "Merah") dapat dikaitkan dengan link gambar yang spesifik.
- **Logika Preview Varian**: Pada *Client Component* Detail Produk, buat fungsi `useEffect` atau state yang memantau perubahan *selected color*. Jika warna berubah, cari varian terkait yang memiliki `imageUrl`, dan jadikan URL tersebut sebagai *active image* di Galeri Utama.
- **Manajemen URL State**: Filter dan Pengurutan di Halaman Shop idealnya menggunakan Query Parameter di URL (misal: `?category=jaket&sort=price_asc`) alih-alih local state murni. Gunakan *React Suspense* untuk mencegah proses render menghalangi UI.
- **Validasi State Varian**: Tombol "Tambah ke Keranjang" harus dinonaktifkan (disabled) jika stok varian yang dipilih sedang habis (0) atau jika pengguna belum memilih varian.

## Kriteria Penerimaan (Acceptance Criteria)
1. **Navigasi Filter & URL**: Filter kategori/harga berfungsi langsung memperbarui grid dan mencerminkan parameter di URL (bisa dibagikan/di-bookmark). Status loading dikelola dengan anggun via komponen *Skeleton*.
2. **Kesesuaian Data & SEO**: Informasi detail produk, varian, dan stok valid sesuai PostgreSQL, dan `<head>` HTML memuat metadata dinamis produk.
3. **Fungsionalitas Interaksi**: Klik "Tambah ke Keranjang" dengan varian valid sukses tersimpan ke Zustand dan memunculkan *Toast Notification*.
4. **Performa & Aksesibilitas (A11y)**: Tabel spesifikasi, galeri gambar (dengan alt tag), dan sidebar responsif sempurna tanpa *Layout Shift*. Elemen pilihan ukuran/warna dapat dinavigasi dengan *keyboard focus* (WCAG compliance).
