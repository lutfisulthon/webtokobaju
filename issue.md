# Issue: Fase 2 - Pengembangan Database & Backend Foundation (UrbanWear)

## Deskripsi
Fokus pada fase ini adalah merancang skema database E-Commerce menggunakan Prisma ORM, melakukan migrasi ke PostgreSQL, membuat *seed data* (data dummy awal), serta membangun *Server Actions* atau *API Routes* dasar untuk mendukung fitur-fitur frontend (seperti menampilkan katalog produk dan membuat pesanan).

## Spesifikasi Teknologi
- Database: PostgreSQL
- ORM: Prisma
- Backend Logic: Next.js Server Actions (direkomendasikan) atau API Routes (`app/api/...`)
- Bahasa: TypeScript

## Tugas (Tasks)
- [ ] Rancang skema database di `prisma/schema.prisma` yang mencakup entitas berikut (dengan relasi yang tepat):
  - **User**: Pelanggan & Admin
  - **Category**: Kategori pakaian (misal: Kaos, Kemeja)
  - **Product**: Data utama produk (Nama, Deskripsi, Harga Dasar, Status Aktif)
  - **ProductVariant**: Varian produk (Ukuran, Warna, Stok, SKU)
  - **Order** & **OrderItem**: Transaksi pesanan (Total, Status Pembayaran, Metode Pembayaran [QRIS/VA], URL Pembayaran, Transaction ID)
  - **PaymentWebhook**: Opsi tabel untuk melacak log status webhoook/callback dari Payment Gateway.
  - **Review**: Ulasan dari pengguna terhadap produk
  - **Wishlist**: Produk yang disimpan oleh pengguna
- [ ] Jalankan migrasi database pertama (`npx prisma migrate dev`) ke instance PostgreSQL untuk menerapkan skema.
- [ ] Buat *seed script* (`prisma/seed.ts`) yang mengisi tabel **Category** dan **Product** dengan beberapa data *dummy* awal yang merepresentasikan katalog busana (minimal 10 produk dari beberapa kategori).
- [ ] Buat *Server Actions* (misalnya di folder `app/actions/` atau `lib/actions/`) untuk fungsi-fungsi inti:
  - Mengambil daftar kategori (`getCategories`).
  - Mengambil daftar produk dengan filter/sortir dasar (`getProducts`).
  - Mengambil detail produk beserta variannya (`getProductBySlug` atau `getProductById`).
  - Membuat pesanan/order baru dan meminta Token/URL Pembayaran ke Payment Gateway (misal Midtrans/Xendit) (`createOrder`).
- [ ] Buat API Route (contoh: `app/api/payment/webhook/route.ts`) untuk menerima *callback/notification* otomatis dari Payment Gateway (untuk mengubah status Order menjadi `Paid` atau `Failed`).

## Kriteria Penerimaan (Acceptance Criteria)
- `prisma/schema.prisma` bebas dari error validasi dan relasi antar tabel (seperti `Product` ke `Category` atau `Order` ke `User`) terhubung dengan benar.
- *Database* PostgreSQL berhasil terhubung dan tabel-tabel tercipta setelah perintah migrasi.
- *Seed script* dapat dijalankan dengan `npx prisma db seed` dan berhasil mengisi database tanpa *error*.
- Fungsi *Server Actions* dasar (*Read* produk/kategori) sudah dapat dipanggil dan mengembalikan data dengan tipe (TypeScript interface) yang jelas sesuai skema Prisma.
- Struktur *codebase* tetap rapi dan siap digunakan oleh Frontend Developer di Fase 3.
