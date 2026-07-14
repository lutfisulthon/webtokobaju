"use server";

import { prisma } from "@/lib/db";
import { PaymentStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export interface CreateOrderInput {
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingMethod: string;
  shippingCost: number;
  promoCode?: string;
  items: {
    variantId: string;
    quantity: number;
  }[];
}

// 1. Validasi Kode Voucher / Promo
export async function validateVoucher(code: string) {
  try {
    const promo = await prisma.promo.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promo) {
      return { isValid: false, message: "Kode voucher tidak ditemukan." };
    }

    const now = new Date();
    if (now < promo.validFrom || now > promo.validUntil) {
      return { isValid: false, message: "Masa berlaku voucher telah habis." };
    }

    if (promo.usageCount >= promo.usageLimit) {
      return { isValid: false, message: "Kuota penggunaan voucher telah habis." };
    }

    return {
      isValid: true,
      promo,
      message: "Voucher berhasil diterapkan!",
    };
  } catch (error) {
    console.error("Gagal validasi voucher:", error);
    return { isValid: false, message: "Gagal memproses validasi voucher." };
  }
}

// 2. Server Action untuk Checkout / Pembuatan Pesanan
export async function createOrder(input: CreateOrderInput) {
  const {
    userId,
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    shippingMethod,
    shippingCost,
    promoCode,
    items,
  } = input;

  if (!items || items.length === 0) {
    throw new Error("Keranjang belanja kosong.");
  }

  try {
    // Jalankan seluruh pengecekan dan penulisan DB dalam 1 Transaksi untuk mencegah data tidak konsisten/bentrok stok
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      let discountAmount = 0;
      let promoId: string | undefined;
      let subtotal = 0;

      // a. Ambil detail harga untuk setiap produk/varian
      const itemsWithPrice = [];
      for (const item of items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });

        if (!variant || !variant.product.isActive || variant.product.deletedAt) {
          throw new Error("Ada produk di keranjang Anda yang sudah tidak tersedia.");
        }

        // Cek stok fisik apakah mencukupi secara aman sebelum dipesan
        if (variant.stock < item.quantity) {
          throw new Error(`Stok produk "${variant.product.name}" (Warna: ${variant.color}, Ukuran: ${variant.size}) tidak mencukupi. Sisa stok: ${variant.stock}.`);
        }

        const priceToUse = variant.product.discountPrice ?? variant.product.price;
        subtotal += priceToUse * item.quantity;

        itemsWithPrice.push({
          variantId: variant.id,
          quantity: item.quantity,
          price: priceToUse,
          sku: variant.sku,
        });
      }

      // b. Proses potongan harga voucher (jika ada)
      if (promoCode) {
        const promo = await tx.promo.findUnique({
          where: { code: promoCode.toUpperCase() },
        });

        if (promo) {
          const now = new Date();
          const isDateValid = now >= promo.validFrom && now <= promo.validUntil;
          const isQuotaValid = promo.usageCount < promo.usageLimit;

          if (isDateValid && isQuotaValid) {
            discountAmount = (subtotal * promo.discountPercentage) / 100;
            // Batasi nilai diskon maksimal jika diatur
            if (promo.maxDiscount && discountAmount > promo.maxDiscount) {
              discountAmount = promo.maxDiscount;
            }
            promoId = promo.id;

            // Increment kuota pemakaian voucher secara aman
            await tx.promo.update({
              where: { id: promo.id },
              data: {
                usageCount: { increment: 1 },
              },
            });
          }
        }
      }

      const total = subtotal;
      const grandTotal = total - discountAmount + shippingCost;

      // c. Kurangi stok fisik varian secara aman menggunakan Atomic updates (decrement)
      for (const item of itemsWithPrice) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      // d. Buat record Order di database
      const order = await tx.order.create({
        data: {
          userId,
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          shippingMethod,
          shippingCost,
          total,
          discountAmount,
          grandTotal,
          promoId,
          paymentStatus: PaymentStatus.PENDING,
          // Hubungkan item pesanan
          items: {
            create: itemsWithPrice.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      return order;
    });

    // e. Pembuatan Snap Token dari Midtrans
    let paymentToken = `MOCK-TOKEN-${result.id.slice(-8)}`;
    let paymentUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${paymentToken}`;
    let transactionId = `TRX-${result.id.slice(-8).toUpperCase()}`;

    const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
    if (MIDTRANS_SERVER_KEY) {
      try {
        const base64Key = Buffer.from(MIDTRANS_SERVER_KEY + ":").toString("base64");
        const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
        const midtransUrl = isProduction 
          ? "https://app.midtrans.com/snap/v1/transactions"
          : "https://app.sandbox.midtrans.com/snap/v1/transactions";

        const snapResponse = await fetch(midtransUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Basic ${base64Key}`,
          },
          body: JSON.stringify({
            transaction_details: {
              order_id: result.id,
              gross_amount: Math.round(result.grandTotal),
            },
            credit_card: {
              secure: true,
            },
            customer_details: {
              first_name: customerName,
              email: customerEmail,
              phone: customerPhone,
            },
          }),
        });

        if (snapResponse.ok) {
          const snapData = await snapResponse.json();
          paymentToken = snapData.token;
          paymentUrl = snapData.redirect_url;
          console.log("Successfully generated Midtrans Snap Token:", paymentToken);
        } else {
          const errText = await snapResponse.text();
          console.error("Midtrans API returned error:", errText);
        }
      } catch (error) {
        console.error("Failed to generate Midtrans Snap token, falling back to mock:", error);
      }
    } else {
      console.log("MIDTRANS_SERVER_KEY not found. Operating in MOCK mode.");
    }

    // Update pesanan dengan URL pembayaran dan transactionId real/simulasi
    const updatedOrder = await prisma.order.update({
      where: { id: result.id },
      data: {
        transactionId,
        paymentUrl,
      },
    });

    // Revalidasi cache shop/dashboard jika perlu
    try {
      revalidatePath("/admin/orders");
    } catch (e) {
      // Abaikan jika dijalankan di luar server Next.js (seperti saat unit testing)
    }

    return {
      success: true,
      order: updatedOrder,
      paymentToken,
      message: "Pesanan berhasil dibuat!",
    };
  } catch (error: any) {
    console.error("Gagal membuat pesanan:", error);
    return {
      success: false,
      message: error.message || "Terjadi kesalahan saat memproses pesanan Anda.",
    };
  }
}

export async function getUserOrders(email?: string) {
  let userEmail = email || "";
  if (!userEmail) {
    const { auth } = await import("@/lib/auth");
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

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true
              }
            }
          }
        }
      }
    });

    return orders;
  } catch (error) {
    console.error("Gagal mengambil pesanan user:", error);
    return [];
  }
}

export async function getUserOrderStats(email?: string) {
  let userEmail = email || "";
  if (!userEmail) {
    const { auth } = await import("@/lib/auth");
    const session = await auth();
    userEmail = session?.user?.email || "";
  }

  const defaultStats = { total: 0, processing: 0, completed: 0, reviews: 0 };
  if (!userEmail) return defaultStats;

  try {
    const user = await prisma.user.findFirst({
      where: { email: userEmail },
      select: { id: true }
    });

    if (!user) return defaultStats;

    const total = await prisma.order.count({ where: { userId: user.id } });
    const processing = await prisma.order.count({
      where: {
        userId: user.id,
        shippingStatus: { in: ["PENDING", "PROCESSING", "SHIPPED"] }
      }
    });
    const completed = await prisma.order.count({
      where: {
        userId: user.id,
        shippingStatus: "DELIVERED"
      }
    });
    const reviews = await prisma.review.count({ where: { userId: user.id } });

    return { total, processing, completed, reviews };
  } catch (error) {
    console.error("Gagal mengambil statistik order:", error);
    return defaultStats;
  }
}
