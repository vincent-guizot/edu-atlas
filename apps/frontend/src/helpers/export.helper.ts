export function downloadCsv(data: Record<string, any>[], filename: string) {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const rows: string[] = [headers.join(',')];
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const cells: string[] = [];
    for (let j = 0; j < headers.length; j++) {
      const val = row[headers[j]];
      const escaped = ('' + (val ?? '')).replace(/"/g, '""');
      cells.push(`"${escaped}"`);
    }
    rows.push(cells.join(','));
  }
  const blob = new Blob([rows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
