# Issue: Fase 3 - Pengembangan UI Inti & Layout (Frontend)

## Deskripsi
Fokus pada fase ini adalah membangun tata letak utama (*Global Layout*) serta komponen-komponen antarmuka dasar (*Core UI Components*) untuk platform e-commerce UrbanWear. Antarmuka harus dirancang dengan prinsip **Mobile-First**, **Premium & Modern Minimalist**, mendukung **Dark Mode**, serta memenuhi standar Aksesibilitas (WCAG 2.1 AA).

## Spesifikasi Desain & Estetika (UI/UX Guidelines)
- **Tema Desain**: Clean layout dengan banyak *white space*, sudut membulat (*rounded-xl* / *rounded-2xl*), bayangan halus (*soft shadow*), dan *micro-interactions* pada setiap tombol dan link.
- **Tipografi**: Heading menggunakan font **Plus Jakarta Sans** (bersifat *stylish* & elegan), sedangkan body text menggunakan font **Inter** (sangat mudah dibaca).
- **Aksesibilitas**: Touch target minimal 44x44px untuk elemen interaktif di mobile, indikator fokus keyboard jelas, dan penggunaan tag HTML5 semantik (`<header>`, `<nav>`, `<footer>`, `<main>`).

## Tugas (Tasks)

### 1. Inisialisasi Tema & Dark Mode
- [ ] Konfigurasikan library `next-themes` untuk mendukung perubahan tema (*Light/Dark Mode*) secara dinamis.
- [ ] Pastikan transisi perubahan warna latar belakang dan teks berlangsung secara halus (*smooth transition*).

### 2. Layout Global (`layout.tsx`)
- [ ] Terapkan layout global yang membungkus seluruh aplikasi Next.js.
- [ ] Tambahkan komponen **Sonner** (`<Toaster />`) secara global untuk menampilkan notifikasi *toast* (sukses/error) di seluruh halaman.

### 3. Komponen Navbar Premium (Sticky & Responsive)
- [ ] Rancang navbar dengan efek *glassmorphism* (semi-transparan dengan *backdrop-blur*) yang melekat (*sticky*) di bagian atas saat di-scroll.
- [ ] Sediakan layout responsif:
  - **Desktop**: Logo di kiri, menu navigasi utama (Home, Shop, New Arrival, About) di tengah, tombol aksi (Search, Wishlist, Shopping Cart, Login, Theme Toggle) di kanan.
  - **Mobile**: Bar navigasi ringkas dengan tombol hamburger menu (*drawer overlay*) untuk menampilkan tautan menu.
- [ ] Terapkan indikator angka (*badge* merah kecil) pada ikon Cart dan Wishlist yang secara dinamis mengambil jumlah dari Zustand store (`useCartStore` & `useWishlistStore`).
- [ ] Implementasikan input pencarian (*Live Search*) yang estetis dan interaktif.

### 4. Komponen Footer Komprehensif
- [ ] Rancang footer grid responsif (1 kolom di mobile, 4 kolom di desktop) yang memuat:
  - **Kolom 1**: Logo UrbanWear, deskripsi singkat brand, dan tautan sosial media (Instagram, TikTok).
  - **Kolom 2**: Menu Belanja (Shop, New Arrival, Best Seller, Promo).
  - **Kolom 3**: Customer Service (FAQ, Cara Belanja, Kebijakan Privasi, Pengiriman).
  - **Kolom 4**: Formulir Berlangganan Newsletter & Pilihan Metode Pembayaran (tampilkan ikon bank VA dan QRIS yang rapi).

### 5. Komponen UI Pendukung
- [ ] Buat komponen **Skeleton Loading** universal untuk digunakan sebagai *loading placeholder* pada produk.
- [ ] Integrasikan notifikasi *Toast* (Sonner) pada aksi-aksi mikro seperti menambah barang ke keranjang atau menyalin tautan produk.

## Kriteria Penerimaan (Acceptance Criteria)
- Navbar responsif dan berfungsi dengan baik di mobile (hamburger menu menutup & membuka dengan animasi halus) dan desktop.
- Indikator badge keranjang & wishlist di navbar ter-update secara *real-time* saat item ditambahkan/dihapus (sinkron dengan Zustand store).
- *Toggle Theme* berfungsi mengubah seluruh halaman menjadi mode gelap (*dark mode*) dan mempertahankan preferensi tema pengguna saat halaman di-refresh.
- Halaman lolos validasi aksesibilitas dasar (kontras warna teks minimal 4.5:1, elemen interaktif dapat diakses dengan keyboard, dan struktur tag semantik lengkap).
- Proyek berhasil dikompilasi tanpa error TypeScript maupun build Next.js.
