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
  ChevronLeft,
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
    gender?: string
    variants: ProductVariant[]
    rating?: number
    reviewCount?: number
  }
}

const COLOR_HEX: Record<string, string> = {
  Hitam: "#1A1A1A",
  Putih: "#FFFFFF",
  Abu: "#9E9E9E",
  Navy: "#1B2A4A",
  Coklat: "#795548",
  Hijau: "#4A6741",
  Merah: "#C0392B",
  Pink: "#F8BBD0",
  Cream: "#F5F0E8",
  Olive: "#6B6B47",
  Beige: "#E8DDD0",
  Charcoal: "#4A4A4A",
  Sand: "#C8B89A",
  Khaki: "#C3B091",
  "Biru Muda": "#90CAF9",
  "Light Blue": "#B3D9F0",
  "Merah-Hitam": "#7B1A1A",
  "Hijau-Navy": "#1A3D2B",
  Brown: "#795548",
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
          <div className="lg:sticky lg:top-24 flex gap-4 items-start">
            {/* Vertical Thumbnails */}
            {allImages.length > 1 && (
              <div className="hidden md:flex flex-col gap-3 shrink-0 overflow-y-auto max-h-[520px] pr-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={cn(
                      "relative aspect-[3/4] w-20 rounded-xl overflow-hidden border-2 shrink-0 bg-muted transition-all duration-200",
                      activeImage === img
                        ? "border-[#FF6B35] ring-2 ring-[#FF6B35]/20 shadow-sm"
                        : "border-transparent hover:border-border"
                    )}
                    aria-label={`Lihat gambar ${idx + 1}`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image Container */}
            <div className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 group border border-border/50">
              <Image
                src={activeImage}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                priority
              />

              {/* Prev/Next Navigation Overlays */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  const currentIndex = allImages.indexOf(activeImage)
                  const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length
                  setActiveImage(allImages[prevIndex])
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-foreground flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
                aria-label="Gambar sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  const currentIndex = allImages.indexOf(activeImage)
                  const nextIndex = (currentIndex + 1) % allImages.length
                  setActiveImage(allImages[nextIndex])
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-foreground flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
                aria-label="Gambar berikutnya"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                <span className="px-2.5 py-1 bg-[#1A1A1A] text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                  BEST SELLER
                </span>
                <span className="px-2.5 py-1 bg-[#FF6B35] text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider shadow-md">
                  NEW
                </span>
              </div>

              {/* Zoom trigger ("Perbesar") */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setZoomOpen(true)
                }}
                className="absolute bottom-4 right-4 bg-white hover:bg-muted text-foreground font-semibold text-xs py-2 px-3.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
              >
                <ZoomIn className="h-3.5 w-3.5" />
                Perbesar
              </button>
            </div>
          </div>
        </div>

        {/* ========== Right Column: Product Info ========== */}
        <div className="lg:col-span-5 space-y-7">

          {/* Header: Category + Actions */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF6B35]">
                  {product.gender ? `${product.gender.toUpperCase()} • ` : ""}{product.category.name.toUpperCase()}
                </span>
              </div>
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
          <div className="flex items-center gap-3">
            <StarRating rating={rating} count={reviewCount} />
            <span className="text-muted-foreground text-xs font-semibold">|</span>
            <span className="text-xs font-bold text-foreground">512 Terjual</span>
          </div>

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
                    - {discountPct}%
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

          {/* Premium Shield Trust Badge */}
          <div className="bg-emerald-50/50 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30 rounded-2xl p-4 flex gap-3 items-start">
            <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400">Garansi Ori UrbanWear</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-500/80 leading-relaxed mt-0.5">
                Semua produk merupakan produk asli dengan kualitas terbaik. Jika terbukti tidak original, kami memberikan garansi pengembalian dana sesuai kebijakan UrbanWear.
              </p>
            </div>
          </div>

          {/* Color Selector */}
          {colors.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  PILIH WARNA: <span className="text-foreground capitalize">{selectedColor}</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => {
                  const hex = COLOR_HEX[color] ?? "#ccc";
                  const isSelected = selectedColor === color;
                  const isWhite = color.toLowerCase() === "putih" || color.toLowerCase() === "cream";
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center relative",
                        isSelected
                          ? "border-[#FF6B35] scale-110 shadow-sm"
                          : "border-border hover:border-foreground/40"
                      )}
                      title={color}
                      aria-label={`Warna ${color}`}
                    >
                      <span
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: hex }}
                      />
                      {isSelected && (
                        <span className={cn(
                          "absolute inset-0 flex items-center justify-center text-[10px] font-extrabold",
                          isWhite ? "text-black" : "text-white"
                        )}>
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {availableSizes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  PILIH UKURAN: <span className="text-foreground">{selectedSize}</span>
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
                        "relative text-xs w-20 h-10 border-2 rounded-xl font-bold flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]",
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

          {/* Stock Info */}
          {activeVariant && (
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-muted-foreground">Jumlah:</span>
              <span className={cn(
                "px-2 py-0.5 rounded-md",
                isOutOfStock
                  ? "bg-red-50 text-red-600"
                  : activeVariant.stock <= 5
                    ? "bg-amber-50 text-amber-600"
                    : "bg-emerald-50 text-emerald-600"
              )}>
                {isOutOfStock ? "Stok habis" : `Tersisa ${activeVariant.stock} pcs`}
              </span>
            </div>
          )}

          {/* Stepper + Buttons */}
          <div className="space-y-4">
            <div className="flex items-stretch gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border-2 border-border rounded-xl bg-card overflow-hidden shrink-0">
                <button
                  disabled={quantity <= 1 || isOutOfStock}
                  onClick={() => setQuantity(quantity - 1)}
                  className="w-10 h-11 flex items-center justify-center hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Kurangi jumlah"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center font-bold text-sm select-none">{quantity}</span>
                <button
                  disabled={isOutOfStock || (!!activeVariant && quantity >= activeVariant.stock)}
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-11 flex items-center justify-center hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
                  "flex-1 h-11 rounded-xl font-bold text-xs gap-2 transition-all duration-300 shadow-sm border",
                  addedToCart
                    ? "bg-emerald-500 hover:bg-emerald-500 text-white border-emerald-500"
                    : isOutOfStock
                      ? "bg-muted text-muted-foreground cursor-not-allowed border-transparent"
                      : "bg-white border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35]/5 shadow-sm"
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
                    Masukkan Keranjang
                  </>
                )}
              </Button>
            </div>

            {/* Beli Sekarang Button */}
            <Button
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={cn(
                "w-full h-12 rounded-xl font-bold text-sm transition-all duration-300 shadow-md",
                isOutOfStock
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-[#FF6B35] hover:bg-orange-600 text-white shadow-[#FF6B35]/20"
              )}
            >
              Beli Sekarang
            </Button>
          </div>

          {/* Quick Shipping Guarantees */}
          <div className="grid grid-cols-2 gap-3.5 pt-2">
            <div className="flex items-center gap-2.5 text-xs">
              <Truck className="h-4 w-4 text-[#FF6B35] shrink-0" />
              <div>
                <p className="font-bold text-foreground">Gratis Ongkir</p>
                <p className="text-[10px] text-muted-foreground">Min. belanja Rp150k</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-xs">
              <RefreshCw className="h-4 w-4 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-foreground">Pengiriman Cepat</p>
                <p className="text-[10px] text-muted-foreground">Dikirim dalam 1-2 hari</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ========== Service Guarantees Row (4 icons) ========== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-8 border-t border-b border-border my-12">
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-600 dark:text-emerald-500 shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">Garansi Ori UrbanWear</p>
            <p className="text-[11px] text-muted-foreground">100% original atau uang kembali</p>
          </div>
        </div>
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-600 dark:text-blue-500 shrink-0">
            <RefreshCw className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">7 Hari Pengembalian</p>
            <p className="text-[11px] text-muted-foreground">Tidak cocok? Bisa retur</p>
          </div>
        </div>
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-500 shrink-0">
            <Star className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">Bahan Berkualitas</p>
            <p className="text-[11px] text-muted-foreground">Nyaman dipakai setiap hari</p>
          </div>
        </div>
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <div className="w-10 h-10 rounded-full bg-[#FFF5F0] dark:bg-orange-950/20 flex items-center justify-center text-[#FF6B35] shrink-0">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">Produk Pilihan</p>
            <p className="text-[11px] text-muted-foreground">Dipilih &amp; ditestet ketat</p>
          </div>
        </div>
      </div>

      {/* ========== 3-Column Specifications & Reviews Section ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 pb-16">
        
        {/* Column 1: Deskripsi & Detail (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          <div>
            <h3 className="font-plus-jakarta font-extrabold text-sm uppercase tracking-wider text-foreground mb-4">
              Deskripsi Produk
            </h3>
            <ul className="list-disc pl-4 space-y-2 text-xs text-muted-foreground leading-relaxed">
              <li>Kualitas premium pilihan terbaik untuk kenyamanan aktivitas sehari-hari.</li>
              <li>Bahan serat alami berpori memberikan sirkulasi udara optimal.</li>
              <li>Didesain ramah kulit, tidak menyebabkan iritasi atau rasa gerah.</li>
              <li>Konstruksi jahitan presisi dan kuat menjamin ketahanan pemakaian jangka panjang.</li>
              <li>Gaya kasual minimalis yang mudah dipadu-padankan dengan busana favorit.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-plus-jakarta font-extrabold text-sm uppercase tracking-wider text-foreground mb-4">
              Detail Produk
            </h3>
            <div className="border border-border rounded-xl overflow-hidden text-xs">
              {[
                { name: "Kategori", val: product.category.name },
                { name: "Material", val: "Katun Stretch Premium" },
                { name: "Panjang", val: "Panjang Penuh" },
                { name: "Pangang", val: "Elastis" },
                { name: "Motif", val: "Polos" },
                { name: "Ketebalan", val: "Sedang" },
                { name: "Kesesuaian Usia", val: "4 - 12 Tahun" },
                { name: "Jenis Kelamin", val: product.gender ? (product.gender.includes("anak") ? "Anak-anak" : product.gender) : "Unisex" },
              ].map((row, i) => (
                <div key={row.name} className={cn("flex justify-between p-3 border-b border-border/50 last:border-0", i % 2 === 0 ? "bg-muted/10" : "bg-card")}>
                  <span className="font-semibold text-muted-foreground">{row.name}</span>
                  <span className="text-foreground capitalize">{row.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Ulasan Produk (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="font-plus-jakarta font-extrabold text-sm uppercase tracking-wider text-foreground mb-2">
            Ulasan Produk ({reviewCount})
          </h3>
          
          <div className="flex items-center gap-6 p-4 border border-border rounded-xl bg-card">
            <div className="text-center shrink-0">
              <p className="text-4xl font-extrabold text-foreground">{rating.toFixed(1)}</p>
              <div className="flex justify-center gap-0.5 my-1">
                {[1,2,3,4,5].map(s => <Star key={s} className="h-3 w-3 text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-[10px] text-muted-foreground">{reviewCount} Ulasan</p>
            </div>
            <div className="flex-1 space-y-1">
              {[
                { star: 5, pct: 85, count: 96 },
                { star: 4, pct: 15, count: 28 },
                { star: 3, pct: 0, count: 0 },
                { star: 2, pct: 0, count: 0 },
                { star: 1, pct: 0, count: 0 },
              ].map(row => (
                <div key={row.star} className="flex items-center gap-2 text-[10px]">
                  <span className="w-2 font-bold text-muted-foreground">{row.star}</span>
                  <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400" />
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${row.pct}%` }} />
                  </div>
                  <span className="w-6 text-right text-muted-foreground">({row.count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* User Reviews List */}
          <div className="space-y-4">
            {[
              {
                user: "Rian Pratama",
                rating: 5,
                time: "5 hari lalu",
                var: "Khaki, 6 Tahun",
                text: "Bahan bagus, lembut dan nyaman dipakai anak saya. Jahitannya rapi, sesuai harga!",
                pics: ["https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=80&h=80&fit=crop"]
              },
              {
                user: "Dewi Anggraini",
                rating: 5,
                time: "1 minggu lalu",
                var: "Navy, 4 Tahun",
                text: "Bagus banget! Pinggang elastisnya pas, anak bebas bergerak.",
                pics: []
              },
              {
                user: "Budi Santoso",
                rating: 4,
                time: "2 minggu lalu",
                var: "Beige, 8 Tahun",
                text: "Kualitas oke, warna sesuai gambar. Pengiriman cepat.",
                pics: []
              }
            ].map((rev, i) => (
              <div key={i} className="border-b border-border/50 pb-4 last:border-0">
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <p className="font-bold text-xs text-foreground">{rev.user}</p>
                    <p className="text-[10px] text-muted-foreground">{rev.time} · Variasi: {rev.var}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: rev.rating }).map((_, s) => (
                      <Star key={s} className="h-3 w-3 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{rev.text}</p>
                {rev.pics.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {rev.pics.map((p, idx) => (
                      <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted border">
                        <Image src={p} alt="" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full text-xs font-bold rounded-xl h-10 border-border hover:bg-muted">
            Lihat Semua Ulasan
          </Button>
        </div>

        {/* Column 3: Informasi Pengiriman & Kebijakan (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <h3 className="font-plus-jakarta font-extrabold text-sm uppercase tracking-wider text-foreground mb-4">
              Informasi Pengiriman
            </h3>
            <div className="border border-border rounded-xl p-4 bg-card text-xs space-y-4">
              <div className="flex justify-between">
                <span className="font-semibold text-muted-foreground">Dikirim dari</span>
                <span className="text-foreground font-bold">Jakarta</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-muted-foreground">Ongkos Kirim</span>
                <div className="text-right">
                  <span className="text-emerald-600 font-bold block">Gratis Ongkir</span>
                  <span className="text-[10px] text-muted-foreground">Min. belanja Rp150.000</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-muted-foreground">Estimasi Sampai</span>
                <span className="text-foreground font-bold">1 ~ 2 Hari</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-muted-foreground">Layanan</span>
                <span className="text-foreground font-semibold">Reguler - Instant - Same Day</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-plus-jakarta font-extrabold text-sm uppercase tracking-wider text-foreground mb-4">
              Kebijakan Pengembalian
            </h3>
            <div className="border border-border rounded-xl p-4 bg-card text-xs space-y-4">
              <div className="flex gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center shrink-0">
                  <RefreshCw className="h-3 w-3 text-blue-500" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Garansi 7 Hari</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Tidak cocok? Ajukan pengembalian dalam 7 hari sejak barang diterima.</p>
                </div>
              </div>
              <div className="h-px bg-border/60" />
              <div className="flex gap-2.5">
                <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                  <Info className="h-3 w-3 text-zinc-400" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Syarat &amp; Ketentuan</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Produk harus dalam kondisi baru, belum dipakai, dan lengkap dengan label.</p>
                </div>
              </div>
            </div>
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
