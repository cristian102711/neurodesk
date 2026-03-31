import { PrismaClient } from '@prisma/client'

declare const globalThis: {
  prismaGlobal: PrismaClient | undefined;
} & typeof global;

function getPrisma(): PrismaClient {
  if (!globalThis.prismaGlobal) {
    globalThis.prismaGlobal = new PrismaClient()
  }
  return globalThis.prismaGlobal
}

const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    return getPrisma()[prop as keyof PrismaClient]
  }
})

export default prisma
