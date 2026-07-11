import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var pool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;

let prisma: PrismaClient;
let pool: Pool;

if (process.env.NODE_ENV === "production") {
  pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
} else {
  if (!global.pool) {
    global.pool = new Pool({ connectionString });
  }
  pool = global.pool;
  const adapter = new PrismaPg(pool);

  if (!global.prisma) {
    global.prisma = new PrismaClient({ adapter });
  }
  prisma = global.prisma;
}

export { prisma, pool };
