import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import type { Image, Link } from "mdast"
import matter from "gray-matter"
import remarkParse from "remark-parse"
import { unified } from "unified"
import { visit } from "unist-util-visit"
import { describe, it } from "node:test"

const STATIC_ROOT = path.resolve("static")
const CONTENT_ROOT = path.join(STATIC_ROOT, "content")
const PAGES_ROOT = path.join(CONTENT_ROOT, "pages")
const JOURNAL_ROOT = path.join(CONTENT_ROOT, "journal")
const INTERNAL_HOSTS = new Set(["modernactuary.co.za", "www.modernactuary.co.za"])

interface ContentDocument {
  filePath: string
  route: string
  content: string
  frontmatter: Record<string, unknown>
}

interface Reference {
  kind: "asset" | "link"
  value: string
  line?: number
}

function readContentDocuments(): ContentDocument[] {
  const pageDocuments = fs
    .readdirSync(PAGES_ROOT)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const filePath = path.join(PAGES_ROOT, fileName)
      const parsed = matter(fs.readFileSync(filePath, "utf8"))
      return {
        filePath,
        route: `/${path.basename(fileName, ".md")}`,
        content: parsed.content,
        frontmatter: parsed.data,
      }
    })

  const journalDocuments = fs
    .readdirSync(JOURNAL_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const filePath = path.join(JOURNAL_ROOT, entry.name, "index.md")
      const parsed = matter(fs.readFileSync(filePath, "utf8"))
      return {
        filePath,
        route: `/journal/${entry.name}`,
        content: parsed.content,
        frontmatter: parsed.data,
      }
    })

  return [...pageDocuments, ...journalDocuments]
}

function extractReferences(document: ContentDocument): Reference[] {
  const references: Reference[] = []
  const tree = unified().use(remarkParse).parse(document.content)

  visit(tree, "image", (node: Image) => {
    references.push({
      kind: "asset",
      value: node.url,
      line: node.position?.start.line,
    })
  })

  visit(tree, "link", (node: Link) => {
    references.push({
      kind: "link",
      value: node.url,
      line: node.position?.start.line,
    })
  })

  visit(tree, "html", (node) => {
    const html = typeof node.value === "string" ? node.value : ""
    const line = node.position?.start.line
    const attributePattern = /\b(href|src)\s*=\s*["']([^"']+)["']/gi

    for (const match of html.matchAll(attributePattern)) {
      references.push({
        kind: match[1].toLowerCase() === "src" ? "asset" : "link",
        value: match[2],
        line,
      })
    }
  })

  const deprecationNote = document.frontmatter.deprecation_note
  if (typeof deprecationNote === "string") {
    const tree = unified().use(remarkParse).parse(deprecationNote)
    visit(tree, "link", (node: Link) => {
      references.push({ kind: "link", value: node.url })
    })
  }

  const image = document.frontmatter.image
  if (typeof image === "string") {
    references.push({ kind: "asset", value: image })
  }

  return references
}

function isExternalReference(value: string): boolean {
  const trimmedValue = value.trim()

  if (
    trimmedValue.startsWith("#") ||
    trimmedValue.startsWith("mailto:") ||
    trimmedValue.startsWith("tel:") ||
    trimmedValue.startsWith("data:")
  ) {
    return true
  }

  try {
    const url = new URL(trimmedValue, "http://localhost")

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return true
    }

    return url.origin !== "http://localhost" && !INTERNAL_HOSTS.has(url.hostname)
  } catch {
    return false
  }
}

function parseReferenceUrl(value: string, document: ContentDocument): URL {
  return new URL(value.trim(), `http://localhost${document.route}`)
}

function normaliseRoute(route: string): string {
  const decodedRoute = decodeURIComponent(route)
  if (decodedRoute === "/") return decodedRoute
  return decodedRoute.replace(/\/$/, "")
}

function getContentRoutes(documents: ContentDocument[]): Set<string> {
  return new Set(["/", "/archive", ...documents.map((document) => document.route)])
}

function getAssetPath(value: string, document: ContentDocument): string {
  const trimmedValue = value.trim()
  const url = parseReferenceUrl(trimmedValue, document)

  if (trimmedValue.startsWith("/") || url.origin !== "http://localhost") {
    return path.resolve(STATIC_ROOT, decodeURIComponent(url.pathname.slice(1)))
  }

  const assetPath = trimmedValue.split(/[?#]/, 1)[0]
  return path.resolve(path.dirname(document.filePath), decodeURIComponent(assetPath))
}

function describeReference(document: ContentDocument, reference: Reference): string {
  const location = reference.line ? `:${reference.line}` : ""
  return `${path.relative(process.cwd(), document.filePath)}${location} -> ${reference.value}`
}

describe("content references", () => {
  const documents = readContentDocuments()
  const routes = getContentRoutes(documents)

  it("only uses internal links that resolve to application routes", () => {
    const brokenLinks = documents.flatMap((document) =>
      extractReferences(document)
        .filter((reference) => reference.kind === "link" && !isExternalReference(reference.value))
        .filter((reference) => {
          const url = parseReferenceUrl(reference.value, document)
          return !routes.has(normaliseRoute(url.pathname))
        })
        .map((reference) => describeReference(document, reference)),
    )

    assert.deepEqual(brokenLinks, [])
  })

  it("only uses local assets that exist", () => {
    const missingAssets = documents.flatMap((document) =>
      extractReferences(document)
        .filter((reference) => reference.kind === "asset" && !isExternalReference(reference.value))
        .filter((reference) => {
          const assetPath = getAssetPath(reference.value, document)
          const relativeAssetPath = path.relative(STATIC_ROOT, assetPath)
          return relativeAssetPath.startsWith("..") || !fs.existsSync(assetPath)
        })
        .map((reference) => describeReference(document, reference)),
    )

    assert.deepEqual(missingAssets, [])
  })
})
