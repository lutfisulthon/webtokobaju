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
    <div className="container mx-auto px-4 md:px-6 py-8 space-y-16">
      {/* 1. Main Client Details Component */}
      <ProductDetailsClient product={product as any} />

      {/* 2. Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="border-t pt-12">
          <div className="space-y-2 mb-8">
            <h2 className="font-plus-jakarta font-extrabold text-xl md:text-2xl tracking-tight">
              Produk Terkait
            </h2>
            <p className="text-xs text-muted-foreground font-semibold">
              Lihat pilihan busana menarik lainnya dari koleksi {product.category.name}.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
