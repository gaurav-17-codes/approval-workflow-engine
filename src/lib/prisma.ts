
// import { PrismaClient } from '@prisma/client'
// import { PrismaMariaDb } from '@prisma/adapter-mariadb'
// import { createPool } from 'mariadb'

// // Prevent multiple instances of Prisma Client in development
// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined
// }

// // 1. Create a connection pool and configure the adapter
// const pool = createPool({
//   host: process.env.DB_HOST || "127.0.0.1",
//   port: Number(process.env.DB_PORT) || 3306,
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD || "", // Fallback to blank for local Homebrew
//   database: process.env.DB_NAME || "approval_engine",
//   connectionLimit: 5,
// })

// const adapter = new PrismaMariaDb(pool)

// // 2. Initialize Prisma Client WITH the adapter
// export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma




import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// 1. Configure the adapter with your explicit local credentials
const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "", // Your local DB has no password
  database: "approval_engine"
});

// 2. Standard Next.js singleton pattern to prevent connection limits
const prismaClientSingleton = () => {
  return new PrismaClient({ adapter });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// 3. Export the connected prisma instance
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;