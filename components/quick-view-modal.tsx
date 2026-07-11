"use client"

import * as React from "react"
import Image from "next/image"
import { ShoppingBag, Star } from "lucide-react"
import { useCartStore } from "@/lib/store/useCartStore"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ProductVariant {
  id: string
  sku: string
  size: string
  color: string
  imageUrl?: string | null
  stock: number
}

interface QuickViewModalProps {
  isOpen: boolean
  onClose: () => void
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

export function QuickViewModal({ isOpen, onClose, product }: QuickViewModalProps) {
  const allImages = React.useMemo(() => [product.image, ...product.images], [product])
  const [activeImage, setActiveImage] = React.useState(allImages[0])
  const [quantity, setQuantity] = React.useState(1)

  // Get distinct colors and sizes
  const colors = React.useMemo(() => {
    return Array.from(new Set(product.variants.map((v) => v.color)))
  }, [product.variants])

  const [selectedColor, setSelectedColor] = React.useState(colors[0] || "")

  const availableSizes = React.useMemo(() => {
    return product.variants.filter((v) => v.color === selectedColor)
  }, [product.variants, selectedColor])

  const [selectedSize, setSelectedSize] = React.useState(availableSizes[0]?.size || "")

  // Sync size & active image when color changes
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

  const activeVariant = React.useMemo(() => {
    return product.variants.find((v) => v.color === selectedColor && v.size === selectedSize)
  }, [product.variants, selectedColor, selectedSize])

  const isOutOfStock = !activeVariant || activeVariant.stock <= 0

  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    if (isOutOfStock) return

    addItem({
      id: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: activeImage,
      size: selectedSize,
      color: selectedColor,
    }, quantity)

    toast.success(`Berhasil menambahkan ke keranjang: ${product.name} (${selectedColor}, Size ${selectedSize})`)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl p-6 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Left: Product Images */}
          <div className="space-y-3">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-muted border">
              <Image
                src={activeImage}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 max-w-full">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={cn(
                      "relative w-14 h-18 rounded-lg overflow-hidden border flex-shrink-0 transition-all",
                      activeImage === img ? "border-[#FF6B35] ring-1 ring-[#FF6B35]" : "border-border hover:border-foreground"
                    )}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${idx}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product details & actions */}
          <div className="flex flex-col h-full justify-between space-y-4">
            <div>
              {/* Category & Stars */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  {product.category.name}
                </span>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-3.5 w-3.5 fill-currentColor" />
                  <span className="text-xs font-bold text-foreground">4.5</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="font-plus-jakarta font-extrabold text-xl leading-tight text-foreground mt-1 mb-2">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                {product.discountPrice ? (
                  <>
                    <span className="font-plus-jakarta font-extrabold text-xl text-[#FF6B35]">
                      Rp {product.discountPrice.toLocaleString("id-ID")}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      Rp {product.price.toLocaleString("id-ID")}
                    </span>
                  </>
                ) : (
                  <span className="font-plus-jakarta font-extrabold text-xl text-foreground">
                    Rp {product.price.toLocaleString("id-ID")}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Color Selector */}
              {colors.length > 0 && (
                <div className="space-y-2 mb-4">
                  <span className="text-xs font-bold text-foreground">Warna: <span className="font-medium text-muted-foreground">{selectedColor}</span></span>
                  <div className="flex gap-2">
                    {colors.map((color) => {
                      const isActive = selectedColor === color
                      return (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all hover:bg-muted",
                            isActive ? "border-[#FF6B35] text-[#FF6B35] bg-[#FF6B35]/5" : "border-border text-foreground"
                          )}
                        >
                          {color}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {availableSizes.length > 0 && (
                <div className="space-y-2 mb-4">
                  <span className="text-xs font-bold text-foreground">Ukuran: <span className="font-medium text-muted-foreground">{selectedSize}</span></span>
                  <div className="flex gap-2">
                    {availableSizes.map((v) => {
                      const isActive = selectedSize === v.size
                      const outOfStock = v.stock <= 0
                      return (
                        <button
                          key={v.size}
                          onClick={() => !outOfStock && setSelectedSize(v.size)}
                          disabled={outOfStock}
                          className={cn(
                            "w-9 h-9 rounded-lg border text-xs font-bold transition-all flex items-center justify-center relative",
                            isActive
                              ? "bg-foreground text-background border-foreground"
                              : "border-border text-foreground hover:bg-muted",
                            outOfStock && "opacity-40 cursor-not-allowed bg-muted line-through"
                          )}
                        >
                          {v.size}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity and CTA Button */}
            <div className="space-y-4 pt-4 border-t">
              {/* Stock Indicator */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">Ketersediaan:</span>
                {isOutOfStock ? (
                  <span className="font-bold text-red-500">Stok Habis</span>
                ) : (
                  <span className="font-bold text-green-600">Ready Stock ({activeVariant?.stock} pcs)</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border rounded-lg h-10 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock || quantity <= 1}
                    className="px-3 h-full hover:bg-muted text-foreground font-semibold disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-foreground">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(activeVariant?.stock || 1, quantity + 1))}
                    disabled={isOutOfStock || quantity >= (activeVariant?.stock || 1)}
                    className="px-3 h-full hover:bg-muted text-foreground font-semibold disabled:opacity-50"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 h-10 bg-[#FF6B35] hover:bg-[#ff8052] text-white font-bold text-xs gap-2 rounded-lg transition-colors"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Tambah ke Keranjang
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
