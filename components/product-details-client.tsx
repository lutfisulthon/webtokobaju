"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, Star, Truck, ShieldCheck, RefreshCw, ChevronRight, Home } from "lucide-react"
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
  }
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const allImages = React.useMemo(() => [product.image, ...product.images], [product])
  const [activeImage, setActiveImage] = React.useState(allImages[0])
  const [quantity, setQuantity] = React.useState(1)

  // Get distinct colors and sizes
  const colors = React.useMemo(() => {
    return Array.from(new Set(product.variants.map((v) => v.color)))
  }, [product.variants])

  const [selectedColor, setSelectedColor] = React.useState(colors[0] || "")
  
  // Available sizes for the selected color
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

    // Auto-preview color variant image if available
    const variantWithImage = product.variants.find((v) => v.color === selectedColor && v.imageUrl)
    console.log("DEBUG Preview - Color:", selectedColor, "Found Variant Image:", variantWithImage?.imageUrl)
    if (variantWithImage?.imageUrl) {
      setActiveImage(variantWithImage.imageUrl)
    }
  }, [selectedColor, availableSizes, selectedSize, product.variants])

  // Get active variant details
  const activeVariant = React.useMemo(() => {
    return product.variants.find((v) => v.color === selectedColor && v.size === selectedSize)
  }, [product.variants, selectedColor, selectedSize])

  const isOutOfStock = !activeVariant || activeVariant.stock <= 0

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
      toast.success("Ditambahkan ke daftar keinginan.")
    }
  }

  const handleAddToCart = () => {
    if (isOutOfStock) return

    addItem({
      id: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor,
    }, quantity)

    toast.success(`Ditambahkan ke keranjang: ${product.name} (${selectedColor}, Size ${selectedSize}) x${quantity}`)
  }

  return (
    <div className="relative">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground flex items-center gap-1.5">
          <Home className="h-3.5 w-3.5" />
          Beranda
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/shop" className="hover:text-foreground">Katalog</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/shop?category=${product.category.slug}`} className="hover:text-foreground capitalize">
          {product.category.name}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground line-clamp-1">{product.name}</span>
      </nav>

      {/* Main product grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-muted border">
            <Image
              src={activeImage}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={cn(
                    "relative aspect-square w-20 rounded-lg overflow-hidden border shrink-0 bg-muted transition-all",
                    activeImage === img ? "border-[#FF6B35] ring-2 ring-[#FF6B35]/20 scale-95" : "border-border hover:border-foreground"
                  )}
                  aria-label={`Lihat gambar ${idx + 1}`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info & Options */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF6B35]">
              {product.category.name}
            </span>
            <h1 className="font-plus-jakarta font-extrabold text-2xl md:text-3xl tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating & Wishlist */}
            <div className="flex items-center justify-between gap-4 py-1">
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-currentColor" />
                ))}
                <span className="text-xs font-semibold text-foreground ml-1">4.5 (12 Ulasan)</span>
              </div>
              <button
                onClick={handleWishlistToggle}
                className={cn(
                  "p-2 rounded-full border bg-card text-muted-foreground hover:text-foreground transition-colors",
                  isWishlisted && "text-red-500 hover:text-red-600 border-red-100 bg-red-50/50"
                )}
                aria-label="Simpan ke wishlist"
              >
                <Heart className="h-5 w-5" fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-muted/40 rounded-xl flex items-center gap-4">
            {product.discountPrice ? (
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-plus-jakarta font-extrabold text-2xl text-[#FF6B35]">
                    Rp {product.discountPrice.toLocaleString("id-ID")}
                  </span>
                  <span className="px-2 py-0.5 bg-[#FF6B35]/15 text-[#FF6B35] text-[10px] font-extrabold rounded">
                    -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                  </span>
                </div>
                <span className="text-xs text-muted-foreground line-through">
                  Rp {product.price.toLocaleString("id-ID")}
                </span>
              </div>
            ) : (
              <span className="font-plus-jakarta font-extrabold text-2xl text-foreground">
                Rp {product.price.toLocaleString("id-ID")}
              </span>
            )}
          </div>

          {/* Variant Selector: Color */}
          {colors.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                Pilih Warna: <span className="text-foreground capitalize">{selectedColor}</span>
              </span>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "text-xs px-4 py-2 border rounded-full font-bold transition-all hover:border-foreground",
                      selectedColor === color
                        ? "border-[#FF6B35] bg-[#FF6B35]/5 text-[#FF6B35] font-extrabold"
                        : "border-border text-muted-foreground"
                    )}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Variant Selector: Size */}
          {availableSizes.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                Pilih Ukuran: <span className="text-foreground">{selectedSize}</span>
              </span>
              <div className="flex gap-2.5">
                {availableSizes.map((v) => {
                  const sizeOutOfStock = v.stock <= 0
                  return (
                    <button
                      key={v.id}
                      disabled={sizeOutOfStock}
                      onClick={() => setSelectedSize(v.size)}
                      className={cn(
                        "text-xs w-11 h-11 border rounded-lg font-bold flex items-center justify-center transition-all focus:outline-none focus:ring-1 focus:ring-[#FF6B35]",
                        selectedSize === v.size
                          ? "border-[#FF6B35] bg-[#FF6B35] text-white font-extrabold"
                          : "border-border hover:border-foreground text-muted-foreground",
                        sizeOutOfStock && "opacity-40 cursor-not-allowed bg-muted line-through hover:border-border"
                      )}
                    >
                      {v.size}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Quantity & Stock Status */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Jumlah</span>
              {activeVariant && (
                <span className={cn("text-xs font-bold", isOutOfStock ? "text-red-500" : "text-emerald-600")}>
                  {isOutOfStock ? "Stok Habis" : `Tersisa ${activeVariant.stock} pcs`}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg h-11 bg-card">
                <button
                  disabled={quantity <= 1 || isOutOfStock}
                  onClick={() => setQuantity(quantity - 1)}
                  className="w-10 h-full flex items-center justify-center hover:bg-muted disabled:opacity-30 rounded-l-lg transition-colors font-bold"
                  aria-label="Kurangi jumlah"
                >
                  -
                </button>
                <span className="w-12 text-center font-bold text-sm" aria-label="Jumlah yang dibeli">
                  {quantity}
                </span>
                <button
                  disabled={isOutOfStock || (activeVariant && quantity >= activeVariant.stock)}
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-full flex items-center justify-center hover:bg-muted disabled:opacity-30 rounded-r-lg transition-colors font-bold"
                  aria-label="Tambah jumlah"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="flex-1 bg-[#111111] dark:bg-foreground hover:bg-[#FF6B35] dark:hover:bg-[#FF6B35] text-white dark:text-background dark:hover:text-white font-bold h-11 rounded-lg gap-2 shadow-lg shadow-black/5"
              >
                <ShoppingBag className="h-4.5 w-4.5" />
                {isOutOfStock ? "Habis Terjual" : "Tambah ke Keranjang"}
              </Button>
            </div>
          </div>

          {/* Delivery & Protection Badges */}
          <div className="border-t pt-6 space-y-4 text-xs text-muted-foreground font-semibold">
            <div className="flex items-center gap-3">
              <Truck className="h-4 w-4 text-[#FF6B35]" />
              <span>Pengiriman Cepat & Gratis Ongkir (min Rp 500k)</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Jaminan Kualitas Bahan Premium Teruji</span>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw className="h-4 w-4 text-primary" />
              <span>Kemudahan Retur Ukuran hingga 7 Hari Kerja</span>
            </div>
          </div>

          {/* Extra Product Description Accordion */}
          <div className="border-t pt-6 space-y-4">
            <details className="group border rounded-xl p-4 bg-card cursor-pointer" open>
              <summary className="flex items-center justify-between text-sm font-bold list-none">
                <span>Deskripsi Produk</span>
                <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
              </summary>
              <p className="text-xs text-muted-foreground leading-relaxed mt-3 whitespace-pre-line font-medium">
                {product.description}
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Add to Cart Bar */}
      {!isOutOfStock && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t p-3 md:hidden flex items-center justify-between gap-4 animate-fade-in shadow-xl">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative h-11 w-11 rounded-lg overflow-hidden shrink-0 bg-muted">
              <Image src={product.image} alt="" fill className="object-cover" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold truncate">{product.name}</h4>
              <span className="text-xs font-extrabold text-[#FF6B35]">
                Rp {(product.discountPrice || product.price).toLocaleString("id-ID")}
              </span>
            </div>
          </div>
          <Button
            onClick={handleAddToCart}
            className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-extrabold text-xs h-10 px-4 rounded-lg flex items-center gap-1.5 shrink-0"
          >
            <ShoppingBag className="h-4 w-4" />
            Beli
          </Button>
        </div>
      )}
    </div>
  )
}
