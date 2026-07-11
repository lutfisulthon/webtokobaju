import { prisma } from "@/lib/db";
import { PaymentStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transactionId, status, payload } = body;

    if (!transactionId || !status) {
      return NextResponse.json(
        { success: false, message: "TransactionId dan Status diperlukan." },
        { status: 400 }
      );
    }

    // Cari order berdasarkan transactionId
    const order = await prisma.order.findUnique({
      where: { transactionId },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Pesanan tidak ditemukan." },
        { status: 404 }
      );
    }

    let newStatus: PaymentStatus = PaymentStatus.PENDING;
    if (status === "PAID") {
      newStatus = PaymentStatus.PAID;
    } else if (status === "FAILED") {
      newStatus = PaymentStatus.FAILED;
    } else if (status === "EXPIRED") {
      newStatus = PaymentStatus.EXPIRED;
    }

    // Jalankan update database dalam transaksi
    await prisma.$transaction(async (tx) => {
      // 1. Update status pembayaran pesanan
      await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: newStatus,
        },
      });

      // 2. Buat log webhook untuk riwayat audit
      await tx.paymentWebhookLog.create({
        data: {
          orderId: order.id,
          status: newStatus.toString(),
          payload: JSON.stringify(payload || body),
        },
      });

      // 3. JIKA pembayaran gagal/kadaluwarsa, kembalikan stok fisik varian dan kurangi usage count voucher
      if (newStatus === PaymentStatus.FAILED || newStatus === PaymentStatus.EXPIRED) {
        // Kembalikan stok varian
        for (const item of order.items) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: { increment: item.quantity },
            },
          });
        }

        // Kembalikan limit promo
        if (order.promoId) {
          await tx.promo.update({
            where: { id: order.promoId },
            data: {
              usageCount: { decrement: 1 },
            },
          });
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: `Status pembayaran pesanan ${order.id} berhasil diperbarui menjadi ${newStatus}.`,
    });
  } catch (error: any) {
    console.error("Gagal memproses webhook pembayaran:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal." },
      { status: 500 }
    );
  }
}
