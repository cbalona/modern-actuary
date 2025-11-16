<script lang="ts">
import { formatDate } from "$lib/utils";
import type { PageData } from "./$types";

const { data }: { data: PageData } = $props();

const canonicalUrl = `${data.siteUrl}/journal/${data.post.slug}`;
</script>

<svelte:head>
  <title>{data.post.metadata.title} - ModernActuary</title>
  <meta name="description" content={data.post.metadata.description} />
  <link rel="canonical" href={canonicalUrl} />
  <meta property="og:url" content={canonicalUrl} />
</svelte:head>

<article class="max-w-none prose">

  {#if data.post.metadata.deprecated && data.post.deprecationNoteHTML}
		<div
			class="mb-8 rounded-lg border border-orange-200 bg-orange-50 p-4 text-orange-800"
			role="alert"
		>
			{@html data.post.deprecationNoteHTML}
		</div>
	{/if}

  <header class="mb-8">
    <h1 class="mb-2!">{data.post.metadata.title}</h1>
    <div class="flex items-center gap-2 mt-2 font-sans text-ink-muted text-base">
    {#if data.post.metadata.updated}
      <a href="#changelog" class="hover:text-accent">
        Updated on
        <time datetime={data.post.metadata.updated.toISOString()}>
          {formatDate(data.post.metadata.updated)}
        </time>
      </a>
      <span>/</span>
      <span>
        Published on
        <time datetime={data.post.metadata.date.toISOString()}>
          {formatDate(data.post.metadata.date)}
        </time>
      </span>
    {:else}
      <span>
        Published on
        <time datetime={data.post.metadata.date.toISOString()}>
          {formatDate(data.post.metadata.date)}
        </time>
      </span>
    {/if}
    </div>
  </header>

  {@html data.post.contentHTML}

  {#if data.post.metadata.changelog && data.post.metadata.changelog.length > 0}
		<div id="changelog" class="changelog">
			<h2>Changelog</h2>
			<ul>
				{#each data.post.metadata.changelog as entry}
					<li>
						<strong>{formatDate(entry.date)}:</strong>
						{entry.description}
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</article>
