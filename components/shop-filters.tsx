"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SlidersHorizontal, X, RotateCcw, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface ShopFiltersProps {
  categories: Array<{ id: string; name: string; slug: string }>
}

// Collapsible Section
function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = React.useState(defaultOpen)
  return (
    <div className="border-b border-[#EDEDE9] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 text-left group"
      >
        <span className="text-[13px] font-bold uppercase tracking-widest text-[#1A1A1A]">{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-[#999] transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && <div className="pb-5">{children}</div>}
    </div>
  )
}

const COLOR_MAP: Record<string, string> = {
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
}

export function ShopFilters({ categories }: ShopFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const [priceMin, setPriceMin] = React.useState(searchParams.get("minPrice") || "0")
  const [priceMax, setPriceMax] = React.useState(searchParams.get("maxPrice") || "2000000")
  const [selectedSize, setSelectedSize] = React.useState(searchParams.get("size") || "")
  const [selectedColor, setSelectedColor] = React.useState(searchParams.get("color") || "")
  const [selectedRating, setSelectedRating] = React.useState(searchParams.get("rating") || "")
  const [selectedStock, setSelectedStock] = React.useState(searchParams.get("stock") || "")

  const activeCategory = searchParams.get("category") || ""
  const activeSort = searchParams.get("sort") || "newest"

  const SIZES = ["XS", "S", "M", "L", "XL", "XXL"]
  const COLORS = ["Hitam", "Putih", "Cream", "Navy", "Olive", "Coklat", "Abu", "Beige"]
  const BRANDS = ["UrbanWear", "Zara", "H&M", "Uniqlo"]
  const [selectedBrand, setSelectedBrand] = React.useState(searchParams.get("brand") || "")

  const hasActiveFilters =
    activeCategory ||
    selectedSize ||
    selectedColor ||
    selectedRating ||
    selectedStock ||
    selectedBrand ||
    searchParams.get("minPrice") ||
    searchParams.get("maxPrice")

  const updateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    params.delete("page")
    router.push(`/shop?${params.toString()}`)
  }

  const handleCategorySelect = (slug: string) => {
    updateQuery({ category: activeCategory === slug ? null : slug })
  }

  const handleReset = () => {
    setPriceMin("0")
    setPriceMax("2000000")
    setSelectedSize("")
    setSelectedColor("")
    setSelectedBrand("")
    setSelectedRating("")
    setSelectedStock("")
    router.push("/shop")
  }

  const toggle = (
    key: string,
    value: string,
    current: string,
    setter: (v: string) => void
  ) => {
    const next = current === value ? "" : value
    setter(next)
    updateQuery({ [key]: next || null })
  }

  const handleApplyPrice = () => {
    updateQuery({ minPrice: priceMin, maxPrice: priceMax })
  }

  const SidebarContent = () => (
    <div className="space-y-0">
      {/* Category */}
      <FilterSection title="Kategori">
        <div className="space-y-1">
          <button
            onClick={() => updateQuery({ category: null })}
            className={cn(
              "w-full text-left px-3 py-2 rounded-xl text-[13px] font-medium transition-all",
              !activeCategory
                ? "bg-[#1A1A1A] text-white font-semibold"
                : "text-[#666] hover:bg-[#F2F2F0] hover:text-[#1A1A1A]"
            )}
          >
            Semua Produk
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-xl text-[13px] font-medium transition-all",
                activeCategory === cat.slug
                  ? "bg-[#FF6B35] text-white font-semibold"
                  : "text-[#666] hover:bg-[#F2F2F0] hover:text-[#1A1A1A]"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Size */}
      <FilterSection title="Ukuran">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggle("size", size, selectedSize, setSelectedSize)}
              className={cn(
                "w-11 h-11 rounded-xl text-[12px] font-bold border-2 transition-all duration-200",
                selectedSize === size
                  ? "bg-[#1A1A1A] text-white border-[#1A1A1A] scale-95"
                  : "bg-white text-[#333] border-[#E5E5E0] hover:border-[#1A1A1A] hover:bg-[#F8F8F5]"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Color */}
      <FilterSection title="Warna">
        <div className="flex flex-wrap gap-3">
          {COLORS.map((color) => {
            const hex = COLOR_MAP[color] ?? "#ccc"
            const isLight = ["Putih", "Cream", "Beige", "Pink"].includes(color)
            return (
              <button
                key={color}
                onClick={() => toggle("color", color, selectedColor, setSelectedColor)}
                title={color}
                className={cn(
                  "relative w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110",
                  selectedColor === color
                    ? "border-[#FF6B35] ring-2 ring-[#FF6B35]/30 scale-110"
                    : isLight
                      ? "border-[#DEDED9]"
                      : "border-transparent"
                )}
                style={{ backgroundColor: hex }}
                aria-label={color}
              >
                {selectedColor === color && (
                  <span
                    className={cn(
                      "absolute inset-0 flex items-center justify-center text-[10px] font-black",
                      isLight ? "text-[#333]" : "text-white"
                    )}
                  >
                    ✓
                  </span>
                )}
              </button>
            )
          })}
        </div>
        {selectedColor && (
          <p className="mt-2 text-[12px] text-[#888]">
            Dipilih: <span className="font-semibold text-[#1A1A1A]">{selectedColor}</span>
          </p>
        )}
      </FilterSection>

      {/* Price */}
      <FilterSection title="Harga (Rp)">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-[13px] font-semibold text-[#1A1A1A]">
            <span>Rp {parseInt(priceMin).toLocaleString("id-ID")}</span>
            <span>Rp {parseInt(priceMax).toLocaleString("id-ID")}</span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#999] mb-1.5 block">Min</label>
              <input
                type="range"
                min="0"
                max="2000000"
                step="50000"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="w-full accent-[#FF6B35] h-1.5 cursor-pointer"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#999] mb-1.5 block">Max</label>
              <input
                type="range"
                min="0"
                max="2000000"
                step="50000"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-full accent-[#FF6B35] h-1.5 cursor-pointer"
              />
            </div>
          </div>
          <button
            onClick={handleApplyPrice}
            className="w-full py-2.5 bg-[#1A1A1A] hover:bg-[#FF6B35] text-white text-[13px] font-bold rounded-xl transition-colors duration-200"
          >
            Terapkan Harga
          </button>
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand" defaultOpen={false}>
        <div className="space-y-2">
          {BRANDS.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-3 py-1 cursor-pointer group"
            >
              <div
                className={cn(
                  "w-4.5 h-4.5 rounded border-2 flex items-center justify-center transition-all",
                  selectedBrand === brand
                    ? "bg-[#FF6B35] border-[#FF6B35]"
                    : "border-[#D5D5D0] group-hover:border-[#1A1A1A]"
                )}
                onClick={() => toggle("brand", brand, selectedBrand, setSelectedBrand)}
              >
                {selectedBrand === brand && (
                  <span className="text-white text-[10px] font-black leading-none">✓</span>
                )}
              </div>
              <span className="text-[13px] text-[#555] group-hover:text-[#1A1A1A] transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Rating" defaultOpen={false}>
        <div className="space-y-1">
          {[5, 4, 3].map((stars) => (
            <button
              key={stars}
              onClick={() => toggle("rating", String(stars), selectedRating, setSelectedRating)}
              className={cn(
                "flex items-center gap-2 w-full px-3 py-2 rounded-xl text-[13px] transition-all",
                selectedRating === String(stars)
                  ? "bg-[#FFF5F0] text-[#FF6B35] font-semibold"
                  : "text-[#666] hover:bg-[#F2F2F0]"
              )}
            >
              <span className="text-amber-400 text-base leading-none">
                {"★".repeat(stars)}{"☆".repeat(5 - stars)}
              </span>
              <span className="text-[12px]">ke atas</span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Ketersediaan" defaultOpen={false}>
        <div className="space-y-2">
          {[
            { id: "ready", label: "Ready Stock" },
            { id: "preorder", label: "Pre Order" },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => toggle("stock", s.id, selectedStock, setSelectedStock)}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-xl text-[13px] font-medium border-2 transition-all",
                selectedStock === s.id
                  ? "border-[#FF6B35] bg-[#FFF5F0] text-[#FF6B35] font-semibold"
                  : "border-[#EDEDE9] text-[#666] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Reset */}
      {hasActiveFilters && (
        <div className="pt-4">
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-[#1A1A1A] text-[#1A1A1A] text-[13px] font-bold hover:bg-[#1A1A1A] hover:text-white transition-all duration-200"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Semua Filter
          </button>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile Filter Trigger */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="w-full flex items-center justify-center gap-2 h-12 bg-[#1A1A1A] text-white rounded-xl text-[13px] font-bold"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter &amp; Urutkan
          {hasActiveFilters && (
            <span className="ml-1 w-5 h-5 bg-[#FF6B35] rounded-full text-[10px] font-black flex items-center justify-center">
              !
            </span>
          )}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        {/* Sort — desktop only in sidebar top */}
        <div className="mb-6 pb-5 border-b border-[#EDEDE9]">
          <label className="block text-[11px] font-bold uppercase tracking-widest text-[#999] mb-2">
            Urutkan
          </label>
          <select
            value={activeSort}
            onChange={(e) => updateQuery({ sort: e.target.value })}
            className="w-full text-[13px] font-semibold bg-white border-2 border-[#EDEDE9] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#FF6B35] cursor-pointer text-[#1A1A1A] appearance-none"
          >
            <option value="newest">Terbaru</option>
            <option value="popular">Terpopuler</option>
            <option value="price_asc">Harga: Rendah ke Tinggi</option>
            <option value="price_desc">Harga: Tinggi ke Rendah</option>
          </select>
        </div>
        <SidebarContent />
      </div>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[88vw] max-w-sm bg-white flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EDEDE9]">
              <h3 className="text-[15px] font-bold text-[#1A1A1A]">Filter Produk</h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-full hover:bg-[#F2F2F0] transition-colors"
              >
                <X className="h-5 w-5 text-[#1A1A1A]" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-2">
              <SidebarContent />
            </div>
            <div className="px-5 py-4 border-t border-[#EDEDE9]">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-full h-12 bg-[#FF6B35] text-white rounded-xl text-[14px] font-bold"
              >
                Lihat Produk
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
