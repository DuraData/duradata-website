import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/rbac"
import { listQueryErrorResponse, paginationMetadata, parseListQuery, parseOptionalEnum, parseOptionalUuid } from "@/lib/list-query"
import { mysqlContainsIds } from "@/lib/mysql-search"

const adminUserListSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  mustChangePassword: true,
  createdAt: true,
} as any

export async function GET(req: Request) {
  const auth = await requireAdmin()
  if (auth instanceof Response) return auth

  const url = new URL(req.url)
  let list, role, status, organizationId
  try {
    list = parseListQuery(url.searchParams, { defaultPageSize: 10, defaultSort: "createdAt", allowedSorts: ["createdAt", "updatedAt", "name", "email"] as const })
    role = parseOptionalEnum(url.searchParams, "role", ["student", "instructor", "admin", "internal_instructor"] as const)
    status = parseOptionalEnum(url.searchParams, "status", ["active", "suspended", "banned"] as const)
    organizationId = parseOptionalUuid(url.searchParams, "organizationId")
  } catch (error) {
    return listQueryErrorResponse(error)
  }
  const q = list.search

  const where: Record<string, unknown> = {}
  if (role) where.role = role
  if (status) where.status = status
  if (organizationId) where.organizationMemberships = { some: { organizationId } }
  if (q) {
    const [userIds, organizationIds] = await Promise.all([mysqlContainsIds("User", ["email", "name"], q), mysqlContainsIds("Organization", ["name"], q)])
    where.OR = [
      { id: { in: userIds } },
      { organizationMemberships: { some: { organizationId: { in: organizationIds } } } },
    ]
  }

  const [users, totalItems] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      select: adminUserListSelect,
      orderBy: { [list.sort]: list.sortDirection },
      skip: list.skip,
      take: list.take,
    }),
    prisma.user.count({ where }),
  ])

  return Response.json({ users, pagination: paginationMetadata(list.page, list.pageSize, totalItems) })
}

const PatchSchema = z.object({
  userId: z.string().uuid(),
  action: z.enum(["activate", "suspend", "ban", "setRole"]),
  role: z.enum(["student", "instructor", "admin", "internal_instructor"]).optional(),
})

export async function PATCH(req: Request) {
  const auth = await requireAdmin()
  if (auth instanceof Response) return auth

  const json = await req.json().catch(() => null)
  const parsed = PatchSchema.safeParse(json)
  if (!parsed.success) return Response.json({ error: "Invalid request body" }, { status: 400 })

  const { userId, action, role } = parsed.data
  if (userId === auth.user.id) {
    return Response.json({ error: "You cannot modify your own account." }, { status: 400 })
  }

  if (action === "setRole") {
    if (!role) return Response.json({ error: "Role is required" }, { status: 400 })
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, role: true, status: true },
    })
    await prisma.session.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } })
    return Response.json({ success: true, user: updated })
  }

  const statusMap = {
    activate: "active",
    suspend: "suspended",
    ban: "banned",
  } as const

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { status: statusMap[action] },
    select: { id: true, role: true, status: true },
  })
  if (updated.status !== "active") await prisma.session.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } })

  return Response.json({ success: true, user: updated })
}

const DeleteSchema = z.object({ userId: z.string().uuid() })

export async function DELETE(req: Request) {
  const auth = await requireAdmin()
  if (auth instanceof Response) return auth

  const json = await req.json().catch(() => null)
  const parsed = DeleteSchema.safeParse(json)
  if (!parsed.success) return Response.json({ error: "Invalid request body" }, { status: 400 })

  const { userId } = parsed.data
  if (userId === auth.user.id) {
    return Response.json({ error: "You cannot delete your own account." }, { status: 400 })
  }

  await prisma.user.delete({ where: { id: userId } })
  return Response.json({ success: true })
}
