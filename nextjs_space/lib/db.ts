import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Inicializar Prisma Client de manera lazy para evitar problemas durante el build
let prismaClient: PrismaClient | null = null

function getPrismaClient(): PrismaClient {
  // Evitar inicialización durante el build
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    // Retornar un cliente mock durante el build
    return {} as PrismaClient
  }

  if (!prismaClient) {
    try {
      prismaClient = globalForPrisma.prisma ?? new PrismaClient()
      
      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = prismaClient
      }
    } catch (error) {
      console.error('Error al inicializar Prisma Client:', error)
      throw new Error(
        '@prisma/client no se ha inicializado. Por favor ejecuta "npx prisma generate" y reinicia el servidor.'
      )
    }
  }

  return prismaClient
}

// Exportar función para obtener Prisma Client de manera lazy
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    return (getPrismaClient() as any)[prop]
  },
})
