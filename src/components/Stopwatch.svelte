<script lang="ts">
  import { formatMsDetailed } from '../lib/format.ts';

  type Lap = { total: number; delta: number };

  let running = $state(false);
  let elapsedMs = $state(0);
  let laps = $state<Lap[]>([]);

  let startTimestamp = 0;
  let baseMs = 0;
  let intervalId = 0;

  function start() {
    startTimestamp = Date.now();
    running = true;
    intervalId = setInterval(() => {
      elapsedMs = baseMs + (Date.now() - startTimestamp);
    }, 30);
  }

  function stop() {
    clearInterval(intervalId);
    baseMs = elapsedMs;
    running = false;
  }

  function lap() {
    if (!running) return;
    const prev = laps.length > 0 ? laps[laps.length - 1].total : 0;
    laps = [...laps, { total: elapsedMs, delta: elapsedMs - prev }];
  }

  function reset() {
    clearInterval(intervalId);
    running = false;
    elapsedMs = 0;
    baseMs = 0;
    laps = [];
  }
</script>

<div class="stopwatch">
  <div class="display">
    {formatMsDetailed(elapsedMs)}
  </div>

  <div class="controls">
    {#if !running}
      <button class="btn primary" onclick={start}>Start</button>
    {:else}
      <button class="btn secondary" onclick={stop}>Stop</button>
      <button class="btn ghost" onclick={lap}>Runde</button>
    {/if}
    {#if elapsedMs > 0 && !running}
      <button class="btn ghost" onclick={reset}>Reset</button>
    {/if}
  </div>

  {#if laps.length > 0}
    <div class="laps">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Runde</th>
            <th>Gesamt</th>
          </tr>
        </thead>
        <tbody>
          {#each laps as lap, i (i)}
            <tr>
              <td class="lap-num">{i + 1}</td>
              <td class="lap-delta">{formatMsDetailed(lap.delta)}</td>
              <td class="lap-total">{formatMsDetailed(lap.total)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .stopwatch {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
  }

  .display {
    font-size: clamp(3rem, 10vw, 6rem);
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.05em;
    font-weight: 300;
    color: var(--color-text);
  }

  .controls {
    display: flex;
    gap: 0.75rem;
  }

  .laps {
    width: 100%;
    max-width: 480px;
    overflow-y: auto;
    max-height: 320px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
  }

  th {
    text-align: left;
    padding: 0.4rem 0.75rem;
    color: var(--color-muted);
    font-weight: 500;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid var(--color-border);
  }

  td {
    padding: 0.5rem 0.75rem;
    font-variant-numeric: tabular-nums;
    border-bottom: 1px solid var(--color-border);
  }

  .lap-num {
    color: var(--color-muted);
    width: 2rem;
  }

  .lap-delta {
    font-weight: 500;
  }

  .lap-total {
    color: var(--color-muted);
  }
</style>
