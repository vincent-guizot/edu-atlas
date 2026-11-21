import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { InteractiveMapsPage } from './InteractiveMapsPage';

// Mock react-leaflet for jsdom
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children, eventHandlers }: any) => (
    <div data-testid="map-marker" onClick={eventHandlers?.click}>
      {children}
    </div>
  ),
  Popup: ({ children }: any) => <div data-testid="map-popup">{children}</div>,
}));

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

describe('InteractiveMapsPage Component', () => {
  it('should render header, category filter pills, map and initial hint without immediate detail popup', () => {
    render(
      <MemoryRouter>
        <InteractiveMapsPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Interactive Maps')).toBeInTheDocument();

    // Verify category pills are rendered
    expect(screen.getByTestId('tab-Semua')).toBeInTheDocument();
    expect(screen.getByTestId('tab-Sekolah Dasar')).toBeInTheDocument();
    expect(screen.getByTestId('tab-SMP')).toBeInTheDocument();
    expect(screen.getByTestId('tab-SMA')).toBeInTheDocument();
    expect(screen.getByTestId('tab-SMK')).toBeInTheDocument();
    expect(screen.getByTestId('tab-Universitas')).toBeInTheDocument();

    // Verify detail popup card is NOT rendered initially
    expect(screen.queryByTestId('selected-institution-card')).not.toBeInTheDocument();

    // Verify initial helpful hint is shown
    expect(
      screen.getByText(/Klik penanda institusi pada peta atau baris tabel untuk melihat detail/i),
    ).toBeInTheDocument();
  });

  it('should display detail popup when a map marker or table row is clicked, and close on close button', () => {
    render(
      <MemoryRouter>
        <InteractiveMapsPage />
      </MemoryRouter>,
    );

    // Click first institution in the table (SMA Negeri 1 Bandung)
    const institutionCells = screen.getAllByText('SMA Negeri 1 Bandung');
    fireEvent.click(institutionCells[0]);

    // Now selected-institution-card should be visible
    const card = screen.getByTestId('selected-institution-card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent('SMA Negeri 1 Bandung');
    expect(card).toHaveTextContent('Kota Bandung, Jawa Barat');

    // Click close button
    const closeBtn = screen.getByRole('button', { name: /Tutup Detail/i });
    fireEvent.click(closeBtn);

    // Card should be dismissed
    expect(screen.queryByTestId('selected-institution-card')).not.toBeInTheDocument();
  });

  it('should filter table and markers when category tabs are clicked', () => {
    render(
      <MemoryRouter>
        <InteractiveMapsPage />
      </MemoryRouter>,
    );

    // Click 'Universitas' tab
    const univTab = screen.getByTestId('tab-Universitas');
    fireEvent.click(univTab);

    // Check table headers & contents
    expect(screen.getAllByText('Institut Teknologi Bandung').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Universitas Indonesia').length).toBeGreaterThan(0);

    // SMA Negeri 1 Bandung should no longer be in the filtered list
    expect(screen.queryByText('SMA Negeri 1 Bandung')).not.toBeInTheDocument();
  });

  it('should support pagination in the bottom table', () => {
    render(
      <MemoryRouter>
        <InteractiveMapsPage />
      </MemoryRouter>,
    );

    // Total institutions is 16, page size is 5 -> 4 pages
    expect(screen.getByTestId('pagination-info')).toHaveTextContent(/Menampilkan 1 – 5 dari 16 institusi/i);

    // Page 1 should contain SMA Negeri 1 Bandung
    expect(screen.getAllByText('SMA Negeri 1 Bandung').length).toBeGreaterThan(0);

    // Click 'Selanjutnya' to go to Page 2
    const nextBtn = screen.getByRole('button', { name: /Selanjutnya/i });
    fireEvent.click(nextBtn);

    expect(screen.getByTestId('pagination-info')).toHaveTextContent(/Menampilkan 6 – 10 dari 16 institusi/i);

    // Page 2 should contain Politeknik Manufaktur Bandung
    expect(screen.getAllByText('Politeknik Manufaktur Bandung').length).toBeGreaterThan(0);

    // Click page 3 button directly
    const page3Btn = screen.getByRole('button', { name: '3' });
    fireEvent.click(page3Btn);

    expect(screen.getByTestId('pagination-info')).toHaveTextContent(/Menampilkan 11 – 15 dari 16 institusi/i);
  });

  it('should switch Sebaran Sekolah Pie Chart scope between Provinsi and Pulau', () => {
    render(
      <MemoryRouter>
        <InteractiveMapsPage />
      </MemoryRouter>,
    );

    const sebaranCard = screen.getByTestId('sebaran-card');

    // Initially on Provinsi
    expect(within(sebaranCard).getByText('Sebaran Sekolah per Wilayah')).toBeInTheDocument();
    expect(within(sebaranCard).getByText('Jawa Barat')).toBeInTheDocument();
    expect(within(sebaranCard).getByText('Jawa Timur')).toBeInTheDocument();

    // Click 'Pulau' button inside sebaranCard
    const pulauBtn = within(sebaranCard).getByRole('button', { name: 'Pulau' });
    fireEvent.click(pulauBtn);

    // Should now display island statistics in the legend
    expect(within(sebaranCard).getByText('Pulau Jawa')).toBeInTheDocument();
    expect(within(sebaranCard).getByText('Pulau Sumatera')).toBeInTheDocument();
    expect(within(sebaranCard).getByText('Pulau Sulawesi')).toBeInTheDocument();
  });
});
