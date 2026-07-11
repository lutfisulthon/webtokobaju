"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, ArrowRight, Ticket, Check, AlertCircle } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { CartItemRow } from "@/components/cart-item-row";
import { validateVoucher } from "@/lib/actions/orders";

export default function CartPage() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [promoMessage, setPromoMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percentage: number } | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 py-16 min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-neutral-900 border-t-transparent dark:border-white rounded-full animate-spin"></div>
      </div>
    );
  }

  const subtotal = getCartTotal();

  const handleApplyVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;

    setIsValidating(true);
    setPromoMessage(null);

    const result = await validateVoucher(voucherCode);
    setIsValidating(false);

    if (result.isValid && result.promo) {
      const percentage = result.promo.discountPercentage;
      const calculatedDiscount = (subtotal * percentage) / 100;
      const finalDiscount = result.promo.maxDiscount && calculatedDiscount > result.promo.maxDiscount
        ? result.promo.maxDiscount
        : calculatedDiscount;

      setDiscountAmount(finalDiscount);
      setAppliedPromo({
        code: result.promo.code,
        percentage: percentage,
      });
      setPromoMessage({ type: "success", text: result.message || "Voucher berhasil diterapkan!" });
    } else {
      setPromoMessage({ type: "error", text: result.message || "Voucher tidak valid." });
      setDiscountAmount(0);
      setAppliedPromo(null);
    }
  };

  const grandTotal = Math.max(subtotal - discountAmount, 0);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-neutral-400" />
        </div>
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
          Keranjang Belanja Anda Kosong
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-8">
          Jelajahi koleksi busana premium kami dan temukan pakaian terbaik Anda hari ini.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-full text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200 transition-all duration-300 shadow-lg shadow-neutral-900/10 dark:shadow-none"
        >
          Mulai Belanja
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100 dark:border-neutral-900">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Keranjang Belanja
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Anda memiliki <span className="font-semibold text-neutral-900 dark:text-neutral-100">{items.reduce((acc, item) => acc + item.quantity, 0)}</span> item di keranjang Anda.
            </p>
          </div>
          
          <button
            onClick={() => clearCart()}
            className="text-xs font-medium text-neutral-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            Kosongkan Keranjang
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Item List */}
          <div className="lg:col-span-2 bg-white dark:bg-neutral-950 p-6 md:p-8 rounded-2xl border border-neutral-200/50 dark:border-neutral-900 shadow-sm">
            <div className="divide-y divide-neutral-100 dark:divide-neutral-900 -mt-6">
              {items.map((item) => (
                <CartItemRow 
                  key={`${item.id}-${item.size || ""}-${item.color || ""}`} 
                  item={item} 
                />
              ))}
            </div>
            
            <div className="mt-8 flex justify-between">
              <Link
                href="/shop"
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50 flex items-center gap-2 transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Kembali Belanja
              </Link>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Promo Code Card */}
            <div className="bg-white dark:bg-neutral-950 p-6 rounded-2xl border border-neutral-200/50 dark:border-neutral-900 shadow-sm">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-3 flex items-center gap-2">
                <Ticket className="w-4 h-4" />
                Gunakan Kode Voucher
              </h2>
              
              <form onSubmit={handleApplyVoucher} className="flex gap-2">
                <input
                  type="text"
                  placeholder="KODEPROMO"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  disabled={appliedPromo !== null}
                  className="flex-1 px-4 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition-all uppercase disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isValidating || !voucherCode.trim() || appliedPromo !== null}
                  className="px-4 py-2 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg disabled:opacity-50 transition-colors"
                >
                  {isValidating ? "Mengecek..." : "Gunakan"}
                </button>
              </form>

              {promoMessage && (
                <div className={`mt-3 flex items-start gap-2 text-xs p-2.5 rounded-lg ${
                  promoMessage.type === "success" 
                    ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400" 
                    : "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400"
                }`}>
                  {promoMessage.type === "success" ? (
                    <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  )}
                  <span>{promoMessage.text}</span>
                </div>
              )}

              {appliedPromo && (
                <button
                  type="button"
                  onClick={() => {
                    setAppliedPromo(null);
                    setDiscountAmount(0);
                    setVoucherCode("");
                    setPromoMessage(null);
                  }}
                  className="mt-3 text-xs text-red-500 hover:underline block"
                >
                  Hapus Voucher
                </button>
              )}
            </div>

            {/* Price Calculations Card */}
            <div className="bg-white dark:bg-neutral-950 p-6 rounded-2xl border border-neutral-200/50 dark:border-neutral-900 shadow-sm space-y-4">
              <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-50 border-b border-neutral-100 dark:border-neutral-900 pb-3">
                Ringkasan Belanja
              </h2>
              
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Subtotal</span>
                  <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Diskon ({appliedPromo?.code})</span>
                    <span>- Rp {discountAmount.toLocaleString("id-ID")}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Pengiriman</span>
                  <span className="text-xs italic">Dihitung di checkout</span>
                </div>
              </div>
              
              <div className="border-t border-neutral-100 dark:border-neutral-900 pt-4 flex justify-between items-baseline">
                <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">Total Akhir</span>
                <span className="text-lg md:text-xl font-bold text-neutral-900 dark:text-neutral-50">
                  Rp {grandTotal.toLocaleString("id-ID")}
                </span>
              </div>

              <Link
                href={{
                  pathname: "/checkout",
                  query: appliedPromo ? { promo: appliedPromo.code } : {},
                }}
                className="w-full mt-2 inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-full text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200 transition-all duration-300 shadow-lg shadow-neutral-900/10 dark:shadow-none"
              >
                Lanjut ke Checkout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
