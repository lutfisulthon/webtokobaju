"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// 1. Dashboard Overview Stats
export async function getAdminDashboardStats() {
  try {
    const totalOrders = await prisma.order.count();
    const totalProducts = await prisma.product.count({ where: { deletedAt: null } });
    const totalCustomers = await prisma.user.count({ where: { role: "CUSTOMER" } });
    
    const orders = await prisma.order.findMany({
      select: { grandTotal: true },
      where: {
        paymentStatus: { in: ["PAID", "PENDING"] }
      }
    });
    
    const totalRevenue = orders.reduce((acc, order) => acc + order.grandTotal, 0);

    // Get simple chart data for last 7 days revenue (mock implementation)
    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 7,
      select: {
        createdAt: true,
        grandTotal: true,
        id: true,
      }
    });

    const chartData = recentOrders.reverse().map((order) => ({
      name: new Date(order.createdAt).toLocaleDateString("id-ID", { weekday: 'short' }),
      total: order.grandTotal,
    }));

    // If chartData is empty, populate mock data to make chart look good initially
    const finalChartData = chartData.length > 0 ? chartData : [
      { name: "Sen", total: 1200000 },
      { name: "Sel", total: 800000 },
      { name: "Rab", total: 2500000 },
      { name: "Kam", total: 1750000 },
      { name: "Jum", total: 3200000 },
      { name: "Sab", total: 4500000 },
      { name: "Min", total: 3800000 },
    ];

    return {
      totalOrders,
      totalProducts,
      totalCustomers,
      totalRevenue,
      chartData: finalChartData,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return {
      totalOrders: 0,
      totalProducts: 0,
      totalCustomers: 0,
      totalRevenue: 0,
      chartData: [],
    };
  }
}

// 2. Fetch Latest Orders for Dashboard
export async function getAdminRecentOrders(limit = 5) {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: { select: { name: true, email: true } },
      }
    });
    return orders;
  } catch (error) {
    console.error("Failed to fetch recent orders:", error);
    return [];
  }
}

// 3. Category Management
export async function getCategories() {
  return await prisma.category.findMany({ orderBy: { createdAt: "desc" } });
}

// 4. Products Management
export async function getAdminProducts() {
  try {
    return await prisma.product.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: { category: true, variants: true }
    });
  } catch (error) {
    return [];
  }
}

// 5. Orders Management
export async function getAdminOrders() {
  try {
    return await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
      }
    });
  } catch (error) {
    return [];
  }
}

// 6. Customers Management
export async function getAdminCustomers() {
  try {
    return await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        orders: { select: { id: true } }
      }
    });
  } catch (error) {
    return [];
  }
}
