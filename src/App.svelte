<script lang="ts">
  import CountdownTimer from './components/CountdownTimer.svelte';
  import Stopwatch from './components/Stopwatch.svelte';

  type Mode = 'timer' | 'stopwatch';
  let mode = $state<Mode>('timer');
</script>

<main>
  <div class="tabs" role="tablist">
    <button
      role="tab"
      aria-selected={mode === 'timer'}
      class:active={mode === 'timer'}
      onclick={() => (mode = 'timer')}
    >
      Timer
    </button>
    <button
      role="tab"
      aria-selected={mode === 'stopwatch'}
      class:active={mode === 'stopwatch'}
      onclick={() => (mode = 'stopwatch')}
    >
      Stoppuhr
    </button>
  </div>

  <section class="panel" role="tabpanel">
    {#if mode === 'timer'}
      <CountdownTimer />
    {:else}
      <Stopwatch />
    {/if}
  </section>
</main>

<style>
  :global(*, *::before, *::after) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :global(:root) {
    --color-bg: #0f1117;
    --color-surface: #1a1d27;
    --color-border: #2d3149;
    --color-text: #e8eaf0;
    --color-muted: #6b7280;
    --color-accent: #6366f1;
    --color-accent-hover: #818cf8;
    --color-alarm: #f87171;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }

  :global(body) {
    background: var(--color-bg);
    color: var(--color-text);
    min-height: 100dvh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 2rem 1rem;
  }

  :global(.btn) {
    padding: 0.6rem 1.4rem;
    border: none;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, opacity 0.15s;
  }

  :global(.btn:disabled) {
    opacity: 0.4;
    cursor: not-allowed;
  }

  :global(.btn.primary) {
    background: var(--color-accent);
    color: #fff;
  }

  :global(.btn.primary:hover:not(:disabled)) {
    background: var(--color-accent-hover);
  }

  :global(.btn.secondary) {
    background: var(--color-surface);
    color: var(--color-text);
    border: 1px solid var(--color-border);
  }

  :global(.btn.secondary:hover) {
    border-color: var(--color-accent);
    color: var(--color-accent-hover);
  }

  :global(.btn.ghost) {
    background: transparent;
    color: var(--color-muted);
    border: 1px solid var(--color-border);
  }

  :global(.btn.ghost:hover) {
    color: var(--color-text);
    border-color: var(--color-muted);
  }

  main {
    width: 100%;
    max-width: 560px;
  }

  div.tabs {
    display: flex;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 2.5rem;
  }

  .tabs button {
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--color-muted);
    font-size: 1rem;
    font-weight: 500;
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    margin-bottom: -1px;
    transition: color 0.15s, border-color 0.15s;
  }

  .tabs button.active {
    color: var(--color-text);
    border-bottom-color: var(--color-accent);
  }

  .tabs button:hover:not(.active) {
    color: var(--color-text);
  }

  .panel {
    padding: 0.5rem 0;
  }
</style>
