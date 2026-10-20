import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "./generated/prisma/client"
import { postgresConnectionOptions, postgresSchema } from "./database-url"

export function createAcademyPrismaClient() {
  return new PrismaClient({ adapter: new PrismaPg(postgresConnectionOptions(), { schema: postgresSchema() }) })
}
