"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  RefreshCw,
  ChevronRight,
  Home,
  Minus,
  Plus,
  X,
  Ruler,
  ZoomIn,
  Share2,
  Check,
  Info,
} from "lucide-react"
import { useCartStore } from "@/lib/store/useCartStore"
import { useWishlistStore } from "@/lib/store/useWishlistStore"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProductVariant {
  id: string
  sku: string
  size: string
  color: string
  imageUrl?: string | null
  stock: number
}

interface ProductDetailsClientProps {
  product: {
    id: string
    name: string
    slug: string
    description: string
    price: number
    discountPrice: number | null
    image: string
    images: string[]
    category: {
      name: string
      slug: string
    }
    variants: ProductVariant[]
    rating?: number
    reviewCount?: number
  }
}

// --- Star Rating Component ---
function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const fill = Math.min(Math.max(rating - (star - 1), 0), 1)
          return (
            <span key={star} className="relative inline-block w-4 h-4">
              {/* Empty star */}
              <Star className="absolute inset-0 h-4 w-4 text-zinc-200 dark:text-zinc-700" fill="currentColor" />
              {/* Filled star (clipped) */}
              {fill > 0 && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fill * 100}%` }}
                >
                  <Star className="h-4 w-4 text-amber-400" fill="currentColor" />
                </span>
              )}
            </span>
          )
        })}
      </div>
      <span className="text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
      <span className="text-sm text-muted-foreground">({count} ulasan)</span>
    </div>
  )
}

// --- Size Guide Modal ---
function SizeGuideModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-background rounded-2xl shadow-2xl max-w-lg w-full p-6 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-plus-jakarta font-bold text-lg flex items-center gap-2">
            <Ruler className="h-5 w-5 text-[#FF6B35]" />
            Panduan Ukuran
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left py-2.5 px-4 font-bold text-xs uppercase tracking-wider rounded-l-lg">Ukuran</th>
                <th className="text-center py-2.5 px-4 font-bold text-xs uppercase tracking-wider">Lingkar Dada (cm)</th>
                <th className="text-center py-2.5 px-4 font-bold text-xs uppercase tracking-wider">Lingkar Pinggang (cm)</th>
                <th className="text-center py-2.5 px-4 font-bold text-xs uppercase tracking-wider rounded-r-lg">Panjang (cm)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { size: "XS", chest: "82–86", waist: "66–70", length: "66" },
                { size: "S", chest: "88–92", waist: "72–76", length: "68" },
                { size: "M", chest: "94–98", waist: "78–82", length: "70" },
                { size: "L", chest: "100–104", waist: "84–88", length: "72" },
                { size: "XL", chest: "106–110", waist: "90–94", length: "74" },
                { size: "XXL", chest: "112–116", waist: "96–100", length: "76" },
              ].map((row, i) => (
                <tr key={row.size} className={cn("border-b last:border-0", i % 2 === 0 ? "bg-muted/20" : "")}>
                  <td className="py-2.5 px-4 font-bold text-[#FF6B35]">{row.size}</td>
                  <td className="py-2.5 px-4 text-center text-muted-foreground">{row.chest}</td>
                  <td className="py-2.5 px-4 text-center text-muted-foreground">{row.waist}</td>
                  <td className="py-2.5 px-4 text-center text-muted-foreground">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-4 flex items-start gap-1.5">
          <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          Ukuran bersifat estimasi. Jika ragu antara dua ukuran, disarankan memilih ukuran yang lebih besar.
        </p>
      </div>
    </div>
  )
}

// --- Image Zoom Modal ---
function ImageZoomModal({ src, alt, open, onClose }: { src: string; alt: string; open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm cursor-zoom-out"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
      >
        <X className="h-5 w-5" />
      </button>
      <div className="relative w-full h-full max-w-3xl max-h-[90vh] mx-4">
        <Image src={src} alt={alt} fill className="object-contain" />
      </div>
    </div>
  )
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const allImages = React.useMemo(() => [product.image, ...product.images], [product])
  const [activeImage, setActiveImage] = React.useState(allImages[0])
  const [quantity, setQuantity] = React.useState(1)
  const [sizeGuideOpen, setSizeGuideOpen] = React.useState(false)
  const [zoomOpen, setZoomOpen] = React.useState(false)
  const [addedToCart, setAddedToCart] = React.useState(false)

  // Rating defaults
  const rating = product.rating ?? 4.5
  const reviewCount = product.reviewCount ?? 12

  // Get distinct colors and sizes
  const colors = React.useMemo(() => {
    return Array.from(new Set(product.variants.map((v) => v.color)))
  }, [product.variants])

  const [selectedColor, setSelectedColor] = React.useState(colors[0] || "")

  const availableSizes = React.useMemo(() => {
    return product.variants.filter((v) => v.color === selectedColor)
  }, [product.variants, selectedColor])

  const [selectedSize, setSelectedSize] = React.useState(availableSizes[0]?.size || "")

  // Sync selected size & color preview image if color changes
  React.useEffect(() => {
    const sizeExistsForColor = availableSizes.some((s) => s.size === selectedSize)
    if (!sizeExistsForColor && availableSizes.length > 0) {
      setSelectedSize(availableSizes[0].size)
    }
    const variantWithImage = product.variants.find((v) => v.color === selectedColor && v.imageUrl)
    if (variantWithImage?.imageUrl) {
      setActiveImage(variantWithImage.imageUrl)
    }
  }, [selectedColor, availableSizes, selectedSize, product.variants])

  // Get active variant details
  const activeVariant = React.useMemo(() => {
    return product.variants.find((v) => v.color === selectedColor && v.size === selectedSize)
  }, [product.variants, selectedColor, selectedSize])

  const isOutOfStock = !activeVariant || activeVariant.stock <= 0
  const discountPct = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0

  // Zustand Actions
  const addItem = useCartStore((state) => state.addItem)
  const wishlistItems = useWishlistStore((state) => state.items)
  const toggleWishlist = useWishlistStore((state) => state.addItem)
  const removeWishlist = useWishlistStore((state) => state.removeItem)

  const isWishlisted = wishlistItems.some((item) => item.id === product.id)

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeWishlist(product.id)
      toast.info("Dihapus dari daftar keinginan.")
    } else {
      toggleWishlist({
        id: product.id,
        name: product.name,
        price: product.discountPrice || product.price,
        image: product.image,
      })
      toast.success("Ditambahkan ke daftar keinginan! ❤️")
    }
  }

  const handleAddToCart = () => {
    if (isOutOfStock) return
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.discountPrice || product.price,
        image: product.image,
        size: selectedSize,
        color: selectedColor,
      },
      quantity
    )
    setAddedToCart(true)
    toast.success(`Ditambahkan ke keranjang! 🛍️`)
    setTimeout(() => setAddedToCart(false), 2500)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, url: window.location.href })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Link disalin ke clipboard!")
    }
  }

  return (
    <>
      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
      <ImageZoomModal
        src={activeImage}
        alt={product.name}
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground flex items-center gap-1 transition-colors">
          <Home className="h-3.5 w-3.5" />
          Beranda
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0" />
        <Link href="/shop" className="hover:text-foreground transition-colors">Katalog</Link>
        <ChevronRight className="h-3 w-3 shrink-0" />
        <Link
          href={`/shop?category=${product.category.slug}`}
          className="hover:text-foreground capitalize transition-colors"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0" />
        <span className="text-foreground font-semibold line-clamp-1">{product.name}</span>
      </nav>

      {/* Main product grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

        {/* ========== Left Column: Sticky Image Gallery ========== */}
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-24 space-y-3">
            {/* Main Image */}
            <div
              className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 cursor-zoom-in group border border-border/50"
              onClick={() => setZoomOpen(true)}
            >
              <Image
                src={activeImage}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                priority
              />

              {/* Discount badge overlay */}
              {product.discountPrice && (
                <div className="absolute top-4 left-4 bg-[#FF6B35] text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-lg tracking-wide">
                  -{discountPct}% OFF
                </div>
              )}

              {/* Zoom icon */}
              <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="h-4 w-4" />
              </div>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={cn(
                      "relative aspect-square w-[72px] rounded-xl overflow-hidden border-2 shrink-0 bg-muted transition-all duration-200",
                      activeImage === img
                        ? "border-[#FF6B35] ring-2 ring-[#FF6B35]/20"
                        : "border-transparent hover:border-border"
                    )}
                    aria-label={`Lihat gambar ${idx + 1}`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ========== Right Column: Product Info ========== */}
        <div className="lg:col-span-5 space-y-7">

          {/* Header: Category + Actions */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 flex-1 min-w-0">
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-[#FF6B35] hover:text-[#FF6B35]/80 transition-colors"
              >
                {product.category.name}
              </Link>
              <h1 className="font-plus-jakarta font-extrabold text-2xl md:text-3xl tracking-tight leading-[1.15] text-foreground">
                {product.name}
              </h1>
            </div>
            {/* Share & Wishlist */}
            <div className="flex items-center gap-1.5 pt-1 shrink-0">
              <button
                onClick={handleShare}
                className="p-2 rounded-full border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
                aria-label="Bagikan produk"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                onClick={handleWishlistToggle}
                className={cn(
                  "p-2 rounded-full border bg-card transition-all",
                  isWishlisted
                    ? "text-red-500 border-red-200 bg-red-50 dark:bg-red-900/20 hover:bg-red-100"
                    : "text-muted-foreground hover:text-red-500 hover:border-red-200"
                )}
                aria-label="Simpan ke wishlist"
              >
                <Heart className="h-4 w-4" fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          {/* Rating */}
          <StarRating rating={rating} count={reviewCount} />

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Pricing */}
          <div className="space-y-1">
            {product.discountPrice ? (
              <>
                <div className="flex items-baseline gap-3">
                  <span className="font-plus-jakarta font-extrabold text-3xl text-[#FF6B35]">
                    Rp {product.discountPrice.toLocaleString("id-ID")}
                  </span>
                  <span className="px-2 py-0.5 bg-[#FF6B35]/10 text-[#FF6B35] text-[10px] font-extrabold rounded-full border border-[#FF6B35]/20">
                    HEMAT {discountPct}%
                  </span>
                </div>
                <span className="text-sm text-muted-foreground line-through">
                  Rp {product.price.toLocaleString("id-ID")}
                </span>
              </>
            ) : (
              <span className="font-plus-jakarta font-extrabold text-3xl text-foreground">
                Rp {product.price.toLocaleString("id-ID")}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Color Selector */}
          {colors.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  Warna: <span className="text-foreground capitalize">{selectedColor}</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "text-xs px-4 py-2 border rounded-full font-semibold transition-all duration-200 hover:border-foreground/50",
                      selectedColor === color
                        ? "border-[#FF6B35] bg-[#FF6B35] text-white shadow-sm shadow-[#FF6B35]/30"
                        : "border-border text-muted-foreground bg-card hover:bg-muted"
                    )}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {availableSizes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  Ukuran: <span className="text-foreground">{selectedSize}</span>
                </span>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs font-semibold text-[#FF6B35] hover:text-[#FF6B35]/80 flex items-center gap-1 transition-colors underline underline-offset-2"
                >
                  <Ruler className="h-3.5 w-3.5" />
                  Panduan Ukuran
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((v) => {
                  const isOOS = v.stock <= 0
                  return (
                    <button
                      key={v.id}
                      disabled={isOOS}
                      onClick={() => setSelectedSize(v.size)}
                      className={cn(
                        "relative text-xs w-12 h-12 border-2 rounded-xl font-bold flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]",
                        selectedSize === v.size
                          ? "border-[#FF6B35] bg-[#FF6B35] text-white shadow-sm"
                          : isOOS
                            ? "border-border/50 text-muted-foreground/40 bg-muted/30 cursor-not-allowed"
                            : "border-border text-foreground bg-card hover:border-foreground/40 hover:bg-muted"
                      )}
                      aria-label={`Ukuran ${v.size}${isOOS ? " (habis)" : ""}`}
                    >
                      {v.size}
                      {/* Strikethrough for OOS */}
                      {isOOS && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="absolute w-[140%] h-px bg-muted-foreground/30 rotate-45" />
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Stock Badge */}
          {activeVariant && (
            <div className={cn(
              "flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg w-fit",
              isOutOfStock
                ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                : activeVariant.stock <= 5
                  ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                  : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-500"
            )}>
              <span className={cn(
                "w-1.5 h-1.5 rounded-full",
                isOutOfStock ? "bg-red-500" : activeVariant.stock <= 5 ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
              )} />
              {isOutOfStock
                ? "Stok habis"
                : activeVariant.stock <= 5
                  ? `Hampir habis! Sisa ${activeVariant.stock} pcs`
                  : `Stok tersedia: ${activeVariant.stock} pcs`}
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div className="flex items-stretch gap-3">
            {/* Quantity Stepper */}
            <div className="flex items-center border-2 border-border rounded-xl bg-card overflow-hidden">
              <button
                disabled={quantity <= 1 || isOutOfStock}
                onClick={() => setQuantity(quantity - 1)}
                className="w-11 h-12 flex items-center justify-center hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Kurangi jumlah"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-10 text-center font-bold text-base select-none">{quantity}</span>
              <button
                disabled={isOutOfStock || (!!activeVariant && quantity >= activeVariant.stock)}
                onClick={() => setQuantity(quantity + 1)}
                className="w-11 h-12 flex items-center justify-center hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Tambah jumlah"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <Button
              id="btn-add-to-cart"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={cn(
                "flex-1 h-12 rounded-xl font-bold text-sm gap-2 transition-all duration-300 shadow-md",
                addedToCart
                  ? "bg-emerald-500 hover:bg-emerald-500 text-white shadow-emerald-500/30"
                  : isOutOfStock
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-zinc-900 dark:bg-zinc-100 hover:bg-[#FF6B35] dark:hover:bg-[#FF6B35] text-white dark:text-zinc-900 dark:hover:text-white shadow-black/10 hover:shadow-[#FF6B35]/30"
              )}
            >
              {addedToCart ? (
                <>
                  <Check className="h-4 w-4" />
                  Ditambahkan!
                </>
              ) : isOutOfStock ? (
                "Stok Habis"
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  Tambah ke Keranjang
                </>
              )}
            </Button>
          </div>

          {/* Service Guarantees */}
          <div className="grid grid-cols-1 gap-2.5 border border-border rounded-xl p-4 bg-muted/20">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-[#FF6B35]/10 flex items-center justify-center shrink-0">
                <Truck className="h-4 w-4 text-[#FF6B35]" />
              </div>
              <div>
                <p className="font-semibold text-xs text-foreground">Gratis Ongkir</p>
                <p className="text-xs text-muted-foreground">Minimum pembelian Rp 500.000</p>
              </div>
            </div>
            <div className="h-px bg-border/60" />
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <p className="font-semibold text-xs text-foreground">Garansi Kualitas</p>
                <p className="text-xs text-muted-foreground">Bahan premium teruji &amp; tahan lama</p>
              </div>
            </div>
            <div className="h-px bg-border/60" />
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <RefreshCw className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="font-semibold text-xs text-foreground">Retur 7 Hari</p>
                <p className="text-xs text-muted-foreground">Kemudahan penukaran ukuran</p>
              </div>
            </div>
          </div>

          {/* Product Description Accordion */}
          <div className="space-y-2">
            <details className="group border border-border rounded-xl bg-card overflow-hidden" open>
              <summary className="flex items-center justify-between px-4 py-3.5 text-sm font-bold cursor-pointer select-none list-none hover:bg-muted/50 transition-colors">
                <span>Deskripsi Produk</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90 shrink-0" />
              </summary>
              <div className="px-4 pb-4">
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </details>

            <details className="group border border-border rounded-xl bg-card overflow-hidden">
              <summary className="flex items-center justify-between px-4 py-3.5 text-sm font-bold cursor-pointer select-none list-none hover:bg-muted/50 transition-colors">
                <span>Informasi Pengiriman &amp; Retur</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90 shrink-0" />
              </summary>
              <div className="px-4 pb-4 space-y-2 text-sm text-muted-foreground">
                <p>🚚 Pengiriman reguler: 2–5 hari kerja</p>
                <p>⚡ Pengiriman express: 1–2 hari kerja (biaya tambahan)</p>
                <p>🔄 Produk dapat dikembalikan dalam 7 hari setelah diterima jika terdapat cacat produksi.</p>
                <p>📦 Produk yang sudah dicuci atau dipakai tidak dapat dikembalikan.</p>
              </div>
            </details>

            <details className="group border border-border rounded-xl bg-card overflow-hidden">
              <summary className="flex items-center justify-between px-4 py-3.5 text-sm font-bold cursor-pointer select-none list-none hover:bg-muted/50 transition-colors">
                <span>Cara Perawatan</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90 shrink-0" />
              </summary>
              <div className="px-4 pb-4 space-y-2 text-sm text-muted-foreground">
                <p>🫧 Cuci dengan tangan atau mesin cuci pada suhu maks. 30°C</p>
                <p>🚫 Jangan gunakan pemutih</p>
                <p>👕 Setrika pada suhu rendah</p>
                <p>🌿 Keringkan di tempat teduh, hindari sinar matahari langsung</p>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* ========== Mobile Sticky CTA Bar ========== */}
      {!isOutOfStock && (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-md border-t border-border p-3 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-xl overflow-hidden shrink-0 bg-muted border">
              <Image src={product.image} alt="" fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold truncate">{product.name}</h4>
              <span className="text-sm font-extrabold text-[#FF6B35]">
                Rp {(product.discountPrice || product.price).toLocaleString("id-ID")}
              </span>
            </div>
            <Button
              onClick={handleAddToCart}
              className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-bold text-xs h-11 px-5 rounded-xl flex items-center gap-1.5 shrink-0 shadow-lg shadow-[#FF6B35]/30"
            >
              <ShoppingBag className="h-4 w-4" />
              Beli
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
