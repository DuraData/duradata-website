import { prisma } from "@/lib/prisma"
import { getAcademyFeatures } from "@/lib/academy-features"

export async function GET() {
  const features = await getAcademyFeatures()
  if (!features.corporateLearningEnabled) {
    return Response.json({ error: "Corporate learning is currently disabled" }, { status: 404 })
  }

  const courses = await prisma.course.findMany({
    where: { status: "approved" },
    include: { instructor: { select: { name: true } } },
    orderBy: { title: "asc" },
  })

  return Response.json(
    courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      price: course.price,
      instructorId: course.instructorId,
      thumbnail: course.imageUrl ?? "/placeholder.jpg",
      instructorName: course.instructor.name,
    })),
    { headers: { "Cache-Control": "no-store" } }
  )
}
