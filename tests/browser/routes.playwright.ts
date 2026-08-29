import { readdirSync } from "node:fs"
import path from "node:path"
import { expect, test } from "@playwright/test"

const pageSlugs = readdirSync("static/content/pages")
  .filter((fileName) => fileName.endsWith(".md"))
  .map((fileName) => path.basename(fileName, ".md"))

const journalSlugs = readdirSync("static/content/journal", { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)

test.describe("site routes", () => {
  test("the home route renders the journal", async ({ page }) => {
    const response = await page.goto("/")

    expect(response?.status()).toBe(200)
    await expect(page).toHaveTitle("ModernActuary - A Journal")
    await expect(page.getByRole("heading", { name: "The Journal" })).toBeVisible()
    await expect(page.locator('a[href^="/journal/"]').first()).toBeVisible()
  })

  test("the archive route renders archived journal entries", async ({ page }) => {
    const response = await page.goto("/archive")

    expect(response?.status()).toBe(200)
    await expect(page).toHaveTitle("Archive - ModernActuary")
    await expect(page.getByRole("heading", { name: "Archive" })).toBeVisible()
    await expect(page.locator('a[href^="/journal/"]').first()).toBeVisible()
  })

  for (const slug of pageSlugs) {
    test(`the /${slug} page route renders`, async ({ page }) => {
      const response = await page.goto(`/${slug}`)

      expect(response?.status()).toBe(200)
      await expect(page.locator("main article > header h1")).toBeVisible()
      await expect(page.locator("main article")).toBeVisible()
    })
  }

  for (const slug of journalSlugs) {
    test(`the /journal/${slug} route renders`, async ({ page }) => {
      const response = await page.goto(`/journal/${slug}`)

      expect(response?.status()).toBe(200)
      await expect(page).toHaveTitle(/ - ModernActuary$/)
      await expect(page.locator("main article > header h1")).toBeVisible()
      await expect(page.locator("main article time").first()).toBeVisible()
    })
  }

  test("unknown content routes return 404", async ({ page }) => {
    const unknownPageResponse = await page.goto("/does-not-exist")
    const unknownJournalResponse = await page.goto("/journal/does-not-exist")

    expect(unknownPageResponse?.status()).toBe(404)
    expect(unknownJournalResponse?.status()).toBe(404)
  })
})
