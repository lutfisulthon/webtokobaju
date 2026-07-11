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

    // e. Simulasi pembuatan URL Pembayaran (di masa depan bisa diintegrasikan dengan Midtrans snap token)
    const mockTransactionId = `TRX-${result.id.slice(-8).toUpperCase()}`;
    const mockPaymentToken = `MOCK-TOKEN-${result.id.slice(-8)}`;
    const mockPaymentUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${mockPaymentToken}`;

    // Update pesanan dengan URL pembayaran dan transactionId simulasi
    const updatedOrder = await prisma.order.update({
      where: { id: result.id },
      data: {
        transactionId: mockTransactionId,
        paymentUrl: mockPaymentUrl,
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
