import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { listQueryErrorResponse, paginationMetadata, parseListQuery } from "@/lib/list-query"

async function ensureStudent() {
  const session = await getSession()
  if (!session) return { error: Response.json({ error: "Not logged in" }, { status: 401 }) }
  if (session.role !== "student") return { error: Response.json({ error: "Forbidden" }, { status: 403 }) }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, role: true, status: true },
  })
  if (!user || user.role !== "student") return { error: Response.json({ error: "Invalid session" }, { status: 401 }) }
  if (user.status !== "active") return { error: Response.json({ error: "Account disabled" }, { status: 403 }) }

  return { user }
}

export async function GET(req: Request) {
  const auth = await ensureStudent()
  if ("error" in auth) return auth.error
  const url = new URL(req.url)
  let list
  try { list = parseListQuery(url.searchParams, { defaultPageSize: 10, defaultSort: "issuedAt", allowedSorts: ["issuedAt"] as const }) } catch (error) { return listQueryErrorResponse(error) }
  const kind = url.searchParams.get("kind")
  if (kind && kind !== "course" && kind !== "free-learning") return Response.json({ error: "Invalid certificate kind" }, { status: 400 })

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: auth.user.id },
    include: { course: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  })

  for (const e of enrollments) {
    const totalLessons = await prisma.lesson.count({ where: { section: { courseId: e.courseId } } })
    if (totalLessons === 0) continue

    const completedLessons = await prisma.progress.count({
      where: { userId: auth.user.id, completed: true, lesson: { section: { courseId: e.courseId } } },
    })
    if (completedLessons !== totalLessons) continue

    const certificateId = `LFY-${e.id.replace(/-/g, "").slice(0, 16).toUpperCase()}`
    const cert = await prisma.certificate.upsert({
      where: { userId_courseId: { userId: auth.user.id, courseId: e.courseId } },
      update: {},
      create: { userId: auth.user.id, courseId: e.courseId, certificateId },
      include: { course: { select: { title: true } } },
    })
    void cert
  }

  let certificates: Array<{ id: string; certificateId: string; issuedAt: Date; course: { id: string; title: string }; kind: "course" | "free-learning" }> = []
  let totalItems = 0
  if (kind === "course") {
    const [rows, count] = await prisma.$transaction([prisma.certificate.findMany({ where: { userId: auth.user.id }, include: { course: { select: { id: true, title: true } } }, orderBy: { issuedAt: list.sortDirection }, skip: list.skip, take: list.take }), prisma.certificate.count({ where: { userId: auth.user.id } })])
    certificates = rows.map((row) => ({ ...row, course: { id: row.courseId, title: row.course.title }, kind: "course" })); totalItems = count
  } else if (kind === "free-learning") {
    const [rows, count] = await prisma.$transaction([prisma.tutorialCertificate.findMany({ where: { userId: auth.user.id }, include: { tutorial: { select: { id: true, title: true } } }, orderBy: { issuedAt: list.sortDirection }, skip: list.skip, take: list.take }), prisma.tutorialCertificate.count({ where: { userId: auth.user.id } })])
    certificates = rows.map((row) => ({ ...row, course: { id: row.tutorialId, title: row.tutorial.title }, kind: "free-learning" })); totalItems = count
  } else {
    const union = await prisma.$queryRawUnsafe<Array<{ id: string; kind: "course" | "free-learning"; issuedAt: Date }>>(`SELECT id, 'course' AS kind, issuedAt FROM Certificate WHERE userId = ? UNION ALL SELECT id, 'free-learning' AS kind, issuedAt FROM TutorialCertificate WHERE userId = ? ORDER BY issuedAt ${list.sortDirection === "asc" ? "ASC" : "DESC"} LIMIT ? OFFSET ?`, auth.user.id, auth.user.id, list.take, list.skip)
    const [courseRows, tutorialRows, courseCount, tutorialCount] = await prisma.$transaction([
      prisma.certificate.findMany({ where: { id: { in: union.filter((row) => row.kind === "course").map((row) => row.id) } }, include: { course: { select: { id: true, title: true } } } }),
      prisma.tutorialCertificate.findMany({ where: { id: { in: union.filter((row) => row.kind === "free-learning").map((row) => row.id) } }, include: { tutorial: { select: { id: true, title: true } } } }),
      prisma.certificate.count({ where: { userId: auth.user.id } }), prisma.tutorialCertificate.count({ where: { userId: auth.user.id } }),
    ])
    const mapped = new Map<string, (typeof certificates)[number]>()
    courseRows.forEach((row) => mapped.set(row.id, { ...row, course: { id: row.courseId, title: row.course.title }, kind: "course" }))
    tutorialRows.forEach((row) => mapped.set(row.id, { ...row, course: { id: row.tutorialId, title: row.tutorial.title }, kind: "free-learning" }))
    certificates = union.flatMap((row) => mapped.get(row.id) ? [mapped.get(row.id)!] : []); totalItems = courseCount + tutorialCount
  }

  return Response.json({
    certificates,
    pagination: paginationMetadata(list.page, list.pageSize, totalItems),
  })
}
