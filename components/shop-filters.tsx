"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ShopFiltersProps {
  categories: Array<{ id: string; name: string; slug: string }>
}

export function ShopFilters({ categories }: ShopFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [isOpen, setIsOpen] = React.useState(false)
  const [minPrice, setMinPrice] = React.useState(searchParams.get("minPrice") || "")
  const [maxPrice, setMaxPrice] = React.useState(searchParams.get("maxPrice") || "")
  const [selectedSize, setSelectedSize] = React.useState(searchParams.get("size") || "")
  const [selectedColor, setSelectedColor] = React.useState(searchParams.get("color") || "")
  const [selectedBrand, setSelectedBrand] = React.useState(searchParams.get("brand") || "")
  const [selectedRating, setSelectedRating] = React.useState(searchParams.get("rating") || "")
  const [selectedPromo, setSelectedPromo] = React.useState(searchParams.get("promo") || "")
  const [selectedStock, setSelectedStock] = React.useState(searchParams.get("stock") || "")

  const activeCategory = searchParams.get("category") || ""
  const activeSort = searchParams.get("sort") || "newest"

  // Constants
  const SIZES = ["XS", "S", "M", "L", "XL", "XXL"]
  const COLORS = [
    { name: "Hitam", hex: "#000000", bg: "bg-black" },
    { name: "Putih", hex: "#ffffff", bg: "bg-white border-border" },
    { name: "Abu", hex: "#808080", bg: "bg-gray-500" },
    { name: "Navy", hex: "#000080", bg: "bg-blue-900" },
    { name: "Coklat", hex: "#8b4513", bg: "bg-amber-800" },
    { name: "Hijau", hex: "#008000", bg: "bg-green-600" },
    { name: "Merah", hex: "#ff0000", bg: "bg-red-600" },
    { name: "Pink", hex: "#ffc0cb", bg: "bg-pink-300" },
    { name: "Cream", hex: "#fffdd0", bg: "bg-yellow-50 border-border" }
  ]
  const BRANDS = ["UrbanWear", "Zara", "H&M", "Uniqlo"]
  const PROMOS = [
    { id: "diskon", label: "Diskon" },
    { id: "flash_sale", label: "Flash Sale" },
    { id: "gratis_ongkir", label: "Gratis Ongkir" }
  ]
  const STOCKS = [
    { id: "ready", label: "Ready Stock" },
    { id: "preorder", label: "Pre Order" }
  ]

  // Update query params helper
  const updateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    
    // Reset to page 1 when filter changes
    if (!updates.page) {
      params.delete("page")
    }

    router.push(`/shop?${params.toString()}`)
  }

  const handleCategorySelect = (slug: string) => {
    if (activeCategory === slug) {
      updateQuery({ category: null })
    } else {
      updateQuery({ category: slug })
    }
  }

  const handleApplyPrice = (e: React.FormEvent) => {
    e.preventDefault()
    updateQuery({ minPrice, maxPrice })
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateQuery({ sort: e.target.value })
  }

  const handleClearAll = () => {
    setMinPrice("")
    setMaxPrice("")
    setSelectedSize("")
    setSelectedColor("")
    setSelectedBrand("")
    setSelectedRating("")
    setSelectedPromo("")
    setSelectedStock("")
    router.push("/shop")
  }

  const toggleFilter = (key: string, value: string, currentVal: string, setter: (val: string) => void) => {
    const newVal = currentVal === value ? "" : value
    setter(newVal)
    updateQuery({ [key]: newVal || null })
  }

  const renderFilterSections = (isMobile: boolean = false) => {
    const applyButtonAction = isMobile ? () => setIsOpen(false) : undefined

    return (
      <div className={cn("space-y-6", !isMobile && "divide-y divide-border/60")}>
        {/* Category Filter */}
        <div className="space-y-3 pt-4">
          <h4 className="font-bold text-sm">Kategori</h4>
          <div className="flex flex-wrap md:flex-col gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.slug
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    handleCategorySelect(cat.slug)
                    if (isMobile) setIsOpen(false)
                  }}
                  className={cn(
                    "text-left text-xs py-1.5 px-3 md:px-2 rounded-full md:rounded-lg border md:border-transparent transition-all hover:bg-muted font-medium",
                    isActive
                      ? "bg-[#FF6B35]/15 text-[#FF6B35] border-[#FF6B35]/30 md:bg-[#FF6B35]/15 md:text-[#FF6B35]"
                      : "text-muted-foreground bg-background border-border md:bg-transparent"
                  )}
                >
                  {cat.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Size Filter */}
        <div className="space-y-3 pt-6">
          <h4 className="font-bold text-sm">Ukuran</h4>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((size) => {
              const isActive = selectedSize === size
              return (
                <button
                  key={size}
                  onClick={() => {
                    toggleFilter("size", size, selectedSize, setSelectedSize)
                    if (isMobile) setIsOpen(false)
                  }}
                  className={cn(
                    "w-9 h-9 rounded-lg text-xs font-bold border transition-all flex items-center justify-center",
                    isActive
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-foreground hover:bg-muted"
                  )}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>

        {/* Color Filter */}
        <div className="space-y-3 pt-6">
          <h4 className="font-bold text-sm">Warna</h4>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((col) => {
              const isActive = selectedColor === col.name
              return (
                <button
                  key={col.name}
                  onClick={() => {
                    toggleFilter("color", col.name, selectedColor, setSelectedColor)
                    if (isMobile) setIsOpen(false)
                  }}
                  className={cn(
                    "w-6 h-6 rounded-full border flex items-center justify-center transition-transform hover:scale-110 shadow-sm relative",
                    col.bg
                  )}
                  title={col.name}
                >
                  {isActive && (
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      col.name === "Putih" || col.name === "Cream" ? "bg-black" : "bg-white"
                    )} />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Brand Filter */}
        <div className="space-y-3 pt-6">
          <h4 className="font-bold text-sm">Brand</h4>
          <div className="space-y-2">
            {BRANDS.map((brand) => {
              const isActive = selectedBrand === brand
              return (
                <label key={brand} className="flex items-center gap-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => {
                      toggleFilter("brand", brand, selectedBrand, setSelectedBrand)
                      if (isMobile) setIsOpen(false)
                    }}
                    className="rounded border-border text-[#FF6B35] focus:ring-[#FF6B35] h-3.5 w-3.5 cursor-pointer"
                  />
                  <span>{brand}</span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Rating Filter */}
        <div className="space-y-3 pt-6">
          <h4 className="font-bold text-sm">Rating</h4>
          <div className="space-y-1.5">
            {[5, 4, 3].map((stars) => {
              const isActive = selectedRating === String(stars)
              return (
                <button
                  key={stars}
                  onClick={() => {
                    toggleFilter("rating", String(stars), selectedRating, setSelectedRating)
                    if (isMobile) setIsOpen(false)
                  }}
                  className={cn(
                    "flex items-center gap-1.5 text-xs py-1 px-1.5 rounded transition-all w-full text-left",
                    isActive ? "bg-muted text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex gap-0.5 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-sm">{i < stars ? "★" : "☆"}</span>
                    ))}
                  </div>
                  <span>Ke atas</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="space-y-3 pt-6">
          <h4 className="font-bold text-sm">Rentang Harga (Rp)</h4>
          <form onSubmit={handleApplyPrice} className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full text-xs px-2.5 py-2 border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                aria-label="Harga Minimum"
              />
              <span className="text-muted-foreground">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full text-xs px-2.5 py-2 border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                aria-label="Harga Maksimum"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm" className="w-full bg-[#111111] hover:bg-[#FF6B35] text-white" onClick={applyButtonAction}>
                Terapkan
              </Button>
              {(minPrice || maxPrice || activeCategory || selectedSize || selectedColor || selectedBrand || selectedRating || selectedPromo || selectedStock) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleClearAll()
                    if (isMobile) setIsOpen(false)
                  }}
                  className="px-2"
                  title="Clear all filters"
                >
                  Batal
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Promo Filter */}
        <div className="space-y-3 pt-6">
          <h4 className="font-bold text-sm">Promo</h4>
          <div className="space-y-2">
            {PROMOS.map((promo) => {
              const isActive = selectedPromo === promo.id
              return (
                <label key={promo.id} className="flex items-center gap-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => {
                      toggleFilter("promo", promo.id, selectedPromo, setSelectedPromo)
                      if (isMobile) setIsOpen(false)
                    }}
                    className="rounded border-border text-[#FF6B35] focus:ring-[#FF6B35] h-3.5 w-3.5 cursor-pointer"
                  />
                  <span>{promo.label}</span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Stock/Availability Filter */}
        <div className="space-y-3 pt-6 pb-6">
          <h4 className="font-bold text-sm">Ketersediaan</h4>
          <div className="space-y-2">
            {STOCKS.map((stock) => {
              const isActive = selectedStock === stock.id
              return (
                <label key={stock.id} className="flex items-center gap-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => {
                      toggleFilter("stock", stock.id, selectedStock, setSelectedStock)
                      if (isMobile) setIsOpen(false)
                    }}
                    className="rounded border-border text-[#FF6B35] focus:ring-[#FF6B35] h-3.5 w-3.5 cursor-pointer"
                  />
                  <span>{stock.label}</span>
                </label>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Mobile Drawer Trigger & Desktop Header */}
      <div className="flex items-center justify-between gap-4 md:hidden">
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 w-full h-11"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter & Urutkan
        </Button>
      </div>

      {/* Sorting Dropdown (Desktop & Mobile Inline - Stacked on Desktop) */}
      <div className="flex flex-col gap-2 border-b pb-4">
        <span className="hidden md:inline text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Filter Produk
        </span>
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Urutkan:</span>
          <select
            value={activeSort}
            onChange={handleSortChange}
            className="text-xs bg-background border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#FF6B35] w-full cursor-pointer"
            aria-label="Urutkan Produk"
          >
            <option value="newest">Terbaru</option>
            <option value="price_asc">Harga: Rendah ke Tinggi</option>
            <option value="price_desc">Harga: Tinggi ke Rendah</option>
            <option value="popular">Terpopuler</option>
          </select>
        </div>
      </div>

      {/* Sidebar Filter Content - Desktop */}
      <div className="hidden md:block">
        {renderFilterSections(false)}
      </div>

      {/* Mobile Drawer (Filter Modal Overlay) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm md:hidden animate-fade-in">
          <div className="w-[85vw] max-w-sm h-full bg-background p-6 shadow-xl flex flex-col space-y-6 overflow-y-auto animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="font-bold text-base">Filter</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Sidebar Filter Content - Mobile */}
            {renderFilterSections(true)}
          </div>
        </div>
      )}
    </div>
  )
}
