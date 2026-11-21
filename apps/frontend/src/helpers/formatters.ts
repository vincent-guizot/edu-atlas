export { formatNumber, formatCompactNumber, formatPercent, formatDate } from '../lib/formatters';

export function formatCurrencyId(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return 'Rp0';
  return `Rp${amount.toLocaleString('id-ID')}`;
}

export function formatRatioId(ratio: number | null | undefined): string {
  if (!ratio) return '0 : 1';
  return `${ratio.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} : 1`;
}
