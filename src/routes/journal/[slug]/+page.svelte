<script lang="ts">
  import type { PageData } from "./$types"
  import { formatDate } from "$lib/utils"

  const { data }: { data: PageData } = $props()

  const canonicalUrl = $derived(`${data.siteUrl}/journal/${data.post.slug}`)
</script>

<svelte:head>
  <title>{data.post.metadata.title} - ModernActuary</title>
  <meta name="description" content={data.post.metadata.description} />
  <link rel="canonical" href={canonicalUrl} />

  <!-- Standard Open Graph Requirements -->
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:title" content={data.post.metadata.title} />
  <meta property="og:description" content={data.post.metadata.description} />
  <meta property="og:type" content="article" />

  <!-- Splash Image Meta Tags -->
  {#if data.post.metadata.image}
    <meta property="og:image" content="{data.siteUrl}{data.post.metadata.image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="{data.siteUrl}{data.post.metadata.image}" />
  {/if}
</svelte:head>

<article class="max-w-none prose">
  {#if data.post.metadata.deprecated && data.post.deprecationNoteHTML}
    <div
      class="mb-8 rounded-lg border border-orange-200 bg-orange-50 p-4 text-orange-800"
      role="alert"
    >
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
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

  {#if data.post.metadata.image}
    <img
      src={data.post.metadata.image}
      alt="Splash art for {data.post.metadata.title}"
      class="w-full h-auto aspect-video object-cover rounded-lg mb-8 border border-gray-200"
    />
  {/if}

  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html data.post.contentHTML}

  {#if data.post.metadata.changelog && data.post.metadata.changelog.length > 0}
    <div id="changelog" class="changelog">
      <h2>Changelog</h2>
      <ul>
        {#each data.post.metadata.changelog as entry (entry.date.toISOString())}
          <li>
            <strong>{formatDate(entry.date)}:</strong>
            {entry.description}
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</article>
