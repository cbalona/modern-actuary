<script lang='ts'>
  import type { PageData } from './$types'
  import { formatDate } from '$lib/utils'
  import { Pin } from 'lucide-svelte'

  const { data }: { data: PageData } = $props()
</script>

<svelte:head>
  <title>ModernActuary - A Journal</title>
  <meta name='description' content='Technical insights on actuarial science, data science, and modern software development.' />
</svelte:head>

<section>
  <header class='mb-8 pb-4 border-gray-200 border-b'>
    <h1 class='font-semibold text-3xl md:text-4xl tracking-tight'>
      The Journal
    </h1>
    <a href='/archive' class='font-sans text-ink-muted hover:text-accent text-base transition-colors'>
      View Archive &rarr;
    </a>
  </header>

  <ul class='space-y-8'>
    {#if data.journalEntries.length > 0}
      {#each data.journalEntries as entry}
        <li>
          <a href='journal/{entry.slug}' class='group block'>
            <h2 class='font-semibold group-hover:text-accent text-2xl transition-colors'>
              {entry.metadata.title}
            </h2>
            <div class='flex items-center gap-2 mt-2'>
              {#if entry.metadata.pinned}
                <Pin class='size-4 text-accent' />
              {/if}
              <p class='font-sans text-ink-muted text-sm'>
                <time datetime={entry.metadata.date.toISOString()}>
                  {formatDate(entry.metadata.date)}
                </time>
              </p>
              {#if entry.isRecentlyUpdated}
                <span
                  class='bg-gray-400/10 px-2 py-1 rounded-full font-semibold text-accent text-xs uppercase tracking-wider'
                >Updated</span
                >
              {/if}
            </div>
            <p class='mt-3 text-base leading-relaxed'>
              {entry.metadata.description}
            </p>
          </a>
        </li>
      {/each}
    {:else}
      <li>
        <p class='text-ink-muted'>There are no journal entries yet.</p>
      </li>
    {/if}
  </ul>
</section>
