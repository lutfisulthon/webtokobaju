# Dokumentasi & Strategi Pengujian UI: Fase 5 (Shop & Detail Produk)

Dokumen ini mencatat rencana pengujian unit (*Unit Testing*) dan pengujian integrasi antarmuka (*UI Testing*) untuk memverifikasi Halaman Katalog/Shop (`app/shop/page.tsx`) dan Halaman Detail Produk (`app/shop/[slug]/page.tsx`).

---

## 1. Rencana Pengujian (Test Cases)

### A. Halaman Katalog / Shop (`app/shop/page.tsx`)
*   **Test Case 1: Pemuatan Data dengan Filter URL**
    *   *Deskripsi*: Menguji apakah memuat halaman dengan query parameter kategori mengembalikan data produk yang relevan.
    *   *Assertion*: Membuka `/shop?category=kemeja` mengembalikan produk yang memiliki `category.slug === 'kemeja'`.
*   **Test Case 2: Filter Rentang Harga**
    *   *Deskripsi*: Menguji filter rentang harga minimum dan maksimum.
    *   *Assertion*: Produk yang ditampilkan harus berada di rentang harga yang diinput (misal: `price >= minPrice` dan `price <= maxPrice`).
*   **Test Case 3: Pengurutan Produk (Sorting)**
    *   *Deskripsi*: Menguji dropdown pengurutan harga.
    *   *Assertion*: Memilih `Harga: Rendah ke Tinggi` mengembalikan produk dengan urutan harga menanjak (`price` terkecil di indeks pertama).
*   **Test Case 4: Status Kosong (Empty State)**
    *   *Deskripsi*: Menguji penampilan layout jika filter yang diberikan tidak mencocokkan produk apa pun.
    *   *Assertion*: Menampilkan ikon `PackageX` dan pesan *"Produk Tidak Ditemukan"*.

### B. Halaman Detail Produk (`app/shop/[slug]/page.tsx`)
*   **Test Case 5: SEO Dynamic Metadata**
    *   *Deskripsi*: Memastikan metadata terisi secara dinamis sesuai detail produk.
    *   *Assertion*: Objek `<head>` memuat `<title>` berformat `Nama Produk | UrbanWear Premium`.
*   **Test Case 6: Pemilihan Warna dan Ukuran Varian**
    *   *Deskripsi*: Menguji apakah varian warna dan ukuran sinkron dengan stok.
    *   *Assertion*: Memilih varian yang kehabisan stok menonaktifkan tombol "Tambah ke Keranjang" dan menampilkan label *"Stok Habis"*.
*   **Test Case 7: Galeri Thumbnail**
    *   *Deskripsi*: Menguji interaktivitas klik thumbnail gambar.
    *   *Assertion*: Klik pada thumbnail memperbarui gambar utama yang ditampilkan.
*   **Test Case 8: Integrasi Cart Zustand**
    *   *Deskripsi*: Menguji tombol "Tambah ke Keranjang" di halaman detail.
    *   *Assertion*: Menambahkan produk dengan kuantitas `2` memperbarui total item di Zustand store sebanyak `+2` dan memunculkan toast notifikasi sukses.

---

## 2. Contoh Implementasi Kode Test (Product Details Varian)

Berikut adalah kerangka pengujian unit untuk penanganan varian produk (`components/product-details-client.test.tsx`):

```tsx
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { ProductDetailsClient } from "./product-details-client"

const mockProduct = {
  id: "prod-1",
  name: "Kemeja Premium",
  slug: "kemeja-premium",
  description: "Bahan katun dingin",
  price: 200000,
  discountPrice: null,
  image: "/img1.jpg",
  images: ["/img2.jpg"],
  category: { name: "Kemeja", slug: "kemeja" },
  variants: [
    { id: "v1", sku: "K-M-W", size: "M", color: "Putih", stock: 5 },
    { id: "v2", sku: "K-L-W", size: "L", color: "Putih", stock: 0 }, // Out of stock
  ],
}

describe("ProductDetailsClient", () => {
  it("renders product info and variant selections correctly", () => {
    render(<ProductDetailsClient product={mockProduct} />)
    
    expect(screen.getByText("Kemeja Premium")).toBeInTheDocument()
    expect(screen.getByText("Putih")).toBeInTheDocument()
  })

  it("disables out of stock variants", () => {
    render(<ProductDetailsClient product={mockProduct} />)
    
    // Pilih ukuran L yang stoknya 0
    const buttonL = screen.getByText("L")
    expect(buttonL).toBeDisabled()
  })
})
```

---

## 3. Laporan Hasil Eksekusi Terakhir (Test Run Report)

Pengujian integrasi dan unit backend untuk data fetching dan query detail produk (`getProductBySlug` & `getProducts` dengan filter) dijalankan menggunakan Vitest dan lulus 100%:

```text
 RUN  v4.1.10 /Users/lutfisulthon/Developer/Github/webtokobaju

 ✓ __tests__/backend.test.ts (9 tests) 496ms
   ✓ Product & Category Queries
     ✓ should retrieve categories from database
     ✓ should retrieve products list with pagination and filters
     ✓ should retrieve a single product by slug with its variants and reviews

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  18:04:42
   Duration  805ms
```

> **Kesimpulan**: Seluruh query pencarian, pemfilteran dinamis, navigasi pagination, dan penarikan varian produk detail yang menyokong alur Halaman Shop & Detail Produk (Fase 5) telah lolos pengujian secara aman dan berintegritas tinggi.
