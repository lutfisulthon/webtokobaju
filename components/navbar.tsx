"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ShoppingBag, Heart, Menu, X, Search, User } from "lucide-react"
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

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      setActiveCategory(params.get("category") || "")
    }
  }, [pathname])

  const cartItems = useCartStore((state) => state.items)
  const wishlistItems = useWishlistStore((state) => state.items)

  React.useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
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
    <div className="w-full flex flex-col">
      {/* ===== Navigation Header ===== */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 border-b bg-white",
          isScrolled
            ? "border-[#E5E7EB] shadow-sm"
            : "border-transparent"
        )}
      >
        <div className="container mx-auto px-4 md:px-8 h-[72px] flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-plus-jakarta font-extrabold text-[22px] tracking-wider text-[#111111]">
              URBAN<span className="text-[#FF6B35]">WEAR</span>
            </span>
          </Link>

          {/* Navigation Links - Center */}
          <nav className="hidden md:flex items-center gap-8 h-full">
            {NAV_LINKS.map((link) => {
              const isHome = link.href === "/"
              const isActive = isHome
                ? pathname === "/"
                : activeCategory === link.href.split("=")[1] || (pathname === "/shop" && link.href === "/shop" && !activeCategory)

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "text-[14px] font-bold transition-colors relative py-6 hover:text-[#FF6B35]",
                    isActive ? "text-[#FF6B35]" : "text-[#6B7280]"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FF6B35] rounded-full animate-fade-in" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-2 flex-1 justify-end md:flex-initial">
            {/* Search Input Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex items-center relative w-56 mr-2"
            >
              <Input
                type="search"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-9 w-full rounded-full border-none bg-[#F8F8F8] text-[13px] placeholder:text-[#6B7280] focus-visible:ring-1 focus-visible:ring-[#E5E7EB]"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] h-[15px] w-[15px] stroke-[2.5]" />
            </form>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Wishlist */}
            <Link href="/wishlist">
              <Button
                variant="ghost"
                size="icon"
                className="relative w-9 h-9 rounded-full text-[#111111] hover:bg-[#F8F8F8]"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5 stroke-[1.5]" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[#FF6B35] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
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
                className="relative w-9 h-9 rounded-full text-[#111111] hover:bg-[#F8F8F8]"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[#FF6B35] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Profile */}
            <Link href="/member/profile">
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 rounded-full text-[#111111] hover:bg-[#F8F8F8]"
                aria-label="Profile Account"
              >
                <User className="h-5 w-5 stroke-[1.5]" />
              </Button>
            </Link>

            {/* Mobile Menu Trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-9 h-9 rounded-full text-[#111111]"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
            >
              {isOpen ? <X className="h-5 w-5 stroke-[1.5]" /> : <Menu className="h-5 w-5 stroke-[1.5]" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="md:hidden border-t bg-white px-4 py-4 space-y-4 animate-in slide-in-from-top duration-200">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Input
                type="search"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-9 h-10 w-full rounded-lg bg-[#F8F8F8]"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
                <Search className="h-4 w-4" />
              </button>
            </form>

            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-3 py-2.5 rounded-xl text-[14px] font-bold transition-all",
                    pathname === link.href || activeCategory === link.href.split("=")[1]
                      ? "bg-[#FFF5F0] text-[#FF6B35]"
                      : "text-[#6B7280] hover:bg-[#F8F8F8]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </div>
  )
}
