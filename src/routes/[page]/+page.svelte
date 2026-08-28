<script lang="ts">
  import type { PageData } from "./$types"

  const { data }: { data: PageData } = $props()
</script>

<svelte:head>
  <title>{data.page.metadata.title} - ModernActuary</title>
</svelte:head>

<article class="prose max-w-none">
  <header class="mb-8 border-b border-gray-200 pb-4">
    <h1 class="mb-0!">{data.page.metadata.title}</h1>
  </header>

  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html data.page.contentHTML}
</article>
