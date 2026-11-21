import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { CalendarPage } from './CalendarPage';

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

describe('CalendarPage Component', () => {
  it('should render header, category pills strip, horizontal filter bar, full-width calendar, and lower agenda cards', () => {
    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>,
    );

    // 1. Header
    expect(screen.getByText('Calendar & Scheduling')).toBeInTheDocument();
    expect(
      screen.getByText('Lihat kalender akademik, jadwal kegiatan, dan agenda penting pendidikan di seluruh Indonesia.'),
    ).toBeInTheDocument();

    // 2. Category Pills
    const academicTab = screen.getByRole('button', { name: 'Kalender Akademik' });
    expect(academicTab).toBeInTheDocument();
    expect(academicTab.className).toContain('bg-[#0F2942]');
    expect(academicTab.className).toContain('rounded-xl');

    // 3. Top Horizontal Filter Bar
    expect(screen.getByText('Filter Kalender & Kegiatan')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Cari kegiatan / acara...')).toBeInTheDocument();
    expect(screen.getAllByText('Semua Provinsi')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Semua Jenjang')[0]).toBeInTheDocument();
    expect(screen.getByText('Reset Filter')).toBeInTheDocument();

    // 4. Full-Width Calendar
    expect(screen.getByText('Januari 2026')).toBeInTheDocument();
    expect(screen.getByText('Hari Ini')).toBeInTheDocument();
    expect(screen.getByText('Senin')).toBeInTheDocument();
    expect(screen.getAllByText('Minggu').length).toBeGreaterThanOrEqual(1);

    // 5. "Sisanya di bawahnya" - Section 1: Agenda & Upcoming
    expect(screen.getByText('Agenda Hari Ini')).toBeInTheDocument();
    expect(screen.getByText('Selasa, 20 Januari 2026')).toBeInTheDocument();
    expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
    expect(screen.getByText('Agenda penting 30 hari ke depan')).toBeInTheDocument();

    // 6. "Sisanya di bawahnya" - Section 2: Stats, Timeline, Level Matrix
    expect(screen.getByText('Statistik Kegiatan Tahun 2026')).toBeInTheDocument();
    expect(screen.getByText('Timeline Kegiatan Penting')).toBeInTheDocument();
    expect(screen.getByText('Kalender per Jenjang')).toBeInTheDocument();
  });

  it('should filter events when searching and reset filters', () => {
    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>,
    );

    const searchInput = screen.getByPlaceholderText('Cari kegiatan / acara...');
    const counterBadge = screen.getByText(/Menampilkan/i);
    expect(counterBadge).toBeInTheDocument();

    // Filter by search query
    fireEvent.change(searchInput, { target: { value: 'Seminar Pendidikan' } });
    expect(counterBadge.textContent).toContain('1');

    // Click Reset Filter
    const resetButton = screen.getByRole('button', { name: /Reset Filter/i });
    fireEvent.click(resetButton);

    expect((searchInput as HTMLInputElement).value).toBe('');
    expect(counterBadge.textContent).not.toContain('Menampilkan 1 kegiatan');
  });

  it('should toggle categories and instansi chips', () => {
    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>,
    );

    // Find category toggle button with exact name "Libur"
    const liburBtn = screen.getByRole('button', { name: /^Libur$/i });
    expect(liburBtn).toBeInTheDocument();

    // Toggle off
    fireEvent.click(liburBtn);
    // Toggle on again
    fireEvent.click(liburBtn);
  });

  it('should switch between Hari, Minggu, Bulan, and Tahun views', () => {
    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>,
    );

    // Switch to Hari
    const hariBtn = screen.getByRole('button', { name: 'Hari' });
    fireEvent.click(hariBtn);
    expect(screen.getByText(/Jadwal Kegiatan: Selasa, 20 Januari 2026/i)).toBeInTheDocument();

    // Switch to Minggu
    const mingguBtn = screen.getByRole('button', { name: 'Minggu' });
    fireEvent.click(mingguBtn);
    expect(screen.getByText(/Jadwal Mingguan: 19 - 25 Januari 2026/i)).toBeInTheDocument();

    // Switch to Tahun
    const tahunBtn = screen.getByRole('button', { name: 'Tahun' });
    fireEvent.click(tahunBtn);
    expect(screen.getByText(/Kalender Tahunan Akademik 2026/i)).toBeInTheDocument();

    // Switch back to Bulan
    const bulanBtn = screen.getByRole('button', { name: 'Bulan' });
    fireEvent.click(bulanBtn);
    expect(screen.getByText('Januari 2026')).toBeInTheDocument();
  });

  it('should support month navigation with Prev, Next, and Today buttons', () => {
    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Januari 2026')).toBeInTheDocument();

    // Click Next month
    const nextBtn = screen.getByTitle('Bulan berikutnya');
    fireEvent.click(nextBtn);
    expect(screen.getByText('Februari 2026')).toBeInTheDocument();

    // Click Prev month
    const prevBtn = screen.getByTitle('Bulan sebelumnya');
    fireEvent.click(prevBtn);
    expect(screen.getByText('Januari 2026')).toBeInTheDocument();

    // Click Today
    const todayBtn = screen.getByRole('button', { name: 'Hari Ini' });
    fireEvent.click(todayBtn);
    expect(screen.getByText('Januari 2026')).toBeInTheDocument();
  });

  it('should open and close the Event Detail Modal when clicking an event', () => {
    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>,
    );

    // Click on an event chip in the calendar (e.g. Libur Tahun Baru 2026)
    const eventChip = screen.getByText('Libur Tahun Baru 2026');
    fireEvent.click(eventChip);

    // Modal opens
    expect(screen.getByText('Detail Kegiatan Kalender')).toBeInTheDocument();
    expect(
      screen.getByText('Hari libur nasional memperingati Tahun Baru Masehi 2026 bagi seluruh satuan pendidikan.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Pemerintah Republik Indonesia')).toBeInTheDocument();

    // Close modal
    const closeBtn = screen.getByRole('button', { name: 'Tutup' });
    fireEvent.click(closeBtn);

    expect(screen.queryByText('Detail Kegiatan Kalender')).not.toBeInTheDocument();
  });
});
