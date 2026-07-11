import * as React from "react"
import Link from "next/link"
import { getCategories, getProducts } from "@/lib/actions/products"
import { ProductCard } from "@/components/product-card"
import { ShopFilters } from "@/components/shop-filters"
import { ShopPagination } from "@/components/shop-pagination"
import { SlidersHorizontal, PackageX, Home } from "lucide-react"

export const revalidate = 0 // Dynamic page, fetch on demand

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
  
  // Parse search params
  const category = resolvedParams.category
  const minPrice = resolvedParams.minPrice ? parseInt(resolvedParams.minPrice) : undefined
  const maxPrice = resolvedParams.maxPrice ? parseInt(resolvedParams.maxPrice) : undefined
  const sort = resolvedParams.sort as "newest" | "price_asc" | "price_desc" | "popular" | undefined
  const page = resolvedParams.page ? parseInt(resolvedParams.page) : 1
  const search = resolvedParams.search

  // Fetch categories & products on server
  const categories = await getCategories().catch(() => [])
  
  const { products, totalPages, currentPage } = await getProducts({
    categorySlug: category,
    minPrice,
    maxPrice,
    sortBy: sort,
    page,
    search,
    limit: 9, // 9 products per page (grid 3x3 looks best)
  }).catch(() => ({ products: [], totalPages: 1, currentPage: 1 }))

  // Define banner metadata based on active category
  const bannerConfig = {
    pria: {
      title: "Fashion Pria Modern",
      desc: "Temukan koleksi pakaian pria untuk gaya kasual hingga formal dengan bahan premium.",
      image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1200&auto=format&fit=crop&q=80",
    },
    wanita: {
      title: "Fashion Wanita Elegan",
      desc: "Tampil percaya diri dengan koleksi fashion terbaru yang dirancang penuh keanggunan.",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=1200&auto=format&fit=crop&q=80",
    },
    "anak-anak": {
      title: "Fashion Anak Nyaman & Ceria",
      desc: "Pakaian berkualitas premium yang lembut dan aman untuk bayi hingga remaja.",
      image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=1200&auto=format&fit=crop&q=80",
    },
    default: {
      title: "Katalog UrbanWear Premium",
      desc: "Jelajahi koleksi busana modern dan minimalis terbaik kami untuk melengkapi gaya hidup Anda.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80",
    }
  };

  const activeBanner = bannerConfig[category as keyof typeof bannerConfig] || bannerConfig.default;

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground flex items-center gap-1.5">
          <Home className="h-3.5 w-3.5" />
          Beranda
        </Link>
        <span>/</span>
        <span className="text-foreground">Katalog</span>
        {category && (
          <>
            <span>/</span>
            <span className="text-foreground capitalize">{category}</span>
          </>
        )}
      </nav>

      {/* Dynamic Category Hero Banner */}
      <div className="relative w-full h-[220px] md:h-[320px] rounded-3xl overflow-hidden mb-10 group bg-black shadow-lg">
        <img
          src={activeBanner.image}
          alt={activeBanner.title}
          className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-102 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center p-6 md:p-12 text-white max-w-xl space-y-3 md:space-y-4">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#FF6B35]">Koleksi Premium</span>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight font-plus-jakarta">{activeBanner.title}</h1>
          <p className="text-xs md:text-sm text-zinc-200 leading-relaxed font-medium">{activeBanner.desc}</p>
          <div>
            <Link
              href="/shop"
              className="inline-flex h-9 md:h-11 items-center justify-center rounded-xl bg-[#FF6B35] px-5 md:px-7 text-xs font-bold text-white hover:bg-[#ff8052] hover:scale-102 transition-all shadow-md"
            >
              Belanja Sekarang
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Filters on Left (w-1/4), Products on Right (w-3/4) */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Sidebar - Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <ShopFilters categories={categories} />
        </aside>

        {/* Right Section - Products Grid */}
        <main className="flex-1">
          {products.length > 0 ? (
            <div className="space-y-8">
              {/* Product Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {products.map((product: any, idx: number) => {
                  const card = <ProductCard key={product.id} product={product} />;
                  // Insert Promo Grid Banner after the 3rd product
                  if (idx === 2) {
                    return (
                      <React.Fragment key={`frag-${product.id}`}>
                        {card}
                        <div key="promo-grid-banner" className="col-span-2 lg:col-span-3 relative h-40 rounded-2xl overflow-hidden bg-black flex items-center p-6 md:p-8 text-white shadow-inner group/banner">
                          <img
                            src="https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=1000&auto=format&fit=crop&q=80"
                            alt="Promo Banner"
                            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover/banner:scale-102 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
                          <div className="relative z-10 space-y-1.5 md:space-y-2 max-w-md">
                            <span className="text-[10px] uppercase font-bold text-[#FF6B35] tracking-widest">Penawaran Spesial</span>
                            <h3 className="font-extrabold text-base md:text-xl font-plus-jakarta tracking-tight">Diskon Hingga 50% + Gratis Ongkir!</h3>
                            <p className="text-[10px] md:text-xs text-zinc-300">Belanja koleksi pilihan hari ini dengan kode voucher <strong>MEGASALE50</strong></p>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  }
                  return card;
                })}
              </div>

              {/* Pagination */}
              <ShopPagination currentPage={currentPage} totalPages={totalPages} />
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-2xl bg-card p-6">
              <div className="p-4 bg-muted rounded-full text-muted-foreground mb-4">
                <PackageX className="h-10 w-10" />
              </div>
              <h3 className="font-plus-jakarta font-bold text-lg mb-2">Produk Tidak Ditemukan</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Maaf, tidak ada produk yang cocok dengan kriteria filter Anda. Coba kurangi filter atau cari kata kunci lain.
              </p>
              <Link
                href="/shop"
                className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-foreground px-6 text-xs font-bold text-background hover:bg-[#FF6B35] hover:text-white transition-colors"
              >
                Reset Semua Filter
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
