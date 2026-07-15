"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminCreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulasi penyimpanan (tanpa backend action sungguhan agar simpel di UI mockup ini)
    setTimeout(() => {
      toast.success("Produk berhasil ditambahkan!");
      router.push("/admin/products");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Tambah Produk Baru</h1>
            <p className="text-sm text-neutral-500">Isi detail di bawah untuk menambahkan produk ke katalog.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Informasi Dasar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Produk</label>
              <Input required placeholder="Contoh: Kemeja Flanel Premium" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">URL Gambar (Placeholder)</label>
              <Input required placeholder="https://images.unsplash.com/..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Deskripsi Lengkap</label>
              <textarea 
                required
                className="w-full min-h-[120px] rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 dark:border-neutral-800 dark:focus-visible:ring-neutral-300"
                placeholder="Jelaskan spesifikasi, bahan, dan keunggulan produk..."
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Harga & Inventaris</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Harga Dasar (Rp)</label>
              <Input type="number" required placeholder="150000" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Harga Diskon (Opsional)</label>
              <Input type="number" placeholder="100000" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Stok Awal</label>
              <Input type="number" required placeholder="50" />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/products"
            className={buttonVariants({ variant: "ghost" })}
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-[#111111] text-white hover:bg-[#333333] flex items-center gap-2 min-w-[140px]"
            )}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan Produk
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
