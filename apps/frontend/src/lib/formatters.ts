export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return '0';
  return num.toLocaleString('id-ID');
}

export function formatCompactNumber(num: number | null | undefined): string {
  if (!num) return '0';
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + ' Jt';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + ' Rb';
  }
  return num.toString();
}

export function formatPercent(num: number | null | undefined): string {
  if (num === null || num === undefined) return '0%';
  return `${num.toFixed(1)}%`;
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}
