<script lang="ts">
import { formatDate } from "$lib/utils";
import type { PageData } from "./$types";

const { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.post.metadata.title} - ModernActuary</title>
  <meta name="description" content={data.post.metadata.description} />
</svelte:head>

<article class="max-w-none prose">
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
</article>
