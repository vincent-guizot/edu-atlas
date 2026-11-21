import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { AdvancedDataGridPage, ADVANCED_TREE_DATASET } from './AdvancedDataGridPage';

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
      <div style={{ width: 200, height: 200 }}>{children}</div>
    ),
  };
});

describe('AdvancedDataGridPage Component', () => {
  const renderComponent = () =>
    render(
      <MemoryRouter>
        <AdvancedDataGridPage />
      </MemoryRouter>,
    );

  it('should render header, top 5 KPI cards, view tabs, search, filter dropdowns, table, and column drawer', () => {
    renderComponent();

    // Verify Title
    expect(screen.getByText('Advanced Data Grid')).toBeInTheDocument();

    // Verify Top KPI Cards
    expect(screen.getByTestId('kpi-total-sekolah')).toBeInTheDocument();
    expect(screen.getByTestId('kpi-total-siswa')).toBeInTheDocument();
    expect(screen.getByTestId('kpi-total-guru')).toBeInTheDocument();
    expect(screen.getByTestId('kpi-total-univ')).toBeInTheDocument();
    expect(screen.getByText('Distribusi Jenjang')).toBeInTheDocument();

    // Verify View Tabs
    expect(screen.getByTestId('view-tab-data-grid')).toBeInTheDocument();
    expect(screen.getByTestId('view-tab-pivot-view')).toBeInTheDocument();
    expect(screen.getByTestId('view-tab-aggregation')).toBeInTheDocument();
    expect(screen.getByTestId('view-tab-group-analysis')).toBeInTheDocument();
    expect(screen.getByTestId('view-tab-comparison')).toBeInTheDocument();

    // Verify Search and Filters
    expect(screen.getByTestId('grid-search-input')).toBeInTheDocument();
    expect(screen.getByTestId('grid-filter-prov')).toBeInTheDocument();
    expect(screen.getByTestId('grid-filter-city')).toBeInTheDocument();
    expect(screen.getByTestId('grid-filter-level')).toBeInTheDocument();

    // Verify Pagination text
    expect(screen.getByTestId('grid-pagination-info')).toHaveTextContent(
      `Menampilkan 1–5 dari ${ADVANCED_TREE_DATASET.length} data`,
    );

    // Verify Column Customization Drawer
    expect(screen.getByTestId('column-customization-drawer')).toBeInTheDocument();
  });

  it('should filter tree rows when searching by province, city, or school', () => {
    renderComponent();

    const searchInput = screen.getByTestId('grid-search-input');

    // Search "Surabaya"
    fireEvent.change(searchInput, { target: { value: 'Surabaya' } });

    // Should display Jawa Timur (which contains Kota Surabaya)
    expect(screen.getByTestId('row-prov-jawa-timur')).toBeInTheDocument();
    // Should NOT show Bali or Sumatera Utara
    expect(screen.queryByTestId('row-prov-bali')).not.toBeInTheDocument();
    expect(screen.queryByTestId('row-prov-sumatera-utara')).not.toBeInTheDocument();

    // Verify search tag
    expect(screen.getByTestId('grid-tag-search')).toBeInTheDocument();
    expect(screen.getByText('Cari: "Surabaya"')).toBeInTheDocument();

    // Search for a specific school "Menteng"
    fireEvent.change(searchInput, { target: { value: 'Menteng' } });
    expect(screen.getByTestId('row-prov-dki-jakarta')).toBeInTheDocument();
  });

  it('should support tree expansion and collapse (Provinces and Districts)', () => {
    renderComponent();

    // Jawa Barat is expanded by default in initial state -> Kota Bandung and Kota Bekasi exist
    expect(screen.getByTestId('row-dist-kota-bandung')).toBeInTheDocument();

    // Click collapse button on Jawa Barat
    const btnExpandJabar = screen.getByTestId('btn-expand-prov-jawa-barat');
    fireEvent.click(btnExpandJabar);

    // After collapsing, district row should not be in DOM
    expect(screen.queryByTestId('row-dist-kota-bandung')).not.toBeInTheDocument();

    // Click expand all button
    const btnExpandAll = screen.getByTestId('btn-expand-all');
    fireEvent.click(btnExpandAll);

    // Districts on page 1 should now be open
    expect(screen.getByTestId('row-dist-kota-bandung')).toBeInTheDocument();
    expect(screen.getByTestId('row-dist-kota-yogyakarta')).toBeInTheDocument();

    // Click collapse all button
    const btnCollapseAll = screen.getByTestId('btn-collapse-all');
    fireEvent.click(btnCollapseAll);

    // All districts should now be closed
    expect(screen.queryByTestId('row-dist-kota-bandung')).not.toBeInTheDocument();
    expect(screen.queryByTestId('row-dist-kota-yogyakarta')).not.toBeInTheDocument();
  });

  it('should filter by dropdown selectors: Provinsi, Status, and Akreditasi', () => {
    renderComponent();

    // Filter Provinsi: 'DKI Jakarta'
    const provSelect = screen.getByTestId('grid-filter-prov');
    fireEvent.change(provSelect, { target: { value: 'DKI Jakarta' } });

    expect(screen.getByTestId('row-prov-dki-jakarta')).toBeInTheDocument();
    expect(screen.queryByTestId('row-prov-jawa-barat')).not.toBeInTheDocument();

    // Verify province tag
    expect(screen.getByTestId('grid-tag-prov')).toBeInTheDocument();
    expect(screen.getByText('Provinsi: DKI Jakarta')).toBeInTheDocument();

    // Reset filters
    const resetBtn = screen.getByTestId('btn-grid-reset-filters');
    fireEvent.click(resetBtn);

    // Tag should be removed and all provinces restored
    expect(screen.queryByTestId('grid-tag-prov')).not.toBeInTheDocument();
    expect(screen.getByTestId('row-prov-jawa-barat')).toBeInTheDocument();
  });

  it('should support column customization drawer (toggle visibility of columns)', () => {
    renderComponent();

    // Initial state: Jenis and Jumlah Sekolah columns are visible
    expect(screen.getByTestId('th-grid-level')).toBeInTheDocument();
    expect(screen.getByTestId('th-grid-schools')).toBeInTheDocument();

    // Toggle off 'Jenis' (col id: 'level')
    const checkLevel = screen.getByTestId('checkbox-col-level');
    fireEvent.click(checkLevel);

    // 'Jenis' column header should no longer be rendered
    expect(screen.queryByTestId('th-grid-level')).not.toBeInTheDocument();

    // Search column in drawer
    const searchColInput = screen.getByTestId('input-search-columns');
    fireEvent.change(searchColInput, { target: { value: 'Rasio' } });

    // Drawer should show 'Rasio Siswa:Guru' and filter out 'Akreditasi'
    const drawer = screen.getByTestId('column-customization-drawer');
    expect(within(drawer).getByText('Rasio Siswa:Guru')).toBeInTheDocument();
    expect(within(drawer).queryByText('Akreditasi')).not.toBeInTheDocument();

    // Toggle drawer closed
    const closeDrawerBtn = screen.getByTestId('btn-close-column-drawer');
    fireEvent.click(closeDrawerBtn);
    expect(screen.queryByTestId('column-customization-drawer')).not.toBeInTheDocument();

    // Toggle drawer open again
    const toggleDrawerBtn = screen.getByTestId('btn-toggle-column-drawer');
    fireEvent.click(toggleDrawerBtn);
    expect(screen.getByTestId('column-customization-drawer')).toBeInTheDocument();
  });

  it('should support sorting by column header (e.g. Nama and Jumlah Siswa)', () => {
    renderComponent();

    // Click "Nama" header to toggle sort asc -> desc
    const thName = screen.getByTestId('th-grid-name');
    fireEvent.click(thName); // desc

    // First province should be alphabetically last (Sumatera Utara or Sulawesi Selatan)
    const provRowsDesc = screen.getAllByTestId(/^row-prov-/);
    expect(provRowsDesc[0]).toHaveTextContent('Sumatera Utara');

    // Click "Jumlah Siswa" header to sort by students desc
    const thStudents = screen.getByTestId('th-grid-students');
    fireEvent.click(thStudents); // desc

    // Highest students is Jawa Barat (8.421.235)
    const provRowsByStudents = screen.getAllByTestId(/^row-prov-/);
    expect(provRowsByStudents[0]).toHaveTextContent('Jawa Barat');
  });

  it('should support pagination (page 1, page 2, and page size change)', () => {
    renderComponent();

    // Page 1 initial
    expect(screen.getByTestId('grid-pagination-info')).toHaveTextContent(
      `Menampilkan 1–5 dari ${ADVANCED_TREE_DATASET.length} data`,
    );
    const prevBtn = screen.getByTestId('btn-grid-prev');
    expect(prevBtn).toBeDisabled();

    // Click Page 2
    const page2Btn = screen.getByTestId('btn-grid-page-2');
    fireEvent.click(page2Btn);

    expect(screen.getByTestId('grid-pagination-info')).toHaveTextContent(
      `Menampilkan 6–8 dari ${ADVANCED_TREE_DATASET.length} data`,
    );
    expect(prevBtn).not.toBeDisabled();

    // Change page size to 10
    const pageSizeSelect = screen.getByTestId('select-grid-page-size');
    fireEvent.change(pageSizeSelect, { target: { value: '10' } });

    // Should now show 1-8 of 8 on single page
    expect(screen.getByTestId('grid-pagination-info')).toHaveTextContent(
      `Menampilkan 1–8 dari ${ADVANCED_TREE_DATASET.length} data`,
    );
  });

  it('should switch between View Tabs (Data Grid, Pivot View, Aggregation, Group Analysis, Comparison)', () => {
    renderComponent();

    // Switch to Pivot View
    const pivotTab = screen.getByTestId('view-tab-pivot-view');
    fireEvent.click(pivotTab);
    expect(screen.getByTestId('pivot-view-container')).toBeInTheDocument();
    expect(screen.getByText('Pivot Matrix: Wilayah × Jenjang Pendidikan')).toBeInTheDocument();

    // Switch to Aggregation
    const aggTab = screen.getByTestId('view-tab-aggregation');
    fireEvent.click(aggTab);
    expect(screen.getByTestId('aggregation-view-container')).toBeInTheDocument();
    expect(screen.getByText('Analisis Agregasi Nasional')).toBeInTheDocument();

    // Switch to Group Analysis
    const groupTab = screen.getByTestId('view-tab-group-analysis');
    fireEvent.click(groupTab);
    expect(screen.getByTestId('group-analysis-view-container')).toBeInTheDocument();
    expect(screen.getByText('Analisis Komposisi Group')).toBeInTheDocument();

    // Switch to Comparison
    const compTab = screen.getByTestId('view-tab-comparison');
    fireEvent.click(compTab);
    expect(screen.getByTestId('comparison-view-container')).toBeInTheDocument();
    expect(screen.getByText('Komparasi Wilayah Side-by-Side')).toBeInTheDocument();

    // Switch back to Data Grid
    const gridTab = screen.getByTestId('view-tab-data-grid');
    fireEvent.click(gridTab);
    expect(screen.getByTestId('th-grid-name')).toBeInTheDocument();
  });

  it('should open Detail Modal when clicking on row/action and close on close button', () => {
    renderComponent();

    // Click detail button on Jawa Barat province
    const detailProvBtn = screen.getByTestId('btn-detail-prov-jawa-barat');
    fireEvent.click(detailProvBtn);

    // Modal should be open
    const modal = screen.getByTestId('grid-detail-modal');
    expect(modal).toBeInTheDocument();
    expect(within(modal).getByText('Jawa Barat')).toBeInTheDocument();
    expect(within(modal).getByText('Jumlah Sekolah')).toBeInTheDocument();

    // Close modal
    const closeBtn = screen.getByTestId('btn-close-grid-modal');
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId('grid-detail-modal')).not.toBeInTheDocument();
  });
});
