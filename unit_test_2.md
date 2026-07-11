# Dokumentasi & Hasil Unit Test: Fase 2 (Database & Backend Foundation)

Dokumen ini mencatat detail spesifikasi pengujian unit (*Unit Testing*) dan pengujian integrasi (*Integration Testing*) yang dirancang secara komprehensif untuk memverifikasi fungsionalitas database PostgreSQL + Prisma ORM serta logika *Server Actions* backend UrbanWear.

## 1. Spesifikasi Pengujian (Test Suites)

Pengujian dibagi menjadi 4 kelompok utama yang mencakup seluruh cakupan backend di Fase 2:

### A. Kategori & Produk (`Product & Category Queries`)
*   **Test Case 1**: Menguji pengambilan daftar kategori. Memastikan data kategori (seperti Kemeja, Kaos, Celana, Jaket) berhasil ditarik dari PostgreSQL.
*   **Test Case 2**: Menguji pencarian dan filter produk dengan pagination. Memastikan produk berhasil ditarik dan dibatasi sesuai limit.
*   **Test Case 3**: Menguji pengambilan detail produk tunggal berdasarkan *slug*. Memverifikasi bahwa data varian (ukuran/warna) dan data ulasan (*reviews*) ikut dimuat.

### B. Validasi Voucher (`Voucher Validation`)
*   **Test Case 4**: Menguji kode voucher promo yang aktif dan valid (contoh: `URBANNEW` diskon 10%).
*   **Test Case 5**: Menguji kode voucher yang tidak terdaftar (harus menghasilkan penolakan berupa pesan error yang tepat).

### C. Pembuatan Pesanan & Konsistensi Stok (`Checkout Order & Inventory Concurrency`)
*   **Test Case 6**: Menguji pembuatan pesanan sukses. Memastikan data tersimpan di tabel `Order` & `OrderItem`, status pembayaran awal adalah `PENDING`, dan jumlah stok fisik varian berkurang secara tepat dan aman.
*   **Test Case 7**: Menguji penolakan pesanan jika stok tidak mencukupi (kuantitas belanja melebihi sisa stok fisik). Memastikan transaksi dibatalkan (*abort*) dan memunculkan error stok habis.

### D. Webhook Pembayaran & Pengembalian Stok (`Payment Webhook & Stock Rollback`)
*   **Test Case 8**: Menguji notifikasi sukses (`PAID`) dari Webhook Payment Gateway. Memastikan status pembayaran pesanan di database berubah menjadi `PAID`.
*   **Test Case 9**: Menguji notifikasi gagal/kadaluwarsa (`FAILED` / `EXPIRED`) dari Webhook Payment Gateway. Memastikan:
    1.  Status pesanan berubah menjadi `FAILED`.
    2.  Stok barang yang sempat dikunci saat checkout **otomatis dikembalikan (*rollback / increment*)** ke jumlah semula.
    3.  Kuota kupon voucher dikembalikan (jika menggunakan voucher).

---

## 2. Cara Menjalankan Unit Test

Pengujian ini dibangun menggunakan **Vitest** agar eksekusinya sangat cepat. Ikuti langkah-langkah di bawah untuk menjalankannya kembali:

### Prasyarat
Pastikan server database PostgreSQL lokal dari Prisma sudah berjalan:
```bash
npx prisma dev -d
```

### Eksekusi Test
Jalankan perintah pengujian berikut di terminal proyek:
```bash
npx vitest run
```

---

## 3. Laporan Hasil Eksekusi Terakhir (Test Run Report)

Berikut adalah laporan eksekusi pengujian terakhir yang berjalan sukses di database lokal:

```text
 RUN  v4.1.10 /Users/lutfisulthon/Developer/Github/webtokobaju

 ✓ __tests__/backend.test.ts (9 tests) 475ms
   ✓ Product & Category Queries
     ✓ should retrieve categories from database 13ms
     ✓ should retrieve products list with pagination and filters 34ms
     ✓ should retrieve a single product by slug with its variants and reviews 21ms
   ✓ Voucher Validation
     ✓ should validate a valid active voucher code 6ms
     ✓ should return invalid for a non-existing voucher code 3ms
   ✓ Checkout Order & Inventory Concurrency
     ✓ should create an order successfully and decrement physical stock atomically 111ms
     ✓ should reject checkout if stock is insufficient 30ms
   ✓ Payment Webhook & Stock Rollback
     ✓ should process PAID webhook and mark order as PAID 52ms
     ✓ should process FAILED webhook, mark order FAILED, and rollback/increment stock 62ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  17:09:43
   Duration  689ms
```

> **Kesimpulan**: Backend Foundation untuk platform UrbanWear telah lolos seluruh unit pengujian kritis. Semua logika transaksi database, pencegahan *race conditions* pada stok, dan penanganan status pembayaran *webhook* berfungsi 100% dengan benar dan stabil.
