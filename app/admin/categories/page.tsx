"use client";

import { useEffect, useState } from "react";
import { getCategories } from "@/lib/actions/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Folder, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      const data = await getCategories();
      setCategories(data);
      setLoading(false);
    }
    fetchCategories();
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Kategori</h1>
          <p className="text-sm text-neutral-500 mt-1">Kelola kategori produk untuk toko Anda.</p>
        </div>
        <button
          className={cn(
            buttonVariants({ variant: "default" }),
            "bg-[#111111] text-white hover:bg-[#333333] shadow-sm flex items-center gap-2"
          )}
          onClick={() => alert("Simulasi fitur Tambah Kategori")}
        >
          <Plus className="w-4 h-4" />
          Tambah Kategori
        </button>
      </div>

      <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Daftar Kategori</CardTitle>
          <CardDescription>
            Terdapat total {categories.length} kategori saat ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border-t border-neutral-100 dark:border-neutral-800">
              <Folder className="h-10 w-10 text-neutral-300 mb-3" />
              <p className="text-sm font-medium text-neutral-900 dark:text-white">Tidak ada kategori</p>
              <p className="text-sm text-neutral-500 mt-1">Buat kategori baru untuk mengelompokkan produk Anda.</p>
            </div>
          ) : (
            <div className="rounded-md border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="px-4 py-3 font-medium">Nama Kategori</th>
                    <th className="px-4 py-3 font-medium">Slug</th>
                    <th className="px-4 py-3 font-medium">Tanggal Dibuat</th>
                    <th className="px-4 py-3 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-neutral-950">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-neutral-900 dark:text-white">
                        {category.name}
                      </td>
                      <td className="px-4 py-3 text-neutral-500">
                        {category.slug}
                      </td>
                      <td className="px-4 py-3 text-neutral-500">
                        {new Date(category.createdAt).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-neutral-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
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
