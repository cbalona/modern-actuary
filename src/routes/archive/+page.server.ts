import type { PageServerLoad } from './$types'
import { getArchivedJournalEntries } from '$lib/server/content'

export const load: PageServerLoad = async () => {
  return { journalEntries: await getArchivedJournalEntries() }
}
