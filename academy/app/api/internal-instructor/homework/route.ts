import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireInternalInstructor } from "@/lib/rbac"
import { listQueryErrorResponse, paginationMetadata, parseListQuery } from "@/lib/list-query"

const CreateHomeworkSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1).optional(),
  dueAt: z.string().datetime(),
  subjectPackageId: z.string().uuid(),
})

export async function GET(req: Request) {
  const auth = await requireInternalInstructor()
  if (auth instanceof Response) return auth

  const url = new URL(req.url)
  let list
  try {
    list = parseListQuery(url.searchParams, {
      defaultPageSize: 10,
      defaultSort: "dueAt",
      allowedSorts: ["dueAt", "createdAt", "updatedAt", "title"] as const,
    })
  } catch (error) {
    return listQueryErrorResponse(error)
  }
  const subjectPackageId = url.searchParams.get("subjectPackageId")
  const where: Record<string, unknown> = { teacherId: auth.user.id }
  if (subjectPackageId) where.subjectPackageId = subjectPackageId
  if (list.search) {
    where.OR = [
      { title: { contains: list.search } },
      { description: { contains: list.search } },
      { subject: { contains: list.search } },
      { subjectPackage: { title: { contains: list.search } } },
    ]
  }

  const [assignments, totalItems] = await prisma.$transaction([prisma.homeworkAssignment.findMany({
    where,
    include: {
      subjectPackage: { select: { id: true, title: true } },
      _count: { select: { submissions: true } },
    },
    orderBy: { [list.sort]: list.sortDirection },
    skip: list.skip,
    take: list.take,
  }), prisma.homeworkAssignment.count({ where })])

  return Response.json({ assignments, pagination: paginationMetadata(list.page, list.pageSize, totalItems) })
}

export async function POST(req: Request) {
  const auth = await requireInternalInstructor()
  if (auth instanceof Response) return auth

  const json = await req.json().catch(() => null)
  const parsed = CreateHomeworkSchema.safeParse(json)
  if (!parsed.success) {
    return Response.json({ error: "Invalid request body" }, { status: 400 })
  }

  const { title, description, dueAt, subjectPackageId } = parsed.data

  const pkg = await prisma.subjectPackage.findUnique({
    where: { id: subjectPackageId },
    select: { id: true, teacherId: true, subject: true, grade: true },
  })
  if (!pkg || pkg.teacherId !== auth.user.id) {
    return Response.json({ error: "Subject not found" }, { status: 404 })
  }

  const created = await prisma.homeworkAssignment.create({
    data: {
      title,
      description: description ?? null,
      subject: pkg.subject,
      grade: pkg.grade,
      dueAt: new Date(dueAt),
      teacherId: auth.user.id,
      subjectPackageId: pkg.id,
    },
  })

  return Response.json({ success: true, assignmentId: created.id })
}
