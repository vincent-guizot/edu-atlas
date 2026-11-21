import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { DataTablePage, INSTITUTIONS_DATASET } from './DataTablePage';

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

describe('DataTablePage (Data Explorer) Component', () => {
  const renderComponent = () =>
    render(
      <MemoryRouter>
        <DataTablePage />
      </MemoryRouter>,
    );

  it('should render header, KPI cards, category pills, filter inputs, table, and pagination', () => {
    renderComponent();

    // Verify Title & Subtitle
    expect(screen.getByText('Data Table (Data Explorer)')).toBeInTheDocument();

    // Verify Top KPI cards
    expect(screen.getByText('Total Sekolah')).toBeInTheDocument();
    expect(screen.getByText('Total Siswa')).toBeInTheDocument();
    expect(screen.getByText('Total Guru')).toBeInTheDocument();
    expect(screen.getByText('Total Universitas')).toBeInTheDocument();
    expect(screen.getByText('Distribusi Jenjang')).toBeInTheDocument();

    // Verify Category Pills
    expect(screen.getByTestId('cat-tab-Semua Jenjang')).toBeInTheDocument();
    expect(screen.getByTestId('cat-tab-SD')).toBeInTheDocument();
    expect(screen.getByTestId('cat-tab-SMP')).toBeInTheDocument();
    expect(screen.getByTestId('cat-tab-SMA')).toBeInTheDocument();
    expect(screen.getByTestId('cat-tab-SMK')).toBeInTheDocument();
    expect(screen.getByTestId('cat-tab-Universitas')).toBeInTheDocument();

    // Verify Search input
    expect(screen.getByTestId('search-input')).toBeInTheDocument();

    // Verify Initial Page text (e.g., 1–10 of 34)
    expect(screen.getByTestId('table-info-top')).toHaveTextContent(
      `Menampilkan 1–10 dari ${INSTITUTIONS_DATASET.length} data`,
    );

    // Verify initial pagination buttons
    expect(screen.getByTestId('btn-page-1')).toBeInTheDocument();
    expect(screen.getByTestId('btn-page-2')).toBeInTheDocument();
  });

  it('should filter table rows when searching by school name, city, or NPSN', () => {
    renderComponent();

    const searchInput = screen.getByTestId('search-input');

    // Search "Surabaya"
    fireEvent.change(searchInput, { target: { value: 'Surabaya' } });

    // Should find SMAN 5 Surabaya and SMPN 1 Surabaya
    expect(screen.getByText('SMAN 5 Surabaya')).toBeInTheDocument();
    expect(screen.getByText('SMPN 1 Surabaya')).toBeInTheDocument();
    // Should NOT show Bandung schools
    expect(screen.queryByText('SMA Negeri 1 Bandung')).not.toBeInTheDocument();

    // Verify Search tag is displayed
    expect(screen.getByTestId('tag-search')).toBeInTheDocument();
    expect(screen.getByText('Cari: "Surabaya"')).toBeInTheDocument();

    // Search by NPSN
    fireEvent.change(searchInput, { target: { value: '20100107' } }); // SMAN 8 Jakarta
    expect(screen.getByText('SMAN 8 Jakarta')).toBeInTheDocument();
    expect(screen.queryByText('SMAN 5 Surabaya')).not.toBeInTheDocument();
  });

  it('should filter by Category Pills and sync with Jenjang select', () => {
    renderComponent();

    // Click 'Universitas' pill
    const univPill = screen.getByTestId('cat-tab-Universitas');
    fireEvent.click(univPill);

    // Should show Universities
    expect(screen.getByText('Universitas Indonesia')).toBeInTheDocument();
    expect(screen.getByText('Institut Teknologi Bandung')).toBeInTheDocument();
    expect(screen.getByText('Universitas Gadjah Mada')).toBeInTheDocument();
    // Should NOT show SMA or SD
    expect(screen.queryByText('SMA Negeri 1 Bandung')).not.toBeInTheDocument();

    // Verify Jenjang select value is updated to 'Universitas'
    const levelSelect = screen.getByTestId('filter-level') as HTMLSelectElement;
    expect(levelSelect.value).toBe('Universitas');

    // Click 'SD' pill
    const sdPill = screen.getByTestId('cat-tab-SD');
    fireEvent.click(sdPill);
    expect(screen.getByText('SD Negeri Menteng 01')).toBeInTheDocument();
    expect(screen.queryByText('Universitas Indonesia')).not.toBeInTheDocument();
  });

  it('should filter by dropdown selectors: Provinsi, Status, and Akreditasi', () => {
    renderComponent();

    // Filter Provinsi: 'DKI Jakarta'
    const provSelect = screen.getByTestId('filter-prov');
    fireEvent.change(provSelect, { target: { value: 'DKI Jakarta' } });

    expect(screen.getByText('SMAN 8 Jakarta')).toBeInTheDocument();
    expect(screen.getByText('SD Negeri Menteng 01')).toBeInTheDocument();
    expect(screen.queryByText('SMA Negeri 1 Bandung')).not.toBeInTheDocument();

    // Filter Status: 'Swasta' in DKI Jakarta
    const statusSelect = screen.getByTestId('filter-status');
    fireEvent.change(statusSelect, { target: { value: 'Swasta' } });

    expect(screen.getByText('SMA Kanisius Jakarta')).toBeInTheDocument();
    expect(screen.queryByText('SMAN 8 Jakarta')).not.toBeInTheDocument();

    // Filter Akreditasi: 'A'
    const accredSelect = screen.getByTestId('filter-accred');
    fireEvent.change(accredSelect, { target: { value: 'A' } });
    expect(screen.getByText('SMA Kanisius Jakarta')).toBeInTheDocument();
  });

  it('should support tag removal and Reset Filter button', () => {
    renderComponent();

    // Set search
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Bandung' } });

    // Set status Swasta
    const statusSelect = screen.getByTestId('filter-status');
    fireEvent.change(statusSelect, { target: { value: 'Swasta' } });

    expect(screen.getByTestId('tag-search')).toBeInTheDocument();
    expect(screen.getByTestId('tag-status')).toBeInTheDocument();

    // Remove search tag
    const removeSearchBtn = screen.getByTestId('remove-tag-search');
    fireEvent.click(removeSearchBtn);

    // Search tag should be gone, search input cleared
    expect(screen.queryByTestId('tag-search')).not.toBeInTheDocument();
    expect((screen.getByTestId('search-input') as HTMLInputElement).value).toBe('');

    // Click "Reset Filter"
    const resetBtn = screen.getByTestId('btn-reset-filters');
    fireEvent.click(resetBtn);

    // All tags removed, all schools restored
    expect(screen.queryByTestId('tag-status')).not.toBeInTheDocument();
    expect(screen.getByTestId('table-info-top')).toHaveTextContent(
      `Menampilkan 1–10 dari ${INSTITUTIONS_DATASET.length} data`,
    );
  });

  it('should support column header sorting and Urutkan menu', () => {
    renderComponent();

    // Click "Nama Institusi" header to sort asc/desc
    const nameTh = screen.getByTestId('th-name');
    fireEvent.click(nameTh); // asc

    // Check first item in table after sorting asc by name
    const rows = screen.getAllByRole('row');
    // First data row (index 1) should be alphabetically first
    expect(rows[1]).toHaveTextContent('Institut Teknologi Bandung');

    // Click again for desc
    fireEvent.click(nameTh);
    const rowsDesc = screen.getAllByRole('row');
    expect(rowsDesc[1]).toHaveTextContent('Universitas Pendidikan Indonesia');

    // Test Urutkan Dropdown Menu
    const sortBtn = screen.getByTestId('btn-sort-menu');
    fireEvent.click(sortBtn);

    expect(screen.getByTestId('sort-dropdown')).toBeInTheDocument();
    const siswaSortOpt = screen.getByText('Siswa Terbanyak');
    fireEvent.click(siswaSortOpt);

    // Highest students: Universitas Gadjah Mada (52.400)
    const rowsSiswaDesc = screen.getAllByRole('row');
    expect(rowsSiswaDesc[1]).toHaveTextContent('Universitas Gadjah Mada');
  });

  it('should support pagination (page navigation and page size change)', () => {
    renderComponent();

    // Page 1 initial
    expect(screen.getByTestId('table-info-top')).toHaveTextContent(
      `Menampilkan 1–10 dari ${INSTITUTIONS_DATASET.length} data`,
    );
    const prevBtn = screen.getByTestId('btn-prev-page');
    expect(prevBtn).toBeDisabled();

    // Click Page 2
    const page2Btn = screen.getByTestId('btn-page-2');
    fireEvent.click(page2Btn);

    expect(screen.getByTestId('table-info-top')).toHaveTextContent(
      `Menampilkan 11–20 dari ${INSTITUTIONS_DATASET.length} data`,
    );
    expect(prevBtn).not.toBeDisabled();

    // Click Next Page (to Page 3)
    const nextBtn = screen.getByTestId('btn-next-page');
    fireEvent.click(nextBtn);
    expect(screen.getByTestId('table-info-top')).toHaveTextContent(
      `Menampilkan 21–30 dari ${INSTITUTIONS_DATASET.length} data`,
    );

    // Change Page Size to 25
    const pageSizeSelect = screen.getByTestId('select-page-size');
    fireEvent.change(pageSizeSelect, { target: { value: '25' } });

    // Resets to Page 1 with 25 items
    expect(screen.getByTestId('table-info-top')).toHaveTextContent(
      `Menampilkan 1–25 dari ${INSTITUTIONS_DATASET.length} data`,
    );
  });

  it('should open Institution Detail Modal on location/detail click and close on close button', () => {
    renderComponent();

    // Find row 1 location button
    const locationBtn = screen.getByTestId('btn-location-1');
    fireEvent.click(locationBtn);

    // Modal should be open
    const modal = screen.getByTestId('institution-detail-modal');
    expect(modal).toBeInTheDocument();
    expect(within(modal).getByText('SMA Negeri 1 Bandung')).toBeInTheDocument();
    expect(within(modal).getByText('Alamat Lengkap')).toBeInTheDocument();
    expect(within(modal).getByText('Drs. H. Hendrayana, M.M.Pd.')).toBeInTheDocument();

    // Click close button
    const closeBtn = screen.getByTestId('btn-close-modal');
    fireEvent.click(closeBtn);

    expect(screen.queryByTestId('institution-detail-modal')).not.toBeInTheDocument();
  });

  it('should support Advanced Filter drawer with minimal siswa filter', () => {
    renderComponent();

    // Click Advanced Filter button
    const advBtn = screen.getByTestId('btn-advanced-filter');
    fireEvent.click(advBtn);

    expect(screen.getByTestId('advanced-filter-panel')).toBeInTheDocument();

    // Set Minimal Siswa to 20000 (only big universities will match)
    const minSiswaInput = screen.getByTestId('input-min-siswa');
    fireEvent.change(minSiswaInput, { target: { value: '20000' } });

    // Should only show universities with >= 20.000 students
    expect(screen.getByText('Universitas Indonesia')).toBeInTheDocument();
    expect(screen.getByText('Institut Teknologi Bandung')).toBeInTheDocument();
    expect(screen.getByText('Universitas Brawijaya')).toBeInTheDocument();
    expect(screen.queryByText('SMA Negeri 1 Bandung')).not.toBeInTheDocument();

    // Advanced tag should be present
    expect(screen.getByTestId('tag-minSiswa')).toBeInTheDocument();
  });
});
