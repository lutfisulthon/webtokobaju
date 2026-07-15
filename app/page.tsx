import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Truck,
  ShieldCheck,
  RefreshCw,
  Headphones,
  Star,
} from "lucide-react"

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-instagram", className)}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
)

import { getProducts } from "@/lib/actions/products"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HomePopularProducts } from "@/components/home-popular-products"
import { FlashSale } from "@/components/flash-sale"
import { HeroCarousel } from "@/components/hero-carousel"

export const revalidate = 0

export default async function HomePage() {
  const { products } = await getProducts({ limit: 12, sortBy: "newest" }).catch(() => ({ products: [] }))

  // Trust Badges
  const trustBadges = [
    {
      icon: Truck,
      title: "Gratis Ongkir",
      desc: "Min. belanja Rp150.000",
    },
    {
      icon: RefreshCw,
      title: "Garansi 7 Hari",
      desc: "Produk dapat dikembalikan",
    },
    {
      icon: ShieldCheck,
      title: "Pembayaran Aman",
      desc: "100% secure payment",
    },
    {
      icon: Headphones,
      title: "Layanan CS 24/7",
      desc: "Siap membantu kapan saja",
    },
  ]

  // Main Categories
  const categories = [
    {
      name: "Pria",
      desc: "Lihat Koleksi",
      image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop&q=80",
      href: "/shop?category=pria",
    },
    {
      name: "Wanita",
      desc: "Lihat Koleksi",
      image: "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=800&auto=format&fit=crop&q=80",
      href: "/shop?category=wanita",
    },
    {
      name: "Anak-anak",
      desc: "Lihat Koleksi",
      image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&auto=format&fit=crop&q=80",
      href: "/shop?category=anak-anak",
    },
  ]

  // Testimonials
  const testimonials = [
    {
      name: "Rian Pratama",
      city: "Jakarta",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      review: "Kualitas produknya premium banget, bahan nyaman dan jahitannya rapi. Pengiriman juga cepat!",
    },
    {
      name: "Siti Rahma",
      city: "Bandung",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      review: "Desainnya modern dan stylish. Sudah belanja beberapa kali dan selalu puas!",
    },
    {
      name: "Denny Wijaya",
      city: "Surabaya",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      review: "Barang sesuai deskripsi, warna tidak mengecewakan. UrbanWear top!",
    },
  ]

  // Instagram Gallery
  const igPhotos = [
    "https://images.unsplash.com/photo-1516826957135-700ede19c6ce?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1550614000-4b95d4ebfa24?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1489987707023-af81165a2f58?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1555529669-2269763671c3?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop&q=80",
  ]

  return (
    <div className="flex flex-col w-full min-h-screen bg-white text-[#111111]">
      
      {/* ===== 1. Hero Section ===== */}
      <HeroCarousel />

      {/* ===== 2. Trust Bar ===== */}
      <section className="container mx-auto px-4 md:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-white border border-[#E5E7EB] rounded-2xl p-8">
          {trustBadges.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F8F8F8] flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-[#111111] stroke-[1.5]" />
              </div>
              <div>
                <h4 className="font-bold text-[13px] text-[#111111]">{title}</h4>
                <p className="text-[11px] text-[#6B7280] mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 3. Categories Section ===== */}
      <section className="container mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="text-center space-y-2 mb-12">
          <h2 className="font-plus-jakarta font-bold text-[28px] tracking-tight text-[#111111]">
            Belanja Berdasarkan Kategori
          </h2>
          <p className="text-[14px] text-[#6B7280]">
            Temukan koleksi pilihan terbaik dari setiap kategori.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative w-full aspect-[4/5] rounded-[24px] overflow-hidden bg-[#F8F8F8] mb-4">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="font-plus-jakarta font-bold text-[18px] text-[#111111] mb-1">{cat.name}</h3>
              <span className="text-[12px] font-bold text-[#FF6B35] flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                {cat.desc} <span className="text-lg leading-none">&rarr;</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 4. Flash Sale Section ===== */}
      <FlashSale products={products} />

      {/* ===== 5. Popular Products Section ===== */}
      <HomePopularProducts products={products} />

      {/* ===== 6. Customer Testimonials ===== */}
      <section className="container mx-auto px-4 md:px-8 py-12 md:py-16 border-t border-[#E5E7EB]">
        <div className="flex items-end justify-between gap-4 mb-10">
          <h2 className="font-plus-jakarta font-bold text-[22px] tracking-tight text-[#111111]">
            Ulasan Pelanggan
          </h2>
          <Link
            href="/reviews"
            className="text-[13px] font-bold text-[#FF6B35] hover:text-[#FF6B35]/80 flex items-center gap-1.5 transition-colors"
          >
            Lihat semua &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl border border-[#E5E7EB] p-8 flex flex-col space-y-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-[#FF6B35] text-4xl leading-none font-serif">&ldquo;</div>
              <p className="text-[14px] text-[#111111] leading-relaxed flex-grow italic font-medium">
                {t.review}
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-[#F8F8F8]">
                  <Image src={t.photo} alt={t.name} fill sizes="44px" className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-[13px] text-[#111111]">{t.name}</h4>
                  <span className="text-[11px] text-[#6B7280]">{t.city}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 7. Instagram Gallery ===== */}
      <section className="container mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-plus-jakarta font-bold text-[22px] tracking-tight text-[#111111] mb-2">
              Ikuti @urbanwear
            </h2>
            <p className="text-[13px] text-[#6B7280]">
              Temukan inspirasi outfit harian di Instagram kami.
            </p>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex text-[13px] font-bold text-[#FF6B35] hover:text-[#FF6B35]/80 items-center gap-1.5 transition-colors"
          >
            Lihat Instagram &rarr;
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {igPhotos.map((photo, i) => (
            <a
              key={i}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden bg-[#F8F8F8]"
            >
              <Image
                src={photo}
                alt={`Instagram photo ${i + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <InstagramIcon className="text-white w-6 h-6" />
              </div>
            </a>
          ))}
        </div>
      </section>

    </div>
  )
}
