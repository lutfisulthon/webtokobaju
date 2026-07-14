"use client";

import Link from "next/link";
import Script from "next/script";
import Image from "next/image";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft, ArrowRight, CreditCard, ShieldCheck, Truck,
  Store, MapPin, Clock, Phone, Check, Loader2, Tag,
  Package, Headphones, RefreshCw, LockKeyhole, ChevronDown,
  ChevronRight, Star, Zap,
} from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import {
  getProvinces, getCities, getShippingCost,
  Province, City, ShippingCourierResult,
} from "@/lib/actions/shipping";
import { createOrder } from "@/lib/actions/orders";
import { validateVoucher } from "@/lib/actions/orders";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Form Schema ──────────────────────────────────────────────────────────────
const checkoutSchema = z.object({
  name: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().min(9, "Nomor minimal 9 digit").max(15, "Nomor maksimal 15 digit"),
  address: z.string().optional(),
  provinceId: z.string().optional(),
  cityId: z.string().optional(),
  postalCode: z.string().optional(),
  note: z.string().optional(),
  courier: z.enum(["jne", "pos", "tiki"]).optional(),
  service: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

// ─── Step Progress ─────────────────────────────────────────────────────────────
const STEPS = ["Informasi", "Pengiriman", "Pembayaran", "Selesai"];

function StepProgress({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 justify-center">
      {STEPS.map((step, i) => {
        const active = i === current;
        const done = i < current;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-extrabold transition-all",
                  done ? "bg-[#22C55E] text-white" :
                  active ? "bg-[#FF6B35] text-white ring-4 ring-[#FF6B35]/20" :
                  "bg-[#F2F2F0] text-[#999]"
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className={cn(
                "text-[10px] font-semibold whitespace-nowrap",
                active ? "text-[#FF6B35]" : done ? "text-[#22C55E]" : "text-[#AAA]"
              )}>
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn(
                "w-12 md:w-20 h-px mx-1 mb-4 transition-colors",
                done ? "bg-[#22C55E]" : "bg-[#E5E5E0]"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Field Component ───────────────────────────────────────────────────────────
function Field({
  label, error, required, children,
}: {
  label: string; error?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[12px] font-bold uppercase tracking-wider text-[#6B7280]">
        {label}{required && <span className="text-[#FF6B35] ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-[11px] text-red-500 flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-100 flex items-center justify-center text-[9px]">!</span>
          {error}
        </p>
      )}
    </div>
  );
}

function Input({ className, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      className={cn(
        "w-full px-4 py-3 text-[14px] bg-[#F8F8F8] border-2 rounded-xl text-[#111827] placeholder:text-[#CCC] transition-all duration-200",
        "focus:outline-none focus:bg-white focus:border-[#FF6B35]",
        error ? "border-red-400" : "border-[#E5E7EB] hover:border-[#CCC]",
        className
      )}
      {...props}
    />
  );
}

function Select({ className, error, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return (
    <select
      className={cn(
        "w-full px-4 py-3 text-[14px] bg-[#F8F8F8] border-2 rounded-xl text-[#111827] transition-all duration-200 appearance-none cursor-pointer",
        "focus:outline-none focus:bg-white focus:border-[#FF6B35]",
        error ? "border-red-400" : "border-[#E5E7EB] hover:border-[#CCC]",
        className
      )}
      {...props}
    />
  );
}

// ─── Store Locations ───────────────────────────────────────────────────────────
const STORES = [
  {
    id: "senayan",
    name: "UrbanWear Plaza Senayan",
    address: "Plaza Senayan Lt. 2, Unit B08",
    city: "Jakarta Pusat",
    hours: "10.00 – 22.00 WIB",
    phone: "+62 21 5729 8800",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&auto=format&fit=crop&q=80",
    available: true,
    etd: "Hari ini",
  },
  {
    id: "gandaria",
    name: "UrbanWear Gandaria City",
    address: "Gandaria City Mall LG, Unit LG-23",
    city: "Jakarta Selatan",
    hours: "10.00 – 22.00 WIB",
    phone: "+62 21 2901 1200",
    image: "https://images.unsplash.com/photo-1555529669-2269763671c3?w=400&auto=format&fit=crop&q=80",
    available: true,
    etd: "Besok",
  },
];

// ─── Courier Options ───────────────────────────────────────────────────────────
const COURIERS = [
  { id: "jne", name: "JNE", desc: "1–3 hari kerja", logo: "🚀" },
  { id: "pos", name: "POS Indonesia", desc: "2–5 hari kerja", logo: "📮" },
  { id: "tiki", name: "TIKI", desc: "1–4 hari kerja", logo: "📦" },
];

// ─── Payment Methods ───────────────────────────────────────────────────────────
const PAYMENT_GROUPS = [
  {
    label: "Virtual Account",
    methods: [
      { id: "bca", name: "BCA VA", icon: "🏦" },
      { id: "mandiri", name: "Mandiri VA", icon: "🏦" },
      { id: "bni", name: "BNI VA", icon: "🏦" },
      { id: "bri", name: "BRI VA", icon: "🏦" },
    ],
  },
  {
    label: "E-Wallet",
    methods: [
      { id: "gopay", name: "GoPay", icon: "💚" },
      { id: "ovo", name: "OVO", icon: "💜" },
      { id: "dana", name: "DANA", icon: "💙" },
      { id: "shopeepay", name: "ShopeePay", icon: "🧡" },
    ],
  },
  {
    label: "QRIS",
    methods: [
      { id: "qris", name: "Scan QRIS", icon: "📱" },
    ],
  },
  {
    label: "Kartu Kredit",
    methods: [
      { id: "visa", name: "Visa / Mastercard", icon: "💳" },
    ],
  },
  {
    label: "Tunai",
    methods: [
      { id: "cod", name: "Bayar di Tempat (COD)", icon: "💵" },
    ],
  },
];

interface CheckoutPageProps {
  searchParams: Promise<{ promo?: string }>;
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = use(searchParams);
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();

  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [deliveryMode, setDeliveryMode] = useState<"delivery" | "pickup">("delivery");
  const [selectedStoreId, setSelectedStoreId] = useState("senayan");
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [shippingCosts, setShippingCosts] = useState<ShippingCourierResult[]>([]);
  const [isLoadingCosts, setIsLoadingCosts] = useState(false);
  const [selectedCost, setSelectedCost] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState<string>("");
  const [voucherCode, setVoucherCode] = useState(params.promo || "");
  const [isValidatingVoucher, setIsValidatingVoucher] = useState(false);
  const [voucherMsg, setVoucherMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);
  const [sameAddress, setSameAddress] = useState(true);
  const [showMockDialog, setShowMockDialog] = useState(false);
  const [mockOrderUrl, setMockOrderUrl] = useState("");

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { name: "", email: "", phone: "", address: "", provinceId: "", cityId: "", courier: "jne", service: "" },
  });

  const watchProvince = watch("provinceId");
  const watchCity = watch("cityId");
  const watchCourier = watch("courier");
  const watchService = watch("service");

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    if (isMounted) getProvinces().then(setProvinces);
  }, [isMounted]);

  useEffect(() => {
    if (watchProvince) {
      setCities([]);
      setValue("cityId", "");
      setValue("service", "");
      setSelectedCost(0);
      getCities(watchProvince).then(setCities);
    }
  }, [watchProvince, setValue]);

  useEffect(() => {
    if (isMounted && params.promo) {
      const subtotal = getCartTotal();
      const code = params.promo.toUpperCase();
      if (code === "URBANNEW" || code === "DISKON10") setDiscountAmount(subtotal * 0.1);
      else if (code === "PROMO15") setDiscountAmount(subtotal * 0.15);
    }
  }, [isMounted, params.promo, getCartTotal]);

  useEffect(() => {
    if (watchCity && watchCourier && deliveryMode === "delivery") {
      setIsLoadingCosts(true);
      setValue("service", "");
      setSelectedCost(0);
      const totalWeight = items.reduce((acc, item) => acc + item.quantity * 500, 0);
      getShippingCost(watchCity, totalWeight, watchCourier!)
        .then((data) => { setShippingCosts(data); setIsLoadingCosts(false); })
        .catch(() => { setIsLoadingCosts(false); toast.error("Gagal mendapatkan tarif ongkir"); });
    }
  }, [watchCity, watchCourier, items, setValue, deliveryMode]);

  useEffect(() => {
    if (watchService && shippingCosts.length > 0) {
      const courierResult = shippingCosts[0];
      const option = courierResult.costs.find((c) => c.service === watchService);
      if (option && option.cost && option.cost.length > 0) {
        setSelectedCost(option.cost[0].value);
        setSelectedMethod(`${courierResult.code.toUpperCase()} - ${option.service}`);
      }
    }
  }, [watchService, shippingCosts]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6B35]" />
      </div>
    );
  }

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const subtotal = getCartTotal();
  const shippingCostFinal = deliveryMode === "pickup" ? 0 : selectedCost;
  const grandTotal = Math.max(subtotal - discountAmount + shippingCostFinal, 0);

  const handleApplyVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;
    setIsValidatingVoucher(true);
    setVoucherMsg(null);
    const result = await validateVoucher(voucherCode);
    setIsValidatingVoucher(false);
    if (result.isValid && result.promo) {
      const pct = result.promo.discountPercentage;
      const calc = (subtotal * pct) / 100;
      const final = result.promo.maxDiscount && calc > result.promo.maxDiscount ? result.promo.maxDiscount : calc;
      setDiscountAmount(final);
      setAppliedPromo(result.promo.code);
      setVoucherMsg({ type: "success", text: result.message || "Voucher berhasil diterapkan! 🎉" });
    } else {
      setVoucherMsg({ type: "error", text: result.message || "Voucher tidak valid." });
      setDiscountAmount(0);
      setAppliedPromo("");
    }
  };

  const onSubmit = async (values: CheckoutFormValues) => {
    setIsSubmitting(true);
    const selectedProvince = provinces.find((p) => p.province_id === values.provinceId)?.province || "";
    const selectedCityObj = cities.find((c) => c.city_id === values.cityId);
    const selectedCity = selectedCityObj ? `${selectedCityObj.type} ${selectedCityObj.city_name}` : "";
    const fullAddress = deliveryMode === "pickup"
      ? STORES.find(s => s.id === selectedStoreId)?.address + ", " + STORES.find(s => s.id === selectedStoreId)?.city
      : `${values.address}, ${selectedCity}, ${selectedProvince}`;

    const orderInput = {
      customerName: values.name,
      customerEmail: values.email,
      customerPhone: values.phone,
      shippingAddress: fullAddress,
      shippingMethod: deliveryMode === "pickup" ? "Pick Up di Toko" : selectedMethod,
      shippingCost: shippingCostFinal,
      promoCode: appliedPromo || params.promo,
      items: items.map((item) => ({ variantId: item.id, quantity: item.quantity })),
    };

    try {
      const res = await createOrder(orderInput);
      if (!res.success || !res.order) throw new Error(res.message || "Gagal membuat pesanan.");
      const token = res.paymentToken;
      if (token?.startsWith("MOCK-TOKEN-")) {
        setMockOrderUrl(res.order.paymentUrl || "");
        setShowMockDialog(true);
        setIsSubmitting(false);
      } else if (token) {
        if ((window as any).snap) {
          (window as any).snap.pay(token, {
            onSuccess: () => { toast.success("Pembayaran berhasil!"); clearCart(); router.push("/shop"); },
            onPending: () => { toast.info("Menunggu pembayaran."); clearCart(); router.push("/shop"); },
            onError: () => toast.error("Pembayaran gagal."),
            onClose: () => toast.warning("Pop-up pembayaran ditutup."),
          });
        } else if (res.order.paymentUrl) {
          window.location.href = res.order.paymentUrl;
        }
        setIsSubmitting(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan sistem.");
      setIsSubmitting(false);
    }
  };

  const selectedStore = STORES.find(s => s.id === selectedStoreId) ?? STORES[0];

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />

      {/* ── Progress Header ── */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <Link href="/cart" className="flex items-center gap-2 text-[13px] font-semibold text-[#6B7280] hover:text-[#111827] transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Link>
            <span className="font-serif text-xl font-bold text-[#111827]">UrbanWear</span>
            <div className="w-20" />
          </div>
          <StepProgress current={step} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* ════════ LEFT: Checkout Form ════════ */}
            <div className="flex-1 min-w-0 space-y-5">

              {/* 1. Contact Info Card */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_2px_16px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[#F2F2F0] flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-[#FF6B35] rounded-lg flex items-center justify-center text-white text-[11px] font-black">1</div>
                  <h2 className="font-bold text-[15px] text-[#111827]">Informasi Kontak</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Nama Lengkap" error={errors.name?.message} required>
                      <Input type="text" placeholder="Contoh: Budi Santoso" {...register("name")} error={!!errors.name} />
                    </Field>
                    <Field label="Email" error={errors.email?.message} required>
                      <Input type="email" placeholder="budi@email.com" {...register("email")} error={!!errors.email} />
                    </Field>
                  </div>
                  <Field label="Nomor WhatsApp" error={errors.phone?.message} required>
                    <Input type="tel" placeholder="08123456789" {...register("phone")} error={!!errors.phone} />
                  </Field>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => setSaveInfo(!saveInfo)}
                      className={cn(
                        "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0",
                        saveInfo ? "bg-[#FF6B35] border-[#FF6B35]" : "border-[#D1D5DB] group-hover:border-[#FF6B35]"
                      )}
                    >
                      {saveInfo && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-[13px] text-[#6B7280]">Simpan informasi untuk pembelian berikutnya</span>
                  </label>
                </div>
              </div>

              {/* 2. Delivery Method Card */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_2px_16px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[#F2F2F0] flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-[#FF6B35] rounded-lg flex items-center justify-center text-white text-[11px] font-black">2</div>
                  <h2 className="font-bold text-[15px] text-[#111827]">Metode Pengiriman</h2>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Delivery Option */}
                  <button
                    type="button"
                    onClick={() => setDeliveryMode("delivery")}
                    className={cn(
                      "relative p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-md",
                      deliveryMode === "delivery"
                        ? "border-[#FF6B35] bg-[#FFF8F5] shadow-sm"
                        : "border-[#E5E7EB] hover:border-[#FF6B35]/40"
                    )}
                  >
                    {deliveryMode === "delivery" && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-[#FF6B35] rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <div className="text-3xl mb-3">🚚</div>
                    <h3 className="font-bold text-[14px] text-[#111827] mb-1">Kirim ke Alamat</h3>
                    <p className="text-[12px] text-[#6B7280] leading-snug">Pesanan dikirim ke alamat tujuan menggunakan jasa ekspedisi pilihan.</p>
                  </button>

                  {/* Pickup Option */}
                  <button
                    type="button"
                    onClick={() => setDeliveryMode("pickup")}
                    className={cn(
                      "relative p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-md",
                      deliveryMode === "pickup"
                        ? "border-[#FF6B35] bg-[#FFF8F5] shadow-sm"
                        : "border-[#E5E7EB] hover:border-[#FF6B35]/40"
                    )}
                  >
                    {deliveryMode === "pickup" && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-[#FF6B35] rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-[#22C55E] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      GRATIS
                    </span>
                    <div className="text-3xl mb-3 mt-1">🏪</div>
                    <h3 className="font-bold text-[14px] text-[#111827] mb-1">Ambil di Toko</h3>
                    <p className="text-[12px] text-[#6B7280] leading-snug">Ambil sendiri pesanan di toko UrbanWear terdekat tanpa biaya pengiriman.</p>
                  </button>
                </div>
              </div>

              {/* 3a. Shipping Address (if delivery) */}
              {deliveryMode === "delivery" && (
                <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_2px_16px_rgba(0,0,0,0.04)] overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#F2F2F0] flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-[#FF6B35] rounded-lg flex items-center justify-center text-white text-[11px] font-black">3</div>
                    <h2 className="font-bold text-[15px] text-[#111827]">Alamat Pengiriman</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Provinsi" error={errors.provinceId?.message} required>
                        <div className="relative">
                          <Select {...register("provinceId")} error={!!errors.provinceId}>
                            <option value="">Pilih Provinsi</option>
                            {provinces.map((p) => (
                              <option key={p.province_id} value={p.province_id}>{p.province}</option>
                            ))}
                          </Select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999] pointer-events-none" />
                        </div>
                      </Field>
                      <Field label="Kota / Kabupaten" error={errors.cityId?.message} required>
                        <div className="relative">
                          <Select {...register("cityId")} disabled={!watchProvince} error={!!errors.cityId}>
                            <option value="">Pilih Kota</option>
                            {cities.map((c) => (
                              <option key={c.city_id} value={c.city_id}>{c.type} {c.city_name}</option>
                            ))}
                          </Select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999] pointer-events-none" />
                        </div>
                      </Field>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Kecamatan">
                        <Input type="text" placeholder="Nama Kecamatan" {...register("postalCode")} />
                      </Field>
                      <Field label="Kode Pos">
                        <Input type="text" placeholder="12345" maxLength={5} />
                      </Field>
                    </div>
                    <Field label="Alamat Lengkap" error={errors.address?.message} required>
                      <textarea
                        rows={3}
                        placeholder="Nama jalan, nomor rumah, RT/RW, Kecamatan..."
                        {...register("address")}
                        className={cn(
                          "w-full px-4 py-3 text-[14px] bg-[#F8F8F8] border-2 rounded-xl text-[#111827] placeholder:text-[#CCC] transition-all duration-200 resize-none",
                          "focus:outline-none focus:bg-white focus:border-[#FF6B35]",
                          errors.address ? "border-red-400" : "border-[#E5E7EB]"
                        )}
                      />
                      {errors.address && <p className="text-[11px] text-red-500">{errors.address.message}</p>}
                    </Field>
                    <Field label="Catatan untuk Kurir (opsional)">
                      <Input type="text" placeholder="Contoh: Titip di pos satpam" {...register("note")} />
                    </Field>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div
                        onClick={() => setSameAddress(!sameAddress)}
                        className={cn(
                          "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0",
                          sameAddress ? "bg-[#FF6B35] border-[#FF6B35]" : "border-[#D1D5DB] group-hover:border-[#FF6B35]"
                        )}
                      >
                        {sameAddress && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span className="text-[13px] text-[#6B7280]">Alamat penagihan sama dengan alamat pengiriman</span>
                    </label>
                  </div>
                </div>
              )}

              {/* 3b. Pickup Location (if pickup) */}
              {deliveryMode === "pickup" && (
                <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_2px_16px_rgba(0,0,0,0.04)] overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#F2F2F0] flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-[#FF6B35] rounded-lg flex items-center justify-center text-white text-[11px] font-black">3</div>
                    <h2 className="font-bold text-[15px] text-[#111827]">Pilih Lokasi Toko</h2>
                  </div>
                  <div className="p-6 space-y-3">
                    {STORES.map((store) => (
                      <button
                        key={store.id}
                        type="button"
                        onClick={() => setSelectedStoreId(store.id)}
                        className={cn(
                          "w-full flex gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-md",
                          selectedStoreId === store.id
                            ? "border-[#FF6B35] bg-[#FFF8F5]"
                            : "border-[#E5E7EB] hover:border-[#FF6B35]/40"
                        )}
                      >
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#F2F2F0]">
                          <Image src={store.image} alt={store.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-[14px] text-[#111827]">{store.name}</h3>
                            {selectedStoreId === store.id && (
                              <div className="w-5 h-5 bg-[#FF6B35] rounded-full flex items-center justify-center shrink-0">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-[12px] text-[#6B7280] mt-0.5">{store.address}</p>
                          <p className="text-[12px] text-[#6B7280]">{store.city}</p>
                          <div className="flex flex-wrap gap-3 mt-2">
                            <span className="flex items-center gap-1 text-[11px] text-[#6B7280]">
                              <Clock className="h-3 w-3" /> {store.hours}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] text-[#22C55E] font-semibold">
                              <Check className="h-3 w-3" /> Stok tersedia
                            </span>
                            <span className="flex items-center gap-1 text-[11px] text-[#FF6B35] font-semibold">
                              ⚡ Siap: {store.etd}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                    <button
                      type="button"
                      className="w-full py-3 text-[13px] font-bold text-[#FF6B35] border-2 border-[#FF6B35]/30 hover:border-[#FF6B35] rounded-xl transition-all duration-200 hover:bg-[#FFF8F5]"
                    >
                      🗺️ Lihat Semua Lokasi Toko
                    </button>
                  </div>
                </div>
              )}

              {/* 4. Shipping Method (if delivery) */}
              {deliveryMode === "delivery" && (
                <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_2px_16px_rgba(0,0,0,0.04)] overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#F2F2F0] flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-[#FF6B35] rounded-lg flex items-center justify-center text-white text-[11px] font-black">4</div>
                    <h2 className="font-bold text-[15px] text-[#111827]">Kurir Pengiriman</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {COURIERS.map((c) => (
                        <label
                          key={c.id}
                          className={cn(
                            "flex flex-col items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:shadow-sm",
                            watchCourier === c.id
                              ? "border-[#FF6B35] bg-[#FFF8F5]"
                              : "border-[#E5E7EB] hover:border-[#FF6B35]/40"
                          )}
                        >
                          <input type="radio" value={c.id} {...register("courier")} className="sr-only" />
                          <span className="text-2xl mb-2">{c.logo}</span>
                          <span className="text-[13px] font-bold text-[#111827]">{c.name}</span>
                          <span className="text-[10px] text-[#6B7280] mt-0.5 text-center">{c.desc}</span>
                        </label>
                      ))}
                    </div>

                    {watchCity && (
                      <div>
                        <label className="block text-[12px] font-bold uppercase tracking-wider text-[#6B7280] mb-2">
                          Paket Layanan
                        </label>
                        {isLoadingCosts ? (
                          <div className="flex items-center gap-2 text-[13px] text-[#6B7280] py-3">
                            <Loader2 className="h-4 w-4 animate-spin text-[#FF6B35]" />
                            Menghitung tarif ongkir...
                          </div>
                        ) : shippingCosts.length > 0 && shippingCosts[0].costs.length > 0 ? (
                          <div className="space-y-2">
                            {shippingCosts[0].costs.map((costOpt) => (
                              <label
                                key={costOpt.service}
                                className={cn(
                                  "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all",
                                  watchService === costOpt.service
                                    ? "border-[#FF6B35] bg-[#FFF8F5]"
                                    : "border-[#E5E7EB] hover:border-[#FF6B35]/30"
                                )}
                              >
                                <input type="radio" value={costOpt.service} {...register("service")} className="sr-only" />
                                <div>
                                  <p className="text-[13px] font-bold text-[#111827]">
                                    {watchCourier?.toUpperCase()} {costOpt.service}
                                  </p>
                                  <p className="text-[11px] text-[#6B7280]">{costOpt.description} · {costOpt.cost[0].etd} hari kerja</p>
                                </div>
                                <span className="text-[13px] font-extrabold text-[#FF6B35]">
                                  Rp {costOpt.cost[0].value.toLocaleString("id-ID")}
                                </span>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[12px] text-amber-600 py-2">Pilih kota tujuan terlebih dahulu untuk melihat tarif.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 5. Payment Method */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_2px_16px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[#F2F2F0] flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-[#FF6B35] rounded-lg flex items-center justify-center text-white text-[11px] font-black">
                    {deliveryMode === "pickup" ? "4" : "5"}
                  </div>
                  <h2 className="font-bold text-[15px] text-[#111827]">Metode Pembayaran</h2>
                </div>
                <div className="p-6 space-y-5">
                  {PAYMENT_GROUPS.map((group) => (
                    <div key={group.label}>
                      <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#6B7280] mb-2">{group.label}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {group.methods.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setSelectedPayment(m.id)}
                            className={cn(
                              "flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-sm",
                              selectedPayment === m.id
                                ? "border-[#FF6B35] bg-[#FFF8F5]"
                                : "border-[#E5E7EB] hover:border-[#FF6B35]/40"
                            )}
                          >
                            <span className="text-xl">{m.icon}</span>
                            <span className="text-[12px] font-semibold text-[#111827] leading-tight">{m.name}</span>
                            {selectedPayment === m.id && (
                              <Check className="h-3.5 w-3.5 text-[#FF6B35] ml-auto shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Voucher */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_2px_16px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[#F2F2F0] flex items-center gap-2.5">
                  <Tag className="h-5 w-5 text-[#FF6B35]" />
                  <h2 className="font-bold text-[15px] text-[#111827]">Kode Voucher</h2>
                </div>
                <div className="p-6">
                  <form onSubmit={handleApplyVoucher} className="flex gap-3">
                    <Input
                      type="text"
                      placeholder="Masukkan kode voucher"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                      disabled={!!appliedPromo}
                      className="flex-1 font-mono tracking-widest"
                    />
                    <button
                      type="submit"
                      disabled={isValidatingVoucher || !voucherCode.trim() || !!appliedPromo}
                      className="px-5 py-3 bg-[#111827] hover:bg-[#FF6B35] text-white text-[13px] font-bold rounded-xl transition-all duration-200 disabled:opacity-40 shrink-0"
                    >
                      {isValidatingVoucher ? <Loader2 className="h-4 w-4 animate-spin" /> : "Pakai"}
                    </button>
                  </form>
                  {voucherMsg && (
                    <div className={cn(
                      "mt-3 flex items-center gap-2 text-[12px] p-3 rounded-xl",
                      voucherMsg.type === "success"
                        ? "bg-[#F0FDF4] text-[#166534]"
                        : "bg-[#FEF2F2] text-[#991B1B]"
                    )}>
                      {voucherMsg.type === "success" ? <Check className="h-4 w-4 shrink-0" /> : <span>✗</span>}
                      {voucherMsg.text}
                    </div>
                  )}
                  {appliedPromo && (
                    <button
                      type="button"
                      onClick={() => { setAppliedPromo(""); setDiscountAmount(0); setVoucherCode(""); setVoucherMsg(null); }}
                      className="mt-2 text-[12px] text-red-500 hover:underline"
                    >
                      Hapus voucher
                    </button>
                  )}
                </div>
              </div>

              {/* Submit Button (Desktop) */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "hidden md:flex w-full items-center justify-center gap-3 py-4 rounded-2xl text-[15px] font-extrabold transition-all duration-300 shadow-lg",
                  "bg-[#111827] hover:bg-[#FF6B35] text-white shadow-black/10 hover:shadow-[#FF6B35]/30",
                  isSubmitting && "opacity-70 cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Memproses Pesanan...</>
                ) : (
                  <>Lanjut ke Pembayaran <ArrowRight className="h-5 w-5" /></>
                )}
              </button>
            </div>

            {/* ════════ RIGHT: Sticky Order Summary ════════ */}
            <div className="w-full lg:w-[360px] shrink-0 lg:sticky lg:top-[110px] space-y-4">

              {/* Order Items */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_2px_16px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#F2F2F0]">
                  <h3 className="font-bold text-[15px] text-[#111827]">Ringkasan Pesanan</h3>
                  <p className="text-[12px] text-[#6B7280] mt-0.5">{items.reduce((a, i) => a + i.quantity, 0)} item</p>
                </div>
                <div className="divide-y divide-[#F2F2F0] max-h-[280px] overflow-y-auto">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3 p-4">
                      <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-[#F8F8F5] shrink-0 border border-[#EDEDE9]">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#111827] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] font-bold text-[#111827] line-clamp-2 leading-snug">{item.name}</h4>
                        <p className="text-[11px] text-[#6B7280] mt-1">
                          {item.color && <span>{item.color}</span>}
                          {item.size && <span> · Size {item.size}</span>}
                        </p>
                        <p className="text-[12px] font-extrabold text-[#FF6B35] mt-1.5">
                          Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="p-5 space-y-2.5 border-t border-[#F2F2F0]">
                  <div className="flex justify-between text-[13px] text-[#6B7280]">
                    <span>Subtotal</span>
                    <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[13px] text-[#22C55E] font-semibold">
                      <span>Diskon ({appliedPromo || params.promo})</span>
                      <span>-Rp {discountAmount.toLocaleString("id-ID")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[13px] text-[#6B7280]">
                    <span>Ongkos Kirim</span>
                    <span>
                      {deliveryMode === "pickup" ? (
                        <span className="text-[#22C55E] font-semibold">GRATIS</span>
                      ) : selectedCost > 0 ? (
                        `Rp ${selectedCost.toLocaleString("id-ID")}`
                      ) : (
                        <span className="italic text-[11px]">Belum dipilih</span>
                      )}
                    </span>
                  </div>
                  <div className="border-t border-[#E5E7EB] pt-3 flex justify-between items-center">
                    <span className="text-[14px] font-bold text-[#111827]">Total Pembayaran</span>
                    <span className="text-[20px] font-extrabold text-[#111827]">
                      Rp {grandTotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pickup Info (if pickup selected) */}
              {deliveryMode === "pickup" && (
                <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_2px_16px_rgba(0,0,0,0.04)] overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#F2F2F0] flex items-center gap-2">
                    <Store className="h-4 w-4 text-[#FF6B35]" />
                    <h3 className="font-bold text-[14px] text-[#111827]">Info Pick Up</h3>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="relative h-28 rounded-xl overflow-hidden">
                      <Image src={selectedStore.image} alt={selectedStore.name} fill className="object-cover" />
                    </div>
                    <div className="space-y-1.5 text-[13px]">
                      <p className="font-bold text-[#111827]">{selectedStore.name}</p>
                      <div className="flex items-start gap-1.5 text-[#6B7280]">
                        <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        <span>{selectedStore.address}, {selectedStore.city}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#6B7280]">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        <span>{selectedStore.hours}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#6B7280]">
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        <span>{selectedStore.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#22C55E] font-semibold">
                        <Zap className="h-3.5 w-3.5 shrink-0" />
                        <span>Estimasi siap: {selectedStore.etd}</span>
                      </div>
                    </div>
                    <div className="bg-[#F8F8F5] rounded-xl p-3 text-[11px] text-[#6B7280] leading-snug">
                      📋 Tunjukkan kode pesanan dan identitas saat mengambil pesanan.
                    </div>
                    <button
                      type="button"
                      className="w-full py-2.5 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white text-[12px] font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      Lihat Lokasi di Peta
                    </button>
                  </div>
                </div>
              )}

              {/* Security + Benefits */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-5 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-[#F0FDF4] rounded-xl">
                  <ShieldCheck className="h-5 w-5 text-[#22C55E] shrink-0" />
                  <p className="text-[11px] text-[#166534] leading-snug font-medium">
                    UrbanWear menjamin keamanan transaksi Anda. Data &amp; pembayaran terenkripsi SSL 256-bit.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { icon: Truck, label: "Gratis Ongkir", desc: "Min. Rp 500k", color: "text-[#FF6B35]", bg: "bg-[#FFF5F0]" },
                    { icon: ShieldCheck, label: "Garansi Original", desc: "100% produk asli", color: "text-[#22C55E]", bg: "bg-[#F0FDF4]" },
                    { icon: RefreshCw, label: "Tukar 7 Hari", desc: "Kembalikan jika cacat", color: "text-[#3B82F6]", bg: "bg-[#EFF6FF]" },
                    { icon: LockKeyhole, label: "Pembayaran Aman", desc: "Enkripsi SSL", color: "text-[#8B5CF6]", bg: "bg-[#F5F3FF]" },
                    { icon: Headphones, label: "CS 24/7", desc: "Siap membantu", color: "text-[#EC4899]", bg: "bg-[#FDF2F8]" },
                  ].map(({ icon: Icon, label, desc, color, bg }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", bg)}>
                        <Icon className={cn("h-4 w-4", color)} />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-[#111827]">{label}</p>
                        <p className="text-[10px] text-[#6B7280]">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Sticky CTA */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-[#6B7280]">Total Pembayaran</span>
              <span className="text-[16px] font-extrabold text-[#111827]">Rp {grandTotal.toLocaleString("id-ID")}</span>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#111827] hover:bg-[#FF6B35] text-white text-[14px] font-extrabold transition-all duration-300 shadow-lg disabled:opacity-70"
            >
              {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Memproses...</> : <>Lanjut ke Pembayaran <ArrowRight className="h-4 w-4" /></>}
            </button>
          </div>
        </form>
      </div>

      {/* ── Trust Bottom Bar ── */}
      <div className="bg-white border-t border-[#E5E7EB] py-6">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {[
              { emoji: "🚚", label: "Gratis Ongkir" },
              { emoji: "⚡", label: "Pengiriman Cepat" },
              { emoji: "🏪", label: "Pick Up di Toko" },
              { emoji: "🔒", label: "Pembayaran Aman" },
              { emoji: "🛡️", label: "Garansi 7 Hari" },
            ].map(({ emoji, label }) => (
              <div key={label} className="flex items-center gap-2 text-[12px] font-semibold text-[#6B7280]">
                <span className="text-lg">{emoji}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mock Payment Dialog ── */}
      {showMockDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl p-8 max-w-md w-full space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500 text-2xl">💳</div>
              <h3 className="text-[18px] font-extrabold text-[#111827]">Simulasi Pembayaran</h3>
              <p className="text-[13px] text-[#6B7280] leading-relaxed">
                Mode pengembangan aktif. Midtrans Sandbox digunakan untuk simulasi pembayaran.
              </p>
            </div>
            <div className="space-y-3">
              <button
                type="button"
                onClick={async () => { toast.success("Simulasi Pembayaran Sukses! 🎉"); clearCart(); setShowMockDialog(false); router.push("/shop"); }}
                className="w-full py-3.5 text-[14px] font-extrabold rounded-2xl text-white bg-[#22C55E] hover:bg-[#16A34A] transition-colors"
              >
                ✓ Simulasikan Pembayaran Sukses
              </button>
              {mockOrderUrl && (
                <a
                  href={mockOrderUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full block py-3.5 text-center text-[13px] font-bold rounded-2xl text-[#111827] bg-[#F8F8F8] hover:bg-[#F0F0F0] transition-colors border border-[#E5E7EB]"
                >
                  Buka Link Pembayaran Sandbox
                </a>
              )}
              <button
                type="button"
                onClick={() => { toast.error("Pembayaran dibatalkan"); setShowMockDialog(false); }}
                className="w-full py-2.5 text-[12px] text-[#6B7280] hover:text-[#111827] transition-colors"
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
