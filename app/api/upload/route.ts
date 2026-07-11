import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// API Route untuk simulasi upload gambar secara lokal (bisa diganti Cloudinary/Vercel Blob di produksi)
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "File gambar tidak ditemukan." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Simpan di direktori publik lokal untuk keperluan testing/development
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // Pastikan folder uploads sudah terbuat
    await fs.mkdir(uploadDir, { recursive: true });

    // Buat nama file unik
    const uniqueFilename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    await fs.writeFile(filePath, buffer);

    const relativeUrl = `/uploads/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      url: relativeUrl,
      message: "Gambar berhasil diunggah secara lokal!",
    });
  } catch (error: any) {
    console.error("Gagal melakukan unggah gambar:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal mengunggah file." },
      { status: 500 }
    );
  }
}
