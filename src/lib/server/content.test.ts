import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { getJournalEntryBySlug, getPage } from "./content"

describe("getPage", () => {
  it("returns undefined for a page that does not exist", async () => {
    assert.equal(await getPage("does-not-exist"), undefined)
  })

  it("parses frontmatter and renders Markdown as HTML", async () => {
    const page = await getPage("about")

    assert.ok(page)
    assert.deepEqual(page.metadata, { title: "About" })
    assert.match(page.contentHTML, /<h2 id="publications">/)
    assert.match(
      page.contentHTML,
      /<a href="https:\/\/www\.soa\.org\/resources\/research-reports\/2025\/operationalizing-genai-actuaries\/">Operationalizing LLMs - A Guide for Actuaries, 2025<\/a>/,
    )
  })
})

describe("getJournalEntryBySlug", () => {
  it("parses journal frontmatter and renders headings", async () => {
    const entry = await getJournalEntryBySlug("a-new-start")

    assert.ok(entry)
    assert.equal(entry.slug, "a-new-start")
    assert.equal(entry.metadata.title, "A New Start")
    assert.deepEqual(entry.metadata.date, new Date("2025-11-16"))
    assert.equal(entry.metadata.pinned, true)
    assert.equal(entry.metadata.archived, false)
    assert.match(entry.contentHTML, /<h2 id="updating-the-python-preferred-practices">/)
  })

  it("rewrites relative image paths in frontmatter and Markdown", async () => {
    const entry = await getJournalEntryBySlug("more-is-less")

    assert.ok(entry)
    assert.equal(entry.metadata.image, "/content/journal/more-is-less/media/splash.jpg")
    assert.match(
      entry.contentHTML,
      /src="\/content\/journal\/more-is-less\/media\/quality-over-quantity-chart\.png"/,
    )
  })

  it("derives the updated date from the latest changelog entry", async () => {
    const entry = await getJournalEntryBySlug("ppp-1-python")

    assert.ok(entry)
    assert.equal(entry.metadata.changelog?.length, 1)
    assert.deepEqual(entry.metadata.changelog?.[0], {
      date: new Date("2025-11-16"),
      description: "Changed `pyenv` to `uv`",
    })
    assert.deepEqual(entry.metadata.updated, new Date("2025-11-16"))
  })

  it("renders a deprecation note when one is provided", async () => {
    const entry = await getJournalEntryBySlug("deprecated-ppp-3-project-automation")

    assert.ok(entry)
    assert.equal(entry.metadata.deprecated, true)
    assert.match(entry.deprecationNoteHTML ?? "", /<p>This post has been deprecated\./)
    assert.match(entry.deprecationNoteHTML ?? "", /<a href="\.\/ppp-1-python\/">PPP 1<\/a>/)
  })
})
