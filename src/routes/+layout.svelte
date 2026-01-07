<script lang='ts'>
  import type { Snippet } from 'svelte'
  import '../app.css'

  interface Props {
    children: Snippet
  }

  const { children }: Props = $props()
</script>

<div class='flex flex-col min-h-screen'>
  <header class='mx-auto px-4 py-8 md:py-12 w-full max-w-3xl'>
    <div class='flex justify-between items-baseline'>
      <a href='/' class='font-semibold hover:text-accent text-xl transition-colors'>
        ModernActuary
      </a>
      <nav class='space-x-6 font-sans text-base'>
        <a href='/' class='hover:text-accent transition-colors'>Journal</a>
        <a href='/about' class='hover:text-accent transition-colors'>About</a>
        <a href='/projects' class='hover:text-accent transition-colors'>Projects</a>
      </nav>
    </div>
  </header>

  <main class='mx-auto px-4 w-full max-w-3xl grow'>
    {@render children()}
  </main>

  <footer class='mx-auto px-4 py-8 w-full max-w-2xl font-sans text-ink-muted text-sm text-center'>
    <p>{new Date().getFullYear()} / <a href='https://www.linkedin.com/in/cbalona/' target='_blank' rel='noopener noreferrer'>Caesar Balona</a></p>
  </footer>
</div>
