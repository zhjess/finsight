import { PrismaClient } from "@prisma/client";
// @ts-ignore
import dotenv from "dotenv";

declare global {
    namespace NodeJS {
      interface Global {
        prisma: PrismaClient | undefined;
      }
    }
  }

let prisma: PrismaClient;

if (process.env.NODE_ENV !== "production"){
    prisma = new PrismaClient();
} else {
  // @ts-ignore
    if (!global.prisma) { // @ts-ignore
        global.prisma = new PrismaClient();
    } // @ts-ignore
    prisma = global.prisma;
}

export default prisma;