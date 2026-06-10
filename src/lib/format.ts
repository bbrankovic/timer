export function formatMs(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function formatMsDetailed(ms: number): string {
  const clamped = Math.max(0, ms);
  const total = Math.floor(clamped / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const centis = Math.floor((clamped % 1000) / 10);
  return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(centis)}`;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}
