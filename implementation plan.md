# Rencana Implementasi: UrbanWear - Premium E-Commerce Fashion

Berdasarkan dokumen spesifikasi yang Anda berikan, kita akan membangun platform e-commerce full-stack yang modern, cepat, dan elegan menggunakan **Next.js (App Router)**. Proyek ini akan menggunakan arsitektur modern yang skalabel, siap untuk produksi, dan dilengkapi dengan Admin Dashboard lengkap.

## User Review Required

> [!IMPORTANT]
> - **Database PostgreSQL**: Rencana ini mengasumsikan Anda akan menggunakan PostgreSQL. Apakah kita akan menggunakan database lokal (misal via Docker) atau layanan cloud (seperti Supabase/Neon/Vercel Postgres) untuk tahap pengembangan ini?
> - **Autentikasi**: Untuk Admin Dashboard dan Login User, disarankan menggunakan **NextAuth.js (Auth.js)**. Apakah Anda setuju dengan pendekatan ini?
> - **Payment Gateway / Checkout**: Untuk fitur Checkout, biasanya kita mengintegrasikan payment gateway nyata (seperti Midtrans/Xendit). Untuk tahap awal ini, apakah kita akan membuat simulasi checkout (menyimpan order ke database dengan status "Pending") atau ingin menggunakan metode WhatsApp Checkout sementara?
> - **Upload Gambar**: Untuk menyimpan gambar produk, kita butuh media penyimpanan (seperti Cloudinary, AWS S3, atau Vercel Blob). Pendekatan apa yang ingin Anda gunakan, atau simpan di folder publik lokal dulu?

## Arsitektur & Teknologi

- **Framework**: Next.js (App Router) dengan React
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS, Framer Motion (animasi), Lucide Icons
- **State Management**: Zustand (untuk Cart, Wishlist, UI state)
- **Forms & Validation**: React Hook Form + Zod
- **Database & ORM**: PostgreSQL + Prisma ORM
- **Komponen UI Dasar**: Shadcn UI (berbasis Radix UI & Tailwind) untuk mempercepat pembuatan form, dialog, toast, dan komponen interaktif yang aksesibel (WCAG) serta mendukung Dark Mode.
- **Lainnya**: Swiper.js (Carousel), Next PWA.

## Desain Database (Prisma Schema Draft)

Kita akan membutuhkan beberapa model utama dengan optimasi level produksi (seperti *Soft Delete* dan *Indexing*):
- `User` (Pelanggan & Admin, dengan enum `Role`, relasi NextAuth, dan fitur *Soft Delete* `deletedAt`)
- `Product` (Detail barang, harga, deskripsi, *Soft Delete* `deletedAt`, terindeks pada `slug`)
- `ProductVariant` (Ukuran, Warna, Stok, SKU)
- `Category` (Kategori fashion, terindeks pada `slug`)
- `Promo` / `Voucher` (Manajemen kode diskon, kuota penggunaan, validitas)
- `Order` & `OrderItem` (Transaksi pesanan, Status Pembayaran Gateway, URL/Token Pembayaran, Metode Kirim, Ongkir, dan Resi/Tracking Number)
- `Review` (Ulasan pelanggan)
- `Wishlist` (Produk yang disimpan pengguna)

## Langkah-Langkah Pengerjaan (Step-by-Step)

### Fase 1: Inisialisasi & Konfigurasi Proyek (Setup)
1. Inisialisasi proyek Next.js dengan `npx create-next-app` (TypeScript, ESLint, Tailwind CSS).
2. Konfigurasi token warna Tailwind (`#FFFFFF`, `#111111`, `#F5F5F5`, Accent: `#FF6B35` / `#10B981`) dan typography (misal: font *Inter* atau *Poppins*).
3. Setup Prisma ORM dan koneksi ke PostgreSQL.
4. Inisialisasi komponen dasar antarmuka (Shadcn UI: Button, Card, Input, Dialog, Toast, Skeleton).
5. Konfigurasi Zustand untuk *global store* (mengelola state Cart dan Wishlist).

### Fase 2: Pengembangan Database & Backend Foundation
1. Membuat skema Prisma (`schema.prisma`) untuk entitas E-commerce.
2. Menjalankan migrasi database (`prisma migrate dev`).
3. Membuat script seed untuk memasukkan data awal (dummy products & categories).
4. Membangun Next.js Server Actions & API Routes untuk operasi CRUD (Read Products, Create Order, dll).

### Fase 3: Pengembangan UI Inti & Layout (Frontend)
1. Membuat Global Layout (`layout.tsx`) dengan dukungan sistem *Dark Mode* (`next-themes`).
2. Membuat **Navbar** responsif (Sticky navigation, Logo, Menu Kategori, Search Bar interaktif, indikator Cart/Wishlist).
3. Membuat **Footer** lengkap (Links, Newsletter, Payment methods).
4. Implementasi komponen *Loading Skeleton* dan *Toast Notification*.

### Fase 4: Halaman Utama (Homepage - `app/page.tsx`)
1. **Hero Section**: Banner full-width, efek parallax ringan, gradient overlay, CTA yang mencolok.
2. **Category Section**: Grid kategori pakaian (Kaos, Kemeja, dll) dengan icon/gambar dan animasi *hover* (Framer Motion).
3. **Featured Products**: Grid produk dengan Product Card (badge diskon/baru, rating, harga coret, gambar ganda saat *hover*, tombol *Quick View* dan *Add to Cart*).
4. **Flash Sale**: Bagian khusus dengan *Countdown Timer* dan indikator progress stok.
5. **New Arrival & Best Seller**: Slider/Carousel produk menggunakan Swiper.js.
6. **Promo Banner & Testimonials**: Banner promosi diskon besar dan *card* ulasan dari pelanggan.

### Fase 5: Halaman Shop & Detail Produk
1. **Halaman Shop (`app/shop/page.tsx`)**:
   - Sidebar filter kompleks (berdasarkan Kategori, Rentang Harga, Ukuran, Warna, Rating).
   - Grid produk dengan fitur pengurutan (*Sorting*: Terbaru, Termurah, dll).
   - Pagination modern.
2. **Halaman Detail Produk (`app/shop/[slug]/page.tsx`)**:
   - Image gallery dengan fitur klik untuk memperbesar (zoom) dan *thumbnail*.
   - Pemilihan Varian (warna visual, kotak ukuran S-XXL).
   - Informasi detail: Deskripsi, Spesifikasi, Size Guide, Estimasi Pengiriman.
   - *Sticky Add to Cart* untuk mobile (memudahkan konversi).
   - Bagian *Related Products* (Produk Terkait).

### Fase 6: Alur Keranjang & Checkout
1. **Shopping Cart (`app/cart/page.tsx`)**: Menampilkan ringkasan produk di keranjang (dari Zustand `localStorage`), field input voucher promosi, dan penghitungan subtotal.
2. **Checkout (`app/checkout/page.tsx`)**: Form (single page) dengan validasi *React Hook Form + Zod* untuk Data Pembeli dan Alamat Lengkap pengiriman.
3. **Integrasi Eksternal & Database**:
   - **RajaOngkir API**: Menghitung tarif ongkos kirim secara otomatis dan *real-time* ke seluruh kecamatan di Indonesia.
   - **Midtrans (Snap)**: Menangani antarmuka dan proses metode pembayaran secara otomatis.
   - Pembuatan record `Order` di database yang dilengkapi kolom untuk *tracking number* dan *shipping status*.

### Fase 7: Admin Dashboard
1. Layout Admin khusus (`app/admin/layout.tsx`) dengan *Sidebar* navigasi.
2. **Dashboard Overview**: Ringkasan statistik (Total penjualan, pesanan baru) dengan grafik (Recharts).
3. **Manajemen Produk**: Form CRUD produk yang ekstensif (tambah produk, unggah foto, kelola varian dan harga).
4. **Manajemen Pesanan**: Tabel daftar pesanan untuk melihat detail dan mengubah status (Diproses, Dikirim).
5. **Manajemen Kategori & Pelanggan**: CRUD untuk kategori fashion dan melihat daftar user.

### Fase 8: Polish, Optimasi & Fitur Lanjutan
1. Integrasi *Framer Motion* untuk *page transitions* yang halus dan *micro-interactions* (hover tombol, buka menu).
2. Optimasi *Lazy Loading* pada gambar (`next/image`).
3. Konfigurasi SEO terstruktur (Dynamic Metadata, OpenGraph untuk share sosial media).
4. Konfigurasi *Progressive Web App* (PWA) manifest dan service worker.

---

## Verification Plan

### Automated Testing (Linting & Build)
- Menjalankan kompilasi TypeScript (`tsc --noEmit`) dan `next build` untuk memastikan aplikasi siap produksi (tidak ada error build).
- Validasi struktur database dengan `npx prisma validate`.

### Manual Verification
1. **Desain & Responsivitas**: Inspeksi visual UI di simulasi Mobile, Tablet, dan Desktop untuk memastikan estetika *Clean Layout* dengan banyak *whitespace* terpenuhi.
2. **User Flow (E2E)**: Mensimulasikan perjalanan pelanggan dari Beranda -> Mencari Produk -> Filter -> Lihat Detail Produk -> Pilih Ukuran -> Masuk Keranjang -> Input Kode Voucher -> Checkout -> Tracking Ongkir.
3. **Fungsionalitas Admin & Stok**: Memastikan admin dapat mengelola produk, dan ketika pengguna checkout, stok produk dikurangi dengan metode *Atomic Updates* / transaksi database yang mencegah *race condition* (stok tidak boleh minus meskipun diakses bersamaan).
4. **Payment Integration (Simulated)**: Memastikan saat checkout, sistem memanggil API Payment Gateway (seperti Midtrans/Xendit) untuk mendapatkan URL pembayaran, dan webhook dapat memicu pengurangan stok yang aman.
5. **Performance Score**: Menggunakan Lighthouse untuk memastikan nilai performa (fast loading) dan aksesibilitas (WCAG) yang tinggi.
