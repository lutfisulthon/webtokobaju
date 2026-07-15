"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const SLIDES = [
  {
    tagline: "NEW SEASON ARRIVALS",
    headline: "Ekspresikan Gayamu Tanpa Batas",
    subheadline: "Temukan koleksi fashion premium untuk pria, wanita, dan anak-anak dengan kualitas terbaik untuk aktivitas sehari-hari.",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1800&auto=format&fit=crop&q=80",
    theme: "light", // light gradient overlay
  },
  {
    tagline: "MINIMALIST & CLASSIC",
    headline: "Koleksi Esensial Sehari-hari",
    subheadline: "Didesain untuk kenyamanan maksimal dengan potongan modern yang bersih dan minimalis.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&auto=format&fit=crop&q=80",
    theme: "dark", // dark gradient overlay for white text on dark background
  },
  {
    tagline: "ELEGANT & TIMELESS",
    headline: "Sentuhan Keanggunan Modern",
    subheadline: "Tampil lebih percaya diri setiap hari dengan koleksi wanita bernuansa netral hangat yang tak lekang oleh waktu.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1800&auto=format&fit=crop&q=80",
    theme: "light",
  }
]

export function HeroCarousel() {
  const [current, setCurrent] = React.useState(0)

  const handleNext = React.useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length)
  }, [])

  const handlePrev = React.useCallback(() => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
  }, [])

  // Auto-slide every 6 seconds
  React.useEffect(() => {
    const timer = setInterval(handleNext, 6000)
    return () => clearInterval(timer)
  }, [handleNext])

  return (
    <section className="relative w-full h-[520px] md:h-[640px] overflow-hidden bg-white group">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {SLIDES.map((slide, index) => {
          const isActive = index === current
          return (
            <div
              key={index}
              className={cn(
                "absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out",
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              )}
            >
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.headline}
                  fill
                  priority={index === 0}
                  className="object-cover object-center"
                  sizes="100vw"
                />
                {/* Gradient overlays depending on slide content theme */}
                {slide.theme === "dark" ? (
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#F4F4F0] via-[#F4F4F0]/60 to-[#F4F4F0]/10 md:to-transparent" />
                )}
              </div>

              {/* Text Content Area */}
              <div className="relative h-full w-full container mx-auto px-4 md:px-8 flex items-center">
                <div className="max-w-[560px] space-y-6 md:space-y-7 text-left">
                  <span
                    className={cn(
                      "inline-block text-[11px] font-extrabold uppercase tracking-widest",
                      slide.theme === "dark" ? "text-[#FF6B35]" : "text-[#FF6B35]"
                    )}
                  >
                    {slide.tagline}
                  </span>
                  
                  <h1
                    className={cn(
                      "font-plus-jakarta font-extrabold text-4xl sm:text-5xl md:text-[56px] tracking-tight leading-[1.1]",
                      slide.theme === "dark" ? "text-white" : "text-[#111111]"
                    )}
                  >
                    {slide.headline}
                  </h1>
                  
                  <p
                    className={cn(
                      "text-[14px] md:text-[15px] leading-relaxed max-w-[460px]",
                      slide.theme === "dark" ? "text-zinc-300" : "text-[#6B7280]"
                    )}
                  >
                    {slide.subheadline}
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <Link
                      href="/shop"
                      className={cn(
                        buttonVariants({ variant: "default" }),
                        "bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-bold h-12 px-8 rounded-xl text-[13px] flex items-center justify-center transition-all shadow-md"
                      )}
                    >
                      Belanja Sekarang &rarr;
                    </Link>
                    <Link
                      href="/shop"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "border-transparent bg-white text-[#111111] hover:bg-zinc-100 font-bold h-12 px-8 rounded-xl text-[13px] transition-all shadow-sm"
                      )}
                    >
                      Lihat Koleksi
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        aria-label="Previous slide"
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-[#111111] flex items-center justify-center transition-all shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={handleNext}
        aria-label="Next slide"
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-[#111111] flex items-center justify-center transition-all shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center items-center gap-3">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              current === index ? "bg-[#FF6B35] scale-125" : "bg-[#D1D5DB] hover:bg-[#9CA3AF]"
            )}
          />
        ))}
      </div>
    </section>
  )
}
