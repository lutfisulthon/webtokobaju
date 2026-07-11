# Fase 6: Alur Keranjang & Checkout

## Tujuan
Membangun pengalaman keranjang belanja (shopping cart) dan proses checkout yang mulus, responsif, dan aman. Fase ini bertujuan untuk mengubah produk yang dipilih pengguna menjadi sebuah pesanan (order) yang tercatat di sistem.

## Ruang Lingkup Pekerjaan (Scope of Work)

### 1. Halaman Keranjang Belanja (Shopping Cart)
- **Lokasi File Utama**: `app/cart/page.tsx`
- **Fitur yang Dibutuhkan**:
  - Menampilkan daftar produk yang telah ditambahkan ke keranjang (Gambar, Nama Produk, Varian/Ukuran/Warna, Harga, dan Kuantitas).
  - Kontrol kuantitas produk (tombol tambah, kurang, hapus item).
  - Ringkasan belanja yang menampilkan Subtotal, estimasi diskon/pajak, dan Total Akhir.
  - Field input untuk memasukkan kode voucher promosi (diskon).
- **State Management**:
  - Mengambil dan mengelola data keranjang dari *global state* (Zustand) yang tersinkronisasi dengan `localStorage` agar data tidak hilang saat halaman di-refresh.

### 2. Halaman Checkout
- **Lokasi File Utama**: `app/checkout/page.tsx`
- **Fitur yang Dibutuhkan**:
  - **Form Data Pembeli**: Nama lengkap, email, dan nomor telepon genggam.
  - **Form Alamat Pengiriman**: Alamat lengkap, kota, provinsi, dan kode pos.
  - **Pemilihan Kurir & Ongkos Kirim (Solusi UMKM)**: Sistem menggunakan integrasi API pihak ketiga (seperti **RajaOngkir** atau **BiteShip**) untuk menghitung biaya ongkos kirim secara otomatis dan akurat berdasarkan kota/kecamatan asal toko dan tujuan pelanggan. Dengan cara ini, toko tidak memerlukan kerjasama resmi; pemilik toko cukup mendatangi gerai ekspedisi umum (JNE/J&T/Sicepat) menggunakan dana yang sudah dibayarkan pelanggan di keranjang.
  - **Metode Pembayaran**: Tidak perlu membuat form pilihan cara bayar manual, karena seluruh proses pemilihan pembayaran (Virtual Account, E-Wallet seperti GoPay/ShopeePay, QRIS, Kartu Kredit, dan Gerai Retail) akan ditangani secara otomatis oleh antarmuka **Midtrans Snap**.
  - **Ringkasan Pesanan Final**: Menampilkan rincian final sebelum tombol "Buat Pesanan" ditekan.
- **Validasi Data**:
  - Gunakan `react-hook-form` dipadukan dengan `zod` untuk memastikan semua field wajib diisi dengan format yang benar (misalnya format email valid).

### 3. Integrasi Backend (Pemesanan & Payment Gateway)
- **Fitur yang Dibutuhkan**:
  - Saat checkout berhasil divalidasi, sistem harus mengirim data ke backend melalui Server Actions atau API Route.
  - Sistem membuat record baru di tabel `Order` dan `OrderItem` pada database.
  - Mengintegrasikan API **Midtrans (Snap)** untuk membuat dan mengambil *Payment Token* / *Redirect URL*.
  - Mengubah status order awal menjadi "Pending Payment".
  - **Fondasi Pelacakan & Notifikasi**: Pastikan tabel `Order` menyimpan nomor telepon pelanggan (untuk notifikasi WhatsApp), dan memiliki kolom `trackingNumber` (Nomor Resi) serta `shippingStatus` (misal: *Processing, Shipped, Delivered*) yang nantinya akan diintegrasikan dengan Webhook kurir (BiteShip/RajaOngkir) dan ditampilkan di halaman Riwayat Pesanan pelanggan.

## Kriteria Penerimaan (Acceptance Criteria)
1. Pengguna dapat mengubah jumlah barang atau menghapus barang di keranjang belanja, dan subtotal/total langsung diperbarui secara *real-time*.
2. Jika keranjang kosong, halaman menampilkan status "Keranjang Kosong" dengan tombol kembali belanja.
3. Form checkout tidak dapat di-submit jika ada input wajib yang kosong atau formatnya salah (ditandai dengan pesan error warna merah).
4. Setelah menekan tombol "Buat Pesanan" dan data tervalidasi, backend Midtrans merespons dengan *Snap Token/URL*, dan pengguna diarahkan ke antarmuka pembayaran Midtrans (atau halaman konfirmasi dengan tombol bayar).
5. Data pesanan berhasil tersimpan di database dengan status "Pending Payment" yang siap diubah statusnya melalui mekanisme webhook Midtrans nantinya.
6. Desain antarmuka untuk keranjang dan checkout harus konsisten, premium, dan mudah digunakan (khususnya pada perangkat mobile).

## Catatan Tambahan untuk Implementasi
- Pastikan desain mengutamakan *trust* (kepercayaan), misalnya dengan menambahkan *trust badges* (icon pembayaran aman, jaminan pengembalian).
- Transisi dari keranjang ke checkout harus cepat dan tanpa hambatan.
- Manfaatkan komponen dari Shadcn UI (seperti Input, Select, Button, Form) untuk menjaga konsistensi dan mempercepat proses *development*.
