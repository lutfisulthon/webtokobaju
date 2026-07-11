"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { ShoppingBag, Heart, Menu, X, Search } from "lucide-react"
import { useCartStore } from "@/lib/store/useCartStore"
import { useWishlistStore } from "@/lib/store/useWishlistStore"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=pria", label: "Pria" },
  { href: "/shop?category=wanita", label: "Wanita" },
  { href: "/shop?category=anak-anak", label: "Anak-anak" },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [activeCategory, setActiveCategory] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [mounted, setMounted] = React.useState(false)

  // Track active category parameter from URL safely on client side
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      setActiveCategory(params.get("category") || "")
    }
  }, [pathname])

  // Get store states
  const cartItems = useCartStore((state) => state.items)
  const wishlistItems = useWishlistStore((state) => state.items)

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const cartCount = mounted ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0
  const wishlistCount = mounted ? wishlistItems.length : 0

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-border/40 shadow-sm"
          : "bg-background border-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-plus-jakarta font-extrabold text-xl tracking-wider text-primary dark:text-foreground">
            URBAN<span className="text-accent text-[#FF6B35]">WEAR</span>
          </span>
        </Link>

        {/* Navigation Links - Desktop with Premium Mega Menus */}
        <nav className="hidden md:flex items-center gap-6 h-full">
          <Link
            href="/"
            className={cn(
              "text-sm font-semibold hover:text-[#FF6B35] transition-colors relative py-5",
              pathname === "/" ? "text-[#FF6B35]" : "text-muted-foreground"
            )}
          >
            Beranda
            {pathname === "/" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FF6B35] rounded-full" />
            )}
          </Link>

          <Link
            href="/shop"
            className={cn(
              "text-sm font-semibold hover:text-[#FF6B35] transition-colors relative py-5",
              pathname === "/shop" && !activeCategory ? "text-[#FF6B35]" : "text-muted-foreground"
            )}
          >
            Shop
            {pathname === "/shop" && !activeCategory && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FF6B35] rounded-full" />
            )}
          </Link>

          {/* PRIA MEGA MENU */}
          <div className="group/mega h-full flex items-center">
            <Link
              href="/shop?category=pria"
              className={cn(
                "text-sm font-semibold hover:text-[#FF6B35] transition-colors relative py-5 flex items-center gap-1 cursor-pointer",
                activeCategory === "pria" ? "text-[#FF6B35]" : "text-muted-foreground"
              )}
            >
              Pria
              {activeCategory === "pria" && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FF6B35] rounded-full" />
              )}
            </Link>

            {/* Mega Menu Dropdown */}
            <div className="absolute top-16 left-0 w-full bg-background border-b border-border shadow-lg opacity-0 translate-y-2 pointer-events-none group-hover/mega:opacity-100 group-hover/mega:translate-y-0 group-hover/mega:pointer-events-auto transition-all duration-300 z-50">
              <div className="container mx-auto px-6 py-8 grid grid-cols-4 gap-8">
                <div>
                  <h4 className="font-bold text-sm text-foreground mb-3 pb-1 border-b">Pakaian Atas</h4>
                  <ul className="space-y-2">
                    {["Kaos", "Polo", "Kemeja", "Hoodie", "Jaket", "Sweater"].map((item) => (
                      <li key={item}>
                        <Link href={`/shop?category=pria&search=${item}`} className="text-xs text-muted-foreground hover:text-[#FF6B35] transition-colors">
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground mb-3 pb-1 border-b">Pakaian Bawah</h4>
                  <ul className="space-y-2">
                    {["Celana Jeans", "Celana Chino", "Celana Pendek", "Jogger"].map((item) => (
                      <li key={item}>
                        <Link href={`/shop?category=pria&search=${item}`} className="text-xs text-muted-foreground hover:text-[#FF6B35] transition-colors">
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground mb-3 pb-1 border-b">Aksesori & Sepatu</h4>
                  <ul className="space-y-2">
                    {["Topi", "Sepatu", "Sandal", "Tas", "Dompet", "Ikat Pinggang", "Jam Tangan"].map((item) => (
                      <li key={item}>
                        <Link href={`/shop?category=pria&search=${item}`} className="text-xs text-muted-foreground hover:text-[#FF6B35] transition-colors">
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-muted group/banner">
                  <Image
                    src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&auto=format&fit=crop&q=80"
                    alt="Koleksi Pria"
                    fill
                    className="object-cover transition-transform duration-500 group-hover/banner:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent flex flex-col justify-end p-4 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF6B35]">Koleksi Pria</span>
                    <h5 className="font-bold text-sm mb-1">Gaya Kasual Modern</h5>
                    <p className="text-[10px] text-zinc-300 mb-2">Gunakan voucher <strong>URBANNEW</strong> diskon 10%</p>
                    <Link href="/shop?category=pria" className="text-[11px] font-bold underline hover:text-[#FF6B35] transition-colors">
                      Belanja Sekarang
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* WANITA MEGA MENU */}
          <div className="group/mega h-full flex items-center">
            <Link
              href="/shop?category=wanita"
              className={cn(
                "text-sm font-semibold hover:text-[#FF6B35] transition-colors relative py-5 flex items-center gap-1 cursor-pointer",
                activeCategory === "wanita" ? "text-[#FF6B35]" : "text-muted-foreground"
              )}
            >
              Wanita
              {activeCategory === "wanita" && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FF6B35] rounded-full" />
              )}
            </Link>

            {/* Mega Menu Dropdown */}
            <div className="absolute top-16 left-0 w-full bg-background border-b border-border shadow-lg opacity-0 translate-y-2 pointer-events-none group-hover/mega:opacity-100 group-hover/mega:translate-y-0 group-hover/mega:pointer-events-auto transition-all duration-300 z-50">
              <div className="container mx-auto px-6 py-8 grid grid-cols-4 gap-8">
                <div>
                  <h4 className="font-bold text-sm text-foreground mb-3 pb-1 border-b">Pakaian Atas</h4>
                  <ul className="space-y-2">
                    {["Dress", "Blouse", "Kaos", "Kemeja", "Outer", "Cardigan"].map((item) => (
                      <li key={item}>
                        <Link href={`/shop?category=wanita&search=${item}`} className="text-xs text-muted-foreground hover:text-[#FF6B35] transition-colors">
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground mb-3 pb-1 border-b">Pakaian Bawah</h4>
                  <ul className="space-y-2">
                    {["Rok", "Celana"].map((item) => (
                      <li key={item}>
                        <Link href={`/shop?category=wanita&search=${item}`} className="text-xs text-muted-foreground hover:text-[#FF6B35] transition-colors">
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground mb-3 pb-1 border-b">Aksesori & Hijab</h4>
                  <ul className="space-y-2">
                    {["Hijab", "Tas", "Sepatu", "Sandal", "Perhiasan", "Jam Tangan", "Aksesori"].map((item) => (
                      <li key={item}>
                        <Link href={`/shop?category=wanita&search=${item}`} className="text-xs text-muted-foreground hover:text-[#FF6B35] transition-colors">
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-muted group/banner">
                  <Image
                    src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=80"
                    alt="Koleksi Wanita"
                    fill
                    className="object-cover transition-transform duration-500 group-hover/banner:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent flex flex-col justify-end p-4 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF6B35]">Koleksi Wanita</span>
                    <h5 className="font-bold text-sm mb-1">Elegan & Percaya Diri</h5>
                    <p className="text-[10px] text-zinc-300 mb-2">Tren gaya terbaru musim ini</p>
                    <Link href="/shop?category=wanita" className="text-[11px] font-bold underline hover:text-[#FF6B35] transition-colors">
                      Temukan Koleksi
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ANAK-ANAK MEGA MENU */}
          <div className="group/mega h-full flex items-center">
            <Link
              href="/shop?category=anak-anak"
              className={cn(
                "text-sm font-semibold hover:text-[#FF6B35] transition-colors relative py-5 flex items-center gap-1 cursor-pointer",
                activeCategory === "anak-anak" ? "text-[#FF6B35]" : "text-muted-foreground"
              )}
            >
              Anak-anak
              {activeCategory === "anak-anak" && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FF6B35] rounded-full" />
              )}
            </Link>

            {/* Mega Menu Dropdown */}
            <div className="absolute top-16 left-0 w-full bg-background border-b border-border shadow-lg opacity-0 translate-y-2 pointer-events-none group-hover/mega:opacity-100 group-hover/mega:translate-y-0 group-hover/mega:pointer-events-auto transition-all duration-300 z-50">
              <div className="container mx-auto px-6 py-8 grid grid-cols-4 gap-8">
                <div>
                  <h4 className="font-bold text-sm text-foreground mb-3 pb-1 border-b">Bayi (0-2 Tahun)</h4>
                  <ul className="space-y-2">
                    {["Bodysuit", "Romper", "Set Bayi", "Selimut", "Topi Bayi"].map((item) => (
                      <li key={item}>
                        <Link href={`/shop?category=anak-anak&search=${item}`} className="text-xs text-muted-foreground hover:text-[#FF6B35] transition-colors">
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground mb-3 pb-1 border-b">Anak (3-7 Tahun)</h4>
                  <ul className="space-y-2">
                    {["Kaos", "Celana", "Dress", "Jaket", "Sandal", "Sepatu"].map((item) => (
                      <li key={item}>
                        <Link href={`/shop?category=anak-anak&search=${item}`} className="text-xs text-muted-foreground hover:text-[#FF6B35] transition-colors">
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground mb-3 pb-1 border-b">Remaja (8-15 Tahun)</h4>
                  <ul className="space-y-2">
                    {["Kaos", "Hoodie", "Celana Jeans", "Rok", "Jaket", "Sneakers"].map((item) => (
                      <li key={item}>
                        <Link href={`/shop?category=anak-anak&search=${item}`} className="text-xs text-muted-foreground hover:text-[#FF6B35] transition-colors">
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-muted group/banner">
                  <Image
                    src="https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=500&auto=format&fit=crop&q=80"
                    alt="Koleksi Anak"
                    fill
                    className="object-cover transition-transform duration-500 group-hover/banner:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent flex flex-col justify-end p-4 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF6B35]">Koleksi Anak</span>
                    <h5 className="font-bold text-sm mb-1">Nyaman & Ceria</h5>
                    <p className="text-[10px] text-zinc-300 mb-2">Bahan premium aman untuk kulit sensitif</p>
                    <Link href="/shop?category=anak-anak" className="text-[11px] font-bold underline hover:text-[#FF6B35] transition-colors">
                      Lihat Produk
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end md:flex-initial">
          {/* Search bar Desktop */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex items-center relative w-64"
          >
            <Input
              type="search"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 h-9 w-full rounded-full border-border bg-muted/30 focus-visible:bg-background"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </form>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Wishlist */}
          <Link href="/wishlist">
            <Button
              variant="ghost"
              size="icon"
              className="relative w-9 h-9 rounded-full"
              aria-label="Daftar Keinginan"
            >
              <Heart className="h-5 w-5 text-foreground" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF6B35] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Cart */}
          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative w-9 h-9 rounded-full"
              aria-label="Keranjang Belanja"
            >
              <ShoppingBag className="h-5 w-5 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden w-9 h-9 rounded-full"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="md:hidden border-b bg-background/95 backdrop-blur-md px-4 py-4 space-y-4 animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Input
              type="search"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 h-10 w-full rounded-lg bg-muted/40"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </form>

          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "px-3 py-2 rounded-md text-base font-medium transition-colors",
                  pathname === link.href
                    ? "bg-accent/10 text-[#FF6B35]"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
