import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireInternalInstructor } from "@/lib/rbac"
import { listQueryErrorResponse, paginationMetadata, parseListQuery } from "@/lib/list-query"

const CreateCourseSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  price: z.number().int().nonnegative(),
  categoryId: z.string().uuid().nullable().optional(),
  sections: z
    .array(
      z.object({
        title: z.string().min(1),
        lessons: z.array(
          z.object({
            title: z.string().min(1),
            videoUrl: z.string().url().optional(),
          })
        ),
      })
    )
    .optional(),
})

export async function GET(req: Request) {
  const auth = await requireInternalInstructor()
  if (auth instanceof Response) return auth

  const url = new URL(req.url)
  let list
  try { list = parseListQuery(url.searchParams, { defaultPageSize: 10, defaultSort: "updatedAt", allowedSorts: ["createdAt", "updatedAt", "title"] as const }) } catch (error) { return listQueryErrorResponse(error) }
  const status = url.searchParams.get("status")
  const where: Record<string, unknown> = { instructorId: auth.user.id }
  if (status) where.status = status
  if (list.search) where.OR = [{ title: { contains: list.search } }, { description: { contains: list.search } }, { category: { name: { contains: list.search } } }]

  const [courses, totalItems] = await prisma.$transaction([prisma.course.findMany({
    where,
    include: {
      category: { select: { id: true, name: true } },
      _count: { select: { enrollments: true, sections: true } },
    },
    orderBy: { [list.sort]: list.sortDirection }, skip: list.skip, take: list.take,
  }), prisma.course.count({ where })])

  return Response.json({ courses, pagination: paginationMetadata(list.page, list.pageSize, totalItems) })
}

export async function POST(req: Request) {
  const auth = await requireInternalInstructor()
  if (auth instanceof Response) return auth

  const json = await req.json().catch(() => null)
  const parsed = CreateCourseSchema.safeParse(json)
  if (!parsed.success) {
    return Response.json({ error: "Invalid request body" }, { status: 400 })
  }

  const { title, description, price, categoryId, sections } = parsed.data
  const placeholderVideo = "https://www.w3schools.com/html/mov_bbb.mp4"

  const created = await prisma.$transaction(async (tx) => {
    const course = await tx.course.create({
      data: {
        title,
        description,
        price,
        categoryId: categoryId ?? null,
        instructorId: auth.user.id,
        status: "draft",
      },
    })

    if (sections?.length) {
      for (const sectionInput of sections) {
        const section = await tx.section.create({
          data: { title: sectionInput.title, courseId: course.id },
        })

        if (sectionInput.lessons?.length) {
          await tx.lesson.createMany({
            data: sectionInput.lessons.map((l) => ({
              title: l.title,
              videoUrl: l.videoUrl ?? placeholderVideo,
              sectionId: section.id,
            })),
          })
        }
      }
    }

    return course
  })

  return Response.json({ success: true, courseId: created.id })
}
