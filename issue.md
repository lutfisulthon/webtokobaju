# Issue: Fase 1 - Inisialisasi & Konfigurasi Proyek E-Commerce (UrbanWear)

## Deskripsi
Lakukan inisialisasi awal proyek Next.js dan konfigurasi *dependencies* utama untuk platform e-commerce UrbanWear. Tugas ini berfokus pada pengaturan kerangka kerja dasar sebelum masuk ke pembuatan halaman atau skema database yang kompleks.

## Spesifikasi Teknologi
- Framework: Next.js (App Router)
- Bahasa: TypeScript
- Styling: Tailwind CSS
- Database & ORM: PostgreSQL + Prisma ORM
- UI Components: Shadcn UI
- State Management: Zustand

## Tugas (Tasks)
- [ ] Inisialisasi proyek Next.js baru dengan mengaktifkan App Router, TypeScript, ESLint, dan Tailwind CSS.
- [ ] Konfigurasikan tema Tailwind (`tailwind.config.ts` atau ekivalennya) sesuai panduan desain:
  - Warna utama: Putih (`#FFFFFF`), Hitam (`#111111`), Abu muda (`#F5F5F5`).
  - Warna aksen: Orange (`#FF6B35`) atau Emerald (`#10B981`).
  - Tipografi modern (Inter, Poppins, atau Manrope).
- [ ] Instal dan inisialisasi Prisma ORM, serta siapkan koneksi awal ke PostgreSQL (melalui `.env`).
- [ ] Setup Shadcn UI dan instal komponen-komponen antarmuka dasar (contoh: Button, Card, Input, Dialog, Toast, Skeleton).
- [ ] Setup arsitektur Zustand untuk manajemen *state global* dasar (siapkan *store* awal untuk Cart dan Wishlist).

## Kriteria Penerimaan (Acceptance Criteria)
- Proyek berhasil berjalan secara lokal (`npm run dev` / `yarn dev`) tanpa *error*.
- Tema warna dan *font* Tailwind berhasil diterapkan dan dapat digunakan di *class*.
- Prisma berhasil diinisialisasi dan siap untuk membuat migrasi pertama (koneksi database tidak memunculkan *error* saat *generate*).
- Komponen Shadcn UI terkonfigurasi dengan benar (struktur folder komponen dan `components.json` valid).
- Kerangka proyek bersih dan terstruktur untuk melanjutkan pengembangan ke Fase 2.
