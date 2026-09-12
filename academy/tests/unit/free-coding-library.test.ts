import assert from "node:assert/strict"
import test from "node:test"
import { buildFreeCodingLibrary } from "../../content/free-coding-library"

const requiredTitles = [
  "HTML & CSS Fundamentals",
  "JavaScript Programming Fundamentals",
  "Python Programming for Beginners",
  "SQL & Relational Database Fundamentals",
  "Git & GitHub Essentials",
  "TypeScript Fundamentals",
  "React Fundamentals",
  "Node.js & REST API Development",
  "C# & .NET Fundamentals",
  "Data Structures, Algorithms & Problem Solving",
]

test("free coding library contains the ten required production courses", () => {
  const library = buildFreeCodingLibrary()
  assert.deepEqual(library.map((course) => course.title), requiredTitles)
  assert.equal(new Set(library.map((course) => course.slug)).size, 10)
  assert.ok(library.every((course) => course.category && course.tags.length >= 4))
})

test("every course has complete lesson, exercise, assessment, and project material", () => {
  for (const course of buildFreeCodingLibrary()) {
    assert.equal(course.lessons.length, course.modules.length)
    assert.ok(course.lessons.length >= 17)
    assert.ok(course.lessons.every((lesson) => lesson.content.length >= 16), `${course.title} has incomplete lesson blocks`)
    assert.ok(course.lessons.every((lesson) => lesson.example.sourceCode && lesson.example.explanation), `${course.title} is missing worked examples`)
    assert.ok(course.lessons.every((lesson) => lesson.exercise.instructions && lesson.exercise.expectedAnswer && lesson.exercise.explanation), `${course.title} is missing exercise guidance`)
    assert.ok(course.lessons.every((lesson) => lesson.questions.length === 2), `${course.title} must assess each lesson`)
    assert.ok(course.lessons.flatMap((lesson) => lesson.questions).length >= 34, `${course.title} needs at least 25 questions`)
    assert.ok(course.project.requirements.length >= 4)
    assert.ok(course.project.acceptanceCriteria.length >= 4)
    assert.ok(course.project.stretchGoals.length >= 2)
  }
})

test("Node.js course teaches safe boundaries without unsafe credential examples", () => {
  const node = buildFreeCodingLibrary().find((course) => course.slug === "nodejs-rest-api-development")
  assert.ok(node)
  const text = JSON.stringify(node).toLowerCase()
  assert.match(text, /hashed passwords/)
  assert.match(text, /server-side authorization/)
  assert.doesNotMatch(text, /password\s*=\s*["'][^"']+["']/)
})
