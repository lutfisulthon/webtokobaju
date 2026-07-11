"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, Star } from "lucide-react"
import { useCartStore } from "@/lib/store/useCartStore"
import { useWishlistStore } from "@/lib/store/useWishlistStore"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Eye } from "lucide-react"
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
    variants: Array<{
      id: string
      sku: string
      size: string
      color: string
      stock: number
    }>
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [isQuickViewOpen, setIsQuickViewOpen] = React.useState(false)

  const addItem = useCartStore((state) => state.addItem)
  const wishlistItems = useWishlistStore((state) => state.items)
  const toggleWishlist = useWishlistStore((state) => state.addItem)
  const removeWishlist = useWishlistStore((state) => state.removeItem)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isWishlisted = mounted ? wishlistItems.some((item) => item.id === product.id) : false

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isWishlisted) {
      removeWishlist(product.id)
      toast.info(`Dihapus dari daftar keinginan: ${product.name}`)
    } else {
      toggleWishlist({
        id: product.id,
        name: product.name,
        price: product.discountPrice || product.price,
        image: product.image,
      })
      toast.success(`Ditambahkan ke daftar keinginan: ${product.name}`)
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const defaultVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null

    addItem({
      id: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.image,
      size: defaultVariant?.size,
      color: defaultVariant?.color,
    }, 1)

    toast.success(
      `Berhasil menambahkan ke keranjang: ${product.name}${
        defaultVariant ? ` (${defaultVariant.color}, Size ${defaultVariant.size})` : ""
      }`
    )
  }

  const activeImage = isHovered && product.images && product.images.length > 0 ? product.images[0] : product.image
  const discountPercentage = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0

  const isNew = (product as any).createdAt ? (Date.now() - new Date((product as any).createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000 : false
  const colors = React.useMemo(() => {
    if (!product.variants) return []
    return Array.from(new Set(product.variants.map((v) => v.color)))
  }, [product.variants])

  return (
    <>
      <Link
        href={`/shop/${product.slug}`}
        className="group relative flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Gallery */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <Image
            src={activeImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={false}
          />

          {/* Quick View Overlay Button */}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsQuickViewOpen(true)
              }}
              className="flex items-center gap-1.5 bg-background/95 text-foreground font-bold text-xs shadow hover:scale-105 hover:bg-background transition-all rounded-lg h-9 px-4"
            >
              <Eye className="h-4 w-4" />
              Quick View
            </Button>
          </div>

          {/* Wishlist Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleWishlistClick}
            className={cn(
              "absolute top-3 right-3 z-10 w-8 h-8 rounded-full border-transparent bg-background/80 dark:bg-background/50 backdrop-blur-sm shadow hover:bg-background hover:scale-110 transition-all",
              isWishlisted && "text-red-500 hover:text-red-600"
            )}
            aria-label="Tambah ke keinginan"
          >
            <Heart className="h-4.5 w-4.5" fill={isWishlisted ? "currentColor" : "none"} />
          </Button>

          {/* Promo or Status Badge */}
          {discountPercentage > 0 ? (
            <div className="absolute top-3 left-3 z-10 px-2 py-0.5 bg-[#FF6B35] text-white text-[10px] font-bold rounded uppercase">
              -{discountPercentage}% SALE
            </div>
          ) : isNew ? (
            <div className="absolute top-3 left-3 z-10 px-2 py-0.5 bg-green-600 text-white text-[10px] font-bold rounded uppercase">
              NEW
            </div>
          ) : product.price > 250000 ? (
            <div className="absolute top-3 left-3 z-10 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded uppercase">
              BEST SELLER
            </div>
          ) : null}
        </div>

        {/* Product Info */}
        <div className="flex flex-col flex-1 p-4">
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#FF6B35]">
              {product.category.name}
            </span>
            <div className="flex items-center gap-0.5 text-yellow-500">
              <Star className="h-3 w-3 fill-currentColor" />
              <span className="text-xs font-semibold text-foreground">4.5</span>
            </div>
          </div>

        {/* Product Name */}
        <h3 className="font-plus-jakarta font-bold text-sm line-clamp-2 mb-1 group-hover:text-[#FF6B35] transition-colors leading-tight">
          {product.name}
        </h3>

        {/* Colors Swatches */}
        {colors.length > 0 && (
          <div className="flex gap-1 mb-2.5 mt-1">
            {colors.map((color) => {
              const bgClass =
                color === "Hitam" ? "bg-black" :
                color === "Putih" ? "bg-white border" :
                color === "Sand" ? "bg-amber-100 border" :
                color === "Khaki" ? "bg-[#c3b091]" :
                color === "Beige" ? "bg-[#f5f5dc] border" :
                color === "Biru Muda" ? "bg-blue-300 border" :
                color === "Merah-Hitam" ? "bg-red-700" :
                color === "Hijau-Navy" ? "bg-emerald-800" :
                color === "Light Blue" ? "bg-sky-200" :
                color === "Charcoal" ? "bg-zinc-700" :
                color === "Brown" ? "bg-amber-800" :
                color === "Hijau" ? "bg-green-600" :
                color === "Navy" ? "bg-blue-900" : "bg-gray-400"
              return (
                <span
                  key={color}
                  className={cn("w-2.5 h-2.5 rounded-full inline-block", bgClass)}
                  title={color}
                />
              )
            })}
          </div>
        )}

        {/* Price & Add to Cart button */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-border/50">
          <div className="flex flex-col">
            {product.discountPrice ? (
              <>
                <span className="text-xs text-muted-foreground line-through">
                  Rp {product.price.toLocaleString("id-ID")}
                </span>
                <span className="font-plus-jakarta font-extrabold text-sm text-[#FF6B35]">
                  Rp {product.discountPrice.toLocaleString("id-ID")}
                </span>
              </>
            ) : (
              <span className="font-plus-jakarta font-extrabold text-sm text-foreground">
                Rp {product.price.toLocaleString("id-ID")}
              </span>
            )}
          </div>

          <Button
            size="icon"
            onClick={handleAddToCart}
            className="w-8 h-8 rounded-lg bg-[#111111] dark:bg-foreground hover:bg-[#FF6B35] dark:hover:bg-[#FF6B35] text-white dark:text-background dark:hover:text-white"
            aria-label="Tambah ke keranjang"
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
    {/* Quick View Modal */}
    <QuickViewModal
      isOpen={isQuickViewOpen}
      onClose={() => setIsQuickViewOpen(false)}
      product={product as any}
    />
  </>
  )
}
