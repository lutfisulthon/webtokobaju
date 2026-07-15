"use client"

import * as React from "react"
import { ProductCard } from "@/components/product-card"

export function FlashSale({ products }: { products: any[] }) {
  const [timeLeft, setTimeLeft] = React.useState({
    hours: 12,
    minutes: 34,
    seconds: 56,
  })

  // Basic countdown logic
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev
        if (hours === 0 && minutes === 0 && seconds === 0) {
          return { hours: 24, minutes: 0, seconds: 0 } // Reset
        }
        
        if (seconds > 0) {
          seconds--
        } else {
          seconds = 59
          if (minutes > 0) {
            minutes--
          } else {
            minutes = 59
            if (hours > 0) {
              hours--
            }
          }
        }
        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const pad = (num: number) => num.toString().padStart(2, "0")

  return (
    <section className="bg-[#F8F8F8] border-y border-[#E5E7EB]">
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <h2 className="font-plus-jakarta font-bold text-[22px] tracking-tight text-[#111111] flex items-center gap-2">
              <span className="text-[#FF6B35]">⚡</span> Flash Sale Hari Ini
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-[#6B7280] font-medium mr-1">Berakhir dalam:</span>
              <div className="flex items-center gap-1.5">
                <div className="bg-[#FF6B35] text-white font-bold text-[13px] w-9 h-9 flex items-center justify-center rounded-lg shadow-sm">
                  {pad(timeLeft.hours)}
                </div>
                <span className="text-[#FF6B35] font-bold">:</span>
                <div className="bg-[#FF6B35] text-white font-bold text-[13px] w-9 h-9 flex items-center justify-center rounded-lg shadow-sm">
                  {pad(timeLeft.minutes)}
                </div>
                <span className="text-[#FF6B35] font-bold">:</span>
                <div className="bg-[#FF6B35] text-white font-bold text-[13px] w-9 h-9 flex items-center justify-center rounded-lg shadow-sm">
                  {pad(timeLeft.seconds)}
                </div>
              </div>
            </div>
          </div>
          
          <a
            href="/shop?sale=true"
            className="hidden md:flex text-[13px] font-bold text-[#FF6B35] hover:text-[#FF6B35]/80 items-center gap-1.5 transition-colors"
          >
            Lihat semua promo &rarr;
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={{ ...product, discountPrice: product.price * 0.8 }} /> // Mock 20% discount if none exists
          ))}
        </div>
      </div>
    </section>
  )
}
