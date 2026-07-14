import * as React from "react"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getProductBySlug, getProducts } from "@/lib/actions/products"
import { ProductDetailsClient } from "@/components/product-details-client"
import { ProductCard } from "@/components/product-card"

export const revalidate = 0 // Disable cache for live updates

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>
}

// Dynamic SEO Metadata Generation
export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug).catch(() => null)

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan - UrbanWear",
    }
  }

  const priceText = product.discountPrice
    ? `Rp ${product.discountPrice.toLocaleString("id-ID")}`
    : `Rp ${product.price.toLocaleString("id-ID")}`

  return {
    title: `${product.name} | UrbanWear Premium`,
    description: `${product.description.substring(0, 150)}... Beli sekarang seharga ${priceText} hanya di UrbanWear.`,
    openGraph: {
      title: `${product.name} - UrbanWear`,
      description: product.description.substring(0, 150),
      images: [
        {
          url: product.image,
          alt: product.name,
        },
      ],
    },
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params

  // Fetch details
  const product = await getProductBySlug(slug).catch(() => null)
  if (!product) {
    notFound()
  }

  // Fetch related products (same category, excluding the current one)
  const { products: allRelated } = await getProducts({
    categorySlug: product.category.slug,
    limit: 5,
  }).catch(() => ({ products: [] }))

  const relatedProducts = allRelated
    .filter((p) => p.id !== product.id)
    .slice(0, 4) // Show up to 4 related products

  return (
    <div className="min-h-screen">
      {/* Product Detail Section */}
      <section className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <ProductDetailsClient product={product as any} />
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="border-t bg-muted/20 py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div className="space-y-1.5">
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF6B35]">
                  Koleksi Terkait
                </p>
                <h2 className="font-plus-jakarta font-extrabold text-xl md:text-2xl tracking-tight">
                  Produk Serupa yang Mungkin Anda Suka
                </h2>
              </div>
              <a
                href={`/shop?category=${product.category.slug}`}
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors shrink-0 pb-0.5"
              >
                Lihat Semua →
              </a>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom padding for mobile sticky CTA */}
      <div className="md:hidden h-24" />
    </div>
  )
}
