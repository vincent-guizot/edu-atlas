import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { DataStatusPage } from './DataStatusPage';

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

describe('DataStatusPage Component', () => {
  it('should render header, 7 category tabs with Navy #0F2942 & rounded-xl, and initial API Status overview', () => {
    render(
      <MemoryRouter>
        <DataStatusPage />
      </MemoryRouter>,
    );

    // 1. Header
    expect(screen.getByText('API & Data Status')).toBeInTheDocument();
    expect(
      screen.getAllByText('Pantau kesehatan API, status dataset, kualitas data, dan aktivitas pembaruan EduAtlas secara real-time.').length,
    ).toBeGreaterThanOrEqual(1);

    // 2. Tab Category buttons
    const tabs = [
      'API Status',
      'Data Status',
      'Data Quality',
      'Update History',
      'System Logs',
      'Webhook & Integration',
      'Environment',
    ];

    tabs.forEach((tab) => {
      const tabBtn = screen.getByRole('button', { name: tab });
      expect(tabBtn).toBeInTheDocument();
      expect(tabBtn.className).toContain('rounded-xl');
    });

    // Default active tab is API Status with Navy color
    const apiStatusTab = screen.getByRole('button', { name: 'API Status' });
    expect(apiStatusTab.className).toContain('bg-[#0F2942]');

    // 3. Contextual banner
    expect(screen.getByText('Fokus Tampilan: API Status')).toBeInTheDocument();

    // 4. Default 5 KPIs for API Status
    expect(screen.getByText('Total API Endpoints')).toBeInTheDocument();
    expect(screen.getAllByText('24').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Total Datasets')).toBeInTheDocument();
    expect(screen.getAllByText('12').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Terakhir Diperbarui').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('20 Okt 2026')).toBeInTheDocument();
    expect(screen.getByText('Uptime API')).toBeInTheDocument();
    expect(screen.getAllByText('99,6%').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Rata-rata Response Time')).toBeInTheDocument();
    expect(screen.getByText('312 ms')).toBeInTheDocument();

    // 5. Sections present on API Status tab
    expect(screen.getByText('Status API Services')).toBeInTheDocument();
    expect(screen.getByText('Status Dataset')).toBeInTheDocument();
    expect(screen.getByText('Response Time (24 Jam Terakhir)')).toBeInTheDocument();
    expect(screen.getByText('Distribusi Status API')).toBeInTheDocument();
    expect(screen.getByText('Data Quality Overview')).toBeInTheDocument();
    expect(screen.getByText('System Logs (Terbaru)')).toBeInTheDocument();
  });

  it('should switch between all 7 tabs and dynamically update banner, KPIs, and dedicated views', () => {
    render(
      <MemoryRouter>
        <DataStatusPage />
      </MemoryRouter>,
    );

    // 1. Switch to Data Status
    fireEvent.click(screen.getByRole('button', { name: 'Data Status' }));
    expect(screen.getByText('Fokus Tampilan: Data Status')).toBeInTheDocument();
    expect(screen.getByText('Total Dataset Aktif')).toBeInTheDocument();
    expect(screen.getByText('Total Rekod Data')).toBeInTheDocument();
    expect(screen.getByText('170,8 Juta')).toBeInTheDocument();
    expect(screen.getByText('Katalog Dataset & Status Sinkronisasi Nasional')).toBeInTheDocument();

    // 2. Switch to Data Quality
    fireEvent.click(screen.getByRole('button', { name: 'Data Quality' }));
    expect(screen.getByText('Fokus Tampilan: Data Quality')).toBeInTheDocument();
    expect(screen.getByText('Skor Kualitas Rata-rata')).toBeInTheDocument();
    expect(screen.getAllByText('95,4%').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Matriks Kualitas Data per Entitas Pendidikan')).toBeInTheDocument();

    // 3. Switch to Update History
    fireEvent.click(screen.getByRole('button', { name: 'Update History' }));
    expect(screen.getByText('Fokus Tampilan: Update History')).toBeInTheDocument();
    expect(screen.getByText('Total Job Eksekusi')).toBeInTheDocument();
    expect(screen.getByText('148 Job')).toBeInTheDocument();
    expect(screen.getByText('Riwayat Eksekusi Pipeline Sinkronisasi Data (ETL)')).toBeInTheDocument();
    expect(screen.getByText('JOB-20261020-01')).toBeInTheDocument();

    // 4. Switch to System Logs
    fireEvent.click(screen.getByRole('button', { name: 'System Logs' }));
    expect(screen.getByText('Fokus Tampilan: System Logs')).toBeInTheDocument();
    expect(screen.getByText('Total Peristiwa Log')).toBeInTheDocument();
    expect(screen.getByText('142.580')).toBeInTheDocument();
    expect(screen.getByText('Log Sistem & Jejak Audit Transaksi')).toBeInTheDocument();
    expect(screen.getByText('LOG-8941')).toBeInTheDocument();

    // 5. Switch to Webhook & Integration
    fireEvent.click(screen.getByRole('button', { name: 'Webhook & Integration' }));
    expect(screen.getByText('Fokus Tampilan: Webhook & Integration')).toBeInTheDocument();
    expect(screen.getByText('Integrasi Eksternal')).toBeInTheDocument();
    expect(screen.getByText('8 Sistem')).toBeInTheDocument();
    expect(screen.getByText('Titik Integrasi & Webhook Antar-Kementerian')).toBeInTheDocument();
    expect(screen.getByText('Pusdatin Kemendikdasmen')).toBeInTheDocument();

    // 6. Switch to Environment
    fireEvent.click(screen.getByRole('button', { name: 'Environment' }));
    expect(screen.getByText('Fokus Tampilan: Environment')).toBeInTheDocument();
    expect(screen.getByText('Status Kluster Server')).toBeInTheDocument();
    expect(screen.getByText('Operational')).toBeInTheDocument();
    expect(screen.getByText('API Gateway (Kong / NGINX)')).toBeInTheDocument();
    expect(screen.getByText('Primary Database (PostgreSQL 16)')).toBeInTheDocument();
  });

  it('should open and close the entity inspection modal when an API service is clicked', () => {
    render(
      <MemoryRouter>
        <DataStatusPage />
      </MemoryRouter>,
    );

    // Initial state: Modal should not be displayed
    expect(screen.queryByText(/Detail Entitas Status:/i)).not.toBeInTheDocument();

    // Click on Auth Service row in API Services table
    const authServiceRow = screen.getByText('Auth Service');
    fireEvent.click(authServiceRow);

    // Modal should now be open
    expect(screen.getByText('Detail Entitas Status: Auth Service')).toBeInTheDocument();
    expect(screen.getByText('Base URL Endpoint')).toBeInTheDocument();
    expect(screen.getByText('Tingkat Ketersediaan (Uptime)')).toBeInTheDocument();

    // Close the modal
    const closeBtn = screen.getByRole('button', { name: 'Tutup' });
    fireEvent.click(closeBtn);

    // Modal should now be closed
    expect(screen.queryByText(/Detail Entitas Status:/i)).not.toBeInTheDocument();
  });

  it('should support searching on API Services table', () => {
    render(
      <MemoryRouter>
        <DataStatusPage />
      </MemoryRouter>,
    );

    // Initial state: Auth Service is in the table
    expect(screen.getByText('/api/v1/auth')).toBeInTheDocument();
    expect(screen.getByText('/api/v1/geo')).toBeInTheDocument();

    // Filter by search input for "Geospatial"
    const searchInput = screen.getByPlaceholderText('Cari service atau endpoint...');
    fireEvent.change(searchInput, { target: { value: 'Geospatial' } });

    expect(screen.getByText('/api/v1/geo')).toBeInTheDocument();
    expect(screen.queryByText('/api/v1/auth')).not.toBeInTheDocument();

    // Reset search
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByText('/api/v1/auth')).toBeInTheDocument();
  });
});
