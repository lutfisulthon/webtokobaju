# Fase 7: Admin Dashboard

## Tujuan
Membangun antarmuka Admin Dashboard yang tertutup (aman), fungsional, dan responsif. Dashboard ini akan digunakan oleh pemilik toko atau staf untuk mengelola operasional e-commerce secara menyeluruh, mulai dari inventaris produk hingga pelacakan pesanan.

## Ruang Lingkup Pekerjaan (Scope of Work)

### 1. Struktur Layout Admin & Keamanan
- **Layout & Navigasi**: Buat layout khusus (`app/admin/layout.tsx`) dengan *Sidebar* navigasi yang intuitif. Menu minimal mencakup: Dashboard, Produk, Kategori, Pesanan, dan Pelanggan.
- **Proteksi Rute**: Implementasikan *middleware* atau pengecekan otorisasi untuk memastikan seluruh *path* `/admin/*` hanya bisa diakses oleh akun dengan *role* Admin.

### 2. Dashboard Overview (Ringkasan Statistik)
- **Summary Cards**: Tampilkan metrik kunci operasi, seperti Total Pendapatan, Jumlah Pesanan Baru/Aktif, Total Produk, dan Jumlah Pelanggan terdaftar.
- **Grafik Penjualan**: Buat grafik visual (misalnya menggunakan *Recharts*) untuk menampilkan tren penjualan atau pemesanan selama kurun waktu tertentu.

### 3. Manajemen Produk (CRUD Ekstensif)
- **Tabel Produk**: Halaman yang menampilkan seluruh produk dengan fitur pencarian dan paginasi.
- **Form Produk**: Fungsionalitas Tambah (Create) dan Edit (Update) produk yang mencakup:
  - Informasi dasar: Nama, Deskripsi, Harga Normal/Diskon, Status visibilitas.
  - Varian Produk: Manajemen ukuran, warna, dan stok per-sku.
  - Gambar: Mekanisme untuk mengunggah (upload) gambar produk.

### 4. Manajemen Pesanan
- **Daftar Order**: Tampilkan tabel semua pesanan yang masuk beserta informasi singkat pelanggan, tanggal pesanan, dan status.
- **Detail & Pembaruan Status**:
  - Halaman detail untuk melihat barang apa saja yang dibeli, total harga, alamat pengiriman, dan ongkos kirim.
  - Fitur bagi admin untuk **memperbarui status pengiriman** pesanan (misal: dari "Pending" menjadi "Diproses", "Dikirim", dsb) serta menginput nomor resi pelacakan (*tracking number*).

### 5. Manajemen Kategori & Pelanggan
- **Kategori**: Fungsionalitas CRUD standar untuk menambah, mengubah, atau menghapus kategori pakaian.
- **Daftar Pelanggan**: Tabel *read-only* untuk melihat pengguna (user) yang mendaftar di situs beserta informasi kontak dan riwayat aktivitas dasar mereka.

## Kriteria Penerimaan (Acceptance Criteria)
1. **Keamanan Akses**: User tanpa *role* Admin atau *guest* otomatis di-*redirect* jika mencoba mengakses halaman dashboard.
2. **Fungsionalitas CRUD**: Penambahan, pengeditan, atau penghapusan data pada modul Produk dan Kategori berjalan lancar dan terhubung langsung ke database PostgreSQL (via Prisma).
3. **Pembaruan Pesanan**: Perubahan status order oleh Admin berhasil tersimpan di database dan secara logis siap direfleksikan di halaman profil pembeli (User).
4. **UI/UX Konsisten**: Tampilan tabel dan form (Shadcn UI) terlihat profesional, bersih, interaktif (tersedia indikator loading/toast notifikasi), serta konsisten dengan *design system* aplikasi.

## Catatan Pendekatan Implementasi
- Dokumen ini bersifat **high-level**. Keputusan *low-level* (struktur penamaan folder *components*, pembagian file hooks) diserahkan kepada programmer/model yang bertugas.
- Sangat disarankan untuk mengekstrak form dan tabel ke komponen terpisah agar file tidak terlalu panjang (modular).
- Untuk manipulasi data (*create/update/delete*), manfaatkan Next.js **Server Actions**.
