import { PrismaClient } from '@prisma/client';
import { env } from '~/env.mjs';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// const prisma = new PrismaClient();

// async function main() {
//   const chat = await prisma.chat.create({
//     data: {
//       title: 'Hello World',
//       description: 'This is a test post',
//     },
//   });
//   console.log(chat);
// }

// main();

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// import { PrismaClient } from "@prisma/client";

// import { env } from "~/env";

// const createPrismaClient = () =>
//   new PrismaClient({
//     log:
//       env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
//   });

// const globalForPrisma = globalThis as unknown as {
//   prisma: ReturnType<typeof createPrismaClient> | undefined;
// };

// export const db = globalForPrisma.prisma ?? createPrismaClient();

// if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
