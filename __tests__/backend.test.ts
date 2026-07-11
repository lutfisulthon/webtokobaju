import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getCategories, getProducts, getProductBySlug } from "@/lib/actions/products";
import { validateVoucher, createOrder } from "@/lib/actions/orders";
import { prisma, pool } from "@/lib/db";
import { POST as handlePaymentWebhook } from "@/app/api/payment/webhook/route";

describe("UrbanWear E-Commerce Backend - Unit & Integration Tests", () => {
  let testVariantId: string;
  let testProductSlug: string;
  let originalStock: number;

  beforeAll(async () => {
    // Cari satu varian produk dari database untuk digunakan pengujian
    const variant = await prisma.productVariant.findFirst({
      include: { product: true },
    });
    
    if (variant) {
      testVariantId = variant.id;
      testProductSlug = variant.product.slug;
      originalStock = variant.stock;
    } else {
      throw new Error("Silakan jalankan seeding database terlebih dahulu sebelum melakukan penujian!");
    }
  });

  afterAll(async () => {
    // Teardown: Tutup pool koneksi agar proses test keluar dengan bersih
    await prisma.$disconnect();
    await pool.end();
  });

  // --- KELOMPOK 1: Pengujian Produk ---
  describe("Product & Category Queries", () => {
    it("should retrieve categories from database", async () => {
      const categories = await getCategories();
      expect(categories.length).toBeGreaterThan(0);
      expect(categories[0]).toHaveProperty("name");
      expect(categories[0]).toHaveProperty("slug");
    });

    it("should retrieve products list with pagination and filters", async () => {
      const result = await getProducts({ limit: 5, page: 1 });
      expect(result).toHaveProperty("products");
      expect(result).toHaveProperty("totalCount");
      expect(result.products.length).toBeLessThanOrEqual(5);
    });

    it("should retrieve a single product by slug with its variants and reviews", async () => {
      const product = await getProductBySlug(testProductSlug);
      expect(product).not.toBeNull();
      expect(product?.slug).toBe(testProductSlug);
      expect(product).toHaveProperty("variants");
      expect(product).toHaveProperty("reviews");
    });
  });

  // --- KELOMPOK 2: Pengujian Promo / Voucher ---
  describe("Voucher Validation", () => {
    it("should validate a valid active voucher code", async () => {
      const validation = await validateVoucher("URBANNEW");
      expect(validation.isValid).toBe(true);
      expect(validation.promo?.discountPercentage).toBe(10);
    });

    it("should return invalid for a non-existing voucher code", async () => {
      const validation = await validateVoucher("INVALIDVOUCHER123");
      expect(validation.isValid).toBe(false);
      expect(validation.message).toBe("Kode voucher tidak ditemukan.");
    });
  });

  // --- KELOMPOK 3: Pengujian Checkout & Transaksi ---
  describe("Checkout Order & Inventory Concurrency", () => {
    it("should create an order successfully and decrement physical stock atomically", async () => {
      const orderQuantity = 2;
      
      const response = await createOrder({
        customerName: "Test Buyer",
        customerEmail: "test@buyer.com",
        customerPhone: "08123456789",
        shippingAddress: "Jl. Testing No. 1, Jakarta",
        shippingMethod: "JNE Regular",
        shippingCost: 15000,
        promoCode: "URBANNEW",
        items: [
          {
            variantId: testVariantId,
            quantity: orderQuantity,
          },
        ],
      });

      expect(response.success).toBe(true);
      expect(response.order).toHaveProperty("id");
      expect(response.order?.paymentStatus).toBe("PENDING");
      expect(response.order?.transactionId).toBeDefined();

      // Cek apakah stok fisik benar-benar berkurang di database secara aman
      const updatedVariant = await prisma.productVariant.findUnique({
        where: { id: testVariantId },
      });
      expect(updatedVariant?.stock).toBe(originalStock - orderQuantity);
    });

    it("should reject checkout if stock is insufficient", async () => {
      // Ambil sisa stok terbaru
      const currentVariant = await prisma.productVariant.findUnique({
        where: { id: testVariantId },
      });
      
      const excessiveQuantity = (currentVariant?.stock || 0) + 10;

      const response = await createOrder({
        customerName: "Greedy Buyer",
        customerEmail: "greedy@buyer.com",
        customerPhone: "08123456789",
        shippingAddress: "Jl. Out of Stock No. 100",
        shippingMethod: "Sicepat",
        shippingCost: 10000,
        items: [
          {
            variantId: testVariantId,
            quantity: excessiveQuantity,
          },
        ],
      });

      expect(response.success).toBe(false);
      expect(response.message).toContain("tidak mencukupi");
    });
  });

  // --- KELOMPOK 4: Pengujian Payment Webhook & Rollback Stok ---
  describe("Payment Webhook & Stock Rollback", () => {
    it("should process PAID webhook and mark order as PAID", async () => {
      // Buat order baru untuk testing webhook
      const orderResponse = await createOrder({
        customerName: "Webhook Buyer",
        customerEmail: "webhook@buyer.com",
        customerPhone: "08123456789",
        shippingAddress: "Jl. Webhook No. 2, Bandung",
        shippingMethod: "J&T",
        shippingCost: 12000,
        items: [{ variantId: testVariantId, quantity: 1 }],
      });

      const order = orderResponse.order!;
      expect(order.paymentStatus).toBe("PENDING");

      // Simulasi request webhook pembayaran sukses
      const webhookRequest = new Request("http://localhost:3000/api/payment/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: order.transactionId,
          status: "PAID",
          payload: { bank: "bca", method: "va" },
        }),
      });

      const response = await handlePaymentWebhook(webhookRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      // Pastikan status di database berubah menjadi PAID
      const updatedOrder = await prisma.order.findUnique({
        where: { id: order.id },
      });
      expect(updatedOrder?.paymentStatus).toBe("PAID");
    });

    it("should process FAILED webhook, mark order FAILED, and rollback/increment stock", async () => {
      // Dapatkan stok varian sebelum order dibuat
      const variantBefore = await prisma.productVariant.findUnique({
        where: { id: testVariantId },
      });
      const stockBefore = variantBefore!.stock;

      // Buat order baru
      const orderResponse = await createOrder({
        customerName: "Fail Buyer",
        customerEmail: "fail@buyer.com",
        customerPhone: "08123456789",
        shippingAddress: "Jl. Gagal No. 3, Surabaya",
        shippingMethod: "Sicepat",
        shippingCost: 10000,
        items: [{ variantId: testVariantId, quantity: 3 }],
      });

      const order = orderResponse.order!;
      
      // Stok setelah order berkurang 3
      const variantAfterOrder = await prisma.productVariant.findUnique({
        where: { id: testVariantId },
      });
      expect(variantAfterOrder!.stock).toBe(stockBefore - 3);

      // Simulasi request webhook pembayaran GAGAL (FAILED / EXPIRED)
      const webhookRequest = new Request("http://localhost:3000/api/payment/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: order.transactionId,
          status: "FAILED",
          payload: { reason: "User cancelled or timeout" },
        }),
      });

      const response = await handlePaymentWebhook(webhookRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      // 1. Pastikan status order di database berubah menjadi FAILED
      const updatedOrder = await prisma.order.findUnique({
        where: { id: order.id },
      });
      expect(updatedOrder?.paymentStatus).toBe("FAILED");

      // 2. Pastikan stok fisik otomatis kembali bertambah 3 (kembali ke kondisi sebelum order)
      const variantAfterRollback = await prisma.productVariant.findUnique({
        where: { id: testVariantId },
      });
      expect(variantAfterRollback!.stock).toBe(stockBefore);
    });
  });
});
