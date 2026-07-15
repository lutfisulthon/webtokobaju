"use client"

import * as React from "react"
import { ProductCard } from "@/components/product-card"

export function HomePopularProducts({ products }: { products: any[] }) {
  const [activeTab, setActiveTab] = React.useState("semua")

  const tabs = [
    { id: "semua", label: "Semua" },
    { id: "terbaru", label: "Terbaru" },
    { id: "bestseller", label: "Best Seller" },
  ]

  // Mock filtering based on tab
  const displayProducts = React.useMemo(() => {
    if (activeTab === "terbaru") {
      return [...products].reverse().slice(0, 8)
    }
    if (activeTab === "bestseller") {
      return [...products].sort((a, b) => (b.price - a.price)).slice(0, 8)
    }
    return products.slice(0, 8)
  }, [products, activeTab])

  return (
    <section className="container mx-auto px-4 md:px-8 py-12 md:py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-[#E5E7EB] pb-3">
        <h2 className="font-plus-jakarta font-bold text-[22px] tracking-tight text-[#111111]">
          Produk Terpopuler
        </h2>
        
        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
          <div className="flex items-center gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-[14px] font-bold pb-3 relative transition-colors ${
                  activeTab === tab.id ? "text-[#FF6B35]" : "text-[#6B7280] hover:text-[#111111]"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#FF6B35]" />
                )}
              </button>
            ))}
          </div>
          
          <a
            href="/shop"
            className="hidden md:flex text-[13px] font-bold text-[#FF6B35] hover:text-[#FF6B35]/80 items-center gap-1.5 transition-colors"
          >
            Lihat semua &rarr;
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <div className="mt-8 text-center md:hidden">
        <a
          href="/shop"
          className="inline-flex h-11 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#111111] hover:bg-[#F8F8F8] font-bold text-[13px] px-8 transition-colors w-full"
        >
          Lihat semua
        </a>
      </div>
    </section>
  )
}
