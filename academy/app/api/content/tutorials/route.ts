import { prisma } from "@/lib/prisma"
import { requireAdminOrInternalInstructor } from "@/lib/rbac"
import { TutorialMetadataSchema } from "@/lib/tutorial-validation"
import { listQueryErrorResponse, paginationMetadata, parseListQuery } from "@/lib/list-query"
import { mysqlContainsIds } from "@/lib/mysql-search"

export async function GET(req: Request) {
  const auth = await requireAdminOrInternalInstructor()
  if (auth instanceof Response) return auth
  const url = new URL(req.url)
  let list
  try {
    list = parseListQuery(url.searchParams, { defaultPageSize: 10, defaultSort: "updatedAt", allowedSorts: ["createdAt", "updatedAt", "publishedAt", "title"] as const })
  } catch (error) {
    return listQueryErrorResponse(error)
  }
  const status = url.searchParams.get("status")
  const difficulty = url.searchParams.get("difficulty")
  const where: Record<string, unknown> = {}
  if (status && ["draft", "published", "archived"].includes(status)) where.status = status
  if (difficulty && ["beginner", "intermediate", "advanced"].includes(difficulty)) where.difficulty = difficulty
  if (list.search) where.id = { in: await mysqlContainsIds("Tutorial", ["title", "shortDescription", "description", "category"], list.search) }
  const [tutorials, totalItems] = await prisma.$transaction([
    prisma.tutorial.findMany({ where, include: { _count: { select: { sections: true } } }, orderBy: { [list.sort]: list.sortDirection }, skip: list.skip, take: list.take }),
    prisma.tutorial.count({ where }),
  ])
  return Response.json({ tutorials, pagination: paginationMetadata(list.page, list.pageSize, totalItems) })
}

export async function POST(req: Request) {
  const auth = await requireAdminOrInternalInstructor()
  if (auth instanceof Response) return auth
  const parsed = TutorialMetadataSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: "Invalid tutorial", details: parsed.error.flatten().fieldErrors }, { status: 400 })
  const tutorial = await prisma.tutorial.create({ data: { ...parsed.data, icon: parsed.data.icon || null, imageUrl: parsed.data.imageUrl || null, publishedAt: parsed.data.status === "published" ? new Date() : null, createdById: auth.user.id, updatedById: auth.user.id } })
  return Response.json({ tutorial }, { status: 201 })
}
