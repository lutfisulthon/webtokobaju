# Issue: Fase 3 - Pengembangan UI Inti & Layout (Frontend) - UrbanWear

## Deskripsi
Fokus pada fase ini adalah membangun struktur antarmuka (UI) inti dan layout global untuk aplikasi e-commerce UrbanWear. Seluruh proses pengembangan **wajib mematuhi standar UI/UX premium**, pendekatan *Mobile-First*, dan aksesibilitas *WCAG 2.1 AA*.

Dokumen ini ditujukan sebagai panduan *high-level* bagi *Frontend Engineer* untuk menghasilkan komponen responsif, memiliki performa tinggi, dan estetika visual yang konsisten.

## Spesifikasi Desain & Teknologi
- **Estetika Brand**: Modern Minimalist, Premium Fashion, *Clean Layout*, banyak *white space*, sudut membulat (*rounded cards*), dan *soft shadows*.
- **Tipografi**: **Plus Jakarta Sans** (untuk heading/judul) dan **Inter** (untuk teks isi paragraf). Implementasi via `next/font`.
- **Warna Identitas & Design Tokens**: Putih (`#FFFFFF`), Hitam (`#111111`), Abu Muda (`#F5F5F5`), dengan warna aksen *Terrakota/Orange* (`#FF6B35`) atau *Emerald* (`#10B981`). Gunakan CSS Variables / Tailwind v4 tokens agar terpusat (hindari hardcode warna).
- **Sistem Tema**: Integrasi fitur transisi *Dark Mode* yang halus (misal via `next-themes`).
- **Komponen Ekstra**: *Glassmorphism* (backdrop blur) dan transisi/animasi *micro-interactions* (misal Framer Motion atau Tailwind *transitions*).
- **Performa & SEO**: Penggunaan `next/image` (WebP & lazy-load otomatis) serta konfigurasi Meta Tags dasar untuk menjamin skor Core Web Vitals dan SEO optimal.

## Daftar Tugas (Tasks)

- [ ] **Setup Global Layout, Tema (*Dark/Light Mode*), & SEO**
  - Implementasikan *Theme Provider* di tingkat paling atas (`layout.tsx`).
  - Pasang wadah (container) notifikasi global yang elegan (contoh: `<Toaster />` dengan *styling* yang selaras dengan tema).
  - Konfigurasi objek `metadata` dasar di `layout.tsx` (Title, Description, OpenGraph) untuk fondasi SEO.
  
- [ ] **Pengembangan Komponen Navbar (Responsif & Premium)**
  - Terapkan efek *Sticky Navigation* dengan visual *glassmorphism* saat di-scroll.
  - **Desktop**: Tampilkan Logo, Menu Navigasi Utama, Search Bar dengan state *hover/focus* yang jelas, serta Ikon Keranjang (*Cart*) dan *Wishlist*.
  - **Mobile**: Gunakan tombol Hamburger yang mengaktifkan *drawer/overlay* beranimasi mulus, pastikan seluruh *touch target* minimal `44x44px`.
  - **Interaktivitas**: *Badge* angka pada ikon Keranjang dan Wishlist **harus terhubung langsung** ke store *Zustand* agar reaktif.

- [ ] **Pengembangan Komponen Footer**
  - Gunakan sistem grid (misal 4 kolom di desktop, 1 kolom di mobile) untuk tautan perusahaan, bantuan, dan kebijakan.
  - Sediakan form langganan (Newsletter) sederhana namun rapi (input + tombol yang terintegrasi di sebelahnya).
  - Tampilkan ikon metode pembayaran yang didukung (QRIS, Virtual Account).

- [ ] **Inisiasi *Design System* Dasar**
  - Buat komponen `Button` terpusat yang fleksibel dengan varian: `primary`, `secondary`, `ghost`, dan dukungan properti `loading` (menyertakan ikon *spinner*).
  - Buat komponen `Input` yang reusable, mencakup label, *hint text*, validasi *error state*, dan aksesibilitas *aria-describedby*.
  - Buat satu komponen `Skeleton` (placeholder pemuatan data) untuk menghindari tata letak bergeser (*Cumulative Layout Shift*) pada saat menunggu data dari backend.

## Kriteria Penerimaan (Acceptance Criteria)
1. **Aksesibilitas (A11y)**: Semua elemen interaktif memiliki `aria-labels` yang tepat dan rasio kontras warna mematuhi standar *WCAG AA*.
2. **Responsivitas**: Tampilan tidak boleh rusak/berantakan mulai dari ukuran layar perangkat seluler kecil (`320px`) hingga desktop besar.
3. **Fungsionalitas State**: Menambah item ke *Zustand Store* (Cart) otomatis mengubah angka lencana (*badge*) pada Navbar tanpa harus me-refresh halaman.
4. **Build Success**: Tidak ada peringatan/error terkait `"use client"` yang salah penempatan, dan aplikasi lolos tahap proses kompilasi (`npm run build`).
5. **Performa**: Penggunaan aset gambar (*Logo* / *Banner* dll) harus melalui komponen `<Image />` bawaan Next.js untuk menjaga efisiensi muatan halaman (*page load*).
