"use server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getWishlist(email?: string) {
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

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    return wishlist?.items || [];
  } catch (error) {
    console.error("Gagal mengambil wishlist:", error);
    return [];
  }
}

export async function removeFromWishlist(productId: string, email?: string) {
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

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: user.id },
      select: { id: true }
    });

    if (!wishlist) {
      return { success: false, message: "Wishlist tidak ditemukan." };
    }

    await prisma.wishlistItem.delete({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId: productId
        }
      }
    });

    revalidatePath("/member/profile");
    return { success: true, message: "Produk dihapus dari wishlist." };
  } catch (error) {
    console.error("Gagal menghapus dari wishlist:", error);
    return { success: false, message: "Gagal menghapus produk." };
  }
}
