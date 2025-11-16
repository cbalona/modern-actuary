import fs from "node:fs";
import path from "node:path";
import { transformerCopyButton } from "@rehype-pretty/transformers";
import matter from "gray-matter";
import type { Image } from "mdast";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import type { Plugin } from "unified";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import * as v from "valibot";

const JOURNAL_DIR = "static/content/journal";
const PAGES_DIR = "static/content/pages";

/**
 * A custom Remark plugin to rewrite relative image paths.
 * It prepends the correct path based on the post's slug.
 * e.g., `![alt](./media/image.png)` becomes `![alt](/content/journal/my-slug/media/image.png)`
 */
const remarkRewriteImagePath: Plugin<[{ slug: string }]> = (options) => {
	const slug = options?.slug;
	if (!slug) return;

	return (tree) => {
		visit(tree, "image", (node: Image) => {
			// Only transform relative paths (those not starting with `/` or `http`).
			if (node.url.startsWith("./")) {
				// Construct the new path.
				const newPath = path.join(
					"/content/journal",
					options.slug,
					node.url.replace("./", ""),
				);
				node.url = newPath.replace(/\\/g, "/"); // Ensure forward slashes for URLs.
			}
		});
	};
};

/**
 * Creates a unified processor for simple note content (e.g., deprecation notes).
 * @returns {import('unified').Processor} A configured unified processor instance.
 */
const noteProcessor = unified()
	.use(remarkParse)
	.use(remarkRehype)
	.use(rehypeStringify);

/**
 * Creates a unified processor to transform markdown into HTML.
 * @param {string} slug - The slug of the content being processed, used for path rewriting.
 * @returns {import('unified').Processor} A configured unified processor instance.
 */
function createProcessor(slug: string) {
	return unified()
		.use(remarkParse)
		.use(remarkRewriteImagePath, { slug })
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeSlug)
		.use(rehypeAutolinkHeadings, { behavior: "wrap" })
		.use(rehypePrettyCode, {
			theme: "rose-pine-dawn",
			keepBackground: false,
			transformers: [
				transformerCopyButton({ visibility: "hover", feedbackDuration: 3_000 }),
			],
		})
		.use(rehypeStringify, { allowDangerousHtml: true });
}

// --- Journal Content ---
const changelogEntrySchema = v.object({
	date: v.pipe(
		v.string(),
		v.transform((s) => new Date(s)),
		v.date(),
	),
	description: v.pipe(v.string(), v.trim()),
});

export const journalEntryMetadataSchema = v.object({
	title: v.pipe(v.string(), v.trim()),
	description: v.pipe(v.string(), v.trim()),
	date: v.pipe(
		v.string(),
		v.transform((s) => new Date(s)),
		v.date(),
	),
	updated: v.optional(
		v.pipe(
			v.string(),
			v.transform((s) => new Date(s)),
			v.date(),
		),
	),
	pinned: v.optional(v.boolean(), false),
	archived: v.optional(v.boolean(), false),
	changelog: v.optional(v.array(changelogEntrySchema)),
	deprecated: v.optional(v.boolean(), false),
	deprecation_note: v.optional(v.pipe(v.string(), v.trim())),
});

export type JournalEntryMetadata = v.InferOutput<
	typeof journalEntryMetadataSchema
>;

export interface JournalEntry {
	slug: string;
	metadata: JournalEntryMetadata;
	contentHTML: string;
	deprecationNoteHTML?: string;
	isRecentlyUpdated?: boolean;
}

/**
 * Reads a journal entry file, parses its frontmatter, and compiles the markdown to HTML.
 * @param {string} filePath - The absolute path to the markdown file.
 * @param {string} slug - The slug of the journal entry.
 * @returns {Promise<JournalEntry>} The processed journal entry object.
 */
async function compileJournalEntryFromFile(
	filePath: string,
	slug: string,
): Promise<JournalEntry> {
	const rawContent = fs.readFileSync(filePath, "utf-8");
	const { data, content } = matter(rawContent);

	const metadata = v.parse(journalEntryMetadataSchema, data);

	// Derive the 'updated' date from the changelog if it exists.
	if (metadata.changelog && metadata.changelog.length > 0) {
		const latestChangelogDate = new Date(
			Math.max(...metadata.changelog.map((entry) => entry.date.getTime())),
		);
		metadata.updated = latestChangelogDate;
	}

	const processor = createProcessor(slug);
	const contentHTML = (await processor.process(content)).toString();

	const deprecationNoteHTML = metadata.deprecation_note
		? (await noteProcessor.process(metadata.deprecation_note)).toString()
		: undefined;

	return { slug, metadata, contentHTML, deprecationNoteHTML };
}

let allJournalEntries: JournalEntry[] | null = null;

/**
 * Retrieves all journal entries from the filesystem.
 * Results are cached in memory after the first read to improve performance.
 * @returns {Promise<JournalEntry[]>} A promise that resolves to an array of all journal entries.
 */
async function getAllJournalEntries(): Promise<JournalEntry[]> {
	if (allJournalEntries) {
		return allJournalEntries;
	}

	if (!fs.existsSync(JOURNAL_DIR)) {
		allJournalEntries = [];
		return allJournalEntries;
	}

	// Read all items in the journal directory.
	const postDirs = fs.readdirSync(JOURNAL_DIR);

	const entries = await Promise.all(
		postDirs.map(async (dirName) => {
			const dirPath = path.join(JOURNAL_DIR, dirName);
			const filePath = path.join(dirPath, "index.md");

			// Check if it's a directory and contains an index.md file.
			const isDirectory = fs.statSync(dirPath).isDirectory();
			if (isDirectory && fs.existsSync(filePath)) {
				// The directory name is our slug.
				const slug = dirName;
				return compileJournalEntryFromFile(filePath, slug);
			}

			return null;
		}),
	);

	// Filter out any null values (for items that were not valid post directories).
	allJournalEntries = entries.filter(
		(entry): entry is JournalEntry => entry !== null,
	);
	return allJournalEntries;
}
/**
 * Reads all non-archived journal entries, processes them, and sorts them.
 * Pinned posts appear first, followed by others sorted by date.
 */
export async function getPublishedJournalEntries(): Promise<JournalEntry[]> {
	const entries = await getAllJournalEntries();
	return entries
		.filter((entry) => !entry.metadata.archived)
		.sort((a, b) => {
			if (a.metadata.pinned && !b.metadata.pinned) return -1;
			if (!a.metadata.pinned && b.metadata.pinned) return 1;
			return b.metadata.date.getTime() - a.metadata.date.getTime();
		});
}

/**
 * Retrieves all archived journal entries, sorted by most recent date first.
 * @returns {Promise<JournalEntry[]>} A promise that resolves to an array of archived journal entries.
 */
export async function getArchivedJournalEntries(): Promise<JournalEntry[]> {
	const entries = await getAllJournalEntries();
	return entries
		.filter((entry) => entry.metadata.archived)
		.sort((a, b) => b.metadata.date.getTime() - a.metadata.date.getTime());
}

let entriesBySlug: Map<string, JournalEntry> | null = null;

/**
 * Retrieves a single journal entry by its slug.
 * Uses an in-memory map for efficient lookups after the initial population.
 * @param {string} slug - The slug of the journal entry to retrieve.
 * @returns {Promise<JournalEntry | undefined>} The journal entry, or undefined if not found.
 */
export async function getJournalEntryBySlug(
	slug: string,
): Promise<JournalEntry | undefined> {
	if (!entriesBySlug) {
		const allEntries = await getAllJournalEntries();
		entriesBySlug = new Map(allEntries.map((p) => [p.slug, p]));
	}
	return entriesBySlug.get(slug);
}

// --- Page Content ---
export const pageMetadataSchema = v.object({
	title: v.pipe(v.string(), v.trim()),
});

export type PageMetadata = v.InferOutput<typeof pageMetadataSchema>;
export interface Page {
	metadata: PageMetadata;
	contentHTML: string;
}

/**
 * Retrieves and compiles a static page from a markdown file.
 * @param {string} slug - The slug of the page, corresponding to its filename (e.g., "about").
 * @returns {Promise<Page | undefined>} The compiled page, or undefined if the file does not exist.
 */
export async function getPage(slug: string): Promise<Page | undefined> {
	const filePath = path.join(PAGES_DIR, `${slug}.md`);

	if (!fs.existsSync(filePath)) {
		return undefined;
	}

	const rawContent = fs.readFileSync(filePath, "utf-8");
	const { data, content } = matter(rawContent);

	const metadata = v.parse(pageMetadataSchema, data);
	const processor = createProcessor(slug);
	const contentHTML = (await processor.process(content)).toString();

	return { metadata, contentHTML };
}
