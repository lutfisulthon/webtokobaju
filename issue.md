# Issue: Fase 2 - Pengembangan Database & Backend Foundation (UrbanWear)

## Deskripsi
Fokus pada fase ini adalah merancang skema database E-Commerce *enterprise-grade* menggunakan Prisma ORM, melakukan migrasi ke PostgreSQL, membuat *seed data* awal, serta membangun *Server Actions* / *API Routes* untuk fungsionalitas inti (katalog, order, pembayaran, manajemen stok, dan auth).

## Spesifikasi Teknologi
- Database: PostgreSQL
- ORM: Prisma
- Backend Logic: Next.js Server Actions & API Routes (`app/api/...`)
- Autentikasi: NextAuth.js / Auth.js (Persiapan Skema Adapter)
- Media Storage: Integrasi API/Action untuk Upload Gambar (misal Vercel Blob / Cloudinary)
- Bahasa: TypeScript

## Tugas (Tasks)
- [x] Rancang skema database di `prisma/schema.prisma` yang mencakup entitas berikut (dengan relasi, index, dan optimasi yang tepat):
  - **User**: Pelanggan & Admin (tambahkan enum `Role` [ADMIN, CUSTOMER], kolom penanda NextAuth adapter, dan fitur *Soft Delete* `deletedAt`).
  - **Category**: Kategori pakaian (tambahkan index pada slug).
  - **Product**: Data utama produk (Nama, Deskripsi, Harga, Status Aktif, fitur *Soft Delete* `deletedAt`, dan index pada slug).
  - **ProductVariant**: Varian produk (Ukuran, Warna, Stok, SKU).
  - **Promo / Voucher**: Manajemen kode diskon (Kode, Persentase Diskon, Max Diskon, Kuota Penggunaan, Validitas Waktu).
  - **Order** & **OrderItem**: Transaksi pesanan (Total, Status Pembayaran, Metode Pembayaran [QRIS/VA], URL Pembayaran, Transaction ID, Webhook Log, **Kurir Pengiriman**, **Ongkos Kirim**, dan **Nomor Resi/Tracking**).
  - **Review** & **Wishlist**: Ulasan produk dan keranjang simpanan pengguna.
- [x] Jalankan migrasi database pertama (`npx prisma migrate dev` / `npx prisma db push`) ke instance PostgreSQL.
- [x] Buat *seed script* (`prisma/seed.ts`) yang mengisi tabel **Category**, **Product**, dan **Promo** dengan data *dummy* awal (minimal 10 produk).
- [x] Buat *Server Actions* (misalnya di folder `app/actions/`) untuk fungsi inti:
  - `getCategories` & `getProducts` (beserta filter/pencarian dan pagination).
  - `getProductBySlug` untuk halaman detail produk.
  - `createOrder`: Membuat pesanan baru, memvalidasi kuota/diskon *Voucher*, dan meminta URL Pembayaran ke Payment Gateway.
  - **Stok**: Implementasikan pengurangan stok menggunakan **Prisma Atomic Updates** (`decrement`) atau *Transactions* saat status pembayaran sukses, untuk mencegah *race conditions / overselling*.
  - `revalidatePath` / `revalidateTag`: Menghapus cache frontend saat Admin melakukan CRUD produk.
- [x] Buat API Route (`app/api/payment/webhook/route.ts`) untuk menerima *callback* otomatis dari Payment Gateway dan memicu pengurangan stok yang aman.
- [x] Buat fungsi Server Action / API untuk *image upload* produk (misal integrasi Vercel Blob / S3).

## Kriteria Penerimaan (Acceptance Criteria)
- Skema Prisma bebas error, memiliki relasi tabel yang benar, fitur *Soft Delete*, dan menggunakan *index* untuk kolom pencarian/filter.
- Migrasi database berhasil dan *seed script* dapat dijalankan tanpa kendala (`npx prisma db seed`).
- Backend logic untuk konfirmasi pembayaran menggunakan *Atomic Updates* / *Database Transaction* untuk mencegah bentrok stok barang (stok tidak boleh minus).
- *Server Actions* dasar dapat dipanggil dengan tipe data (TypeScript) yang jelas (fully typed).
- Kerangka backend kokoh dan aman (mencegah terhapusnya riwayat pesanan jika produk di-soft-delete).
