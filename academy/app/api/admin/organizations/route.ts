import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/rbac"
import { listQueryErrorResponse, paginationMetadata, parseListQuery } from "@/lib/list-query"

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")

export async function GET(req: Request) {
  const auth = await requireAdmin()
  if (auth instanceof Response) return auth

  const url = new URL(req.url)
  let list
  try {
    list = parseListQuery(url.searchParams, { defaultPageSize: 10, defaultSort: "name", allowedSorts: ["name", "createdAt", "updatedAt"] as const, defaultSortDirection: "asc" })
  } catch (error) {
    return listQueryErrorResponse(error)
  }
  const active = url.searchParams.get("status")
  const where: Record<string, unknown> = {}
  if (active === "active") where.active = true
  if (active === "inactive") where.active = false
  if (list.search) where.OR = [
    { name: { contains: list.search } },
    { slug: { contains: list.search } },
    { members: { some: { user: { name: { contains: list.search } } } } },
    { members: { some: { user: { email: { contains: list.search } } } } },
  ]
  const [organizations, totalItems, courses, users] = await prisma.$transaction([
    prisma.organization.findMany({
      where,
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true, status: true } } }, orderBy: { createdAt: "asc" }, take: 25 },
        assignments: { include: { course: { select: { id: true, title: true, status: true } } }, orderBy: { createdAt: "desc" }, take: 25 },
        _count: { select: { members: true, assignments: true } },
      },
      orderBy: { [list.sort]: list.sortDirection }, skip: list.skip, take: list.take,
    }),
    prisma.organization.count({ where }),
    prisma.course.findMany({ where: { status: "approved" }, select: { id: true, title: true }, orderBy: { title: "asc" }, take: 100 }),
    prisma.user.findMany({ where: { status: "active" }, select: { id: true, name: true, email: true }, orderBy: { name: "asc" }, take: 100 }),
  ])
  return Response.json({ organizations, courses, users, pagination: paginationMetadata(list.page, list.pageSize, totalItems) })
}

const CreateSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("createOrganization"), name: z.string().trim().min(2).max(120) }),
  z.object({ action: z.literal("addMember"), organizationId: z.string().uuid(), userId: z.string().uuid(), role: z.enum(["learner", "manager", "administrator"]) }),
  z.object({ action: z.literal("assignCourse"), organizationId: z.string().uuid(), courseId: z.string().uuid(), dueAt: z.string().datetime().nullable().optional(), required: z.boolean().default(true) }),
])

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (auth instanceof Response) return auth
  const parsed = CreateSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: "Invalid request body" }, { status: 400 })

  if (parsed.data.action === "createOrganization") {
    const organization = await prisma.organization.create({ data: { name: parsed.data.name, slug: slugify(parsed.data.name), createdById: auth.user.id } })
    return Response.json({ success: true, organization }, { status: 201 })
  }

  if (parsed.data.action === "addMember") {
    const { organizationId, userId, role } = parsed.data
    const member = await prisma.$transaction(async (tx) => {
      const created = await tx.organizationMember.upsert({
        where: { organizationId_userId: { organizationId, userId } },
        update: { role },
        create: { organizationId, userId, role },
      })
      const assignments = await tx.courseAssignment.findMany({ where: { organizationId }, select: { courseId: true } })
      if (assignments.length) await tx.enrollment.createMany({ data: assignments.map(({ courseId }) => ({ courseId, userId })), skipDuplicates: true })
      return created
    })
    return Response.json({ success: true, member })
  }

  const { organizationId, courseId, dueAt, required } = parsed.data
  const assignment = await prisma.$transaction(async (tx) => {
    const created = await tx.courseAssignment.upsert({
      where: { organizationId_courseId: { organizationId, courseId } },
      update: { dueAt: dueAt ? new Date(dueAt) : null, required, assignedById: auth.user.id },
      create: { organizationId, courseId, dueAt: dueAt ? new Date(dueAt) : null, required, assignedById: auth.user.id },
    })
    const members = await tx.organizationMember.findMany({ where: { organizationId }, select: { userId: true } })
    if (members.length) await tx.enrollment.createMany({ data: members.map(({ userId }) => ({ userId, courseId })), skipDuplicates: true })
    return created
  })
  return Response.json({ success: true, assignment })
}

const PatchSchema = z.object({ id: z.string().uuid(), name: z.string().trim().min(2).max(120), active: z.boolean() })
export async function PATCH(request: Request) {
  const auth = await requireAdmin()
  if (auth instanceof Response) return auth
  const parsed = PatchSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: "Invalid request body" }, { status: 400 })
  const organization = await prisma.organization.update({ where: { id: parsed.data.id }, data: { name: parsed.data.name, slug: slugify(parsed.data.name), active: parsed.data.active } })
  return Response.json({ success: true, organization })
}

const DeleteSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("organization"), id: z.string().uuid() }),
  z.object({ type: z.literal("member"), id: z.string().uuid() }),
  z.object({ type: z.literal("assignment"), id: z.string().uuid() }),
])
export async function DELETE(request: Request) {
  const auth = await requireAdmin()
  if (auth instanceof Response) return auth
  const parsed = DeleteSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: "Invalid request body" }, { status: 400 })
  if (parsed.data.type === "organization") await prisma.organization.delete({ where: { id: parsed.data.id } })
  if (parsed.data.type === "member") await prisma.organizationMember.delete({ where: { id: parsed.data.id } })
  if (parsed.data.type === "assignment") await prisma.courseAssignment.delete({ where: { id: parsed.data.id } })
  return Response.json({ success: true })
}
