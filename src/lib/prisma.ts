
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

// 1. Configure the adapter using DATABASE_URL (preferred) or individual env vars
const getDbConfig = () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    try {
      const parsed = new URL(databaseUrl);
      const user = decodeURIComponent(parsed.username || "");
      const password = decodeURIComponent(parsed.password || "");
      const host = parsed.hostname || "localhost";
      const port = parsed.port ? Number(parsed.port) : 3306;
      const dbName = parsed.pathname ? parsed.pathname.replace(/^\//, "") : "approval_engine";
      return {
        host,
        port,
        user,
        password,
        database: dbName,
      };
    } catch (e) {
      // fallthrough to env vars
    }
  }

  return {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "approval_engine",
  };
};

const dbConfig = getDbConfig();
const adapter = new PrismaMariaDb(dbConfig);

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