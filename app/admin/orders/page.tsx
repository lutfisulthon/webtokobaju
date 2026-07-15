"use client";

import { useEffect, useState } from "react";
import { getAdminOrders } from "@/lib/actions/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShoppingCart, Eye, CheckCircle2, Package, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const data = await getAdminOrders();
      setOrders(data);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700"><Clock className="w-3 h-3"/> Tertunda</span>;
      case "PROCESSING":
        return <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"><Package className="w-3 h-3"/> Diproses</span>;
      case "SHIPPED":
        return <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700"><ShoppingCart className="w-3 h-3"/> Dikirim</span>;
      case "DELIVERED":
        return <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"><CheckCircle2 className="w-3 h-3"/> Selesai</span>;
      default:
        return <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium border-neutral-200 bg-neutral-100 text-neutral-600">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Pesanan</h1>
        <p className="text-sm text-neutral-500 mt-1">Pantau dan kelola pesanan pelanggan Anda.</p>
      </div>

      <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Daftar Pesanan</CardTitle>
          <CardDescription>
            Menampilkan total {orders.length} transaksi pesanan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border-t border-neutral-100 dark:border-neutral-800">
              <ShoppingCart className="h-10 w-10 text-neutral-300 mb-3" />
              <p className="text-sm font-medium text-neutral-900 dark:text-white">Tidak ada pesanan</p>
              <p className="text-sm text-neutral-500 mt-1">Belum ada transaksi masuk.</p>
            </div>
          ) : (
            <div className="rounded-md border border-neutral-200 dark:border-neutral-800 overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[900px]">
                <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="px-4 py-3 font-medium">Order ID</th>
                    <th className="px-4 py-3 font-medium">Tanggal</th>
                    <th className="px-4 py-3 font-medium">Pelanggan</th>
                    <th className="px-4 py-3 font-medium">Total Harga</th>
                    <th className="px-4 py-3 font-medium text-center">Status Pembayaran</th>
                    <th className="px-4 py-3 font-medium text-center">Status Pengiriman</th>
                    <th className="px-4 py-3 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-neutral-950">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-neutral-900 dark:text-white uppercase">
                        #{order.id.slice(-8)}
                      </td>
                      <td className="px-4 py-3 text-neutral-500">
                        {new Date(order.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-neutral-900 dark:text-white">{order.customerName}</p>
                        <p className="text-xs text-neutral-500">{order.customerEmail}</p>
                      </td>
                      <td className="px-4 py-3 font-medium text-neutral-900 dark:text-white">
                        Rp {order.grandTotal.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn(
                          "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold border-transparent",
                          order.paymentStatus === "PAID" ? "bg-emerald-100 text-emerald-800" : "bg-neutral-100 text-neutral-600"
                        )}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {getStatusBadge(order.shippingStatus)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link 
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1.5 p-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="sr-only sm:not-sr-only">Detail</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
