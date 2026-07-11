"use client";

import Link from "next/link";
import Script from "next/script";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, CreditCard, ShieldCheck, Truck, ShoppingCart, Loader2 } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { getProvinces, getCities, getShippingCost, Province, City, ShippingCourierResult } from "@/lib/actions/shipping";
import { createOrder } from "@/lib/actions/orders";
import { toast } from "sonner";
import Image from "next/image";

// Form Validation Schema using Zod
const checkoutSchema = z.object({
  name: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().min(9, "Nomor telepon minimal 9 digit").max(15, "Nomor telepon maksimal 15 digit"),
  address: z.string().min(10, "Alamat lengkap minimal 10 karakter"),
  provinceId: z.string().min(1, "Silakan pilih provinsi"),
  cityId: z.string().min(1, "Silakan pilih kota/kabupaten"),
  courier: z.enum(["jne", "pos", "tiki"]),
  service: z.string().min(1, "Silakan pilih layanan pengiriman"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CheckoutPageProps {
  searchParams: Promise<{ promo?: string }>;
}

export default function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = use(searchParams);
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();

  const [isMounted, setIsMounted] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [shippingCosts, setShippingCosts] = useState<ShippingCourierResult[]>([]);
  const [isLoadingCosts, setIsLoadingCosts] = useState(false);
  const [selectedCost, setSelectedCost] = useState<number>(0);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  
  // Dev simulation dialog
  const [showMockDialog, setShowMockDialog] = useState(false);
  const [mockOrderUrl, setMockOrderUrl] = useState("");
  const [mockOrderId, setMockOrderId] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      provinceId: "",
      cityId: "",
      courier: "jne",
      service: "",
    },
  });

  const watchProvince = watch("provinceId");
  const watchCity = watch("cityId");
  const watchCourier = watch("courier");
  const watchService = watch("service");

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch provinces on load
  useEffect(() => {
    if (isMounted) {
      getProvinces().then((data) => setProvinces(data));
    }
  }, [isMounted]);

  // Fetch cities when province changes
  useEffect(() => {
    if (watchProvince) {
      setCities([]);
      setValue("cityId", "");
      setValue("service", "");
      setSelectedCost(0);
      getCities(watchProvince).then((data) => setCities(data));
    }
  }, [watchProvince, setValue]);

  // Calculate voucher discount on client side based on query params
  useEffect(() => {
    if (isMounted && params.promo) {
      // Simulate discount lookup (normally done securely on server, here we just show preview)
      const subtotal = getCartTotal();
      const code = params.promo.toUpperCase();
      // Dummy check to match what server would do
      if (code === "URBANNEW" || code === "DISKON10") {
        setDiscountAmount(subtotal * 0.1);
      } else if (code === "PROMO15") {
        setDiscountAmount(subtotal * 0.15);
      }
    }
  }, [isMounted, params.promo, getCartTotal]);

  // Fetch shipping costs when city or courier changes
  useEffect(() => {
    if (watchCity && watchCourier) {
      setIsLoadingCosts(true);
      setValue("service", "");
      setSelectedCost(0);
      // Calculate total weight (default 500g per item)
      const totalWeight = items.reduce((acc, item) => acc + item.quantity * 500, 0);

      getShippingCost(watchCity, totalWeight, watchCourier)
        .then((data) => {
          setShippingCosts(data);
          setIsLoadingCosts(false);
        })
        .catch(() => {
          setIsLoadingCosts(false);
          toast.error("Gagal mendapatkan tarif ongkir");
        });
    }
  }, [watchCity, watchCourier, items, setValue]);

  // Update selected cost when service changes
  useEffect(() => {
    if (watchService && shippingCosts.length > 0) {
      const courierResult = shippingCosts[0];
      const option = courierResult.costs.find((c) => c.service === watchService);
      if (option && option.cost.length > 0) {
        setSelectedCost(option.cost[0].value);
        setSelectedMethod(`${courierResult.code.toUpperCase()} - ${option.service}`);
      }
    }
  }, [watchService, shippingCosts]);

  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 py-16 min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-900 dark:text-white" />
      </div>
    );
  }

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const subtotal = getCartTotal();
  const grandTotal = Math.max(subtotal - discountAmount + selectedCost, 0);

  const onSubmit = async (values: CheckoutFormValues) => {
    setIsSubmitting(true);
    
    // Find city and province names for address
    const selectedProvince = provinces.find((p) => p.province_id === values.provinceId)?.province || "";
    const selectedCityObj = cities.find((c) => c.city_id === values.cityId);
    const selectedCity = selectedCityObj ? `${selectedCityObj.type} ${selectedCityObj.city_name}` : "";
    const fullAddress = `${values.address}, ${selectedCity}, ${selectedProvince}`;

    const orderInput = {
      customerName: values.name,
      customerEmail: values.email,
      customerPhone: values.phone,
      shippingAddress: fullAddress,
      shippingMethod: selectedMethod,
      shippingCost: selectedCost,
      promoCode: params.promo,
      items: items.map((item) => ({
        variantId: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      const res = await createOrder(orderInput);
      
      if (!res.success || !res.order) {
        throw new Error(res.message || "Gagal membuat pesanan.");
      }

      const token = res.paymentToken;

      // Handle Mock vs Real Midtrans payment
      if (token && token.startsWith("MOCK-TOKEN-")) {
        setMockOrderId(res.order.id);
        setMockOrderUrl(res.order.paymentUrl || "");
        setShowMockDialog(true);
        setIsSubmitting(false);
      } else if (token) {
        // Trigger real Midtrans snap popup
        if ((window as any).snap) {
          (window as any).snap.pay(token, {
            onSuccess: function (result: any) {
              toast.success("Pembayaran berhasil!");
              clearCart();
              router.push(`/shop`); // Redirect to shop or success page
            },
            onPending: function (result: any) {
              toast.info("Menunggu pembayaran Anda.");
              clearCart();
              router.push(`/shop`);
            },
            onError: function (result: any) {
              toast.error("Pembayaran gagal.");
            },
            onClose: function () {
              toast.warning("Anda menutup pop-up pembayaran.");
            },
          });
        } else {
          // Fallback to direct redirect link
          if (res.order.paymentUrl) {
            window.location.href = res.order.paymentUrl;
          }
        }
        setIsSubmitting(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan sistem.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 min-h-screen">
      {/* Midtrans Snap JS Script */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />

      <div className="max-w-6xl mx-auto">
        <Link
          href="/cart"
          className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-50 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Keranjang
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Checkout Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="lg:col-span-7 bg-white dark:bg-neutral-950 p-6 md:p-8 rounded-2xl border border-neutral-200/50 dark:border-neutral-900 shadow-sm space-y-6"
          >
            <div>
              <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-50 border-b border-neutral-100 dark:border-neutral-900 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-neutral-500" />
                Informasi Pengiriman
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register("name")}
                  className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 transition-all ${
                    errors.name ? "border-red-500 focus:ring-red-500" : "border-neutral-300 dark:border-neutral-700 focus:ring-neutral-900 dark:focus:ring-white"
                  }`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  {...register("email")}
                  className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 transition-all ${
                    errors.email ? "border-red-500 focus:ring-red-500" : "border-neutral-300 dark:border-neutral-700 focus:ring-neutral-900 dark:focus:ring-white"
                  }`}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                Nomor Telepon (WhatsApp)
              </label>
              <input
                type="tel"
                placeholder="08123456789"
                {...register("phone")}
                className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 transition-all ${
                  errors.phone ? "border-red-500 focus:ring-red-500" : "border-neutral-300 dark:border-neutral-700 focus:ring-neutral-900 dark:focus:ring-white"
                }`}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                  Provinsi
                </label>
                <select
                  {...register("provinceId")}
                  className="w-full px-4 py-2.5 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition-all"
                >
                  <option value="">Pilih Provinsi</option>
                  {provinces.map((prov) => (
                    <option key={prov.province_id} value={prov.province_id}>
                      {prov.province}
                    </option>
                  ))}
                </select>
                {errors.provinceId && <p className="text-xs text-red-500 mt-1">{errors.provinceId.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                  Kota / Kabupaten
                </label>
                <select
                  disabled={!watchProvince}
                  {...register("cityId")}
                  className="w-full px-4 py-2.5 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition-all disabled:opacity-50"
                >
                  <option value="">Pilih Kota/Kabupaten</option>
                  {cities.map((city) => (
                    <option key={city.city_id} value={city.city_id}>
                      {city.type} {city.city_name}
                    </option>
                  ))}
                </select>
                {errors.cityId && <p className="text-xs text-red-500 mt-1">{errors.cityId.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                Alamat Lengkap
              </label>
              <textarea
                rows={3}
                placeholder="Nama jalan, nomor rumah, RT/RW, Kecamatan"
                {...register("address")}
                className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 transition-all ${
                  errors.address ? "border-red-500 focus:ring-red-500" : "border-neutral-300 dark:border-neutral-700 focus:ring-neutral-900 dark:focus:ring-white"
                }`}
              />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
            </div>

            <div className="space-y-4">
              <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-50 border-b border-neutral-100 dark:border-neutral-900 pb-3 flex items-center gap-2">
                <Truck className="w-5 h-5 text-neutral-500" />
                Layanan Pengiriman
              </h2>

              <div className="grid grid-cols-3 gap-2">
                {["jne", "pos", "tiki"].map((courierOption) => (
                  <label
                    key={courierOption}
                    className={`flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${
                      watchCourier === courierOption
                        ? "border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-900"
                        : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
                    }`}
                  >
                    <input
                      type="radio"
                      value={courierOption}
                      {...register("courier")}
                      className="sr-only"
                    />
                    <span className="text-sm font-semibold uppercase text-neutral-800 dark:text-neutral-200">
                      {courierOption}
                    </span>
                  </label>
                ))}
              </div>

              {watchCity && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                    Pilih Paket Pengiriman
                  </label>
                  
                  {isLoadingCosts ? (
                    <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 py-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Mencari tarif ongkir...
                    </div>
                  ) : shippingCosts.length > 0 && shippingCosts[0].costs.length > 0 ? (
                    <select
                      {...register("service")}
                      className="w-full px-4 py-2.5 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition-all"
                    >
                      <option value="">Pilih Layanan</option>
                      {shippingCosts[0].costs.map((costOpt) => (
                        <option key={costOpt.service} value={costOpt.service}>
                          {costOpt.service} ({costOpt.description}) - Rp {costOpt.cost[0].value.toLocaleString("id-ID")} ({costOpt.cost[0].etd} hari)
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-xs text-amber-600 dark:text-amber-400 py-1">
                      Layanan pengiriman tidak tersedia untuk rute ini atau hubungi admin.
                    </p>
                  )}
                  {errors.service && <p className="text-xs text-red-500 mt-1">{errors.service.message}</p>}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold rounded-full text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200 transition-all duration-300 shadow-lg shadow-neutral-900/10 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Memproses Pesanan...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Buat Pesanan & Bayar Sekarang
                </>
              )}
            </button>
          </form>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5 bg-neutral-50 dark:bg-neutral-900/50 p-6 md:p-8 rounded-2xl border border-neutral-200/50 dark:border-neutral-900 shadow-sm space-y-6">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-50 pb-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-neutral-500" />
              Ringkasan Pesanan
            </h2>

            {/* Item List */}
            <div className="divide-y divide-neutral-200/60 dark:divide-neutral-800/60 max-h-[300px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={`${item.id}-${item.size || ""}-${item.color || ""}`} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="relative w-12 h-16 bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      Ukuran: {item.size || "-"} | Warna: {item.color || "-"}
                    </p>
                    <p className="text-xs font-medium text-neutral-500 mt-1">
                      {item.quantity} x Rp {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-50 self-center">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Potongan Voucher</span>
                  <span>- Rp {discountAmount.toLocaleString("id-ID")}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Ongkos Kirim</span>
                <span>
                  {selectedCost > 0 
                    ? `Rp ${selectedCost.toLocaleString("id-ID")}` 
                    : "Pilih alamat & kurir"}
                </span>
              </div>

              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 flex justify-between items-baseline">
                <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">Total Pembayaran</span>
                <span className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                  Rp {grandTotal.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dev Mode Mock Payment Dialog */}
      {showMockDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto text-amber-500">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                Simulasi Pembayaran (Dev Mode)
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                MIDTRANS_SERVER_KEY tidak terdeteksi di server. Kami mensimulasikan pembayaran sandbox Midtrans untuk pengujian Anda.
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={async () => {
                  toast.success("Simulasi Pembayaran Sukses!");
                  clearCart();
                  setShowMockDialog(false);
                  router.push(`/shop`);
                }}
                className="w-full py-3 text-sm font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
              >
                Simulasikan Pembayaran SUKSES
              </button>

              <a
                href={mockOrderUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full block py-3 text-center text-sm font-semibold rounded-lg text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
              >
                Buka Link URL Pembayaran Simulasi
              </a>

              <button
                type="button"
                onClick={() => {
                  toast.error("Pembayaran dibatalkan");
                  setShowMockDialog(false);
                }}
                className="w-full py-2.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300 transition-colors"
              >
                Tutup / Batalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
