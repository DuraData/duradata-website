import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaClient } from "./generated/prisma/client"
import { mysqlConnectionOptions } from "./database-url"

export function createAcademyPrismaClient() {
  return new PrismaClient({ adapter: new PrismaMariaDb(mysqlConnectionOptions()) })
}
