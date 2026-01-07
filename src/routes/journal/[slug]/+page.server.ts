import type { PageServerLoad } from './$types'
import { getJournalEntryBySlug } from '$lib/server/content'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ params }) => {
  const post = await getJournalEntryBySlug(params.slug)

  if (!post) {
    throw error(404, 'Journal entry not found')
  }

  return { post }
}
