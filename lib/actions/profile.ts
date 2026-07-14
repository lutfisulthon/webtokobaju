"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface ProfileData {
  name: string;
  phone: string;
  address: string;
  provinceId: string;
  cityId: string;
  district: string;
  postalCode: string;
  gender?: string;
  birthday?: Date | string;
}

export async function getProfile(email?: string) {
  let userId = "";
  let userEmail = email || "";

  if (!userEmail) {
    const session = await auth();
    userId = session?.user?.id || "";
  }

  if (!userId && !userEmail) {
    return null;
  }

  try {
    const user = await prisma.user.findFirst({
      where: userId ? { id: userId } : { email: userEmail },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        provinceId: true,
        cityId: true,
        district: true,
        postalCode: true,
        gender: true,
        birthday: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function updateProfile(data: Partial<ProfileData>, email?: string) {
  let userId = "";
  let userEmail = email || "";

  if (!userEmail) {
    const session = await auth();
    userId = session?.user?.id || "";
    userEmail = session?.user?.email || "";
  }

  if (!userId && !userEmail) {
    return { success: false, message: "Sesi tidak valid, silakan masuk log kembali." };
  }

  try {
    const targetUser = await prisma.user.findFirst({
      where: userEmail ? { email: userEmail } : { id: userId },
      select: { id: true }
    });

    if (!targetUser) {
      return { success: false, message: "Pengguna tidak ditemukan." };
    }

    const updateData: any = {
      name: data.name,
      phone: data.phone,
      address: data.address,
      provinceId: data.provinceId,
      cityId: data.cityId,
      district: data.district,
      postalCode: data.postalCode,
      gender: data.gender,
    };

    if (data.birthday) {
      updateData.birthday = new Date(data.birthday);
    }

    await prisma.user.update({
      where: { id: targetUser.id },
      data: updateData,
    });

    revalidatePath("/member/profile");
    revalidatePath("/checkout");
    return { success: true, message: "Profil berhasil diperbarui!" };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, message: "Gagal memperbarui profil." };
  }
}

export async function changePassword(data: any, email?: string) {
  const { currentPassword, newPassword } = data;
  if (!currentPassword || !newPassword) {
    return { success: false, message: "Data tidak lengkap." };
  }

  let userEmail = email || "";
  if (!userEmail) {
    const session = await auth();
    userEmail = session?.user?.email || "";
  }

  if (!userEmail) {
    return { success: false, message: "Sesi tidak valid, silakan masuk log kembali." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return { success: false, message: "Pengguna tidak ditemukan." };
    }

    const bcrypt = require("bcryptjs");
    
    // Jika user sign in via OAuth (seperti Google), field password mungkin kosong
    if (user.password) {
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return { success: false, message: "Password saat ini salah." };
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return { success: true, message: "Password berhasil diubah!" };
  } catch (error) {
    console.error("Error changing password:", error);
    return { success: false, message: "Gagal mengubah password." };
  }
}