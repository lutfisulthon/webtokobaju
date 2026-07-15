"use client";

import { useEffect, useState } from "react";
import { getAdminCustomers } from "@/lib/actions/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Mail, Phone, ShoppingCart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      const data = await getAdminCustomers();
      setCustomers(data);
      setLoading(false);
    }
    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Pelanggan</h1>
        <p className="text-sm text-neutral-500 mt-1">Daftar pengguna yang terdaftar sebagai pelanggan di toko Anda.</p>
      </div>

      <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Basis Pelanggan</CardTitle>
          <CardDescription>
            Menampilkan total {customers.length} pelanggan terdaftar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border-t border-neutral-100 dark:border-neutral-800">
              <Users className="h-10 w-10 text-neutral-300 mb-3" />
              <p className="text-sm font-medium text-neutral-900 dark:text-white">Belum ada pelanggan</p>
              <p className="text-sm text-neutral-500 mt-1">Belum ada user terdaftar dengan role CUSTOMER.</p>
            </div>
          ) : (
            <div className="rounded-md border border-neutral-200 dark:border-neutral-800 overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[700px]">
                <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="px-4 py-3 font-medium">Informasi Pelanggan</th>
                    <th className="px-4 py-3 font-medium">Kontak</th>
                    <th className="px-4 py-3 font-medium text-center">Total Pesanan</th>
                    <th className="px-4 py-3 font-medium">Bergabung Sejak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-neutral-950">
                  {customers.map((user) => (
                    <tr key={user.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-neutral-600 dark:text-neutral-300 uppercase">
                            {user.name ? user.name.substring(0, 2) : "US"}
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">{user.name || "User Tanpa Nama"}</p>
                            <p className="text-xs text-neutral-500">ID: {user.id.slice(-8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 space-y-1">
                        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{user.email || "-"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{user.phone || "-"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                          <ShoppingCart className="w-3.5 h-3.5" />
                          {user.orders?.length || 0} Order
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-500">
                        {new Date(user.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric", month: "long", year: "numeric"
                        })}
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
