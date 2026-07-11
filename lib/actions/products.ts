"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// 1. Mengambil semua kategori pakaian
export async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Gagal mengambil kategori:", error);
    throw new Error("Terjadi kesalahan saat mengambil kategori.");
  }
}

// 2. Mengambil daftar produk dengan filter dan pencarian
export interface ProductFilterOptions {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "newest" | "price_asc" | "price_desc" | "popular";
  limit?: number;
  page?: number;
}

export async function getProducts(options: ProductFilterOptions = {}) {
  const {
    categorySlug,
    minPrice,
    maxPrice,
    search,
    sortBy = "newest",
    limit = 12,
    page = 1,
  } = options;

  const skip = (page - 1) * limit;

  // Bangun klausa WHERE untuk filter
  const where: any = {
    isActive: true,
    deletedAt: null, // Hanya ambil produk yang tidak di-soft-delete
  };

  if (categorySlug) {
    where.category = {
      slug: categorySlug,
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  // Tentukan pengurutan (Sorting)
  let orderBy: any = {};
  if (sortBy === "newest") {
    orderBy = { createdAt: "desc" };
  } else if (sortBy === "price_asc") {
    orderBy = { price: "asc" };
  } else if (sortBy === "price_desc") {
    orderBy = { price: "desc" };
  } else if (sortBy === "popular") {
    // Sebagai alternatif, urutkan berdasarkan jumlah review terbanyak
    orderBy = { reviews: { _count: "desc" } };
  }

  try {
    const [products, totalCount] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
          variants: true,
          _count: {
            select: { reviews: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Gagal mengambil produk:", error);
    throw new Error("Terjadi kesalahan saat mengambil produk.");
  }
}

// 3. Mengambil produk berdasarkan Slug (Detail Produk)
export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        slug,
        isActive: true,
        deletedAt: null,
      },
      include: {
        category: true,
        variants: {
          orderBy: { size: "asc" },
        },
        reviews: {
          include: {
            user: {
              select: { name: true, image: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return product;
  } catch (error) {
    console.error("Gagal mengambil detail produk:", error);
    throw new Error("Terjadi kesalahan saat mengambil detail produk.");
  }
}

// 4. Fungsi Revalidasi Cache Halaman (Digunakan Admin saat CRUD)
export async function revalidateProductsCache() {
  try {
    revalidatePath("/shop");
    revalidatePath("/");
  } catch (error) {
    console.error("Gagal melakukan revalidasi cache:", error);
  }
}
