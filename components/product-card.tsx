"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, Star, Eye, Zap } from "lucide-react"
import { useCartStore } from "@/lib/store/useCartStore"
import { useWishlistStore } from "@/lib/store/useWishlistStore"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { QuickViewModal } from "@/components/quick-view-modal"

export interface ProductCardProps {
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
    variants: Array<{
      id: string
      sku: string
      size: string
      color: string
      stock: number
    }>
  }
}

const COLOR_HEX: Record<string, string> = {
  Hitam: "#1A1A1A",
  Putih: "#F8F8F5",
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

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [isQuickViewOpen, setIsQuickViewOpen] = React.useState(false)
  const [addedFeedback, setAddedFeedback] = React.useState(false)

  const addItem = useCartStore((state) => state.addItem)
  const wishlistItems = useWishlistStore((state) => state.items)
  const toggleWishlist = useWishlistStore((state) => state.addItem)
  const removeWishlist = useWishlistStore((state) => state.removeItem)

  React.useEffect(() => { setMounted(true) }, [])

  const isWishlisted = mounted ? wishlistItems.some((item) => item.id === product.id) : false

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (isWishlisted) {
      removeWishlist(product.id)
      toast.info("Dihapus dari wishlist")
    } else {
      toggleWishlist({ id: product.id, name: product.name, price: product.discountPrice || product.price, image: product.image })
      toast.success("Ditambahkan ke wishlist ❤️")
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    const defaultVariant = product.variants?.[0]
    addItem({ id: product.id, name: product.name, price: product.discountPrice || product.price, image: product.image, size: defaultVariant?.size, color: defaultVariant?.color }, 1)
    setAddedFeedback(true)
    toast.success(`${product.name} ditambahkan ke keranjang 🛍️`)
    setTimeout(() => setAddedFeedback(false), 1800)
  }

  const activeImage = isHovered && product.images?.length > 0 ? product.images[0] : product.image
  const discountPct = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0
  const isNew = (product as any).createdAt
    ? Date.now() - new Date((product as any).createdAt).getTime() < 14 * 24 * 60 * 60 * 1000
    : false
  const isBestSeller = !isNew && !product.discountPrice && product.price > 250000

  const colors = React.useMemo(
    () => Array.from(new Set(product.variants?.map((v) => v.color) ?? [])),
    [product.variants]
  )

  // Static rating (would come from DB in production)
  const rating = 4.5

  return (
    <>
      <Link
        href={`/shop/${product.slug}`}
        className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1.5 border border-[#F0F0EC]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#F8F8F5]">
          <Image
            src={activeImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-108"
            priority={false}
          />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {discountPct > 0 && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-[#FF6B35] text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider shadow-md">
                <Zap className="h-2.5 w-2.5" />
                -{discountPct}%
              </span>
            )}
            {isNew && (
              <span className="px-2.5 py-1 bg-[#1A1A1A] text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                NEW
              </span>
            )}
            {isBestSeller && (
              <span className="px-2.5 py-1 bg-[#2E7D32] text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                BEST SELLER
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            className={cn(
              "absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 shadow-sm",
              isWishlisted
                ? "bg-red-50 text-red-500 border border-red-100"
                : "bg-white/80 text-[#1A1A1A] border border-white/60 hover:bg-white hover:scale-110"
            )}
            aria-label="Tambah ke wishlist"
          >
            <Heart className="h-4 w-4" fill={isWishlisted ? "currentColor" : "none"} />
          </button>

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-end pb-5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <button
              onClick={(e) => {
                e.preventDefault(); e.stopPropagation()
                setIsQuickViewOpen(true)
              }}
              className="flex items-center gap-2 bg-white text-[#1A1A1A] font-bold text-[12px] px-5 py-2.5 rounded-xl shadow-lg hover:bg-[#1A1A1A] hover:text-white transition-all duration-200 border border-white"
            >
              <Eye className="h-4 w-4" />
              Quick View
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col flex-1 p-4 gap-2">
          {/* Category + Rating Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF6B35]">
                {product.category.name}
              </span>
              {product.gender && (
                <>
                  <span className="text-[10px] text-[#CCC]">•</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#888]">
                    {product.gender.toLowerCase().includes("anak") ? "ANAK" : product.gender}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
              <span className="text-[11px] font-bold text-[#1A1A1A]">{rating}</span>
              <span className="text-[10px] text-[#999]">(12)</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-[13px] text-[#1A1A1A] line-clamp-2 leading-snug group-hover:text-[#FF6B35] transition-colors duration-200">
            {product.name}
          </h3>

          {/* Color Swatches */}
          {colors.length > 0 && (
            <div className="flex items-center gap-1.5 mt-0.5">
              {colors.slice(0, 5).map((color) => {
                const hex = COLOR_HEX[color] ?? "#ccc"
                const isLight = ["Putih", "Cream", "Beige", "Pink", "Light Blue", "Biru Muda"].includes(color)
                return (
                  <span
                    key={color}
                    title={color}
                    className={cn(
                      "w-4 h-4 rounded-full border shrink-0 transition-transform hover:scale-110",
                      isLight ? "border-[#DEDED9]" : "border-transparent"
                    )}
                    style={{ backgroundColor: hex }}
                  />
                )
              })}
              {colors.length > 5 && (
                <span className="text-[10px] text-[#999] font-medium">+{colors.length - 5}</span>
              )}
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Price + Cart Button */}
          <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-[#F0F0EC]">
            <div className="flex flex-col leading-tight">
              {product.discountPrice ? (
                <>
                  <span className="text-[10px] text-[#AAA] line-through">
                    Rp {product.price.toLocaleString("id-ID")}
                  </span>
                  <span className="font-extrabold text-[14px] text-[#FF6B35]">
                    Rp {product.discountPrice.toLocaleString("id-ID")}
                  </span>
                </>
              ) : (
                <span className="font-extrabold text-[14px] text-[#1A1A1A]">
                  Rp {product.price.toLocaleString("id-ID")}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold transition-all duration-200 shrink-0",
                addedFeedback
                  ? "bg-[#2E7D32] text-white"
                  : "bg-[#1A1A1A] hover:bg-[#FF6B35] text-white shadow-sm"
              )}
              aria-label="Tambah ke keranjang"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              {addedFeedback ? "✓" : "Beli"}
            </button>
          </div>
        </div>
      </Link>

      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={product as any}
      />
    </>
  )
}
