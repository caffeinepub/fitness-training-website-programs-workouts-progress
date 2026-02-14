export function formatTimestamp(timestamp: bigint): string {
  const milliseconds = Number(timestamp / 1_000_000n);
  const date = new Date(milliseconds);
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatApplicationNumber(num: number): string {
  return `APP-${num.toString().padStart(6, '0')}`;
}
