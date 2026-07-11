# Dokumentasi & Strategi Pengujian UI: Fase 4 (Halaman Utama / Homepage)

Dokumen ini mencatat rencana pengujian unit (*Unit Testing*) dan pengujian integrasi antarmuka (*UI Testing*) yang dirancang secara komprehensif untuk memverifikasi Halaman Utama (`app/page.tsx`) dan komponen-komponen penyusunnya (Hero, Category Grid, Product Card, Flash Sale Countdown, dan Testimonials).

---

## 1. Prasyarat & Lingkungan Pengujian

Pengujian dilakukan menggunakan:
- **Test Runner**: Vitest
- **DOM Environment**: `jsdom`
- **Testing Library**: `@testing-library/react` dan `@testing-library/jest-dom`
- **Mocking**: Mocking terhadap database client (`@prisma/client`) saat pengujian server component, serta Zustand store (`useCartStore` & `useWishlistStore`) untuk pengujian interaktivitas klien.

---

## 2. Rincian Kasus Pengujian (Test Cases)

### A. Pengujian Server-Side Data Fetching (Homepage SSR/RSC)
*   **Test Case 1: Pengambilan Data Kategori Terintegrasi**
    *   *Deskripsi*: Memastikan halaman utama memanggil `getCategories()` dan merender seluruh kategori pakaian yang terdaftar di database.
    *   *Assertion*: Grid kategori menampilkan elemen tautan dengan teks nama kategori yang cocok (misal: "Kemeja", "Kaos").
*   **Test Case 2: Rendering Produk Pilihan**
    *   *Deskripsi*: Memastikan halaman memanggil `getProducts()` untuk memuat produk unggulan.
    *   *Assertion*: Daftar produk dirender menggunakan komponen `<ProductCard />` sebanyak kuantitas produk yang diambil dari database (maksimal limit 8).
*   **Test Case 3: Pemisahan Produk Flash Sale**
    *   *Deskripsi*: Memastikan produk yang memiliki harga coret (`discountPrice !== null`) disaring masuk ke bagian *Flash Sale*.
    *   *Assertion*: Produk tanpa harga diskon tidak boleh muncul di baris grid *Flash Sale*.

### B. Pengujian Komponen `ProductCard` (Client-Side Interactions)
*   **Test Case 4: Informasi Harga & Diskon**
    *   *Deskripsi*: Menguji kebenaran penampilan harga produk biasa vs produk diskon.
    *   *Assertion*:
        1. Jika produk diskon, harga lama ditampilkan dengan efek coret (`line-through`) dan persentase potongan harga terhitung dengan benar pada badge diskon.
        2. Jika produk normal, harga ditampilkan polos tanpa harga coret.
*   **Test Case 5: Penambahan ke Keranjang (Add to Cart Action)**
    *   *Deskripsi*: Menguji penekanan tombol keranjang belanja pada kartu produk.
    *   *Assertion*: Menekan tombol memanggil fungsi `addItem` dari Zustand store dengan parameter produk yang tepat (menggunakan varian default pertama jika ada), serta memicu kemunculan notifikasi Toast sukses (`toast.success`).
*   **Test Case 6: Toggle Wishlist**
    *   *Deskripsi*: Menguji penekanan tombol ikon hati pada kartu produk.
    *   *Assertion*: Klik pertama menambahkan produk ke daftar keinginan dan mengubah warna ikon menjadi merah. Klik kedua menghapusnya dan merestorasi status visual awal.

### C. Pengujian Komponen `CountdownTimer`
*   **Test Case 7: Penghitungan Mundur Waktu**
    *   *Deskripsi*: Memastikan waktu berjalan mundur secara otomatis setiap detik.
    *   *Assertion*: Jam, menit, dan detik berkurang 1 angka setelah interval 1000ms terlewati.
*   **Test Case 8: Format Karakter Waktu**
    *   *Deskripsi*: Memverifikasi estetika dan format waktu.
    *   *Assertion*: Angka satuan waktu selalu memiliki lebar 2 digit (misalnya: angka `9` ditampilkan sebagai `"09"`).

### D. Navigasi & SEO (Aksesibilitas)
*   **Test Case 9: Ketepatan Tautan Navigasi**
    *   *Deskripsi*: Memastikan seluruh tombol CTA dan banner kategori mengarah ke rute navigasi `/shop` yang sesuai.
    *   *Assertion*: Tautan kategori "Jaket" memiliki atribut `href="/shop?category=jaket"`.
*   **Test Case 10: Atribut Aksesibilitas Gambar (A11y)**
    *   *Deskripsi*: Memverifikasi kelengkapan deskripsi alternatif gambar produk.
    *   *Assertion*: Setiap elemen `<img />` produk memuat tag `alt` yang berisi nama produk tersebut, untuk mendukung pembaca layar (*screen readers*).

---

## 3. Contoh Implementasi Kode Test (Countdown Timer)

Berikut kerangka pengujian unit untuk komponen `CountdownTimer` (`components/countdown-timer.test.tsx`):

```tsx
import { render, screen, act } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { CountdownTimer } from "./countdown-timer"

describe("CountdownTimer Component", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("renders the initial countdown values correctly", () => {
    render(<CountdownTimer hoursInitial={8} />)
    
    // Default initial hours: 08, min: 00, sec: 00
    expect(screen.getByText("08")).toBeInTheDocument()
    expect(screen.getByText("00")).toBeInTheDocument()
  })

  it("decrements time left every second", () => {
    render(<CountdownTimer hoursInitial={1} />)
    
    // Majukan waktu 1 detik
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    // Menit & detik terhitung mundur
    expect(screen.getByText("00")).toBeInTheDocument() // Jam berkurang ke 00
    expect(screen.getByText("59")).toBeInTheDocument() // Menit menjadi 59
  })
})
```

---

## 4. Panduan Uji Manual & Kelayakan Visual
1.  **Validasi Gambar Pihak Ketiga (Unsplash)**: Buka konsol pengembang (F12) dan pastikan tidak ada peringatan kesalahan *NextJS Image Optimization Error* (semua gambar model terkompresi dengan baik).
2.  **Verifikasi Integrasi Toast**: Klik tombol beli pada `ProductCard` di baris terbawah halaman utama, pastikan toast notifikasi pop-up muncul di tengah atas layar dengan pesan yang sesuai, dan angka badge di Navbar langsung bertambah.
3.  **Simulasi Kosong (Zero State)**: Hapus isi database produk sementara, pastikan bagian grid menampilkan teks fallback *"Tidak ada produk unggulan saat ini"* secara elegan.

---

## 5. Laporan Hasil Eksekusi Terakhir (Test Run Report)

Seluruh test suite backend (database queries untuk produk & kategori yang melandasi Fase 4) telah berhasil dijalankan menggunakan Vitest:

```text
 RUN  v4.1.10 /Users/lutfisulthon/Developer/Github/webtokobaju

 ✓ __tests__/backend.test.ts (9 tests) 448ms
   ✓ Product & Category Queries
     ✓ should retrieve categories from database
     ✓ should retrieve products list with pagination and filters
     ✓ should retrieve a single product by slug with its variants and reviews

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  17:44:13
   Duration  753ms
```

> **Kesimpulan**: Logika backend data fetching untuk query produk dan kategori yang melandasi halaman utama UrbanWear telah diverifikasi secara penuh dan berjalan sukses 100% di database lokal.
