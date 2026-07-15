"use client";

import { useEffect, useState } from "react";
import { getAdminProducts } from "@/lib/actions/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, PackageOpen, Pencil, Trash, Image as ImageIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const data = await getAdminProducts();
      setProducts(data);
      setLoading(false);
    }
    fetchProducts();
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Produk</h1>
          <p className="text-sm text-neutral-500 mt-1">Kelola inventaris dan katalog produk toko Anda.</p>
        </div>
        <Link
          href="/admin/products/create"
          className={cn(
            buttonVariants({ variant: "default" }),
            "bg-[#111111] text-white hover:bg-[#333333] shadow-sm flex items-center gap-2"
          )}
        >
          <Plus className="w-4 h-4" />
          Tambah Produk
        </Link>
      </div>

      <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Katalog Produk</CardTitle>
          <CardDescription>
            Menampilkan total {products.length} produk yang terdaftar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border-t border-neutral-100 dark:border-neutral-800">
              <PackageOpen className="h-10 w-10 text-neutral-300 mb-3" />
              <p className="text-sm font-medium text-neutral-900 dark:text-white">Belum ada produk</p>
              <p className="text-sm text-neutral-500 mt-1">Klik tombol 'Tambah Produk' untuk mulai mengisi katalog.</p>
            </div>
          ) : (
            <div className="rounded-md border border-neutral-200 dark:border-neutral-800 overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[800px]">
                <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="px-4 py-3 font-medium w-16">Foto</th>
                    <th className="px-4 py-3 font-medium">Nama Produk</th>
                    <th className="px-4 py-3 font-medium">Kategori</th>
                    <th className="px-4 py-3 font-medium">Harga</th>
                    <th className="px-4 py-3 font-medium text-center">Total Varian</th>
                    <th className="px-4 py-3 font-medium text-center">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-neutral-950">
                  {products.map((product) => {
                    const totalVariants = product.variants?.length || 0;
                    
                    return (
                      <tr key={product.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-neutral-100 flex items-center justify-center relative">
                            {product.image ? (
                              <Image src={product.image} alt={product.name} fill sizes="40px" className="object-cover" />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-neutral-400" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-neutral-900 dark:text-white line-clamp-1">{product.name}</p>
                          <p className="text-xs text-neutral-500 mt-0.5">{product.slug}</p>
                        </td>
                        <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                          {product.category?.name || "-"}
                        </td>
                        <td className="px-4 py-3 font-medium text-neutral-900 dark:text-white">
                          Rp {product.price.toLocaleString("id-ID")}
                        </td>
                        <td className="px-4 py-3 text-center text-neutral-600 dark:text-neutral-400">
                          <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-md text-xs font-medium">
                            {totalVariants}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {product.isActive ? (
                            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold border-transparent bg-emerald-100 text-emerald-800">
                              Aktif
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold border-transparent bg-neutral-100 text-neutral-600">
                              Draft
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/products/${product.id}`} className="p-2 text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors">
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button className="p-2 text-neutral-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
