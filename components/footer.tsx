"use client"

import * as React from "react"
import Link from "next/link"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export function Footer() {
  const [email, setEmail] = React.useState("")

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    // Simple success feedback
    toast.success("Terima kasih! Anda telah berlangganan newsletter kami.")
    setEmail("")
  }

  return (
    <footer className="w-full border-t bg-muted/30 dark:bg-muted/10 mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <span className="font-plus-jakarta font-extrabold text-xl tracking-wider text-primary dark:text-foreground">
              URBAN<span className="text-accent text-[#FF6B35]">WEAR</span>
            </span>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Pilihan fashion kasual dan streetwear premium terbaik untuk gaya hidup modern Anda. Berani tampil beda, berani berekspresi.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-plus-jakarta font-bold text-sm tracking-wider uppercase mb-4 text-foreground">
              Belanja
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/shop" className="text-sm text-muted-foreground hover:text-[#FF6B35] transition-colors">
                  Semua Produk
                </Link>
              </li>
              <li>
                <Link href="/shop?category=pria" className="text-sm text-muted-foreground hover:text-[#FF6B35] transition-colors">
                  Koleksi Pria
                </Link>
              </li>
              <li>
                <Link href="/shop?category=wanita" className="text-sm text-muted-foreground hover:text-[#FF6B35] transition-colors">
                  Koleksi Wanita
                </Link>
              </li>
              <li>
                <Link href="/shop?category=aksesoris" className="text-sm text-muted-foreground hover:text-[#FF6B35] transition-colors">
                  Aksesoris
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-plus-jakarta font-bold text-sm tracking-wider uppercase mb-4 text-foreground">
              Bantuan
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-[#FF6B35] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-muted-foreground hover:text-[#FF6B35] transition-colors">
                  Informasi Pengiriman
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-muted-foreground hover:text-[#FF6B35] transition-colors">
                  Kebijakan Pengembalian
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-[#FF6B35] transition-colors">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-plus-jakarta font-bold text-sm tracking-wider uppercase text-foreground">
              Newsletter
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Dapatkan info promo terbaru dan penawaran eksklusif langsung di inbox Anda.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
              <Input
                type="email"
                placeholder="Alamat email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background rounded-lg border-border focus-visible:ring-[#FF6B35]/20 focus-visible:border-[#FF6B35]"
              />
              <Button type="submit" size="icon" className="shrink-0 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-lg">
                <Send className="h-4 w-4" />
                <span className="sr-only">Kirim</span>
              </Button>
            </form>
          </div>
        </div>

        <hr className="my-10 border-border/60" />

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} UrbanWear. Hak Cipta Dilindungi. Built with Passion.
          </p>

          {/* Payment Methods */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground mr-1">Pembayaran aman:</span>
            {/* QRIS */}
            <div className="px-2 py-0.5 border border-border/80 rounded bg-background text-[10px] font-extrabold tracking-tight text-primary-foreground dark:text-foreground select-none">
              QRIS
            </div>
            {/* Virtual Account */}
            <div className="px-2 py-0.5 border border-border/80 rounded bg-background text-[10px] font-extrabold tracking-tight text-primary-foreground dark:text-foreground select-none">
              VIRTUAL ACCOUNT
            </div>
            {/* GoPay */}
            <div className="px-2 py-0.5 border border-border/80 rounded bg-background text-[10px] font-extrabold tracking-tight text-primary-foreground dark:text-foreground select-none">
              GOPAY
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
