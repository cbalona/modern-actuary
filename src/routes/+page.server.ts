import { getPublishedJournalEntries } from "$lib/server/content";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const journalEntries = await getPublishedJournalEntries();
	// Defines the threshold for displaying the "Updated" tag (one year).
	const oneYearInMs = 365 * 24 * 60 * 60 * 1000;

	const journalEntriesWithUpdateStatus = journalEntries.map((entry) => {
		const isRecentlyUpdated = entry.metadata.updated
			? Date.now() - entry.metadata.updated.getTime() < oneYearInMs
			: false;

		return {
			...entry,
			isRecentlyUpdated,
		};
	});

	return {
		journalEntries: journalEntriesWithUpdateStatus,
	};
};
