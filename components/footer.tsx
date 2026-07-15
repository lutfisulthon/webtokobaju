"use client"

import * as React from "react"
import Link from "next/link"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-instagram", className)}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
)
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-facebook", className)}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
)
const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-youtube", className)}><path d="M2.5 7.1c.3-1.4 1.4-2.5 2.8-2.8C7.6 3.8 12 3.8 12 3.8s4.4 0 6.7.5c1.4.3 2.5 1.4 2.8 2.8.5 2.3.5 7.1.5 7.1s0 4.8-.5 7.1c-.3 1.4-1.4 2.5-2.8 2.8-2.3.5-6.7.5-6.7.5s-4.4 0-6.7-.5c-1.4-.3-2.5-1.4-2.8-2.8C2 16.7 2 11.9 2 11.9s0-4.8.5-7.1z"/><path d="m9.7 15.5 6-3.6-6-3.6v7.2z"/></svg>
)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("lucide lucide-tiktok", className)}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
)

export function Footer() {
  const [email, setEmail] = React.useState("")

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    toast.success("Terima kasih! Anda telah berlangganan newsletter kami. 🎉")
    setEmail("")
  }

  return (
    <footer className="w-full bg-[#FAFAFA] border-t border-[#E5E7EB] mt-auto">
      <div className="container mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-8">
          {/* Brand Info & Socials */}
          <div className="space-y-6 lg:pr-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-plus-jakarta font-extrabold text-[22px] tracking-wider text-[#111111]">
                URBAN<span className="text-[#FF6B35]">WEAR</span>
              </span>
            </Link>
            <p className="text-[13px] text-[#6B7280] leading-relaxed">
              Pilihan fashion kasual dan streetwear premium terbaik untuk gaya hidup modern Anda.
            </p>
            <div className="flex items-center gap-4 pt-1">
              <Link href="#" className="text-[#111111] hover:text-[#FF6B35] transition-colors" aria-label="Instagram">
                <InstagramIcon className="h-[18px] w-[18px] stroke-[2]" />
              </Link>
              <Link href="#" className="text-[#111111] hover:text-[#FF6B35] transition-colors" aria-label="TikTok">
                <TikTokIcon className="h-[18px] w-[18px] stroke-[2]" />
              </Link>
              <Link href="#" className="text-[#111111] hover:text-[#FF6B35] transition-colors" aria-label="Facebook">
                <FacebookIcon className="h-[18px] w-[18px] stroke-[2]" />
              </Link>
              <Link href="#" className="text-[#111111] hover:text-[#FF6B35] transition-colors" aria-label="YouTube">
                <YoutubeIcon className="h-[18px] w-[18px] stroke-[2]" />
              </Link>
            </div>
          </div>

          {/* BELANJA */}
          <div>
            <h3 className="font-plus-jakarta font-bold text-[13px] tracking-widest uppercase mb-6 text-[#111111]">
              Belanja
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/shop" className="text-[13px] font-medium text-[#6B7280] hover:text-[#FF6B35] transition-colors">
                  Semua Produk
                </Link>
              </li>
              <li>
                <Link href="/shop?category=pria" className="text-[13px] font-medium text-[#6B7280] hover:text-[#FF6B35] transition-colors">
                  Pria
                </Link>
              </li>
              <li>
                <Link href="/shop?category=wanita" className="text-[13px] font-medium text-[#6B7280] hover:text-[#FF6B35] transition-colors">
                  Wanita
                </Link>
              </li>
              <li>
                <Link href="/shop?category=anak-anak" className="text-[13px] font-medium text-[#6B7280] hover:text-[#FF6B35] transition-colors">
                  Anak-anak
                </Link>
              </li>
              <li>
                <Link href="/shop?sort=newest" className="text-[13px] font-medium text-[#6B7280] hover:text-[#FF6B35] transition-colors">
                  Koleksi Terbaru
                </Link>
              </li>
            </ul>
          </div>

          {/* BANTUAN */}
          <div>
            <h3 className="font-plus-jakarta font-bold text-[13px] tracking-widest uppercase mb-6 text-[#111111]">
              Bantuan
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/faq" className="text-[13px] font-medium text-[#6B7280] hover:text-[#FF6B35] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-[13px] font-medium text-[#6B7280] hover:text-[#FF6B35] transition-colors">
                  Informasi Pengiriman
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-[13px] font-medium text-[#6B7280] hover:text-[#FF6B35] transition-colors">
                  Kebijakan Pengembalian
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[13px] font-medium text-[#6B7280] hover:text-[#FF6B35] transition-colors">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[13px] font-medium text-[#6B7280] hover:text-[#FF6B35] transition-colors">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* TENTANG KAMI */}
          <div>
            <h3 className="font-plus-jakarta font-bold text-[13px] tracking-widest uppercase mb-6 text-[#111111]">
              Tentang Kami
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-[13px] font-medium text-[#6B7280] hover:text-[#FF6B35] transition-colors">
                  Tentang UrbanWear
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-[13px] font-medium text-[#6B7280] hover:text-[#FF6B35] transition-colors">
                  Karir
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-[13px] font-medium text-[#6B7280] hover:text-[#FF6B35] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/store-locator" className="text-[13px] font-medium text-[#6B7280] hover:text-[#FF6B35] transition-colors">
                  Store Locator
                </Link>
              </li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div className="lg:col-span-1">
            <h3 className="font-plus-jakarta font-bold text-[13px] tracking-widest uppercase mb-6 text-[#111111]">
              Newsletter
            </h3>
            <p className="text-[13px] text-[#6B7280] leading-relaxed mb-4">
              Dapatkan info promo terbaru dan penawaran eksklusif langsung di inbox Anda.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3 relative">
              <input
                type="email"
                placeholder="Alamat email Anda"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-[13px] bg-white border border-[#E5E7EB] rounded-lg text-[#111111] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-colors"
                aria-label="Alamat Email"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-3 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-md transition-all flex items-center justify-center"
                aria-label="Subscribe"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <hr className="my-10 border-[#E5E7EB]" />

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[12px] text-[#9CA3AF] font-medium">
            &copy; {new Date().getFullYear()} UrbanWear. Hak Cipta Dilindungi.
          </p>

          {/* Payment Methods */}
          <div className="flex items-center gap-3 opacity-80">
            <span className="text-[11px] text-[#9CA3AF] mr-2">Metode Pembayaran:</span>
            {["BCA", "MANDIRI", "BRI", "BNI", "VISA", "MC"].map((pay) => (
              <div key={pay} className="px-2 py-1 border border-[#E5E7EB] rounded-sm bg-white text-[9px] font-black tracking-tight text-[#111111] select-none shadow-sm">
                {pay}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
