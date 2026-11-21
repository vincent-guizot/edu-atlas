import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReportsPage } from './ReportsPage';

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

// Mock jsPDF and ExcelJS
vi.mock('jspdf', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      setFontSize: vi.fn(),
      setTextColor: vi.fn(),
      text: vi.fn(),
      save: vi.fn(),
    })),
  };
});

vi.mock('jspdf-autotable', () => ({
  default: vi.fn(),
}));

vi.mock('exceljs', () => ({
  default: {
    Workbook: vi.fn().mockImplementation(() => ({
      addWorksheet: vi.fn().mockReturnValue({
        columns: [],
        addRow: vi.fn(),
        getRow: vi.fn().mockReturnValue({
          font: {},
          fill: {},
        }),
      }),
      xlsx: {
        writeBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
      },
    })),
  },
}));

// Mock URL.createObjectURL and URL.revokeObjectURL
beforeEach(() => {
  window.URL.createObjectURL = vi.fn().mockReturnValue('blob:http://localhost/dummy');
  window.URL.revokeObjectURL = vi.fn();
});

describe('ReportsPage Component', () => {
  it('should render header, category tabs in Navy #0F2942 & rounded-xl, template cards with route slugs, and "Buat Laporan Kustom" placed at the bottom', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/reports']}>
        <Routes>
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reports/:slug" element={<ReportsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    // 1. Header
    expect(screen.getByText('Reports & Export')).toBeInTheDocument();
    expect(
      screen.getByText('Buat laporan, analisis data, dan ekspor hasil visualisasi EduAtlas.'),
    ).toBeInTheDocument();

    // 2. Category Tab: Navy & rounded-xl
    const templatesTab = screen.getByRole('button', { name: 'Report Templates' });
    expect(templatesTab).toBeInTheDocument();
    expect(templatesTab.className).toContain('bg-[#0F2942]');
    expect(templatesTab.className).toContain('rounded-xl');

    // 3. Section 1 (Top): Pilih Template Laporan with 6 template cards
    expect(screen.getByText('Pilih Template Laporan')).toBeInTheDocument();
    expect(screen.getAllByText('Ringkasan Pendidikan Nasional').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Profil Provinsi').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Analisis Jenjang').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Data Kualitas Pendidikan').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Sebaran Institusi').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Program & Beasiswa').length).toBeGreaterThanOrEqual(1);

    // 4. Verify template cards link to their route slugs (e.g. /reports/ringakasanpendidikannasional)
    const links = screen.getAllByRole('link', { name: /Gunakan Template/i });
    expect(links.length).toBe(6);
    expect(links[0].getAttribute('href')).toBe('/reports/ringakasanpendidikannasional');
    expect(links[1].getAttribute('href')).toBe('/reports/profilprovinsi');
    expect(links[2].getAttribute('href')).toBe('/reports/analisisjenjang');
    expect(links[3].getAttribute('href')).toBe('/reports/datakualitaspendidikan');
    expect(links[4].getAttribute('href')).toBe('/reports/sebaraninstitusi');
    expect(links[5].getAttribute('href')).toBe('/reports/programbeasiswa');

    // 5. Section 2: Preview Laporan
    expect(screen.getByText('Preview Laporan')).toBeInTheDocument();
    expect(screen.getByText('Halaman 1')).toBeInTheDocument();

    // 6. Section 3: Laporan yang Sudah Dibuat & Ekspor Data Langsung
    expect(screen.getByText('Laporan yang Sudah Dibuat')).toBeInTheDocument();
    expect(screen.getByText('Ekspor Data Langsung')).toBeInTheDocument();

    // 7. Requirement: "Buat Laporan Kustom taro di bawah"
    // Verify "Buat Laporan Kustom" exists and is placed at the bottom
    const customSection = container.querySelector('#custom-report-section');
    expect(customSection).toBeInTheDocument();
    expect(screen.getByText('Buat Laporan Kustom')).toBeInTheDocument();
    expect(screen.getByText('Konfigurasi Parameter Laporan')).toBeInTheDocument();

    // Verify DOM order: custom-report-section is located after preview and history sections
    const previewEl = screen.getByText('Preview Laporan').closest('.bg-white');
    const historyEl = screen.getByText('Laporan yang Sudah Dibuat').closest('.bg-white');
    expect(previewEl?.compareDocumentPosition(customSection!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(historyEl?.compareDocumentPosition(customSection!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('should support Ekspor Data Langsung for CSV, Excel, and JSON formats', async () => {
    render(
      <MemoryRouter initialEntries={['/reports']}>
        <Routes>
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reports/:slug" element={<ReportsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    // Initial state: Direct format is CSV
    const downloadDirectBtn = screen.getByRole('button', { name: /Download Data \(CSV\)/i });
    expect(downloadDirectBtn).toBeInTheDocument();

    // 1. Download CSV
    fireEvent.click(downloadDirectBtn);
    await waitFor(() => {
      expect(window.URL.createObjectURL).toHaveBeenCalled();
    });
    expect(screen.getByText(/berhasil diekspor ke format CSV/i)).toBeInTheDocument();

    // 2. Switch format to JSON
    const formatSelect = screen.getByDisplayValue('CSV (.csv)');
    fireEvent.change(formatSelect, { target: { value: 'JSON' } });

    const downloadJsonBtn = screen.getByRole('button', { name: /Download Data \(JSON\)/i });
    fireEvent.click(downloadJsonBtn);
    await waitFor(() => {
      expect(window.URL.createObjectURL).toHaveBeenCalled();
    });
    expect(screen.getByText(/berhasil diekspor ke format JSON/i)).toBeInTheDocument();

    // 3. Switch format to Excel
    fireEvent.change(formatSelect, { target: { value: 'Excel (XLSX)' } });
    const downloadExcelBtn = screen.getByRole('button', { name: /Download Data \(Excel \(XLSX\)\)/i });
    fireEvent.click(downloadExcelBtn);
    await waitFor(() => {
      expect(window.URL.createObjectURL).toHaveBeenCalled();
    });
    expect(screen.getByText(/berhasil diekspor ke format Excel/i)).toBeInTheDocument();
  });

  it('should support Buat Laporan Kustom with real data, update preview, and append to report history', async () => {
    render(
      <MemoryRouter initialEntries={['/reports']}>
        <Routes>
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reports/:slug" element={<ReportsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    // Find Custom Report section controls
    const customSection = document.getElementById('custom-report-section');
    expect(customSection).toBeInTheDocument();

    // Generate Custom Report with PDF
    const generateBtn = screen.getByRole('button', { name: 'Generate Laporan' });
    fireEvent.click(generateBtn);

    await waitFor(() => {
      // Toast notification appears
      expect(screen.getByText(/Laporan kustom.*berhasil digenerate dan diunduh/i)).toBeInTheDocument();
    });

    // Verify preview is updated with custom title
    expect(screen.getAllByText(/Laporan Kustom: Institusi Pendidikan/i).length).toBeGreaterThanOrEqual(1);

    // Verify new report item is added to Laporan yang Sudah Dibuat table
    expect(screen.getAllByText(/Laporan Kustom - Institusi Pendidikan/i).length).toBeGreaterThanOrEqual(1);
  });

  it('should support clicking the 3-dots button on a report row to reveal Edit and Delete actions', async () => {
    render(
      <MemoryRouter initialEntries={['/reports']}>
        <Routes>
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reports/:slug" element={<ReportsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    // Initial state: 5 reports in history
    expect(screen.getByText('Ringkasan Pendidikan Nasional 2026')).toBeInTheDocument();
    expect(screen.getAllByText('Data Kualitas Pendidikan').length).toBeGreaterThanOrEqual(1);

    // Click 3-dots button on first report row
    const actionButtons = screen.getAllByTitle('Opsi Laporan');
    expect(actionButtons.length).toBeGreaterThanOrEqual(1);

    // Click the 3-dots button on the first report
    fireEvent.click(actionButtons[0]);

    // Popover menu with Edit and Delete options appears
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();

    // Click Edit button
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

    // Edit Modal opens
    expect(screen.getByText('Edit Metadata Laporan')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Ringkasan Pendidikan Nasional 2026')).toBeInTheDocument();

    // Change report name in modal
    const nameInput = screen.getByDisplayValue('Ringkasan Pendidikan Nasional 2026');
    fireEvent.change(nameInput, { target: { value: 'Ringkasan Nasional Edisi Khusus' } });

    // Save changes
    const saveBtn = screen.getByRole('button', { name: 'Simpan Perubahan' });
    fireEvent.click(saveBtn);

    // Modal closes and updated name appears in table
    await waitFor(() => {
      expect(screen.queryByText('Edit Metadata Laporan')).not.toBeInTheDocument();
      expect(screen.getByText('Ringkasan Nasional Edisi Khusus')).toBeInTheDocument();
    });

    // Now test Delete action
    // Click 3-dots button again on the first report
    const updatedActionButtons = screen.getAllByTitle('Opsi Laporan');
    fireEvent.click(updatedActionButtons[0]);

    // Click Delete
    const deleteBtn = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(deleteBtn);

    // The deleted item should no longer be in the document
    await waitFor(() => {
      expect(screen.queryByText('Ringkasan Nasional Edisi Khusus')).not.toBeInTheDocument();
    });
  });

  it('should render dedicated template route view when visiting /reports/ringakasanpendidikannasional', () => {
    render(
      <MemoryRouter initialEntries={['/reports/ringakasanpendidikannasional']}>
        <Routes>
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reports/:slug" element={<ReportsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    // Breadcrumb and Back link
    expect(screen.getByText('Kembali ke Semua Template')).toBeInTheDocument();
    expect(screen.getAllByText('Ringkasan Pendidikan Nasional').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Template Resmi')).toBeInTheDocument();
    expect(screen.getByText(/slug: \/reports\/ringakasanpendidikannasional/i)).toBeInTheDocument();

    // Action buttons
    expect(screen.getByText('Unduh Laporan (PDF)')).toBeInTheDocument();
    expect(screen.getByText('Ekspor Excel')).toBeInTheDocument();

    // KPI Cards
    expect(screen.getByText('Total Cakupan Sekolah')).toBeInTheDocument();
    expect(screen.getByText('125.482')).toBeInTheDocument();

    // Multi-page document preview
    expect(screen.getByText('Dokumen Lengkap Template Laporan')).toBeInTheDocument();
    expect(screen.getByText('Hal 1: Ringkasan Eksekutif')).toBeInTheDocument();
    expect(screen.getByText('Hal 2: Sebaran & Grafik')).toBeInTheDocument();
    expect(screen.getByText('Hal 3: Indikator & Metrik')).toBeInTheDocument();
    expect(screen.getByText('Hal 4: Lampiran Data')).toBeInTheDocument();

    // Switch to page 4
    fireEvent.click(screen.getByRole('button', { name: 'Hal 4: Lampiran Data' }));
    expect(screen.getByText('4. Lampiran Rekapitulasi Data Provinsi')).toBeInTheDocument();
    expect(screen.getByText('Jawa Barat')).toBeInTheDocument();
  });
});
