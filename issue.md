# Issue: Fase 2 - Pengembangan Database & Backend Foundation (UrbanWear)

## Deskripsi
Fokus pada fase ini adalah merancang skema database E-Commerce menggunakan Prisma ORM, melakukan migrasi ke PostgreSQL, membuat *seed data* (data dummy awal), serta membangun *Server Actions* atau *API Routes* dasar untuk mendukung fitur-fitur frontend (seperti katalog produk, autentikasi user, penanganan unggahan media, dan alur integrasi pembayaran otomatis).

## Spesifikasi Teknologi
- Database: PostgreSQL
- ORM: Prisma
- Backend Logic: Next.js Server Actions & API Routes (`app/api/...`)
- Autentikasi: NextAuth.js / Auth.js (Persiapan Skema Adapter)
- Media Storage: Integrasi API/Action untuk Upload Gambar (misal Vercel Blob / Cloudinary)
- Bahasa: TypeScript

## Tugas (Tasks)
- [ ] Rancang skema database di `prisma/schema.prisma` yang mencakup entitas berikut (dengan relasi dan index yang tepat):
  - **User**: Pelanggan & Admin (tambahkan enum `Role` dan kolom penanda NextAuth adapter seperti `Account`, `Session`, dst).
  - **Category**: Kategori pakaian (tambahkan index pada kolom nama/slug).
  - **Product**: Data utama produk (Nama, Deskripsi, Harga Dasar, Status Aktif, tambahkan index pada slug).
  - **ProductVariant**: Varian produk (Ukuran, Warna, Stok, SKU).
  - **Order** & **OrderItem**: Transaksi pesanan (Total, Status Pembayaran, Metode Pembayaran [QRIS/VA], URL Pembayaran, Transaction ID, Webhook Log).
  - **Review**: Ulasan dari pengguna terhadap produk.
  - **Wishlist**: Produk yang disimpan oleh pengguna.
- [ ] Jalankan migrasi database pertama (`npx prisma migrate dev`) ke instance PostgreSQL untuk menerapkan skema.
- [ ] Buat *seed script* (`prisma/seed.ts`) yang mengisi tabel **Category** dan **Product** dengan data *dummy* awal katalog busana (minimal 10 produk dari beberapa kategori).
- [ ] Buat *Server Actions* (misalnya di folder `app/actions/` atau `lib/actions/`) untuk fungsi-fungsi inti:
  - Mengambil daftar kategori (`getCategories`).
  - Mengambil daftar produk dengan filter/sortir/pencarian (`getProducts`).
  - Mengambil detail produk beserta variannya (`getProductBySlug` atau `getProductById`).
  - Membuat pesanan/order baru dan meminta Token/URL Pembayaran ke Payment Gateway (misal Midtrans/Xendit) (`createOrder`).
  - Menghapus/mengubah cache data produk pada frontend (`revalidatePath` / `revalidateTag`) saat admin melakukan perubahan data produk.
- [ ] Buat API Route (contoh: `app/api/payment/webhook/route.ts`) untuk menerima *callback/notification* otomatis dari Payment Gateway (untuk mengubah status Order menjadi `Paid` atau `Failed`).
- [ ] Buat fungsi Server Action atau API Route untuk penanganan upload gambar produk (misal `/api/upload` atau integrasi Vercel Blob) untuk digunakan oleh admin dashboard nantinya.

## Kriteria Penerimaan (Acceptance Criteria)
- Skema Prisma bebas dari error validasi, dan relasi antar tabel (seperti `Product` ke `Category` atau `Order` ke `User`) terhubung dengan benar.
- Kolom pencarian kritis (seperti `slug` produk) terindeks (`@@index` atau `@unique`) di tingkat database.
- *Database* PostgreSQL berhasil terhubung dan tabel-tabel tercipta setelah perintah migrasi.
- *Seed script* dapat dijalankan dengan `npx prisma db seed` dan berhasil mengisi database tanpa *error*.
- Fungsi *Server Actions* dasar (*Read* produk/kategori) sudah dapat dipanggil dan mengembalikan data dengan tipe (TypeScript interface) yang jelas sesuai skema Prisma.
- Struktur *codebase* tetap rapi dan siap digunakan oleh Frontend Developer di Fase 3.
