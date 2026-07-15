"use client";

import { useEffect, useState } from "react";
import { getAdminDashboardStats, getAdminRecentOrders } from "@/lib/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingBag, ShoppingCart, Users, Package } from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const dashboardStats = await getAdminDashboardStats();
      const orders = await getAdminRecentOrders(5);
      
      setStats(dashboardStats);
      setRecentOrders(orders);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Pendapatan",
      value: `Rp ${stats.totalRevenue.toLocaleString("id-ID")}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bgColor: "bg-emerald-100 dark:bg-emerald-500/20"
    },
    {
      title: "Total Pesanan",
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-500/20"
    },
    {
      title: "Total Produk",
      value: stats.totalProducts.toString(),
      icon: ShoppingBag,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-500/20"
    },
    {
      title: "Pelanggan Aktif",
      value: stats.totalCustomers.toString(),
      icon: Users,
      color: "text-orange-500",
      bgColor: "bg-orange-100 dark:bg-orange-500/20"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">Ikhtisar toko Anda dan metrik penjualan terkini.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, i) => (
          <Card key={i} className="shadow-sm border-neutral-200 dark:border-neutral-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neutral-900 dark:text-white">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Sales Chart */}
        <Card className="col-span-4 shadow-sm border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Pendapatan Terakhir</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FF6B35" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    tickFormatter={(value) => `Rp${value / 1000}k`}
                    dx={-10}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`Rp ${Number(value).toLocaleString("id-ID")}`, "Pendapatan"]}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="total" stroke="#FF6B35" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders List */}
        <Card className="col-span-3 shadow-sm border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Pesanan Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Package className="h-10 w-10 text-neutral-300 mb-3" />
                <p className="text-sm text-neutral-500">Belum ada pesanan.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 last:border-0 pb-4 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none text-neutral-900 dark:text-white">
                        {order.customerName || "Pelanggan"}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {order.customerEmail}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        +Rp {order.grandTotal.toLocaleString("id-ID")}
                      </p>
                      <div className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold border-transparent bg-amber-100 text-amber-800">
                        {order.shippingStatus}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
