"use server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getUserReviews(email?: string) {
  let userEmail = email || "";
  if (!userEmail) {
    const session = await auth();
    userEmail = session?.user?.email || "";
  }

  if (!userEmail) return [];

  try {
    const user = await prisma.user.findFirst({
      where: { email: userEmail },
      select: { id: true }
    });

    if (!user) return [];

    const reviews = await prisma.review.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        product: true
      }
    });

    return reviews;
  } catch (error) {
    console.error("Gagal mengambil ulasan:", error);
    return [];
  }
}

export async function submitReview(data: { orderId: string; productId: string; rating: number; comment: string }, email?: string) {
  const { orderId, productId, rating, comment } = data;
  if (!orderId || !productId || !rating) {
    return { success: false, message: "Data ulasan tidak lengkap." };
  }

  let userEmail = email || "";
  if (!userEmail) {
    const session = await auth();
    userEmail = session?.user?.email || "";
  }

  if (!userEmail) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    const user = await prisma.user.findFirst({
      where: { email: userEmail },
      select: { id: true }
    });

    if (!user) {
      return { success: false, message: "Pengguna tidak ditemukan." };
    }

    // Cek apakah user benar-benar membeli produk ini di orderId tersebut
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id,
        items: {
          some: {
            variant: {
              productId: productId
            }
          }
        }
      }
    });

    if (!order) {
      return { success: false, message: "Transaksi tidak ditemukan atau Anda tidak membeli produk ini." };
    }

    // Cek apakah ulasan sudah pernah dibuat untuk orderId + productId + userId ini
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: user.id,
        productId: productId,
        // Di schema prisma review tidak ada field orderId langsung, namun idealnya kita handle per product
      }
    });

    if (existingReview) {
      // Boleh update atau return pesan
      await prisma.review.update({
        where: { id: existingReview.id },
        data: { rating, comment }
      });
      revalidatePath("/member/profile");
      return { success: true, message: "Ulasan berhasil diperbarui!" };
    }

    await prisma.review.create({
      data: {
        userId: user.id,
        productId: productId,
        rating,
        comment
      }
    });

    revalidatePath("/member/profile");
    return { success: true, message: "Ulasan berhasil dikirim!" };
  } catch (error) {
    console.error("Gagal mengirim ulasan:", error);
    return { success: false, message: "Gagal mengirim ulasan." };
  }
}
