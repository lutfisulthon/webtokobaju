# Dokumentasi & Strategi Pengujian UI: Fase 3 (UI Inti & Layout - Frontend)

Dokumen ini mencatat rencana pengujian unit (*Unit Testing*) dan pengujian integrasi antarmuka (*UI/UX Testing*) untuk memverifikasi fungsionalitas komponen global, tata letak, aksesibilitas, manajemen tema, serta integrasi state management Zustand pada Fase 3.

---

## 1. Prasyarat & Lingkungan Pengujian

Pengujian komponen UI disarankan menggunakan kombinasi teknologi berikut:
- **Test Runner**: Vitest (yang sudah dikonfigurasi pada proyek)
- **Environment**: `jsdom` (untuk menyimulasikan DOM browser di Node.js)
- **Library**: `@testing-library/react` dan `@testing-library/jest-dom`
- **Mocks**: Mocking terhadap `next/navigation` (`usePathname`, `useRouter`) dan `localStorage` (untuk persistensi Zustand).

---

## 2. Rincian Kasus Pengujian (Test Cases)

### A. Manajemen Tema (`ThemeToggle` & `ThemeProvider`)
*   **Test Case 1: Inisialisasi Tema Default**
    *   *Deskripsi*: Memastikan aplikasi membaca preferensi sistem pengguna (*system theme*) atau menggunakan tema default (*light/dark*) saat pertama kali dimuat.
    *   *Assertion*: Elemen `<html>` memiliki kelas `light` atau `dark` yang sesuai setelah mounted.
*   **Test Case 2: Pergantian Tema Dinamis**
    *   *Deskripsi*: Menguji interaksi tombol `ThemeToggle` ketika diklik.
    *   *Assertion*: Klik pertama mengubah tema dari `light` ke `dark` (atau sebaliknya), merubah kelas pada tag `<html>`, dan menyimpan status tema ke `localStorage`.

### B. Navbar Responsif & Keamanan Navigasi
*   **Test Case 3: Navigasi Desktop**
    *   *Deskripsi*: Memastikan seluruh tautan navigasi utama (Beranda, Shop, Pria, Wanita) tampil di layar desktop dan menunjuk ke URL yang benar.
    *   *Assertion*: Elemen `<nav>` desktop terlihat, dan menu aktif mendapatkan tanda visual (garis bawah/akses warna).
*   **Test Case 4: Hamburger Menu & Mobile Drawer**
    *   *Deskripsi*: Memastikan menu hamburger muncul di layar ukuran seluler (`viewport: 320px`) dan menyembunyikan navigasi utama di balik tombol.
    *   *Assertion*: Menekan tombol Hamburger memicu perubahan state (`isOpen: true`), merender drawer navigasi mobile, dan tombol penutup (X) dapat menutup drawer kembali.
*   **Test Case 5: Pencarian Produk (Search Bar)**
    *   *Deskripsi*: Menguji pengiriman kata kunci pencarian dari kolom input pencarian.
    *   *Assertion*: Mengisi kolom pencarian dan menekan Enter akan memanggil fungsi router `push` menuju `/shop?search=kata_kunci`.

### C. Zustand State Badges (Cart & Wishlist)
*   **Test Case 6: Indikator Keranjang Belanja (Cart Count)**
    *   *Deskripsi*: Memastikan Navbar secara dinamis merender jumlah kuantitas total item di keranjang belanja.
    *   *Assertion*: Saat `useCartStore` memiliki 3 barang (misal: 2 Kaos, 1 Kemeja), badge di atas ikon keranjang harus merender teks `"3"`. Jika kosong, badge tidak boleh ditampilkan.
*   **Test Case 7: Indikator Daftar Keinginan (Wishlist Count)**
    *   *Deskripsi*: Memastikan lencana daftar keinginan menampilkan data secara akurat.
    *   *Assertion*: Saat `useWishlistStore` berisi 2 produk, badge di atas ikon hati harus menampilkan angka `"2"`.

### D. Komponen Desain Sistem Reusable (`Button` & `Input`)
*   **Test Case 8: Button Varian & Status Loading**
    *   *Deskripsi*: Menguji properti khusus komponen `Button`.
    *   *Assertion*:
        1.  Menerapkan varian `outline` menghasilkan kelas CSS yang benar.
        2.  Mengaktifkan `loading={true}` merender ikon animasi spinner (`.animate-spin`) dan menonaktifkan tombol secara otomatis (`disabled={true}`).
*   **Test Case 9: Input Aksesibilitas & Validasi Error**
    *   *Deskripsi*: Menguji kepatuhan komponen `Input` terhadap standar aksesibilitas WCAG.
    *   *Assertion*:
        1.  Atribut `id` pada elemen input terasosiasi dengan benar ke tag `<label htmlFor="...">`.
        2.  Ketika terdapat pesan error, input memiliki atribut `aria-invalid="true"` dan `aria-describedby` mengarah ke elemen pesan error yang sesuai.

### E. Footer & Newsletter
*   **Test Case 10: Form Berlangganan Newsletter**
    *   *Deskripsi*: Mensimulasikan pendaftaran email newsletter di Footer.
    *   *Assertion*: Memasukkan email valid dan menekan tombol kirim akan memicu notifikasi sukses (toast) dan mengosongkan kolom input kembali.

---

## 3. Contoh Implementasi Kode Test (Vitest + React Testing Library)

Berikut contoh kerangka kode pengujian untuk komponen `Button` (`components/ui/button.test.tsx`):

```tsx
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { Button } from "./button"

describe("Button Component", () => {
  it("renders children correctly", () => {
    render(<Button>Click Me</Button>)
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument()
  })

  it("disables button and shows spinner when loading", () => {
    render(<Button loading>Submit</Button>)
    const buttonEl = screen.getByRole("button")
    
    expect(buttonEl).toBeDisabled()
    expect(buttonEl.querySelector(".animate-spin")).toBeInTheDocument()
  })
})
```

---

## 4. Panduan Verifikasi Manual

Bagi pengembang yang melakukan pengujian langsung di layar (Manual QA):
1.  **Uji Responsif**: Buka Chrome DevTools (`F12`), pilih mode simulasi perangkat, dan pastikan layout aman di lebar `320px` (iPhone SE) hingga desktop ultra-lebar tanpa mengalami *horizontal scrolling*.
2.  **Uji Keyboard Tab**: Tekan tombol `Tab` berulang kali untuk memastikan indikator fokus visual melompat secara logis dari Navbar -> Input Search -> Tombol Cart -> Tautan Menu -> Konten Utama -> Footer.
3.  **Uji Kontras**: Gunakan ekstensi aksesibilitas (seperti *Axe DevTools* atau *Lighthouse*) untuk memastikan rasio kontras teks terhadap latar belakang di light/dark mode tetap di atas standar `4.5:1`.
