import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Verificar que el cliente de Prisma esté disponible
let prismaClient: PrismaClient

try {
  prismaClient = globalForPrisma.prisma ?? new PrismaClient()
} catch (error) {
  console.error('Error al inicializar Prisma Client:', error)
  throw new Error(
    '@prisma/client no se ha inicializado. Por favor ejecuta "npx prisma generate" y reinicia el servidor.'
  )
}

export const prisma = prismaClient

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
