import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Tags, ShoppingCart, Users, Settings, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // In a real application, you'd check auth here
  // e.g. const session = await auth(); if (session?.user?.role !== "ADMIN") redirect("/");

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Produk", href: "/admin/products", icon: ShoppingBag },
    { name: "Kategori", href: "/admin/categories", icon: Tags },
    { name: "Pesanan", href: "/admin/orders", icon: ShoppingCart },
    { name: "Pelanggan", href: "/admin/customers", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-neutral-800">
          <Link href="/" className="font-plus-jakarta font-extrabold text-xl tracking-tight text-[#111111] dark:text-white">
            URBAN<span className="text-[#FF6B35]">WEAR</span>
            <span className="text-xs ml-2 font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full text-neutral-500">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-neutral-800 space-y-1">
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
            Pengaturan
          </Link>
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
