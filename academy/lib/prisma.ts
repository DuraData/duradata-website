import type { PrismaClient } from "@/lib/generated/prisma/client"
import { createAcademyPrismaClient } from "@/lib/create-prisma-client"
import { validateProductionEnvironment } from "@/lib/env"

validateProductionEnvironment()

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  createAcademyPrismaClient()

// Cache on globalThis in every environment, not just dev: within one warm
// serverless instance this is the only thing stopping every re-invocation of
// this module (or a Next.js dev/HMR reload) from opening a fresh pool.
globalForPrisma.prisma = prisma
