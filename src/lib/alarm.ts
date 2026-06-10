export function playAlarm(): void {
  const ctx = new AudioContext();
  const beeps = 3;
  const onMs = 200;
  const offMs = 100;

  for (let i = 0; i < beeps; i++) {
    const start = ctx.currentTime + i * (onMs + offMs) / 1000;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.6, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + onMs / 1000);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + onMs / 1000);
  }

  setTimeout(() => ctx.close(), beeps * (onMs + offMs) + 500);
}
