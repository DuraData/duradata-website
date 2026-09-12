import { prisma } from "@/lib/prisma"
import { requireStudent } from "@/lib/rbac"

export async function POST(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const auth = await requireStudent()
  if (auth instanceof Response) return auth
  const { slug } = await params
  const tutorial = await prisma.tutorial.findFirst({
    where: { slug, status: "published", courseType: "FREE" },
    select: { id: true },
  })
  if (!tutorial) return Response.json({ error: "Free course not found" }, { status: 404 })

  const enrollment = await prisma.tutorialEnrollment.upsert({
    where: { userId_tutorialId: { userId: auth.user.id, tutorialId: tutorial.id } },
    update: {},
    create: { userId: auth.user.id, tutorialId: tutorial.id },
  })
  return Response.json({ success: true, enrollment: { id: enrollment.id, enrolledAt: enrollment.enrolledAt } })
}
