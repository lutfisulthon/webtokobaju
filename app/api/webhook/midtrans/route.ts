import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PaymentStatus, ShippingStatus } from "@prisma/client";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log("Received Midtrans Webhook notification:", payload);

    const {
      order_id,
      status_code,
      gross_amount,
      transaction_status,
      signature_key,
      payment_type,
    } = payload;

    if (!order_id) {
      return NextResponse.json({ message: "Invalid payload: missing order_id" }, { status: 400 });
    }

    // 1. Verifikasi Signature Key untuk keamanan (opsional jika server key tidak ada)
    const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
    if (MIDTRANS_SERVER_KEY) {
      const serverKey = MIDTRANS_SERVER_KEY;
      const signaturePayload = order_id + status_code + gross_amount + serverKey;
      const calculatedSignature = crypto
        .createHash("sha512")
        .update(signaturePayload)
        .digest("hex");

      if (calculatedSignature !== signature_key) {
        console.error("Invalid Midtrans Webhook Signature!");
        return NextResponse.json({ message: "Invalid Signature Key" }, { status: 403 });
      }
    } else {
      console.warn("MIDTRANS_SERVER_KEY is not defined. Skipping webhook signature verification.");
    }

    // 2. Cari Order di database
    const order = await prisma.order.findUnique({
      where: { id: order_id },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // 3. Log Webhook payload ke database
    await prisma.paymentWebhookLog.create({
      data: {
        orderId: order.id,
        payload: JSON.stringify(payload),
        status: transaction_status,
      },
    });

    // 4. Tentukan PaymentStatus baru berdasarkan status dari Midtrans
    let newPaymentStatus: PaymentStatus = PaymentStatus.PENDING;
    let newShippingStatus: ShippingStatus = order.shippingStatus;

    if (transaction_status === "capture") {
      // Untuk Kartu Kredit, cek fraud_status
      if (payload.fraud_status === "challenge") {
        newPaymentStatus = PaymentStatus.PENDING;
      } else if (payload.fraud_status === "accept") {
        newPaymentStatus = PaymentStatus.PAID;
        newShippingStatus = ShippingStatus.PROCESSING;
      }
    } else if (transaction_status === "settlement") {
      // Pembayaran sukses (E-Wallet, VA, dll)
      newPaymentStatus = PaymentStatus.PAID;
      newShippingStatus = ShippingStatus.PROCESSING;
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      newPaymentStatus = PaymentStatus.FAILED;
      newShippingStatus = ShippingStatus.CANCELLED;
    } else if (transaction_status === "pending") {
      newPaymentStatus = PaymentStatus.PENDING;
    }

    // 5. Update Status Order di Database
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: newPaymentStatus,
        shippingStatus: newShippingStatus,
        paymentMethod: payment_type || order.paymentMethod,
      },
    });

    console.log(`Order ${order.id} status updated successfully to Payment: ${newPaymentStatus}, Shipping: ${newShippingStatus}`);

    return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error processing Midtrans Webhook:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
