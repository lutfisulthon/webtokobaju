import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  getCategories,
  getProducts,
} from "@/lib/actions/products"
import { ProductCard } from "@/components/product-card"
import { ShopFilters } from "@/components/shop-filters"
import { ShopPagination } from "@/components/shop-pagination"
import {
  PackageX,
  Truck,
  ShieldCheck,
  Headphones,
  LockKeyhole,
  ArrowRight,
  LayoutGrid,
  List,
  SlidersHorizontal,
  ChevronRight,
  Home,
} from "lucide-react"

export const revalidate = 0

interface ShopPageProps {
  searchParams: Promise<{
    category?: string
    minPrice?: string
    maxPrice?: string
    sort?: string
    page?: string
    search?: string
  }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams

  const category = resolvedParams.category
  const minPrice = resolvedParams.minPrice ? parseInt(resolvedParams.minPrice) : undefined
  const maxPrice = resolvedParams.maxPrice ? parseInt(resolvedParams.maxPrice) : undefined
  const sort = resolvedParams.sort as "newest" | "price_asc" | "price_desc" | "popular" | undefined
  const page = resolvedParams.page ? parseInt(resolvedParams.page) : 1
  const search = resolvedParams.search

  const categories = await getCategories().catch(() => [])

  const { products, totalPages, currentPage } = await getProducts({
    categorySlug: category,
    minPrice,
    maxPrice,
    sortBy: sort,
    page,
    search,
    limit: 8,
  }).catch(() => ({ products: [], totalPages: 1, currentPage: 1 }))

  // Dynamic hero config per category
  const heroConfig: Record<string, { title: string; sub: string; label: string; image: string }> = {
    kemeja: {
      title: "Kemeja Premium\nUntuk Pria Modern",
      sub: "Tampil percaya diri dengan koleksi kemeja premium kami dari bahan pilihan terbaik.",
      label: "Koleksi Kemeja",
      image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1400&auto=format&fit=crop&q=80",
    },
    kaos: {
      title: "Kaos Streetwear\nEdisi Terbatas",
      sub: "Ekspresikan diri Anda dengan desain grafis eksklusif dan material katun organik premium.",
      label: "Koleksi Kaos",
      image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1400&auto=format&fit=crop&q=80",
    },
    jaket: {
      title: "Jaket & Outerwear\nMusim Ini",
      sub: "Kehangatan bertemu gaya — koleksi jaket premium untuk tampil elegan sepanjang hari.",
      label: "Koleksi Jaket",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1400&auto=format&fit=crop&q=80",
    },
    celana: {
      title: "Celana Modern\nPremium Comfort",
      sub: "Kenyamanan dan gaya dalam satu paket — celana berkualitas untuk setiap aktivitas.",
      label: "Koleksi Celana",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=1400&auto=format&fit=crop&q=80",
    },
    default: {
      title: "Discover Your\nPerfect Style",
      sub: "Premium quality clothing designed for everyday confidence. Koleksi terbaik UrbanWear untuk tampil memukau.",
      label: "Koleksi Premium",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&auto=format&fit=crop&q=80",
    },
  }

  const hero = heroConfig[category ?? ""] ?? heroConfig.default

  const trustFeatures = [
    {
      icon: Truck,
      title: "Gratis Ongkir",
      desc: "Ke seluruh Indonesia min. Rp 500k",
      color: "text-[#FF6B35]",
      bg: "bg-[#FFF5F0]",
    },
    {
      icon: ShieldCheck,
      title: "Garansi 7 Hari",
      desc: "Kemudahan retur & penukaran ukuran",
      color: "text-[#2E7D32]",
      bg: "bg-[#F0F7F0]",
    },
    {
      icon: Headphones,
      title: "CS Responsif",
      desc: "Siap membantu 09.00–21.00 WIB",
      color: "text-[#1565C0]",
      bg: "bg-[#EEF4FF]",
    },
    {
      icon: LockKeyhole,
      title: "Pembayaran Aman",
      desc: "SSL terenkripsi, 100% terlindungi",
      color: "text-[#6A1B9A]",
      bg: "bg-[#F5EEF9]",
    },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAF8]">

      {/* ===== Breadcrumb ===== */}
      <div className="container mx-auto px-4 md:px-8 pt-6 pb-2">
        <nav className="flex items-center gap-1.5 text-[12px] font-medium text-[#999]" aria-label="Breadcrumb">
          <Link href="/" className="flex items-center gap-1 hover:text-[#1A1A1A] transition-colors">
            <Home className="h-3.5 w-3.5" />
            Beranda
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <span className="text-[#1A1A1A] font-semibold">Katalog</span>
          {category && (
            <>
              <ChevronRight className="h-3 w-3 shrink-0" />
              <span className="text-[#1A1A1A] font-semibold capitalize">{category}</span>
            </>
          )}
        </nav>
      </div>

      {/* ===== Hero Section ===== */}
      <section className="container mx-auto px-4 md:px-8 pt-4 pb-10">
        <div className="relative w-full h-[280px] md:h-[420px] rounded-3xl overflow-hidden group">
          <Image
            src={hero.image}
            alt={hero.title}
            fill
            priority
            className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 90vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/5" />

          <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-14 text-white max-w-2xl">
            <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF6B35] mb-4">
              <span className="w-6 h-px bg-[#FF6B35]" />
              {hero.label}
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight mb-4 whitespace-pre-line text-white">
              {hero.title}
            </h1>
            <p className="text-sm md:text-base text-white/75 leading-relaxed font-medium max-w-md mb-7">
              {hero.sub}
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-white text-[#1A1A1A] font-bold text-[13px] px-6 py-3.5 rounded-2xl hover:bg-[#FF6B35] hover:text-white transition-all duration-300 w-fit shadow-lg"
            >
              Lihat Koleksi
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Shop Layout ===== */}
      <section className="container mx-auto px-4 md:px-8 pb-20">
        <div className="flex flex-col md:flex-row gap-8 md:gap-10">

          {/* ── Sidebar Filter ── */}
          <aside className="w-full md:w-[260px] shrink-0">
            <div className="md:sticky md:top-24 bg-white rounded-2xl border border-[#EDEDE9] shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[#EDEDE9]">
                <SlidersHorizontal className="h-4 w-4 text-[#FF6B35]" />
                <h2 className="text-[14px] font-extrabold uppercase tracking-widest text-[#1A1A1A]">
                  Filter
                </h2>
              </div>
              <ShopFilters categories={categories} />
            </div>
          </aside>

          {/* ── Product Area ── */}
          <main className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <p className="text-[13px] font-semibold text-[#888]">
                Menampilkan{" "}
                <span className="text-[#1A1A1A] font-bold">{products.length}</span>{" "}
                produk
                {search && (
                  <span className="text-[#1A1A1A]"> untuk &quot;{search}&quot;</span>
                )}
                {category && (
                  <span className="capitalize"> dalam <span className="text-[#FF6B35] font-bold">{category}</span></span>
                )}
              </p>

              <div className="flex items-center gap-2 shrink-0">
                {/* View toggle icons — decorative (could be wired with state) */}
                <button
                  className="w-9 h-9 rounded-xl bg-[#1A1A1A] text-white flex items-center justify-center"
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  className="w-9 h-9 rounded-xl bg-white border-2 border-[#EDEDE9] text-[#AAA] flex items-center justify-center hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors"
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {products.length > 0 ? (
              <div className="space-y-10">
                {/* Product Grid with mid-promo injection */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
                  {products.map((product: any, idx: number) => {
                    const card = <ProductCard key={product.id} product={product} />

                    // Insert promo banner after 4th product (spanning 2/4 cols)
                    if (idx === 3 && products.length > 4) {
                      return (
                        <React.Fragment key={`frag-${product.id}`}>
                          {card}
                          {/* Promo Banner — spans full grid */}
                          <div
                            key="mid-promo"
                            className="col-span-2 xl:col-span-4 relative h-[140px] md:h-[180px] rounded-2xl overflow-hidden group/promo"
                          >
                            <Image
                              src="https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?w=1200&auto=format&fit=crop&q=80"
                              alt="Mid Season Sale"
                              fill
                              className="object-cover object-center transition-transform duration-700 group-hover/promo:scale-[1.04]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/90 via-[#1A1A1A]/60 to-transparent" />
                            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-14 text-white">
                              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#FF6B35] mb-1.5">
                                Penawaran Eksklusif
                              </span>
                              <h3 className="font-serif text-2xl md:text-3xl font-bold leading-tight mb-1">
                                Exclusive Mid Season Sale
                              </h3>
                              <p className="text-white/70 text-[12px] mb-4">
                                Diskon hingga <strong className="text-[#FF6B35]">50%</strong> untuk produk pilihan. Gunakan kode: <strong className="font-mono text-white">URBAN50</strong>
                              </p>
                              <Link
                                href="/shop"
                                className="inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-white hover:text-[#1A1A1A] text-white font-bold text-[12px] px-5 py-2.5 rounded-xl w-fit transition-all duration-200"
                              >
                                Shop Now
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          </div>
                        </React.Fragment>
                      )
                    }
                    return card
                  })}
                </div>

                {/* Pagination */}
                <ShopPagination currentPage={currentPage} totalPages={totalPages} />
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border-2 border-dashed border-[#EDEDE9]">
                <div className="w-16 h-16 bg-[#F8F8F5] rounded-full flex items-center justify-center mb-4">
                  <PackageX className="h-8 w-8 text-[#CCC]" />
                </div>
                <h3 className="font-bold text-[18px] text-[#1A1A1A] mb-2">
                  Produk Tidak Ditemukan
                </h3>
                <p className="text-[13px] text-[#888] max-w-sm leading-relaxed mb-6">
                  Tidak ada produk yang cocok dengan kriteria Anda. Coba ubah atau hapus filter untuk melihat lebih banyak produk.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#FF6B35] text-white font-bold text-[13px] px-6 py-3 rounded-xl transition-colors duration-200"
                >
                  Reset Semua Filter
                </Link>
              </div>
            )}
          </main>
        </div>
      </section>

      {/* ===== Trust Section ===== */}
      <section className="bg-white border-t border-[#EDEDE9]">
        <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="text-center mb-10">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF6B35] mb-2">
              Mengapa UrbanWear?
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1A1A1A]">
              Belanja Dengan Tenang
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {trustFeatures.map(({ icon: Icon, title, desc, color, bg }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#FAFAF8] border border-[#EDEDE9] hover:shadow-md transition-shadow duration-200"
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", bg)}>
                  <Icon className={cn("h-5 w-5", color)} />
                </div>
                <h4 className="font-bold text-[14px] text-[#1A1A1A] mb-1">{title}</h4>
                <p className="text-[12px] text-[#888] leading-snug">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

// local helper (avoids importing from lib for server component)
function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ")
}
