import "dotenv/config"
import { createAcademyPrismaClient } from "../lib/create-prisma-client"
import {
  FREE_CODING_LIBRARY_MANAGED_KEYS,
  FREE_CODING_LIBRARY_SLUGS,
  freeCodingCourseBlueprints,
} from "../content/free-coding-library"

async function main() {
  const prisma = createAcademyPrismaClient()
  try {
    const tutorials = await prisma.tutorial.findMany({
      where: { slug: { in: FREE_CODING_LIBRARY_SLUGS } },
      orderBy: { title: "asc" },
    })
    if (tutorials.length !== 10) throw new Error(`Expected 10 managed free courses, found ${tutorials.length}`)

    const expectedTitles = new Set(freeCodingCourseBlueprints.map((course) => course.title))
    const expectedManagedKeys = new Set(FREE_CODING_LIBRARY_MANAGED_KEYS)
    const rows = []
    for (const tutorial of tutorials) {
      if (!expectedTitles.has(tutorial.title)) throw new Error(`Unexpected managed course: ${tutorial.title}`)
      if (!tutorial.managedKey || !expectedManagedKeys.has(tutorial.managedKey)) throw new Error(`${tutorial.title} does not have the expected managed key`)
      if (tutorial.status !== "published" || tutorial.courseType !== "FREE") throw new Error(`${tutorial.title} is not published Free Learning content`)
      const [modules, lessons, examples, exercises, questions] = await Promise.all([
        prisma.tutorialSection.count({ where: { tutorialId: tutorial.id } }),
        prisma.tutorialLesson.count({ where: { section: { tutorialId: tutorial.id }, isPublished: true } }),
        prisma.tutorialCodeExample.count({ where: { lesson: { section: { tutorialId: tutorial.id } } } }),
        prisma.tutorialExercise.count({ where: { lesson: { section: { tutorialId: tutorial.id } } } }),
        prisma.tutorialQuizQuestion.count({ where: { quiz: { lesson: { section: { tutorialId: tutorial.id } } } } }),
      ])
      if (modules < 17 || lessons !== modules || examples !== lessons || exercises !== lessons || questions < 25) {
        throw new Error(`${tutorial.title} failed content verification: ${JSON.stringify({ modules, lessons, examples, exercises, questions })}`)
      }
      rows.push({ title: tutorial.title, modules, lessons, examples, exercises, questions })
    }
    console.log(JSON.stringify({ success: true, courses: rows }, null, 2))
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
