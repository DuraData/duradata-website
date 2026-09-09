import { expect, test } from "@playwright/test"
import { loginAs } from "./utils/auth"

async function api<T>(page: import("@playwright/test").Page, path: string, init?: RequestInit) {
  return page.evaluate(async ({ path, init }) => {
    const response = await fetch(path, init)
    return { ok: response.ok, status: response.status, json: await response.json().catch(() => null) }
  }, { path, init }) as Promise<{ ok: boolean; status: number; json: T }>
}

const combinations = [
  [false, true, true],
  [true, true, true],
  [true, false, true],
  [true, true, false],
  [false, false, true],
  [false, true, false],
  [true, false, false],
  [false, false, false],
] as const

async function restoreDefaultFeatures(page: import("@playwright/test").Page) {
  await loginAs(page, "admin")
  await api(page, "/api/admin/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ settings: [
    { key: "academicLearningEnabled", value: "false" },
    { key: "corporateLearningEnabled", value: "true" },
    { key: "freeLearningEnabled", value: "true" },
  ] }) })
  await expect.poll(async () => (await api(page, "/api/academy/features")).json).toEqual({
    academicLearningEnabled: false,
    corporateLearningEnabled: true,
    freeLearningEnabled: true,
  })
}

test.beforeEach(async ({ page }) => { await restoreDefaultFeatures(page) })
test.afterEach(async ({ page }) => { await restoreDefaultFeatures(page) })

test("one deployment isolates the Duradata and Academy hosts", async ({ page }) => {
  await page.goto("http://duradata.localhost:3000/")
  await expect(page.getByText("Transforming Data Into Decisions")).toBeVisible()

  await page.goto("http://academy.localhost:3000/")
  await expect(page.getByText("Duradata Academy").first()).toBeVisible()

  await page.goto("http://academy.localhost:3000/courses")
  await expect(page.getByRole("heading", { name: "Courses" })).toBeVisible()

  await page.goto("http://duradata.localhost:3000/courses")
  await expect(page.getByText("Transforming Data Into Decisions")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Courses" })).toHaveCount(0)
})

test("all learning-mode combinations enforce pages, APIs, and navigation", async ({ page }) => {
  for (const [academic, corporate, free] of combinations) {
    await loginAs(page, "admin")
    const response = await api(page, "/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: [
        { key: "academicLearningEnabled", value: String(academic) },
        { key: "corporateLearningEnabled", value: String(corporate) },
        { key: "freeLearningEnabled", value: String(free) },
      ] }),
    })
    expect(response.ok).toBeTruthy()
    await expect.poll(async () => (await api<{ academicLearningEnabled: boolean; corporateLearningEnabled: boolean; freeLearningEnabled: boolean }>(page, "/api/academy/features")).json).toEqual({
      academicLearningEnabled: academic,
      corporateLearningEnabled: corporate,
      freeLearningEnabled: free,
    })

    for (const [path, enabled] of [["/api/sa-hub/packages", academic], ["/api/courses", corporate], ["/api/content/tutorials", free]] as const) {
      const result = await api(page, path)
      expect(result.status, `${path} for ${academic}/${corporate}/${free}`).toBe(enabled ? 200 : 404)
    }

    for (const [path, enabled] of [["/academic-learning", academic], ["/courses", corporate], ["/learn", free]] as const) {
      await page.goto(path)
      if (enabled) await expect(page.getByText("is unavailable")).toHaveCount(0)
      else await expect(page.getByText(/learning is unavailable/i)).toBeVisible()
    }

    await api(page, "/api/auth/logout", { method: "POST" })
    await page.goto("/")
    for (const [name, enabled] of [["Academic Learning", academic], ["Courses", corporate], ["Learn Free", free]] as const) {
      const links = page.getByRole("link", { name, exact: true })
      if (enabled) expect(await links.count(), `${name} should be available`).toBeGreaterThan(0)
      else await expect(links).toHaveCount(0)
    }
  }

  await api(page, "/api/admin/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ settings: [
    { key: "academicLearningEnabled", value: "false" },
    { key: "corporateLearningEnabled", value: "true" },
    { key: "freeLearningEnabled", value: "true" },
  ] }) })
})

test("Academy admin manages an organization, learner, and assigned course", async ({ page }) => {
  await loginAs(page, "admin")
  const initial = await api<{ users: Array<{ id: string; email: string }>; courses: Array<{ id: string }>; organizations: unknown[] }>(page, "/api/admin/organizations")
  expect(initial.ok).toBeTruthy()
  const catalog = initial.json
  const learner = catalog.users.find((user: { email: string }) => user.email.includes("e2e.student"))
  const course = catalog.courses[0]
  expect(learner).toBeTruthy(); expect(course).toBeTruthy()
  if (!learner || !course) throw new Error("Seeded learner and approved course are required")

  const created = await api<{ organization: { id: string } }>(page, "/api/admin/organizations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "createOrganization", name: `E2E Organization ${Date.now()}` }) })
  expect(created.status).toBe(201)
  const organization = created.json.organization

  expect((await api(page, "/api/admin/organizations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "addMember", organizationId: organization.id, userId: learner.id, role: "learner" }) })).ok).toBeTruthy()
  expect((await api(page, "/api/admin/organizations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "assignCourse", organizationId: organization.id, courseId: course.id, required: true }) })).ok).toBeTruthy()

  const updated = (await api<{ organizations: Array<{ id: string; members: unknown[]; assignments: unknown[] }> }>(page, "/api/admin/organizations")).json
  const row = updated.organizations.find((item: { id: string }) => item.id === organization.id)
  if (!row) throw new Error("Created organization was not returned by the catalog")
  expect(row.members).toHaveLength(1)
  expect(row.assignments).toHaveLength(1)

  expect((await api(page, "/api/admin/organizations", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "organization", id: organization.id }) })).ok).toBeTruthy()
})
