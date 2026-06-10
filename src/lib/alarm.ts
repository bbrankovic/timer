const BEEP_ON_MS = 180;
const BEEP_OFF_MS = 820;

function beep(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = 880;
  osc.type = 'sine';
  gain.gain.setValueAtTime(0.6, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + BEEP_ON_MS / 1000);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + BEEP_ON_MS / 1000);
}

export function playAlarm(): () => void {
  const ctx = new AudioContext();
  beep(ctx);
  const id = setInterval(() => beep(ctx), BEEP_ON_MS + BEEP_OFF_MS);

  return () => {
    clearInterval(id);
    ctx.close();
  };
}
