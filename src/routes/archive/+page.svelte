<script lang="ts">
import { formatDate } from "$lib/utils";
import type { PageData } from "./$types";

const { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Archive - ModernActuary</title>
  <meta name="description" content="Archived journal entries from ModernActuary." />
</svelte:head>

<section>
  <header class="mb-8 pb-4 border-gray-200 border-b">
    <h1 class="font-semibold text-3xl md:text-4xl tracking-tight">
      Archive
    </h1>
    <p class="mt-2 text-ink-muted">Older posts from the journal.</p>
  </header>

  {#if data.journalEntries.length > 0}
    <ul class="space-y-8">
      {#each data.journalEntries as entry}
        <li>
          <a href="/journal/{entry.slug}" class="group block">
            <h2 class="font-semibold group-hover:text-accent text-2xl transition-colors">
              {#if entry.metadata.deprecated}
                <span class="rounded-full bg-orange-200 px-3 py-1 align-middle text-sm font-semibold uppercase tracking-wider text-orange-800">
                  Deprecated
                </span>
              {/if}
              {entry.metadata.title}
              
            </h2>
            <p class="mt-2 font-sans text-ink-muted text-sm">
              <time datetime={entry.metadata.date.toISOString()}>
                {formatDate(entry.metadata.date)}
              </time>
            </p>
            <p class="mt-3 text-base leading-relaxed">
              {entry.metadata.description}
            </p>
          </a>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="text-ink-muted">There are no archived posts yet.</p>
  {/if}
</section>
