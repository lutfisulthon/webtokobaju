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
      name: "PRIA",
      subtitle: "Temukan gaya terbaikmu",
      desc: "Lihat Koleksi",
      image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop&q=80",
      href: "/shop?category=pria",
    },
    {
      name: "WANITA",
      subtitle: "Elegan dalam setiap gaya",
      desc: "Lihat Koleksi",
      image: "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=800&auto=format&fit=crop&q=80",
      href: "/shop?category=wanita",
    },
    {
      name: "ANAK-ANAK",
      subtitle: "Nyaman, stylish, dan penuh warna",
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
      review: "Kualitas produknya premium banget, bahan nyaman dan jahitannya rapi. Desainnya juga modern dan elegan!",
    },
    {
      name: "Siti Rahma",
      city: "Bandung",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      review: "Model bajunya kekinian semua, pengiriman cepat dan packaging rapi. Puas belanja di UrbanWear!",
    },
    {
      name: "Denny Wijaya",
      city: "Surabaya",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      review: "Anak saya suka banget bajunya, bahannya lembut dan warnanya bagus-bagus.",
    },
  ]

  // Instagram Gallery
  const igPhotos = [
    "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1555529669-2269763671c3?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400&auto=format&fit=crop&q=80",
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
          <h2 className="font-plus-jakarta font-bold text-[26px] tracking-tight text-[#111111]">
            Belanja Berdasarkan Kategori
          </h2>
          <p className="text-[13px] text-[#6B7280]">
            Temukan koleksi terbaik sesuai gaya Anda.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative flex flex-col aspect-[3/4] rounded-[20px] overflow-hidden bg-[#F8F8F8] shadow-sm hover:shadow-md transition-all duration-500"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              {/* Subtle dark gradient overlay at bottom only */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
              
              {/* Minimal text overlay bottom-left */}
              <div className="absolute bottom-6 left-6 text-white text-left z-10">
                <h3 className="font-plus-jakarta font-extrabold text-[18px] tracking-[0.15em] uppercase text-white mb-1">
                  {cat.name}
                </h3>
                <span className="text-[11px] font-bold tracking-widest uppercase text-white/80 border-b border-white/30 pb-0.5 group-hover:border-white transition-all">
                  Lihat Koleksi &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 4. Collection Banner ===== */}
      <section className="container mx-auto px-4 md:px-8 py-8">
        <div className="relative w-full h-[320px] md:h-[420px] rounded-[24px] overflow-hidden group">
          <Image
            src="https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?w=1600&auto=format&fit=crop&q=80"
            alt="Koleksi Musim Terbaru"
            fill
            className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
            sizes="100vw"
          />
          {/* Subtle dark elegant overlay */}
          <div className="absolute inset-0 bg-black/45 transition-colors duration-500 group-hover:bg-black/50" />

          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 md:p-12 text-white">
            <span className="inline-block text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#FF6B35] mb-3">
              NEW SEASON
            </span>
            <h2 className="font-plus-jakarta font-bold text-2xl md:text-4xl tracking-tight leading-tight text-white mb-3">
              Koleksi Musim Terbaru
            </h2>
            <p className="text-[13px] md:text-[14px] text-white/80 max-w-md leading-relaxed mb-6 font-medium">
              Tampil maksimal dengan koleksi pilihan untuk setiap momen spesialmu.
            </p>
            <Link
              href="/shop"
              className="bg-white hover:bg-zinc-100 text-[#111111] font-bold text-xs h-10 px-8 rounded-xl flex items-center justify-center transition-all shadow-md w-fit"
            >
              Belanja Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 5. Popular Products Section ===== */}
      <HomePopularProducts products={products} />

      {/* ===== 6. Customer Testimonials ===== */}
      <section className="container mx-auto px-4 md:px-8 py-12 md:py-16 border-t border-[#E5E7EB] relative group/reviews">
        <div className="flex items-end justify-between gap-4 mb-10">
          <h2 className="font-plus-jakarta font-bold text-[22px] tracking-tight text-[#111111]">
            Apa Kata Mereka
          </h2>
          <Link
            href="/reviews"
            className="text-[13px] font-bold text-[#FF6B35] hover:text-[#FF6B35]/80 flex items-center gap-1.5 transition-colors"
          >
            Lihat Semua &rarr;
          </Link>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-[24px] border border-[#E5E7EB] p-8 flex flex-col space-y-4 shadow-sm hover:shadow-md transition-all duration-300">
                {/* 5 Stars Rating */}
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-[13px] text-[#333333] leading-relaxed flex-grow italic font-medium">
                  &ldquo;{t.review}&rdquo;
                </p>
                <div className="flex items-center gap-4 pt-2 border-t border-zinc-100">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#F8F8F8]">
                    <Image src={t.photo} alt={t.name} fill sizes="40px" className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[13px] text-[#111111]">{t.name}</h4>
                    <span className="text-[10px] text-[#22C55E] font-bold tracking-wider uppercase block mt-0.5">
                      ✓ Verified Purchase
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
