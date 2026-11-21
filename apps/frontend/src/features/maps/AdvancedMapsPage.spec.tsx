import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { AdvancedMapsPage } from './AdvancedMapsPage';

// Mock react-router-dom useOutletContext
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useOutletContext: () => ({
      period: '2026',
      setPeriod: vi.fn(),
    }),
  };
});

// Mock ResponsiveContainer for recharts
vi.mock('recharts', async () => {
  const actual = await vi.importActual('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }: any) => (
      <div style={{ width: 300, height: 200 }}>{children}</div>
    ),
  };
});

describe('AdvancedMapsPage Component', () => {
  it('should render page header, top 2 cards, category pills, and initial map state without immediate popup', () => {
    render(
      <MemoryRouter>
        <AdvancedMapsPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Advanced Maps')).toBeInTheDocument();

    // Top 2 cards
    const ringkasanCard = screen.getByTestId('ringkasan-nasional-card');
    expect(within(ringkasanCard).getByText('Ringkasan Nasional')).toBeInTheDocument();
    expect(within(ringkasanCard).getByText('Total Sekolah')).toBeInTheDocument();
    expect(within(ringkasanCard).getByText('125.482')).toBeInTheDocument();

    const top5Card = screen.getByTestId('top-5-provinsi-card');
    expect(within(top5Card).getByText('Top 5 Provinsi (Jumlah Sekolah)')).toBeInTheDocument();
    expect(within(top5Card).getByText('Jawa Barat')).toBeInTheDocument();

    // Category pills
    expect(screen.getByTestId('category-Choropleth')).toBeInTheDocument();
    expect(screen.getByTestId('category-Heatmap')).toBeInTheDocument();

    // Verify detail popup is NOT shown initially
    expect(screen.queryByTestId('island-detail-card')).not.toBeInTheDocument();

    // Verify initial hint is present
    expect(
      screen.getByText(/Klik salah satu pulau pada peta untuk melihat detail data analitik/i),
    ).toBeInTheDocument();
  });

  it('should display single top-right detail popup when an island is clicked, and close on close button', () => {
    render(
      <MemoryRouter>
        <AdvancedMapsPage />
      </MemoryRouter>,
    );

    // Click Jawa island path on the SVG map
    const mapSvg = screen.getByRole('img', { name: /Peta Indonesia/i });
    const paths = mapSvg.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);

    // Fire click on first path (Sumatera) or Jawa path
    fireEvent.click(paths[0]);

    // Detail popup should appear in top-right
    const detailCard = screen.getByTestId('island-detail-card');
    expect(detailCard).toBeInTheDocument();
    expect(detailCard).toHaveTextContent(/Wilayah Geospasial/i);
    expect(detailCard).toHaveTextContent(/Total Sekolah/i);

    // Click close button
    const closeBtn = screen.getByRole('button', { name: /Tutup Detail/i });
    fireEvent.click(closeBtn);

    // Detail popup should be dismissed
    expect(screen.queryByTestId('island-detail-card')).not.toBeInTheDocument();
  });

  it('should update metric selector and legend', () => {
    render(
      <MemoryRouter>
        <AdvancedMapsPage />
      </MemoryRouter>,
    );

    const metricSelect = screen.getByRole('combobox', { name: /Pilih Metrik Peta/i });
    expect(metricSelect).toHaveValue('sekolah');

    fireEvent.change(metricSelect, { target: { value: 'siswa' } });
    expect(metricSelect).toHaveValue('siswa');

    // Legend updates
    expect(screen.getByText(/Tingkat Kepadatan: Jumlah Siswa/i)).toBeInTheDocument();
  });

  it('should render unchanged bottom 3 cards (Heatmap, Comparison, Radius)', () => {
    render(
      <MemoryRouter>
        <AdvancedMapsPage />
      </MemoryRouter>,
    );

    // 1. Heatmap Card
    const heatmapCard = screen.getByTestId('heatmap-card');
    expect(within(heatmapCard).getByText('Heatmap Kepadatan Sekolah')).toBeInTheDocument();

    // 2. Comparison Card
    const comparisonCard = screen.getByTestId('comparison-card');
    expect(within(comparisonCard).getByText('Perbandingan Antar Provinsi')).toBeInTheDocument();

    // 3. Radius Card
    const radiusCard = screen.getByTestId('radius-card');
    expect(within(radiusCard).getByText('Analisis Radius')).toBeInTheDocument();
    expect(within(radiusCard).getByRole('combobox', { name: /Pusat Radius/i })).toBeInTheDocument();
    expect(within(radiusCard).getByRole('combobox', { name: /Jarak Radius/i })).toBeInTheDocument();
  });
});
