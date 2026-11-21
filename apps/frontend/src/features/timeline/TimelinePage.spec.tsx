import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { TimelinePage } from './TimelinePage';

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

describe('TimelinePage Component', () => {
  it('should render header, category tabs, main gantt card with only prog-1 expanded, full-width daftar kegiatan, milestone, ringkasan program, and grafik section', () => {
    render(
      <MemoryRouter>
        <TimelinePage />
      </MemoryRouter>,
    );

    // 1. Header
    expect(screen.getByText('Timeline & Gantt')).toBeInTheDocument();
    expect(
      screen.getByText('Visualisasi timeline program pendidikan, jadwal pelaksanaan, dan dependensi antar kegiatan.'),
    ).toBeInTheDocument();

    // 2. Category Tab: Navy & rounded-xl
    const progNasionalTab = screen.getByRole('button', { name: 'Program Nasional' });
    expect(progNasionalTab).toBeInTheDocument();
    expect(progNasionalTab.className).toContain('bg-[#0F2942]');
    expect(progNasionalTab.className).toContain('rounded-xl');

    // 3. Gantt card controls
    expect(screen.getByText('Timeline Program Nasional 2026')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Gantt View' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Timeline View' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'List View' })).toBeInTheDocument();

    // 4. "Timeline nya isi nya jgn dropdown kecuali nomor 1"
    // Program 1 subtask 'Sosialisasi PPDB' should be visible
    expect(screen.getAllByText('Sosialisasi PPDB').length).toBeGreaterThanOrEqual(1);
    // Click Program 2 to expand its subtasks
    const prog2Btn = screen.getByRole('button', { name: /Pelaksanaan Kegiatan Belajar Mengajar/i });
    expect(prog2Btn).toBeInTheDocument();
    fireEvent.click(prog2Btn);
    expect(screen.getAllByText('Semester Ganjil 2026/2027').length).toBeGreaterThanOrEqual(1);

    // 5. "Daftar Kegiatan full width"
    expect(screen.getByText('Daftar Kegiatan')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Cari kegiatan...')).toBeInTheDocument();

    // 6. 3-Section Bottom: "Milestone Penting 2026", "Ringkasan Program", and "Grafik & Analisis Timeline"
    expect(screen.getByText('Milestone Penting 2026')).toBeInTheDocument();
    expect(screen.getByText('Mulai Sosialisasi PPDB Nasional')).toBeInTheDocument();
    expect(screen.getByText('Ringkasan Program')).toBeInTheDocument();
    expect(screen.getByText('Grafik & Analisis Timeline')).toBeInTheDocument();
  });

  it('should switch between Gantt View, Timeline View, and List View', () => {
    render(
      <MemoryRouter>
        <TimelinePage />
      </MemoryRouter>,
    );

    // Switch to Timeline View
    const timelineViewBtn = screen.getByRole('button', { name: 'Timeline View' });
    fireEvent.click(timelineViewBtn);
    expect(screen.getByText('Roadmap Pelaksanaan Kegiatan 2026')).toBeInTheDocument();
    expect(screen.getByText('18 Tahapan Terjadwal')).toBeInTheDocument();

    // Switch to List View
    const listViewBtn = screen.getByRole('button', { name: 'List View' });
    fireEvent.click(listViewBtn);
    expect(screen.getByText('Daftar Hierarki Program & Kegiatan')).toBeInTheDocument();
    expect(screen.getByText('6 Program Induk • 18 Sub-kegiatan')).toBeInTheDocument();

    // Switch back to Gantt View
    const ganttViewBtn = screen.getByRole('button', { name: 'Gantt View' });
    fireEvent.click(ganttViewBtn);
    expect(screen.getByText('Tahun 2026')).toBeInTheDocument();
  });

  it('should open and close the modal when clicking a Gantt bar or activity', () => {
    render(
      <MemoryRouter>
        <TimelinePage />
      </MemoryRouter>,
    );

    // Click on a Gantt bar or subtask
    const subtask = screen.getByTitle(/Sosialisasi PPDB/i);
    expect(subtask).toBeInTheDocument();
    fireEvent.click(subtask);

    // Modal should open
    expect(screen.getByText('Detail Kegiatan Timeline & Gantt')).toBeInTheDocument();
    expect(screen.getByText('Progres Pelaksanaan')).toBeInTheDocument();
    expect(screen.getAllByText('100%').length).toBeGreaterThanOrEqual(1);

    // Close modal
    const closeBtn = screen.getByRole('button', { name: 'Tutup' });
    fireEvent.click(closeBtn);

    expect(screen.queryByText('Detail Kegiatan Timeline & Gantt')).not.toBeInTheDocument();
  });

  it('should filter Daftar Kegiatan by search query', () => {
    render(
      <MemoryRouter>
        <TimelinePage />
      </MemoryRouter>,
    );

    const searchInput = screen.getByPlaceholderText('Cari kegiatan...');
    fireEvent.change(searchInput, { target: { value: 'Chromebook' } });

    // Should find the Pengadaan Perangkat TIK
    expect(screen.getAllByText('Pengadaan Perangkat TIK').length).toBeGreaterThanOrEqual(1);

    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });
  });

  it('should support the fixed dropdown in Ringkasan Program and update counts', () => {
    render(
      <MemoryRouter>
        <TimelinePage />
      </MemoryRouter>,
    );

    // Initial state: Semua Program (18 Kegiatan)
    expect(screen.getByText('Semua Program (18 Kegiatan)')).toBeInTheDocument();
    expect(screen.getAllByText('18').length).toBeGreaterThanOrEqual(1);

    // Find the Ringkasan Program dropdown
    const programSelect = screen.getByDisplayValue('Semua Program (18 Kegiatan)');
    expect(programSelect).toBeInTheDocument();

    // Change to "PPDB"
    fireEvent.change(programSelect, { target: { value: 'PPDB' } });
    expect(screen.getAllByText('5').length).toBeGreaterThanOrEqual(1); // PPDB has 5 activities

    // Change to "Ujian"
    fireEvent.change(programSelect, { target: { value: 'Ujian' } });
    expect(screen.getAllByText('3').length).toBeGreaterThanOrEqual(1); // Ujian has 3 activities
  });

  it('should open modal when clicking a milestone item', () => {
    render(
      <MemoryRouter>
        <TimelinePage />
      </MemoryRouter>,
    );

    const milestone = screen.getByText('Mulai Sosialisasi PPDB Nasional');
    fireEvent.click(milestone);

    expect(screen.getByText('Detail Kegiatan Timeline & Gantt')).toBeInTheDocument();
    expect(screen.getByText(/Milestone Tanggal Kunci/i)).toBeInTheDocument();

    // Close modal
    fireEvent.click(screen.getByRole('button', { name: 'Tutup' }));
    expect(screen.queryByText('Detail Kegiatan Timeline & Gantt')).not.toBeInTheDocument();
  });

  it('should render Grafik section and switch between chart modes', () => {
    render(
      <MemoryRouter>
        <TimelinePage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Grafik & Analisis Timeline')).toBeInTheDocument();
    expect(screen.getByText(/Puncak: Mar–Apr/i)).toBeInTheDocument();

    // Find chart mode select dropdown
    const chartSelect = screen.getByDisplayValue('Beban Bulanan (Peak Activity)');
    expect(chartSelect).toBeInTheDocument();

    // Switch to Kurva-S Progres
    fireEvent.change(chartSelect, { target: { value: 'Kurva-S Progres' } });
    expect(screen.getByText(/Akumulasi target capaian program tahun 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/Status: On Track/i)).toBeInTheDocument();

    // Switch to Alokasi Durasi
    fireEvent.change(chartSelect, { target: { value: 'Alokasi Durasi' } });
    expect(screen.getByText(/Alokasi total hari operasional per program/i)).toBeInTheDocument();
    expect(screen.getByText(/Total 348 Hari KBM/i)).toBeInTheDocument();
  });
});
