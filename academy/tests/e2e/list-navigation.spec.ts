import { expect, test } from "@playwright/test"
import { loginAs } from "./utils/auth"

test("free-learning catalogue keeps server query state in the URL and resets it", async ({ page }) => {
  await page.goto("/learn")
  await page.getByRole("textbox", { name: "Search free courses" }).fill("Python")
  await expect(page).toHaveURL(/search=Python/)
  await expect(page.getByRole("link", { name: /Python Programming for Beginners/ })).toBeVisible()
  await page.getByRole("button", { name: "Clear filters" }).click()
  await expect(page).toHaveURL(/\/learn$/)
})

test("admin growing lists expose searchable URL-backed server pagination controls", async ({ page }) => {
  await loginAs(page, "admin")
  const cases = [
    ["/admin/courses", "Search courses"],
    ["/admin/users", "Search users"],
    ["/admin/organizations", "Search organizations"],
    ["/admin/enrollments", "Search enrollments"],
  ] as const

  for (const [path, label] of cases) {
    await page.goto(path)
    await page.getByRole("textbox", { name: label }).fill("no-match-e2e-query")
    await expect(page).toHaveURL(/search=no-match-e2e-query/)
    await expect(page.getByLabel("Rows per page")).toHaveValue("10")
    await page.getByLabel("Rows per page").selectOption("25")
    await expect(page).toHaveURL(/pageSize=25/)
    await expect(page.getByRole("button", { name: "Previous" })).toBeDisabled()
  }
})
