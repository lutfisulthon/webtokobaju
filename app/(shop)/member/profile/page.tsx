 "use client";
 
 import { useState, useEffect } from "react";
 import { useRouter } from "next/navigation";
 import Link from "next/link";
 import { signOut, useSession } from "next-auth/react";
 import { toast } from "sonner";
 import {
   User, Phone, MapPin, Loader2, ShieldCheck, ChevronRight, Home,
   Package, Truck, CheckCircle, Star, Heart, Bell, Settings, Lock,
   LogOut, ShoppingBag, Clock, ArrowRight, LayoutGrid,
   Edit2, X, Save, Mail, Calendar, Users, CreditCard, Award,
   Sparkles, Store,
 } from "lucide-react";
 import { getProfile, updateProfile } from "@/lib/actions/profile";
 import { getProvinces, getCities, getDistricts, Province, City } from "@/lib/actions/shipping";
 
 // ─── Types ────────────────────────────────────────────────────────────────────
 type ActiveSection =
   | "ringkasan"
   | "pesanan"
   | "wishlist"
   | "ulasan"
   | "alamat"
   | "pengaturan"
   | "notifikasi"
   | "keamanan";
 
 type WaStatus = "idle" | "verifying" | "verified" | "failed";
 
 // ─── Mock Data ─────────────────────────────────────────────────────────────────
 const MOCK_ORDERS = [
   {
     id: "ORD-2024-001",
     product: "Urban Classic Jacket",
     color: "Midnight Black",
     size: "M",
     qty: 1,
     price: 899000,
     status: "DELIVERED",
     date: "8 Jul 2025",
     image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=120&h=120&fit=crop",
   },
   {
     id: "ORD-2024-002",
     product: "Essential Slim Chino",
     color: "Stone Beige",
     size: "32",
     qty: 2,
     price: 649000,
     status: "PROCESSING",
     date: "11 Jul 2025",
     image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=120&h=120&fit=crop",
   },
 ];
 
 const MOCK_WISHLIST = [
   { id: 1, name: "Merino Wool Turtleneck", price: 749000, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&h=250&fit=crop" },
   { id: 2, name: "Relaxed Linen Shirt", price: 459000, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&h=250&fit=crop" },
   { id: 3, name: "Utility Cargo Pants", price: 589000, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=250&fit=crop" },
   { id: 4, name: "Canvas Sneakers Low", price: 399000, image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=200&h=250&fit=crop" },
 ];
 
 const MOCK_NOTIFICATIONS = [
   { icon: Truck,     title: "Pesanan sedang dikirim", body: "Pesanan #ORD-2024-001 kini dalam perjalanan menuju alamat Anda.", time: "2 jam lalu", unread: true },
   { icon: Heart,     title: "Diskon wishlist!", body: "Merino Wool Turtleneck di wishlist Anda kini diskon 20%.", time: "1 hari lalu", unread: true },
   { icon: Sparkles,  title: "Koleksi Baru Tersedia", body: "Koleksi Musim Gugur 2025 kini hadir di UrbanWear.", time: "3 hari lalu", unread: false },
 ];
 
 // ─── Helpers ───────────────────────────────────────────────────────────────────
 function formatCurrency(n: number) {
   return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
 }
 
 const STATUS_MAP: Record<string, { label: string; bg: string; text: string; dot: string }> = {
   DELIVERED:  { label: "Selesai",    bg: "bg-emerald-50",  text: "text-emerald-700", dot: "bg-emerald-500" },
   PROCESSING: { label: "Diproses",   bg: "bg-blue-50",     text: "text-blue-700",    dot: "bg-blue-500" },
   SHIPPED:    { label: "Dikirim",    bg: "bg-violet-50",   text: "text-violet-700",  dot: "bg-violet-500" },
   PENDING:    { label: "Menunggu",   bg: "bg-amber-50",    text: "text-amber-700",   dot: "bg-amber-500" },
   CANCELLED:  { label: "Dibatalkan", bg: "bg-red-50",      text: "text-red-700",     dot: "bg-red-500" },
 };
 
 // ─── Stat Card ─────────────────────────────────────────────────────────────────
 function StatCard({ icon: Icon, label, value, iconBg }: { icon: React.ElementType; label: string; value: string | number; iconBg: string }) {
   return (
     <div className="bg-white rounded-2xl p-5 border border-zinc-100/80 hover:border-zinc-200 hover:shadow-lg hover:shadow-zinc-100/50 hover:-translate-y-0.5 transition-all duration-300 cursor-default">
       <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center mb-4`}>
         <Icon className="w-5 h-5 text-white" />
       </div>
       <p className="text-2xl font-extrabold text-zinc-900 tracking-tight">{value}</p>
       <p className="text-[11px] font-semibold text-zinc-400 mt-1">{label}</p>
     </div>
   );
 }
 
 // ─── Section Title ─────────────────────────────────────────────────────────────
 function SectionTitle({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
   return (
     <div className="mb-6">
       <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">{children}</h2>
       {subtitle && <p className="text-[13px] text-zinc-400 mt-1">{subtitle}</p>}
     </div>
   );
 }
 
 // ─── Card Shell ────────────────────────────────────────────────────────────────
 function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
   return (
     <div className={`bg-white rounded-2xl border border-zinc-100/80 p-6 ${className}`}>
       {children}
     </div>
   );
 }
 
 function CardHeader({ title, action, actionLabel, icon: Icon }: { title: string; action?: () => void; actionLabel?: string; icon?: React.ElementType }) {
   return (
     <div className="flex items-center justify-between mb-5">
       <h3 className="text-[13px] font-extrabold text-zinc-900 tracking-tight">{title}</h3>
       {action && actionLabel && (
         <button onClick={action} className="flex items-center gap-1.5 text-[11px] font-semibold text-[#FF6B35] hover:text-orange-600 transition-colors">
           {Icon && <Icon className="w-3.5 h-3.5" />}
           {actionLabel}
         </button>
       )}
     </div>
   );
 }
 
 // ─── Form Input ────────────────────────────────────────────────────────────────
 function FormField({ label, children }: { label: string; children: React.ReactNode }) {
   return (
     <div className="space-y-2">
       <label className="block text-[11px] font-semibold text-zinc-500">{label}</label>
       {children}
     </div>
   );
 }
 
 const inputClass = "w-full h-11 px-4 text-[13px] font-medium text-zinc-800 border border-zinc-200 rounded-xl bg-white placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all disabled:bg-zinc-50 disabled:text-zinc-400 disabled:cursor-not-allowed";
 const selectClass = inputClass + " appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNS44IDcuMkwxMCAxMS40bDQuMi00LjIiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-no-repeat bg-[right_12px_center]";
 
 // ─── Main Page ─────────────────────────────────────────────────────────────────
 export default function MemberDashboardPage() {
   const router = useRouter();
   const { data: session, status } = useSession();
   const [active, setActive] = useState<ActiveSection>("ringkasan");
   const [isLoading, setIsLoading] = useState(true);
   const [isSaving, setIsSaving] = useState(false);
   const [isEditing, setIsEditing] = useState(false);
   const [isDataLoaded, setIsDataLoaded] = useState(false);
 
   // Form states
   const [name, setName]               = useState("");
   const [email, setEmail]             = useState("");
   const [phone, setPhone]             = useState("");
   const [gender, setGender]           = useState("");
   const [birthday, setBirthday]       = useState("");
   const [address, setAddress]         = useState("");
   const [selectedProvinceId, setSelectedProvinceId] = useState("");
   const [selectedCityId, setSelectedCityId]         = useState("");
   const [selectedDistrict, setSelectedDistrict]     = useState("");
   const [postalCode, setPostalCode]   = useState("");
   const [joinDate, setJoinDate]       = useState("");
   const [waStatus, setWaStatus]       = useState<WaStatus>("idle");
 
   // Region data
   const [provinces, setProvinces] = useState<Province[]>([]);
   const [cities, setCities]       = useState<City[]>([]);
   const [districts, setDistricts] = useState<string[]>([]);
 
   const initials = name
     ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
     : "UW";
 
   // ─── Load data ──────────────────────────────────────────────────────────────
   useEffect(() => {
     async function load() {
       if (status === "loading") return;
       if (status === "unauthenticated" || !session?.user) {
         router.push("/login?callbackUrl=/member/profile");
         return;
       }
       try {
         const provs = await getProvinces();
         setProvinces(provs);
         const profile = await getProfile(session.user.email || undefined);
         setName(profile?.name || session.user.name || "");
         setEmail(profile?.email || session.user.email || "");
         if (profile) {
           setPhone(profile.phone || "");
           setAddress(profile.address || "");
           
           // Load cities and districts first before setting IDs to prevent them from being wiped out
           if (profile.provinceId) {
             const citiesData = await getCities(profile.provinceId);
             setCities(citiesData);
           }
           if (profile.cityId) {
             const districtsData = await getDistricts(profile.cityId);
             setDistricts(districtsData);
           }
 
           setSelectedProvinceId(profile.provinceId || "");
           setSelectedCityId(profile.cityId || "");
           setSelectedDistrict(profile.district || "");
           setPostalCode(profile.postalCode || "");
           if (profile.phone && profile.phone.length >= 9) setWaStatus("verified");
         }
         if (session.user && (session.user as any).createdAt) {
           setJoinDate(new Date((session.user as any).createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }));
         } else {
           setJoinDate("2025");
         }
       } catch (err) {
         console.error(err);
       } finally {
         setIsLoading(false);
       }
     }
     load();
   }, [status, session, router]);
 
   useEffect(() => {
     if (selectedProvinceId) {
       getCities(selectedProvinceId).then(setCities);
       setSelectedCityId("");
       setSelectedDistrict("");
     }
   }, [selectedProvinceId]);
 
   useEffect(() => {
     if (selectedCityId) {
       getDistricts(selectedCityId).then(setDistricts);
       setSelectedDistrict("");
     }
   }, [selectedCityId]);
 
   const handleSave = async () => {
     setIsSaving(true);
     try {
       const res = await updateProfile({ name, phone, address, provinceId: selectedProvinceId, cityId: selectedCityId, district: selectedDistrict, postalCode }, session?.user?.email || undefined);
       if (res.success) { toast.success(res.message); setIsEditing(false); }
       else toast.error(res.message);
     } catch { toast.error("Gagal menyimpan."); }
     finally { setIsSaving(false); }
   };
 
   const verifyWhatsApp = async () => {
     if (phone.length < 9) { setWaStatus("failed"); toast.error("Nomor WA tidak valid."); return; }
     setWaStatus("verifying");
     await new Promise((r) => setTimeout(r, 1200));
     setWaStatus("verified");
     toast.success("Nomor WhatsApp terverifikasi!");
   };
 
   const NAV = [
     { id: "ringkasan",   icon: LayoutGrid, label: "Ringkasan" },
     { id: "pesanan",     icon: Package,    label: "Pesanan" },
     { id: "wishlist",    icon: Heart,      label: "Wishlist" },
     { id: "ulasan",      icon: Star,       label: "Ulasan" },
     { id: "alamat",      icon: MapPin,     label: "Alamat" },
     { id: "pengaturan",  icon: Settings,   label: "Pengaturan" },
     { id: "notifikasi",  icon: Bell,       label: "Notifikasi" },
     { id: "keamanan",    icon: Lock,       label: "Keamanan" },
   ] as const;
 
   // ─── Loading state ──────────────────────────────────────────────────────────
   if (isLoading || status === "loading") {
     return (
       <div className="min-h-screen flex items-center justify-center bg-zinc-50">
         <div className="flex flex-col items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-[#FF6B35] flex items-center justify-center animate-pulse">
             <Loader2 className="w-5 h-5 animate-spin text-white" />
           </div>
           <p className="text-[13px] font-medium text-zinc-400">Memuat dashboard…</p>
         </div>
       </div>
     );
   }
 
   // ─── Content sections ───────────────────────────────────────────────────────
   const renderContent = () => {
     switch (active) {
 
       // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       // RINGKASAN
       // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       case "ringkasan":
         return (
           <div className="space-y-5">
             {/* Welcome */}
             <div>
               <h1 className="text-[22px] font-extrabold text-zinc-900 tracking-tight">
                 Halo, {name?.split(" ")[0] || "Pengguna"} 👋
               </h1>
               <p className="text-[13px] text-zinc-400 mt-1">
                 Berikut ringkasan aktivitas akun Anda.
               </p>
             </div>
 
             {/* Stats Grid */}
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
               <StatCard icon={Package}     iconBg="bg-[#FF6B35]"  label="Total Pesanan"    value={12} />
               <StatCard icon={Truck}        iconBg="bg-blue-500"   label="Sedang Diproses"  value={2} />
               <StatCard icon={CheckCircle}  iconBg="bg-emerald-500" label="Pesanan Selesai" value={9} />
               <StatCard icon={Star}         iconBg="bg-amber-500"  label="Ulasan Diberikan" value={7} />
             </div>
 
             {/* Info + Address */}
             <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
               {/* Info — 3 cols */}
               <Card className="lg:col-span-3">
                 <CardHeader title="Informasi Akun" action={() => setActive("pengaturan")} actionLabel="Edit" icon={Edit2} />
                 <div className="divide-y divide-zinc-100">
                   {[
                     { icon: User,     label: "Nama",      val: name },
                     { icon: Mail,     label: "Email",     val: email },
                     { icon: Phone,    label: "WhatsApp",  val: phone },
                     { icon: Calendar, label: "Bergabung", val: joinDate },
                   ].map(({ icon: Ic, label, val }) => (
                     <div key={label} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                       <div className="w-8 h-8 bg-zinc-50 rounded-lg flex items-center justify-center shrink-0">
                         <Ic className="w-4 h-4 text-zinc-400" />
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-[11px] font-medium text-zinc-400">{label}</p>
                         <p className={`text-[13px] font-semibold truncate ${val ? "text-zinc-800" : "text-zinc-300 italic"}`}>
                           {val || "Belum diisi"}
                         </p>
                       </div>
                     </div>
                   ))}
                 </div>
               </Card>
 
               {/* Address — 2 cols */}
               <div className="lg:col-span-2 space-y-4">
                 <Card>
                   <CardHeader title="Alamat Utama" action={() => setActive("alamat")} actionLabel="Kelola" />
                   {address ? (
                     <div>
                       <div className="inline-flex items-center gap-1.5 bg-[#FF6B35]/8 text-[#FF6B35] text-[10px] font-bold rounded-lg px-2.5 py-1 mb-3">
                         <MapPin className="w-3 h-3" /> Utama
                       </div>
                       <p className="text-[13px] font-medium text-zinc-700 leading-relaxed">{address}</p>
                       {phone && <p className="text-[12px] text-zinc-400 mt-2">{phone}</p>}
                     </div>
                   ) : (
                     <div className="text-center py-4">
                       <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                         <MapPin className="w-6 h-6 text-zinc-300" />
                       </div>
                       <p className="text-[13px] font-medium text-zinc-400 mb-3">Belum ada alamat tersimpan</p>
                       <button onClick={() => { setActive("pengaturan"); setIsEditing(true); }} className="h-9 px-4 bg-zinc-900 text-white text-[11px] font-semibold rounded-xl hover:bg-zinc-700 transition-all">
                         Tambah Alamat
                       </button>
                     </div>
                   )}
                 </Card>
 
                 {/* CTA Card */}
                 <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white rounded-2xl p-5 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-28 h-28 bg-[#FF6B35]/10 rounded-full -translate-y-8 translate-x-8" />
                   <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-6 -translate-x-6" />
                   <div className="relative">
                     <Store className="w-6 h-6 text-[#FF6B35] mb-3" />
                     <h4 className="text-[13px] font-bold mb-1">Ambil di Toko</h4>
                     <p className="text-[11px] text-zinc-400 leading-relaxed mb-4">
                       Pesanan siap diambil di toko terdekat tanpa biaya pengiriman.
                     </p>
                     <button className="h-8 px-4 bg-[#FF6B35] hover:bg-orange-500 text-white text-[11px] font-semibold rounded-lg transition-colors">
                       Lihat Lokasi →
                     </button>
                   </div>
                 </div>
               </div>
             </div>
 
             {/* Recent Orders */}
             <Card>
               <CardHeader title="Pesanan Terakhir" action={() => setActive("pesanan")} actionLabel="Lihat Semua" icon={ArrowRight} />
               <div className="divide-y divide-zinc-100">
                 {MOCK_ORDERS.map((order) => {
                   const s = STATUS_MAP[order.status] || STATUS_MAP.PENDING;
                   return (
                     <div key={order.id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                       <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-zinc-100">
                         <img src={order.image} alt={order.product} className="w-full h-full object-cover" />
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-[13px] font-semibold text-zinc-800 truncate">{order.product}</p>
                         <p className="text-[11px] text-zinc-400 mt-0.5">{order.color} · {order.size} · ×{order.qty} · {order.date}</p>
                       </div>
                       <div className="text-right shrink-0 space-y-1">
                         <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold rounded-lg px-2 py-0.5 ${s.bg} ${s.text}`}>
                           <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />{s.label}
                         </span>
                         <p className="text-[13px] font-bold text-zinc-900">{formatCurrency(order.price)}</p>
                       </div>
                     </div>
                   );
                 })}
               </div>
             </Card>
 
             {/* Wishlist Preview */}
             <Card>
               <CardHeader title="Wishlist" action={() => setActive("wishlist")} actionLabel="Lihat Semua" icon={ArrowRight} />
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                 {MOCK_WISHLIST.map((item) => (
                   <div key={item.id} className="group cursor-pointer">
                     <div className="aspect-[4/5] rounded-xl overflow-hidden bg-zinc-100 relative">
                       <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       <button className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                       </button>
                     </div>
                     <p className="text-[12px] font-medium text-zinc-700 mt-2 leading-snug truncate">{item.name}</p>
                     <p className="text-[12px] font-bold text-zinc-900 mt-0.5">{formatCurrency(item.price)}</p>
                   </div>
                 ))}
               </div>
             </Card>
 
             {/* Notifications + Security */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
               <Card>
                 <CardHeader title="Notifikasi" action={() => setActive("notifikasi")} actionLabel="Semua" />
                 <div className="space-y-1">
                   {MOCK_NOTIFICATIONS.map((n, i) => {
                     const NIcon = n.icon;
                     return (
                       <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-50/80 transition-colors">
                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.unread ? "bg-[#FF6B35]/10" : "bg-zinc-100"}`}>
                           <NIcon className={`w-4 h-4 ${n.unread ? "text-[#FF6B35]" : "text-zinc-400"}`} />
                         </div>
                         <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2">
                             <p className="text-[12px] font-semibold text-zinc-800 truncate">{n.title}</p>
                             {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] shrink-0" />}
                           </div>
                           <p className="text-[11px] text-zinc-400 leading-snug mt-0.5 line-clamp-1">{n.body}</p>
                           <p className="text-[10px] text-zinc-300 mt-1">{n.time}</p>
                         </div>
                       </div>
                     );
                   })}
                 </div>
               </Card>
 
               <Card className="flex flex-col">
                 <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                     <ShieldCheck className="w-5 h-5 text-emerald-500" />
                   </div>
                   <div>
                     <h3 className="text-[13px] font-extrabold text-zinc-900 tracking-tight">Keamanan</h3>
                     <p className="text-[10px] font-semibold text-emerald-600">Terlindungi</p>
                   </div>
                 </div>
                 <div className="flex-1 space-y-2">
                   {[
                     { label: "Verifikasi Email", ok: true },
                     { label: "Nomor WhatsApp", ok: waStatus === "verified" },
                     { label: "Password", ok: true },
                   ].map((item) => (
                     <div key={item.label} className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-50/80">
                       <span className="text-[12px] font-medium text-zinc-600">{item.label}</span>
                       <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${item.ok ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                         {item.ok ? "Aktif" : "Belum"}
                       </span>
                     </div>
                   ))}
                 </div>
                 <button onClick={() => setActive("keamanan")} className="mt-4 h-10 w-full bg-zinc-900 hover:bg-zinc-700 text-white text-[12px] font-semibold rounded-xl transition-colors">
                   Kelola Keamanan
                 </button>
               </Card>
             </div>
           </div>
         );
 
       // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       // PESANAN
       // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       case "pesanan":
         return (
           <div className="space-y-4">
             <SectionTitle subtitle="Riwayat semua transaksi pembelian Anda.">Pesanan Saya</SectionTitle>
             {MOCK_ORDERS.map((order) => {
               const s = STATUS_MAP[order.status] || STATUS_MAP.PENDING;
               return (
                 <Card key={order.id}>
                   <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
                     <div className="flex items-center gap-2">
                       <ShoppingBag className="w-4 h-4 text-zinc-400" />
                       <span className="text-[12px] font-semibold text-zinc-500">{order.id}</span>
                     </div>
                     <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold rounded-lg px-2.5 py-1 ${s.bg} ${s.text}`}>
                       <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />{s.label}
                     </span>
                   </div>
                   <div className="flex items-center gap-4">
                     <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                       <img src={order.image} alt={order.product} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <p className="text-[14px] font-semibold text-zinc-800">{order.product}</p>
                       <p className="text-[12px] text-zinc-400 mt-0.5">{order.color} · {order.size} · ×{order.qty}</p>
                       <p className="text-[11px] text-zinc-300 mt-0.5">{order.date}</p>
                     </div>
                     <p className="text-[14px] font-bold text-zinc-900 shrink-0">{formatCurrency(order.price)}</p>
                   </div>
                   <div className="flex gap-2 mt-4 pt-3 border-t border-zinc-100">
                     <button className="h-9 px-4 bg-zinc-900 text-white text-[11px] font-semibold rounded-xl hover:bg-zinc-700 transition-colors">
                       Lihat Detail
                     </button>
                     {order.status === "DELIVERED" && (
                       <button className="h-9 px-4 border border-zinc-200 text-zinc-600 text-[11px] font-semibold rounded-xl hover:bg-zinc-50 transition-colors">
                         Beri Ulasan
                       </button>
                     )}
                   </div>
                 </Card>
               );
             })}
             <Link href="/member/orders" className="flex items-center justify-center gap-2 h-11 bg-white border border-zinc-200 rounded-2xl text-[12px] font-semibold text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 transition-all">
               Lihat Semua Pesanan <ArrowRight className="w-4 h-4" />
             </Link>
           </div>
         );
 
       // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       // WISHLIST
       // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       case "wishlist":
         return (
           <div className="space-y-5">
             <SectionTitle subtitle="Produk yang Anda simpan untuk dibeli nanti.">Wishlist Saya</SectionTitle>
             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
               {MOCK_WISHLIST.map((item) => (
                 <Card key={item.id} className="p-0 overflow-hidden group hover:shadow-lg hover:shadow-zinc-100/50 hover:-translate-y-0.5 transition-all duration-300">
                   <div className="aspect-[4/5] relative overflow-hidden bg-zinc-100">
                     <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-50 transition-colors">
                       <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                     </button>
                   </div>
                   <div className="p-3.5">
                     <p className="text-[13px] font-medium text-zinc-700 leading-snug">{item.name}</p>
                     <p className="text-[13px] font-bold text-zinc-900 mt-1">{formatCurrency(item.price)}</p>
                     <button className="mt-3 w-full h-9 bg-zinc-900 text-white text-[11px] font-semibold rounded-xl hover:bg-zinc-700 transition-colors">
                       Beli Sekarang
                     </button>
                   </div>
                 </Card>
               ))}
             </div>
           </div>
         );
 
       // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       // ULASAN
       // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       case "ulasan":
         return (
           <div className="space-y-5">
             <SectionTitle subtitle="Ulasan yang sudah Anda berikan pada produk.">Ulasan Produk</SectionTitle>
             <Card className="text-center py-12">
               <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                 <Star className="w-8 h-8 text-amber-400" />
               </div>
               <p className="text-[14px] font-semibold text-zinc-500 mb-1">Belum Ada Ulasan</p>
               <p className="text-[12px] text-zinc-400 mb-4">Ulasan Anda akan muncul di sini setelah pesanan selesai.</p>
               <button onClick={() => setActive("pesanan")} className="h-9 px-5 bg-zinc-900 text-white text-[12px] font-semibold rounded-xl hover:bg-zinc-700 transition-colors">
                 Lihat Pesanan Selesai
               </button>
             </Card>
           </div>
         );
 
       // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       // ALAMAT
       // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       case "alamat":
         return (
           <div className="space-y-5">
             <SectionTitle subtitle="Kelola alamat pengiriman Anda.">Alamat Saya</SectionTitle>
             <Card>
               {address ? (
                 <div>
                   <div className="flex items-center justify-between mb-4">
                     <div className="inline-flex items-center gap-1.5 bg-[#FF6B35]/8 text-[#FF6B35] text-[10px] font-bold rounded-lg px-2.5 py-1">
                       <MapPin className="w-3 h-3" /> Alamat Utama
                     </div>
                     <button onClick={() => { setActive("pengaturan"); setIsEditing(true); }} className="flex items-center gap-1 text-[11px] font-semibold text-[#FF6B35] hover:text-orange-600 transition-colors">
                       <Edit2 className="w-3.5 h-3.5" /> Edit
                     </button>
                   </div>
                   <p className="text-[14px] font-semibold text-zinc-800 mb-1">{name}</p>
                   <p className="text-[13px] text-zinc-500 leading-relaxed">{address}</p>
                   {phone && <p className="text-[12px] text-zinc-400 mt-2">{phone}</p>}
                 </div>
               ) : (
                 <div className="text-center py-10">
                   <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                     <MapPin className="w-8 h-8 text-zinc-300" />
                   </div>
                   <p className="text-[14px] font-semibold text-zinc-500 mb-1">Belum Ada Alamat</p>
                   <p className="text-[12px] text-zinc-400 mb-4">Tambahkan alamat pengiriman utama Anda.</p>
                   <button onClick={() => { setActive("pengaturan"); setIsEditing(true); }} className="h-9 px-5 bg-zinc-900 text-white text-[12px] font-semibold rounded-xl hover:bg-zinc-700 transition-colors">
                     Tambah Alamat
                   </button>
                 </div>
               )}
             </Card>
           </div>
         );
 
       // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       // PENGATURAN
       // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       case "pengaturan":
         return (
           <div className="space-y-5">
             {/* Header */}
             <div className="flex items-center justify-between">
               <SectionTitle subtitle="Perbarui data diri dan alamat pengiriman Anda.">Pengaturan Akun</SectionTitle>
               {!isEditing ? (
                 <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 h-9 px-4 bg-zinc-900 text-white text-[12px] font-semibold rounded-xl hover:bg-zinc-700 transition-colors">
                   <Edit2 className="w-3.5 h-3.5" /> Edit Profil
                 </button>
               ) : (
                 <div className="flex gap-2">
                   <button onClick={() => setIsEditing(false)} className="h-9 px-4 border border-zinc-200 text-zinc-500 text-[12px] font-semibold rounded-xl hover:bg-zinc-50 transition-colors">
                     Batal
                   </button>
                   <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-1.5 h-9 px-4 bg-[#FF6B35] text-white text-[12px] font-semibold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-60">
                     {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Simpan
                   </button>
                 </div>
               )}
             </div>
 
             {/* Personal Info */}
             <Card>
               <div className="flex items-center gap-3 mb-5 pb-4 border-b border-zinc-100">
                 <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
                   <User className="w-4 h-4 text-zinc-500" />
                 </div>
                 <h3 className="text-[13px] font-extrabold text-zinc-800 tracking-tight">Informasi Pribadi</h3>
               </div>
 
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField label="Nama Lengkap">
                   <input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditing} placeholder="Masukkan nama lengkap" className={inputClass} />
                 </FormField>
                 <FormField label="Email (Akun)">
                   <input type="email" value={email} disabled placeholder="" className={inputClass} />
                 </FormField>
               </div>
 
               <div className="mt-4">
                 <FormField label="Nomor WhatsApp">
                   <div className="flex gap-2">
                     <input type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setWaStatus("idle"); }} disabled={!isEditing} placeholder="Contoh: 081234567890" className={inputClass + " flex-1"} />
                     {isEditing && (
                       <button type="button" onClick={verifyWhatsApp} disabled={waStatus === "verifying" || !phone} className="h-11 px-4 border border-zinc-200 bg-white rounded-xl text-[12px] font-semibold hover:bg-zinc-50 transition-all disabled:opacity-50 min-w-[120px]">
                         {waStatus === "verifying" ? <Loader2 className="w-4 h-4 animate-spin text-[#FF6B35] mx-auto" />
                           : waStatus === "verified" ? <span className="text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Terverifikasi</span>
                           : waStatus === "failed" ? <span className="text-red-500">Gagal</span>
                           : "Verifikasi"}
                       </button>
                     )}
                     {!isEditing && waStatus === "verified" && (
                       <div className="h-11 px-4 border border-emerald-200 bg-emerald-50 rounded-xl text-[12px] font-semibold text-emerald-600 flex items-center gap-1">
                         <CheckCircle className="w-3.5 h-3.5" /> Aktif
                       </div>
                     )}
                   </div>
                 </FormField>
               </div>
 
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                 <FormField label="Jenis Kelamin">
                   <select value={gender} onChange={(e) => setGender(e.target.value)} disabled={!isEditing} className={selectClass}>
                     <option value="">Pilih Jenis Kelamin</option>
                     <option value="Pria">Pria</option>
                     <option value="Wanita">Wanita</option>
                     <option value="Lainnya">Lainnya</option>
                   </select>
                 </FormField>
                 <FormField label="Tanggal Lahir">
                   <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} disabled={!isEditing} className={inputClass} />
                 </FormField>
               </div>
             </Card>
 
             {/* Address */}
             <Card>
               <div className="flex items-center gap-3 mb-5 pb-4 border-b border-zinc-100">
                 <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
                   <MapPin className="w-4 h-4 text-zinc-500" />
                 </div>
                 <h3 className="text-[13px] font-extrabold text-zinc-800 tracking-tight">Alamat Pengiriman Utama</h3>
               </div>
 
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField label="Provinsi">
                   <select disabled={!isEditing} value={selectedProvinceId} onChange={(e) => setSelectedProvinceId(e.target.value)} className={selectClass}>
                     <option value="">Pilih Provinsi</option>
                     {provinces.map((p) => <option key={p.province_id} value={p.province_id}>{p.province}</option>)}
                   </select>
                 </FormField>
                 <FormField label="Kota / Kabupaten">
                   <select disabled={!isEditing || !selectedProvinceId} value={selectedCityId} onChange={(e) => setSelectedCityId(e.target.value)} className={selectClass}>
                     <option value="">Pilih Kota/Kabupaten</option>
                     {cities.map((c) => <option key={c.city_id} value={c.city_id}>{c.type} {c.city_name}</option>)}
                   </select>
                 </FormField>
                 <FormField label="Kecamatan">
                   <select disabled={!isEditing || !selectedCityId} value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} className={selectClass}>
                     <option value="">Pilih Kecamatan</option>
                     {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                   </select>
                 </FormField>
                 <FormField label="Kode Pos">
                   <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} disabled={!isEditing} placeholder="Masukkan kode pos" className={inputClass} />
                 </FormField>
               </div>
 
               <div className="mt-4">
                 <FormField label="Detail Alamat / Nama Jalan / No. Rumah">
                   <textarea rows={3} value={address} onChange={(e) => setAddress(e.target.value)} disabled={!isEditing} placeholder="Contoh: Jl. Sudirman No. 45, RT 02/03" className={inputClass + " !h-auto py-3 resize-none"} />
                 </FormField>
               </div>
             </Card>
           </div>
         );
 
       // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       // NOTIFIKASI
       // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       case "notifikasi":
         return (
           <div className="space-y-3">
             <SectionTitle subtitle="Pemberitahuan terbaru aktivitas akun Anda.">Notifikasi</SectionTitle>
             {MOCK_NOTIFICATIONS.map((n, i) => {
               const NIcon = n.icon;
               return (
                 <Card key={i} className={`flex items-start gap-4 ${n.unread ? "border-l-2 border-l-[#FF6B35]" : ""}`}>
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.unread ? "bg-[#FF6B35]/10" : "bg-zinc-100"}`}>
                     <NIcon className={`w-5 h-5 ${n.unread ? "text-[#FF6B35]" : "text-zinc-400"}`} />
                   </div>
                   <div className="flex-1">
                     <div className="flex items-center gap-2 mb-1">
                       <p className="text-[13px] font-semibold text-zinc-800">{n.title}</p>
                       {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />}
                     </div>
                     <p className="text-[12px] text-zinc-500 leading-relaxed">{n.body}</p>
                     <p className="text-[11px] text-zinc-300 mt-1.5">{n.time}</p>
                   </div>
                 </Card>
               );
             })}
           </div>
         );
 
       // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       // KEAMANAN
       // ━━━━━━━━
       // KEAMANAN
       // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       case "keamanan":
         return (
           <div className="space-y-5">
             <SectionTitle subtitle="Kelola keamanan dan privasi akun Anda.">Keamanan Akun</SectionTitle>
             <Card>
               <div className="flex items-center gap-4 mb-6 pb-5 border-b border-zinc-100">
                 <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                   <ShieldCheck className="w-6 h-6 text-emerald-500" />
                 </div>
                 <div>
                   <p className="text-[14px] font-bold text-zinc-900">Status: Terlindungi</p>
                   <p className="text-[12px] text-emerald-600 font-medium">Akun Anda aman dan terverifikasi.</p>
                 </div>
               </div>
               <div className="space-y-3">
                 {[
                   { icon: Mail,  label: "Verifikasi Email", desc: email, ok: true },
                   { icon: Phone, label: "Nomor WhatsApp", desc: phone || "Belum diisi", ok: waStatus === "verified" },
                   { icon: Lock,  label: "Password", desc: "Terakhir diubah: —", ok: true },
                 ].map((item) => {
                   const Ic = item.icon;
                   return (
                     <div key={item.label} className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50/80">
                       <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shrink-0 border border-zinc-100">
                         <Ic className="w-4 h-4 text-zinc-400" />
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-[13px] font-semibold text-zinc-800">{item.label}</p>
                         <p className="text-[11px] text-zinc-400 truncate">{item.desc}</p>
                       </div>
                       <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg ${item.ok ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                         {item.ok ? "Aktif" : "Belum verifikasi"}
                       </span>
                     </div>
                   );
                 })}
               </div>
             </Card>
           </div>
         );
 
       default: return null;
     }
   };
 
   // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   // PAGE LAYOUT
   // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   return (
     <div className="min-h-screen bg-zinc-50">
       {/* Breadcrumb */}
       <div className="border-b border-zinc-100 bg-white">
         <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center gap-2 text-[11px] font-medium text-zinc-400">
           <Link href="/" className="hover:text-zinc-600 transition-colors flex items-center gap-1">
             <Home className="w-3 h-3" /> Beranda
           </Link>
           <ChevronRight className="w-3 h-3 text-zinc-300" />
           <span className="text-zinc-700 font-semibold">Profil Saya</span>
         </div>
       </div>
 
       <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8">
         <div className="flex gap-6 items-start">
 
           {/* ━━ SIDEBAR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
           <aside className="hidden lg:flex flex-col w-60 shrink-0 gap-4 sticky top-24">
             {/* Profile card */}
             <div className="bg-white rounded-2xl border border-zinc-100/80 overflow-hidden">
               {/* Accent gradient strip */}
               <div className="h-16 bg-gradient-to-r from-[#FF6B35] to-orange-400 relative">
                 <div className="absolute -bottom-7 left-1/2 -translate-x-1/2">
                   <div className="w-14 h-14 rounded-full bg-zinc-900 text-white flex items-center justify-center text-lg font-bold ring-4 ring-white">
                     {session?.user?.image ? (
                       <img src={session.user.image} className="w-14 h-14 rounded-full object-cover" alt={name} />
                     ) : initials}
                   </div>
                 </div>
               </div>
               <div className="pt-10 pb-5 px-4 text-center">
                 <p className="text-[14px] font-bold text-zinc-900 truncate">{name || "Pengguna"}</p>
                 <p className="text-[11px] text-zinc-400 truncate mt-0.5">{email}</p>
                 <div className="inline-flex items-center gap-1 mt-2.5 bg-amber-50 text-amber-700 text-[10px] font-semibold rounded-md px-2 py-0.5">
                   <Award className="w-3 h-3" /> Member
                 </div>
               </div>
             </div>
 
             {/* Nav */}
             <nav className="bg-white rounded-2xl border border-zinc-100/80 overflow-hidden">
               <div className="p-2">
                 {NAV.map(({ id, icon: Icon, label }) => {
                   const isActive = active === id;
                   return (
                     <button
                       key={id}
                       onClick={() => setActive(id as ActiveSection)}
                       className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] font-medium transition-all duration-150 text-left ${
                         isActive
                           ? "bg-[#FF6B35]/8 text-[#FF6B35] font-semibold"
                           : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
                       }`}
                     >
                       <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-[#FF6B35]" : "text-zinc-400"}`} />
                       {label}
                       {id === "notifikasi" && MOCK_NOTIFICATIONS.some(n => n.unread) && (
                         <span className="ml-auto w-5 h-5 bg-[#FF6B35] text-white text-[10px] font-bold rounded-full flex items-center justify-center">2</span>
                       )}
                     </button>
                   );
                 })}
               </div>
 
               <div className="border-t border-zinc-100 p-2">
                 <button
                   onClick={() => signOut({ callbackUrl: "/" })}
                   className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] font-medium text-red-500 hover:bg-red-50 transition-all"
                 >
                   <LogOut className="w-[18px] h-[18px] shrink-0" />
                   Keluar
                 </button>
               </div>
             </nav>
           </aside>
 
           {/* ━━ CONTENT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
           <main className="flex-1 min-w-0">
             {/* Mobile nav */}
             <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
               {NAV.map(({ id, icon: Icon, label }) => (
                 <button
                   key={id}
                   onClick={() => setActive(id as ActiveSection)}
                   className={`shrink-0 flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-[11px] font-medium transition-all ${
                     active === id
                       ? "bg-zinc-900 text-white"
                       : "bg-white border border-zinc-200 text-zinc-500"
                   }`}
                 >
                   <Icon className="w-3.5 h-3.5" />
                   {label}
                 </button>
               ))}
             </div>
 
             {renderContent()}
           </main>
         </div>
       </div>
 
       {/* ━━ Trust Bar ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
       <div className="border-t border-zinc-100 bg-white mt-12">
         <div className="max-w-screen-xl mx-auto px-6 py-8">
           <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
             {[
               { icon: Truck,        label: "Pengiriman Cepat",     desc: "1-3 hari kerja" },
               { icon: CreditCard,   label: "Garansi Tukar 7 Hari", desc: "Tukar gratis" },
               { icon: CheckCircle,  label: "Produk Original",      desc: "100% asli" },
               { icon: Lock,         label: "Pembayaran Aman",      desc: "Terenkripsi SSL" },
               { icon: Phone,        label: "Customer Service",     desc: "Siap membantu" },
             ].map(({ icon: Ic, label, desc }) => (
               <div key={label} className="flex items-center gap-3">
                 <div className="w-9 h-9 bg-zinc-50 rounded-lg flex items-center justify-center shrink-0">
                   <Ic className="w-4 h-4 text-zinc-500" />
                 </div>
                 <div>
                   <p className="text-[12px] font-semibold text-zinc-700">{label}</p>
                   <p className="text-[10px] text-zinc-400">{desc}</p>
                 </div>
               </div>
             ))}
           </div>
         </div>
       </div>
     </div>
   );
 }
 