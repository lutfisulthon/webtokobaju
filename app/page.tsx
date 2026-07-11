import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ShoppingBag, Truck, ShieldCheck, HelpCircle, Star } from "lucide-react"
import { getCategories, getProducts } from "@/lib/actions/products"
import { ProductCard } from "@/components/product-card"
import { CountdownTimer } from "@/components/countdown-timer"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { buttonVariants } from "@/components/ui/button"

export const revalidate = 60 // Revalidate cache every 60 seconds

export default async function HomePage() {
  // Fetch data on the server
  const categories = await getCategories().catch(() => [])
  
  // Fetch products for featured
  const { products: featuredProducts } = await getProducts({ limit: 8 }).catch(() => ({ products: [] }))
  
  // Filter products that have discount for Flash Sale
  const flashSaleProducts = featuredProducts.filter(p => p.discountPrice !== null).slice(0, 4)

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[70vh] min-h-[500px] md:h-[80vh] flex items-center justify-start overflow-hidden bg-zinc-900">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80"
            alt="UrbanWear Banner"
            fill
            priority
            className="object-cover object-center opacity-70 dark:opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-white max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B35]/25 border border-[#FF6B35]/50 backdrop-blur-sm text-xs font-bold tracking-wider uppercase text-[#FF6B35]">
            New Season Arrivals
          </div>
          <h1 className="font-plus-jakarta font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1] max-w-2xl text-zinc-50">
            Ekspresikan Gayamu Tanpa Batas
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 max-w-lg leading-relaxed font-medium">
            Temukan koleksi kasual dan streetwear premium terbaik dengan material pilihan. Dapatkan potongan harga spesial khusus hari ini.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/shop"
              className={cn(
                buttonVariants({ variant: "default" }),
                "bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-bold h-12 px-6 rounded-lg text-sm transition-all shadow-lg hover:shadow-xl shadow-[#FF6B35]/20 flex items-center gap-2"
              )}
            >
              Belanja Sekarang
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/shop?category=jaket"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "border border-white/30 text-white hover:bg-white/10 font-bold h-12 px-6 rounded-lg text-sm backdrop-blur-sm flex items-center justify-center"
              )}
            >
              Lihat Koleksi Jaket
            </Link>
          </div>
        </div>
      </section>


      {/* Trust Badges */}
      <section className="border-b bg-card">
        <div className="container mx-auto px-4 md:px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="p-3 bg-[#FF6B35]/10 rounded-full text-[#FF6B35]">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Gratis Ongkir Se-Indonesia</h4>
              <p className="text-xs text-muted-foreground">Minimal pembelanjaan Rp 500.000</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-500">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Jaminan Kualitas 100%</h4>
              <p className="text-xs text-muted-foreground">Bahan premium terpilih & tahan lama</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Layanan CS 24/7</h4>
              <p className="text-xs text-muted-foreground">Siap membantu keluhan & order Anda</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Grid */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="text-center space-y-3 mb-10">
          <h2 className="font-plus-jakarta font-extrabold text-2xl md:text-3xl tracking-tight text-foreground">
            Telusuri Berdasarkan Kategori
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Temukan produk terbaik yang telah kami pisahkan untuk mempermudah pengalaman belanja Anda.
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category: any) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="group relative aspect-square overflow-hidden rounded-xl bg-zinc-900 shadow-sm"
              >
                <Image
                  src={category.image || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop&q=80"}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-plus-jakarta font-extrabold text-base tracking-wide uppercase">
                    {category.name}
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-white/70 flex items-center gap-1 mt-1 group-hover:text-[#FF6B35] transition-colors">
                    Lihat Koleksi <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed rounded-xl text-muted-foreground">
            Kategori tidak ditemukan.
          </div>
        )}
      </section>

      {/* 3. Flash Sale Section */}
      {flashSaleProducts.length > 0 && (
        <section className="bg-red-500/5 dark:bg-red-500/10 py-16 border-y border-red-500/10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
              <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
                <span className="px-3 py-1 rounded bg-[#FF6B35] text-white text-xs font-extrabold uppercase tracking-widest animate-pulse">
                  Flash Sale
                </span>
                <h2 className="font-plus-jakarta font-extrabold text-2xl tracking-tight">
                  Diskon Spesial Hari Ini
                </h2>
              </div>
              <CountdownTimer hoursInitial={8} />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {flashSaleProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Featured Products (Koleksi Terpopuler) */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <h2 className="font-plus-jakarta font-extrabold text-2xl md:text-3xl tracking-tight">
              Koleksi Terpopuler
            </h2>
            <p className="text-sm text-muted-foreground">
              Produk-produk premium pilihan yang paling disukai pelanggan saat ini.
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold uppercase tracking-wider text-[#FF6B35] hover:text-[#FF6B35]/80 flex items-center gap-1 shrink-0 pb-1"
          >
            Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed rounded-xl text-muted-foreground">
            Tidak ada produk unggulan saat ini. Silakan jalankan seeding database.
          </div>
        )}
      </section>

      {/* 5. Promo Banner Section */}
      <section className="container mx-auto px-4 md:px-6 mb-16 md:mb-24">
        <div className="relative w-full rounded-2xl overflow-hidden bg-zinc-950 text-white py-16 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Background Decorative Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FF6B35_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="space-y-4 relative z-10 max-w-xl text-center md:text-left">
            <span className="px-2.5 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-extrabold tracking-wider uppercase text-[#FF6B35]">
              Diskon Pengguna Baru
            </span>
            <h2 className="font-plus-jakarta font-extrabold text-2xl sm:text-3xl tracking-tight leading-tight text-zinc-50">
              Gunakan Kode Kupon: <span className="text-[#FF6B35] font-mono">URBANNEW</span>
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed font-medium">
              Dapatkan potongan harga tambahan sebesar 10% untuk transaksi pertama Anda tanpa batasan minimum belanja.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link
              href="/shop"
              className={cn(
                buttonVariants({ variant: "default" }),
                "bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-bold h-12 px-8 rounded-lg text-sm flex items-center justify-center"
              )}
            >
              Belanja Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="bg-muted/30 py-16 md:py-24 border-t">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center space-y-3 mb-12">
            <h2 className="font-plus-jakarta font-extrabold text-2xl md:text-3xl tracking-tight">
              Ulasan Pelanggan Kami
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Apa kata mereka yang telah mencoba kualitas pakaian premium dari UrbanWear.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-card p-6 rounded-xl border shadow-sm flex flex-col space-y-4">
              <div className="flex items-center gap-0.5 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-currentColor" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground italic leading-relaxed flex-1">
                "Kemeja Linen-nya benar-benar nyaman dipakai di cuaca panas. Modelnya yang oversized pas sekali di badan dan jahitannya sangat rapi. Bakal beli warna lain!"
              </p>
              <div>
                <h4 className="font-bold text-sm">Rian Pratama</h4>
                <span className="text-xs text-muted-foreground">Jakarta</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-card p-6 rounded-xl border shadow-sm flex flex-col space-y-4">
              <div className="flex items-center gap-0.5 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-currentColor" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground italic leading-relaxed flex-1">
                "Pengiriman super cepat dan packing-nya premium sekali. Jaket hoodie yang saya beli tebal tapi tidak bikin gerah, bahannya lembut banget."
              </p>
              <div>
                <h4 className="font-bold text-sm">Siti Rahma</h4>
                <span className="text-xs text-muted-foreground">Bandung</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-card p-6 rounded-xl border shadow-sm flex flex-col space-y-4">
              <div className="flex items-center gap-0.5 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-currentColor" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground italic leading-relaxed flex-1">
                "Sangat terbantu dengan panduan ukuran di website ini. Celana cargo yang saya pesan pas sempurna. Sangat direkomendasikan!"
              </p>
              <div>
                <h4 className="font-bold text-sm">Denny Wijaya</h4>
                <span className="text-xs text-muted-foreground">Surabaya</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
