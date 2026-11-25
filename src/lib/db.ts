import { PrismaClient } from '@prisma/client'
import { PrismaClient as SQLitePrismaClient } from '@/generated/sqlite'

type DatabaseClient =
  | PrismaClient
  | InstanceType<typeof SQLitePrismaClient>

const globalForPrisma = globalThis as unknown as {
  prisma: DatabaseClient | undefined
}

const isSQLite = process.env.DATABASE_URL?.startsWith('file:') ?? false

export const db =
  globalForPrisma.prisma ??
  (isSQLite
    ? new SQLitePrismaClient({ log: ['query'] })
    : new PrismaClient({ log: ['query'] }))

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db