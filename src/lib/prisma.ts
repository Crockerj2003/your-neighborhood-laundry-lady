import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const connectionString =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_PRISMA_URL ??
  process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error(
    "No database connection string found. Set DATABASE_URL, POSTGRES_PRISMA_URL, or POSTGRES_URL.",
  );
}

const adapter = new PrismaPg({ connectionString });

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
