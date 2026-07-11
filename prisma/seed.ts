import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


async function main() {
  console.log("Memulai proses seeding...");

  // 1. Bersihkan data lama
  await prisma.paymentWebhookLog.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.promo.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Data lama berhasil dibersihkan.");

  // 2. Buat Admin & Customer Dummy
  const admin = await prisma.user.create({
    data: {
      name: "Admin UrbanWear",
      email: "admin@urbanwear.com",
      role: Role.ADMIN,
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "Budi Santoso",
      email: "budi@gmail.com",
      role: Role.CUSTOMER,
    },
  });

  console.log("User dummy (Admin & Customer) berhasil dibuat.");

  // 3. Buat Kategori
  const kemejaCat = await prisma.category.create({
    data: {
      name: "Kemeja",
      slug: "kemeja",
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=80",
    },
  });

  const kaosCat = await prisma.category.create({
    data: {
      name: "Kaos",
      slug: "kaos",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80",
    },
  });

  const celanaCat = await prisma.category.create({
    data: {
      name: "Celana",
      slug: "celana",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=80",
    },
  });

  const jaketCat = await prisma.category.create({
    data: {
      name: "Jaket",
      slug: "jaket",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=80",
    },
  });

  console.log("Kategori berhasil dibuat.");

  // 4. Buat Promo / Voucher
  await prisma.promo.createMany({
    data: [
      {
        code: "URBANNEW",
        discountPercentage: 10,
        maxDiscount: 20000,
        usageLimit: 100,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 hari ke depan
      },
      {
        code: "MEGASALE50",
        discountPercentage: 50,
        maxDiscount: 100000,
        usageLimit: 50,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 hari
      },
    ],
  });

  console.log("Promo/Voucher berhasil dibuat.");

  // 5. Buat Produk & Varian (12 Produk Premium)
  const productsData = [
    // --- Kemeja ---
    {
      name: "Kemeja Linen Oversized Casual",
      slug: "kemeja-linen-oversized-casual",
      description: "Kemeja linen premium berpotongan oversized. Sangat adem, ringan, dan cocok untuk gaya kasual maupun semi-formal sehari-hari.",
      price: 249000,
      discountPrice: 199000,
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80",
      images: [
        "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80"
      ],
      gender: "pria",
      categoryId: kemejaCat.id,
      variants: [
        { sku: "KMJ-LN-OW-S", size: "S", color: "Putih", imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80", stock: 15 },
        { sku: "KMJ-LN-OW-M", size: "M", color: "Putih", imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80", stock: 25 },
        { sku: "KMJ-LN-OW-L", size: "L", color: "Putih", imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80", stock: 20 },
        { sku: "KMJ-LN-OW-XL", size: "XL", color: "Putih", imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80", stock: 10 },
        { sku: "KMJ-LN-OB-S", size: "S", color: "Beige", imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80", stock: 12 },
        { sku: "KMJ-LN-OB-M", size: "M", color: "Beige", imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80", stock: 18 },
        { sku: "KMJ-LN-OB-L", size: "L", color: "Beige", imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80", stock: 15 },
      ]
    },
    {
      name: "Kemeja Oxford Minimalis Slimfit",
      slug: "kemeja-oxford-minimalis-slimfit",
      description: "Kemeja dengan bahan katun Oxford bertekstur rapat. Tampilan bersih, slim-fit, dan elegan untuk kerja atau hang out.",
      price: 279000,
      discountPrice: null,
      image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&auto=format&fit=crop&q=80",
      images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80"],
      gender: "pria",
      categoryId: kemejaCat.id,
      variants: [
        { sku: "KMJ-OX-SF-S", size: "S", color: "Biru Muda", imageUrl: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&auto=format&fit=crop&q=80", stock: 20 },
        { sku: "KMJ-OX-SF-M", size: "M", color: "Biru Muda", imageUrl: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&auto=format&fit=crop&q=80", stock: 30 },
        { sku: "KMJ-OX-SF-L", size: "L", color: "Biru Muda", imageUrl: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&auto=format&fit=crop&q=80", stock: 25 },
        { sku: "KMJ-OX-SF-XL", size: "XL", color: "Biru Muda", imageUrl: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&auto=format&fit=crop&q=80", stock: 15 },
      ]
    },
    {
      name: "Kemeja Flanel Kotak-Kotak Modern",
      slug: "kemeja-flanel-kotak-kotak-modern",
      description: "Kemeja flanel tebal bertekstur lembut dengan motif kotak-kotak klasik yang tidak pernah lekang oleh waktu.",
      price: 299000,
      discountPrice: 249000,
      image: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=800&auto=format&fit=crop&q=80",
      images: [],
      gender: "pria",
      categoryId: kemejaCat.id,
      variants: [
        { sku: "KMJ-FL-RD-M", size: "M", color: "Merah-Hitam", imageUrl: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=800&auto=format&fit=crop&q=80", stock: 14 },
        { sku: "KMJ-FL-RD-L", size: "L", color: "Merah-Hitam", imageUrl: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=800&auto=format&fit=crop&q=80", stock: 18 },
        { sku: "KMJ-FL-GR-M", size: "M", color: "Hijau-Navy", imageUrl: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop&q=80", stock: 12 },
        { sku: "KMJ-FL-GR-L", size: "L", color: "Hijau-Navy", imageUrl: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop&q=80", stock: 15 },
      ]
    },

    // --- Kaos ---
    {
      name: "Kaos Polos Katun Organik Premium",
      slug: "kaos-polos-katun-organik-premium",
      description: "Kaos polos basic dengan bahan 100% Katun Kombed Organik 24s. Lebih tebal, lembut di kulit, ramah lingkungan, dan menyerap keringat.",
      price: 129000,
      discountPrice: 99000,
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
      images: [
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80"
      ],
      gender: "pria",
      categoryId: kaosCat.id,
      variants: [
        { sku: "KOS-OG-BK-S", size: "S", color: "Hitam", stock: 40 },
        { sku: "KOS-OG-BK-M", size: "M", color: "Hitam", stock: 50 },
        { sku: "KOS-OG-BK-L", size: "L", color: "Hitam", stock: 45 },
        { sku: "KOS-OG-WT-S", size: "S", color: "Putih", stock: 35 },
        { sku: "KOS-OG-WT-M", size: "M", color: "Putih", stock: 45 },
        { sku: "KOS-OG-WT-L", size: "L", color: "Putih", stock: 40 },
      ]
    },
    {
      name: "Kaos Streetwear Oversized Graphic",
      slug: "kaos-streetwear-oversized-graphic",
      description: "Kaos bergaya streetwear modern dengan potongan oversized dan grafis sablon plastisol berkualitas tinggi di bagian belakang.",
      price: 189000,
      discountPrice: 159000,
      image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80",
      images: [],
      gender: "pria",
      categoryId: kaosCat.id,
      variants: [
        { sku: "KOS-SW-GF-M", size: "M", color: "Charcoal", stock: 20 },
        { sku: "KOS-SW-GF-L", size: "L", color: "Charcoal", stock: 25 },
        { sku: "KOS-SW-GF-XL", size: "XL", color: "Charcoal", stock: 15 },
      ]
    },

    // --- Celana ---
    {
      name: "Celana Kulot Linen Highwaist",
      slug: "celana-kulot-linen-highwaist",
      description: "Celana kulot wanita dengan potongan pinggang tinggi (highwaist). Memberikan ilusi kaki jenjang dengan bahan linen jatuh yang sejuk.",
      price: 219000,
      discountPrice: 179000,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=80",
      images: [],
      gender: "wanita",
      categoryId: celanaCat.id,
      variants: [
        { sku: "CLN-KL-LN-S", size: "S", color: "Sand", stock: 15 },
        { sku: "CLN-KL-LN-M", size: "M", color: "Sand", stock: 20 },
        { sku: "CLN-KL-LN-L", size: "L", color: "Sand", stock: 15 },
        { sku: "CLN-KL-LB-S", size: "S", color: "Hitam", stock: 15 },
        { sku: "CLN-KL-LB-M", size: "M", color: "Hitam", stock: 20 },
      ]
    },
    {
      name: "Celana Chino Slim Fit Stretch",
      slug: "celana-chino-slim-fit-stretch",
      description: "Celana chino panjang pria berpola slim-fit dari katun twill stretch (melar) yang nyaman dan fleksibel bergerak seharian.",
      price: 329000,
      discountPrice: null,
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80",
      images: [],
      gender: "pria",
      categoryId: celanaCat.id,
      variants: [
        { sku: "CLN-CN-SF-28", size: "28", color: "Khaki", stock: 10 },
        { sku: "CLN-CN-SF-30", size: "30", color: "Khaki", stock: 15 },
        { sku: "CLN-CN-SF-32", size: "32", color: "Khaki", stock: 15 },
        { sku: "CLN-CN-SF-34", size: "34", color: "Khaki", stock: 10 },
      ]
    },

    // --- Jaket ---
    {
      name: "Jaket Denim Oversized Wash",
      slug: "jaket-denim-oversized-wash",
      description: "Jaket jeans/denim tebal unisex dengan potongan semi-oversized dan efek washed bergaya retro/vintage yang keren.",
      price: 399000,
      discountPrice: 319000,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",
      images: [
        "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80"
      ],
      gender: "unisex",
      categoryId: jaketCat.id,
      variants: [
        { sku: "JKT-DN-OW-M", size: "M", color: "Light Blue", stock: 8 },
        { sku: "JKT-DN-OW-L", size: "L", color: "Light Blue", stock: 12 },
        { sku: "JKT-DN-OW-XL", size: "XL", color: "Light Blue", stock: 10 },
      ]
    },
    {
      name: "Jaket Coach Bomber Minimalist",
      slug: "jaket-coach-bomber-minimalist",
      description: "Jaket coach kasual dengan bahan parasut nilon tahan cipratan air (water-resistant) dilengkapi kancing jepret hitam eksklusif.",
      price: 299000,
      discountPrice: 229000,
      image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop&q=80",
      images: [],
      gender: "pria",
      categoryId: jaketCat.id,
      variants: [
        { sku: "JKT-CB-MN-S", size: "S", color: "Hitam", stock: 10 },
        { sku: "JKT-CB-MN-M", size: "M", color: "Hitam", stock: 15 },
        { sku: "JKT-CB-MN-L", size: "L", color: "Hitam", stock: 15 },
      ]
    },
    {
      name: "Cardigan Rajut Lembut Knitwear",
      slug: "cardigan-rajut-lembut-knitwear",
      description: "Outer rajut cardigan bergaya Korea dengan serat benang akrilik premium yang lembut, nyaman di kulit, dan menghangatkan.",
      price: 249000,
      discountPrice: null,
      image: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=800&auto=format&fit=crop&q=80",
      images: [],
      gender: "wanita",
      categoryId: jaketCat.id,
      variants: [
        { sku: "JKT-CD-RJ-M", size: "M", color: "Brown", stock: 12 },
        { sku: "JKT-CD-RJ-L", size: "L", color: "Brown", stock: 15 },
      ]
    },
    
    // --- Anak-anak ---
    {
      name: "Kaos Anak Katun Dino Ceria",
      slug: "kaos-anak-katun-dino-ceria",
      description: "Kaos anak bermotif dinosaurus yang lucu dengan bahan 100% katun premium yang lembut, sejuk, dan aman untuk kulit sensitif anak.",
      price: 99000,
      discountPrice: 79000,
      image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&auto=format&fit=crop&q=80",
      images: [],
      gender: "anak-anak",
      categoryId: kaosCat.id,
      variants: [
        { sku: "KOS-ANK-DN-4", size: "4 Tahun", color: "Hijau", stock: 15 },
        { sku: "KOS-ANK-DN-6", size: "6 Tahun", color: "Hijau", stock: 20 },
      ]
    },
    {
      name: "Jaket Hoodie Anak Fleece Lembut",
      slug: "jaket-hoodie-anak-fleece-lembut",
      description: "Jaket hoodie anak dengan bahan fleece tebal namun sangat lembut dan hangat. Sangat nyaman untuk bermain maupun bepergian.",
      price: 179000,
      discountPrice: null,
      image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format&fit=crop&q=80",
      images: [],
      gender: "anak-anak",
      categoryId: jaketCat.id,
      variants: [
        { sku: "JKT-ANK-HD-S", size: "S (8-10 Thn)", color: "Navy", stock: 10 },
        { sku: "JKT-ANK-HD-M", size: "M (11-13 Thn)", color: "Navy", stock: 12 },
      ]
    }
  ];

  for (const item of productsData) {
    const { variants, ...productProps } = item;
    const createdProduct = await prisma.product.create({
      data: productProps
    });

    // Buat Varian untuk produk tersebut
    const variantsWithProductId = variants.map(v => ({
      ...v,
      productId: createdProduct.id
    }));

    await prisma.productVariant.createMany({
      data: variantsWithProductId
    });
  }

  console.log("Produk dan variannya berhasil dibuat.");
  console.log("Seeding selesai dengan sukses! 🎉");
}

main()
  .catch((e) => {
    console.error("Gagal melakukan seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

