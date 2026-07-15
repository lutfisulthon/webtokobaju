"use client"

import * as React from "react"
import { ProductCard } from "@/components/product-card"

export function HomePopularProducts({ products }: { products: any[] }) {
  const displayProducts = React.useMemo(() => {
    return products.slice(0, 8)
  }, [products])

  return (
    <section className="container mx-auto px-4 md:px-8 py-12 md:py-16">
      <div className="flex items-end justify-between gap-6 mb-10 border-b border-[#E5E7EB] pb-3">
        <h2 className="font-plus-jakarta font-bold text-[22px] tracking-tight text-[#111111]">
          Produk Pilihan Untukmu
        </h2>
        
        <a
          href="/shop"
          className="text-[13px] font-bold text-[#FF6B35] hover:text-[#FF6B35]/80 flex items-center gap-1.5 transition-colors"
        >
          Lihat Semua &rarr;
        </a>
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
