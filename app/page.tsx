import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RefreshCw,
  Headphones,
  CheckCircle2,
  Star,
  ChevronRight,
  Sparkles,
  Zap,
} from "lucide-react"
import { getProducts } from "@/lib/actions/products"
import { ProductCard } from "@/components/product-card"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const revalidate = 0 // Always fetch fresh data on homepage load

export default async function HomePage() {
  // Fetch newest and popular products on the server
  const { products: newestProducts } = await getProducts({
    limit: 8,
    sortBy: "newest",
  }).catch(() => ({ products: [] }))

  const { products: popularProducts } = await getProducts({
    limit: 8,
    sortBy: "popular",
  }).catch(() => ({ products: [] }))

  // Trust Benefits
  const trustBenefits = [
    {
      icon: Truck,
      title: "Gratis Ongkir",
      desc: "Minimal pembelian tertentu",
      color: "text-[#FF6B35]",
      bg: "bg-[#FFF5F0]",
    },
    {
      icon: ShieldCheck,
      title: "Produk Original",
      desc: "Kualitas terjamin",
      color: "text-[#2E7D32]",
      bg: "bg-[#F0F7F0]",
    },
    {
      icon: RefreshCw,
      title: "Garansi Tukar 7 Hari",
      desc: "Sesuai syarat & ketentuan",
      color: "text-[#1565C0]",
      bg: "bg-[#EEF4FF]",
    },
    {
      icon: Headphones,
      title: "Customer Support",
      desc: "Siap membantu setiap hari",
      color: "text-[#6A1B9A]",
      bg: "bg-[#F5EEF9]",
    },
  ]

  // Category Cards (ONLY THREE AS REQUESTED)
  const categories = [
    {
      name: "PRIA",
      desc: "Streetwear & Casual",
      image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop&q=80",
      href: "/shop?category=pria",
      btnText: "Lihat Koleksi →",
    },
    {
      name: "WANITA",
      desc: "Minimalist & Modern",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=80",
      href: "/shop?category=wanita",
      btnText: "Lihat Koleksi →",
    },
    {
      name: "ANAK-ANAK",
      desc: "Stylish & Comfort",
      image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format&fit=crop&q=80",
      href: "/shop?category=anak-anak",
      btnText: "Lihat Koleksi →",
    },
  ]

  // Why Choose Us
  const whyChooseUs = [
    {
      icon: "🏆",
      title: "Produk Original",
      desc: "Semua koleksi kami 100% asli dari brand UrbanWear terpercaya.",
    },
    {
      icon: "🌿",
      title: "Bahan Premium",
      desc: "Menggunakan material katun organik dan serat pilihan yang awet.",
    },
    {
      icon: "🚚",
      title: "Pengiriman Cepat",
      desc: "Layanan logistik prioritas untuk mengantar pesanan tepat waktu.",
    },
    {
      icon: "🔒",
      title: "Pembayaran Aman",
      desc: "Transaksi terenkripsi aman dengan opsi gerbang pembayaran lengkap.",
    },
  ]

  // Testimonials
  const testimonials = [
    {
      name: "Rian Pratama",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      review: "Bahannya sangat halus dan dingin saat dipakai. Kemeja linen oversized-nya pas sekali untuk nongkrong maupun kerja kasual.",
      rating: 5,
    },
    {
      name: "Siti Rahma",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      review: "Pelayanan retur size sangat mudah dan cepat. Ukuran kemeja wanita pas sesuai deskripsi. Langganan belanja di sini!",
      rating: 5,
    },
    {
      name: "Denny Wijaya",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      review: "Koleksi anak-anaknya lucu sekali, bahan katunnya lembut dan aman di kulit anak saya. Pengiriman cepat sampai.",
      rating: 5,
    },
  ]

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#FAFAF8] text-[#111827]">
      
      {/* ===== 1. Hero Section ===== */}
      <section className="relative w-full h-[80vh] min-h-[550px] flex items-center justify-start overflow-hidden bg-zinc-950">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&auto=format&fit=crop&q=80"
          alt="UrbanWear Editorial Banner"
          fill
          priority
          className="object-cover object-center opacity-75 dark:opacity-50"
        />
        {/* Soft elegant gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />

        <div className="container mx-auto px-4 md:px-8 relative z-10 text-white max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF6B35]/20 border border-[#FF6B35]/40 backdrop-blur-sm text-xs font-bold tracking-wider uppercase text-[#FF6B35]">
            <Sparkles className="h-3 w-3" />
            Edisi Terbatas
          </div>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1] max-w-2xl text-white">
            Ekspresikan Gayamu Tanpa Batas
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-zinc-300 max-w-xl leading-relaxed font-medium">
            Temukan koleksi fashion premium untuk pria, wanita, dan anak-anak dengan desain modern, bahan berkualitas, dan harga terbaik.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/shop"
              className={cn(
                buttonVariants({ variant: "default" }),
                "bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-bold h-12 px-8 rounded-2xl text-sm transition-all shadow-lg hover:shadow-[#FF6B35]/30 flex items-center gap-2"
              )}
            >
              Belanja Sekarang
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/shop"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "border-white/30 text-white hover:bg-white/10 font-bold h-12 px-8 rounded-2xl text-sm backdrop-blur-sm flex items-center justify-center"
              )}
            >
              Lihat Koleksi
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 2. Trust Benefits ===== */}
      <section className="bg-white border-b border-[#E5E7EB]">
        <div className="container mx-auto px-4 md:px-8 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {trustBenefits.map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#FAFAF8] transition-colors">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", bg)}>
                <Icon className={cn("h-5 w-5", color)} />
              </div>
              <div>
                <h4 className="font-bold text-[14px] text-[#111827]">{title}</h4>
                <p className="text-[12px] text-[#6B7280]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 3. Category Section (ONLY THREE CARDS) ===== */}
      <section className="container mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="text-center space-y-3 mb-12">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF6B35]">Koleksi Utama</p>
          <h2 className="font-serif font-bold text-2xl md:text-3xl tracking-tight text-[#111827]">
            Belanja Berdasarkan Kategori
          </h2>
          <p className="text-sm text-[#6B7280] max-w-md mx-auto">
            Temukan koleksi pilihan sesuai kebutuhan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-zinc-950 shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] transition-all duration-500"
            >
              <Image
                src={cat.image}
                alt={`Koleksi ${cat.name}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF6B35]">UrbanWear Fashion</span>
                <h3 className="font-serif font-bold text-xl md:text-2xl tracking-wide">{cat.name}</h3>
                <p className="text-xs text-white/70">{cat.desc}</p>
                <span className="inline-flex h-9 items-center justify-center rounded-xl bg-white/10 group-hover:bg-white text-white group-hover:text-black font-bold text-xs px-5 border border-white/20 transition-all uppercase tracking-wider">
                  {cat.btnText}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 4. Promotional Banner ===== */}
      <section className="container mx-auto px-4 md:px-8 pb-16 md:pb-24">
        <div className="relative w-full rounded-3xl overflow-hidden bg-zinc-950 text-white py-16 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FF6B35_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="space-y-4 relative z-10 max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-extrabold tracking-wider uppercase text-[#FF6B35]">
              <Zap className="h-3 w-3 animate-pulse" />
              Rekomendasi Musim Ini
            </span>
            <h2 className="font-serif font-bold text-3xl md:text-4xl tracking-tight leading-tight text-white">
              Koleksi Musim Terbaru
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed font-medium">
              Temukan outfit pilihan untuk gaya kasual dan modern. Padukan kenyamanan maksimal dengan estetika fashion terkini.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link
              href="/shop"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-bold text-sm px-8 transition-all shadow-lg"
            >
              Belanja Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 5. Featured Products (Produk Terbaru) ===== */}
      <section className="container mx-auto px-4 md:px-8 pb-16 md:pb-24">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF6B35]">Katalog Baru</p>
            <h2 className="font-serif font-bold text-2xl md:text-3xl tracking-tight">
              Produk Terbaru
            </h2>
          </div>
          <Link
            href="/shop?sort=newest"
            className="text-xs font-bold uppercase tracking-wider text-[#FF6B35] hover:text-[#FF6B35]/80 flex items-center gap-1 shrink-0 pb-1"
          >
            Lihat Semua <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {newestProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {newestProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-[#E5E7EB] rounded-3xl text-muted-foreground bg-white">
            Belum ada produk terbaru saat ini.
          </div>
        )}
      </section>

      {/* ===== 6. Best Seller Section (Produk Terlaris) ===== */}
      <section className="container mx-auto px-4 md:px-8 pb-16 md:pb-24">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF6B35]">Paling Banyak Dicari</p>
            <h2 className="font-serif font-bold text-2xl md:text-3xl tracking-tight">
              Produk Terlaris
            </h2>
          </div>
          <Link
            href="/shop?sort=popular"
            className="text-xs font-bold uppercase tracking-wider text-[#FF6B35] hover:text-[#FF6B35]/80 flex items-center gap-1 shrink-0 pb-1"
          >
            Lihat Semua <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {popularProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {popularProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-[#E5E7EB] rounded-3xl text-muted-foreground bg-white">
            Belum ada produk terlaris saat ini.
          </div>
        )}
      </section>

      {/* ===== 7. Why Choose Us ===== */}
      <section className="bg-white border-y border-[#E5E7EB] py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center space-y-3 mb-16">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF6B35]">Keunggulan Kami</p>
            <h2 className="font-serif font-bold text-2xl md:text-3xl tracking-tight text-[#111827]">
              Why Choose UrbanWear
            </h2>
            <p className="text-sm text-[#6B7280] max-w-md mx-auto">
              Kami berkomitmen menghadirkan layanan retail fashion kelas dunia dengan standar terbaik.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {whyChooseUs.map((w) => (
              <div key={w.title} className="bg-[#FAFAF8] rounded-2xl border border-[#E5E7EB] p-6 space-y-4 hover:shadow-md transition-shadow">
                <div className="text-3xl">{w.icon}</div>
                <h4 className="font-bold text-[15px] text-[#111827]">{w.title}</h4>
                <p className="text-[12px] text-[#6B7280] leading-relaxed font-medium">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 8. Customer Reviews ===== */}
      <section className="container mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="text-center space-y-3 mb-16">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF6B35]">Testimoni Pelanggan</p>
          <h2 className="font-serif font-bold text-2xl md:text-3xl tracking-tight">
            Apa Kata Pelanggan Kami
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl border border-[#E5E7EB] p-6 md:p-8 flex flex-col space-y-4 shadow-[0_2px_16px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow relative">
              <div className="flex gap-0.5 text-amber-400">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-currentColor" />
                ))}
              </div>
              <p className="text-[13px] text-[#6B7280] italic leading-relaxed flex-grow font-medium">
                &ldquo;{t.review}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#F2F2F0]">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
                  <Image src={t.photo} alt={t.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-[13px] text-[#111827] flex items-center gap-1.5">
                    {t.name}
                    <span className="inline-flex items-center gap-0.5 text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">
                      <CheckCircle2 className="h-2.5 w-2.5" /> Verified
                    </span>
                  </h4>
                  <span className="text-[10px] text-muted-foreground">Pembeli Terverifikasi</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 9. Newsletter Section ===== */}
      <section className="bg-zinc-950 text-white py-16 md:py-24 border-t border-[#E5E7EB] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FF6B35_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="container mx-auto px-4 md:px-8 max-w-2xl text-center space-y-6 relative z-10">
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#FF6B35]">Berlangganan</span>
          <h2 className="font-serif font-bold text-3xl md:text-4xl tracking-tight text-white">
            Dapatkan Update Koleksi Terbaru
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            Berlangganan newsletter untuk mendapatkan informasi produk terbaru, promo eksklusif, dan inspirasi fashion langsung di email Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
            <input
              type="email"
              placeholder="Masukkan alamat email Anda"
              required
              className="flex-1 px-4 py-3 text-[13px] bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FF6B35] transition-colors"
            />
            <button
              type="button"
              className="px-6 py-3 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-all shadow-md shrink-0"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}
