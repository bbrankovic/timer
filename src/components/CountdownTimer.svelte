<script lang="ts">
  import { formatMs } from '../lib/format.ts';
  import { playAlarm } from '../lib/alarm.ts';

  type Phase = 'idle' | 'running' | 'paused' | 'done';

  let phase = $state<Phase>('idle');
  let inputH = $state(0);
  let inputM = $state(0);
  let inputS = $state(10);

  let totalMs = $derived((inputH * 3600 + inputM * 60 + inputS) * 1000);

  // Amount of time left when we last pressed Start/Resume
  let snapshotMs = 0;
  // When we last pressed Start/Resume
  let startTimestamp = 0;
  // What to display
  let displayMs = $state(0);

  let intervalId = 0;

  $effect(() => {
    // Keep display in sync with input while idle
    if (phase === 'idle') displayMs = totalMs;
  });

  function start() {
    snapshotMs = phase === 'paused' ? displayMs : totalMs;
    if (snapshotMs <= 0) return;
    startTimestamp = Date.now();
    phase = 'running';
    intervalId = setInterval(tick, 50);
  }

  function tick() {
    const remaining = snapshotMs - (Date.now() - startTimestamp);
    if (remaining <= 0) {
      displayMs = 0;
      clearInterval(intervalId);
      phase = 'done';
      playAlarm();
    } else {
      displayMs = remaining;
    }
  }

  function pause() {
    clearInterval(intervalId);
    // displayMs is already correct from tick(); snapshot it
    snapshotMs = displayMs;
    phase = 'paused';
  }

  function reset() {
    clearInterval(intervalId);
    phase = 'idle';
    displayMs = totalMs;
    snapshotMs = 0;
  }

  function clamp(val: number, min: number, max: number) {
    return Math.max(min, Math.min(max, val));
  }
</script>

<div class="timer" class:done={phase === 'done'}>
  <div class="display" class:pulse={phase === 'done'}>
    {formatMs(displayMs)}
  </div>

  {#if phase === 'idle' || phase === 'paused'}
    <div class="inputs">
      <label>
        <span>Std</span>
        <input
          type="number" min="0" max="99"
          value={inputH}
          disabled={phase === 'paused'}
          oninput={(e) => { inputH = clamp(parseInt((e.target as HTMLInputElement).value) || 0, 0, 99); }}
        />
      </label>
      <span class="sep">:</span>
      <label>
        <span>Min</span>
        <input
          type="number" min="0" max="59"
          value={inputM}
          disabled={phase === 'paused'}
          oninput={(e) => { inputM = clamp(parseInt((e.target as HTMLInputElement).value) || 0, 0, 59); }}
        />
      </label>
      <span class="sep">:</span>
      <label>
        <span>Sek</span>
        <input
          type="number" min="0" max="59"
          value={inputS}
          disabled={phase === 'paused'}
          oninput={(e) => { inputS = clamp(parseInt((e.target as HTMLInputElement).value) || 0, 0, 59); }}
        />
      </label>
    </div>
  {/if}

  <div class="controls">
    {#if phase === 'idle' || phase === 'paused'}
      <button class="btn primary" onclick={start} disabled={totalMs === 0 && phase === 'idle'}>
        {phase === 'paused' ? 'Weiter' : 'Start'}
      </button>
    {/if}
    {#if phase === 'running'}
      <button class="btn secondary" onclick={pause}>Pause</button>
    {/if}
    {#if phase !== 'idle'}
      <button class="btn ghost" onclick={reset}>Reset</button>
    {/if}
  </div>

  {#if phase === 'done'}
    <p class="done-msg">Zeit abgelaufen!</p>
  {/if}
</div>

<style>
  .timer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .display {
    font-size: clamp(3rem, 10vw, 6rem);
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.05em;
    font-weight: 300;
    color: var(--color-text);
    transition: color 0.3s;
  }

  .done .display {
    color: var(--color-alarm);
  }

  .pulse {
    animation: pulse 0.8s ease-in-out infinite alternate;
  }

  @keyframes pulse {
    from { opacity: 1; }
    to { opacity: 0.4; }
  }

  .inputs {
    display: flex;
    align-items: flex-end;
    gap: 0.25rem;
  }

  .inputs label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .inputs span {
    font-size: 0.75rem;
    color: var(--color-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .inputs input {
    width: 4rem;
    text-align: center;
    font-size: 1.5rem;
    padding: 0.4rem 0.25rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background: var(--color-surface);
    color: var(--color-text);
    font-variant-numeric: tabular-nums;
  }

  .inputs input:disabled {
    opacity: 0.5;
  }

  .sep {
    font-size: 1.5rem;
    margin-bottom: 0.35rem;
    color: var(--color-muted);
  }

  .controls {
    display: flex;
    gap: 0.75rem;
  }

  .done-msg {
    font-size: 1.1rem;
    color: var(--color-alarm);
    font-weight: 500;
  }
</style>
