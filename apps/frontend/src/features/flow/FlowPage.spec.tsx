import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { FlowPage } from './FlowPage';

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

describe('FlowPage Component', () => {
  it('should render header, category tabs in Navy #0F2942 & rounded-xl, and initial Education Flow view', () => {
    render(
      <MemoryRouter>
        <FlowPage />
      </MemoryRouter>,
    );

    // 1. Header
    expect(screen.getByText('Flow & Network')).toBeInTheDocument();
    expect(
      screen.getByText('Visualisasi alur proses, hubungan antarentitas, dan jaringan pendidikan di Indonesia.'),
    ).toBeInTheDocument();

    // 2. Tab Category buttons
    const tabs = [
      'Education Flow',
      'Institution Network',
      'Collaboration Network',
      'Student Pathway',
      'Teacher Mobility',
      'Program Dependency',
      'Other',
    ];

    tabs.forEach((tab) => {
      const tabBtn = screen.getByRole('button', { name: tab });
      expect(tabBtn).toBeInTheDocument();
      expect(tabBtn.className).toContain('rounded-xl');
    });

    // Default active tab: Education Flow with Navy color
    const educationFlowTab = screen.getByRole('button', { name: 'Education Flow' });
    expect(educationFlowTab.className).toContain('bg-[#0F2942]');

    // 3. Contextual banner
    expect(screen.getByText('Fokus Tampilan: Education Flow')).toBeInTheDocument();

    // 4. Default KPIs for Education Flow
    expect(screen.getByText('Total Sekolah')).toBeInTheDocument();
    expect(screen.getByText('125.482')).toBeInTheDocument();
    expect(screen.getByText('Total Siswa')).toBeInTheDocument();
    expect(screen.getByText('42.560.321')).toBeInTheDocument();
    expect(screen.getByText('Total Guru')).toBeInTheDocument();
    expect(screen.getByText('2.843.921')).toBeInTheDocument();
    expect(screen.getByText('Total Universitas')).toBeInTheDocument();
    expect(screen.getByText('3.216')).toBeInTheDocument();

    // 5. Sections present
    expect(screen.getByText('Alur Siswa Antar Jenjang Pendidikan')).toBeInTheDocument();
    expect(screen.getByText('Jaringan Institusi Pendidikan')).toBeInTheDocument();
    expect(screen.getByText('Peta Alur Pendidikan per Provinsi')).toBeInTheDocument();
    expect(screen.getByText('Top 10 Kolaborasi Institusi')).toBeInTheDocument();
    expect(screen.getByText('Jenis Hubungan')).toBeInTheDocument();
  });

  it('should switch across all 7 tabs and dynamically update banner, KPIs, and datasets', () => {
    render(
      <MemoryRouter>
        <FlowPage />
      </MemoryRouter>,
    );

    // 1. Switch to Institution Network
    fireEvent.click(screen.getByRole('button', { name: 'Institution Network' }));
    expect(screen.getByText('Fokus Tampilan: Institution Network')).toBeInTheDocument();
    expect(screen.getByText('Nodus Terhubung')).toBeInTheDocument();
    expect(screen.getByText('8.420')).toBeInTheDocument();
    expect(screen.getByText('Kluster Jaringan')).toBeInTheDocument();
    expect(screen.getByText('34 Kluster')).toBeInTheDocument();

    // 2. Switch to Collaboration Network
    fireEvent.click(screen.getByRole('button', { name: 'Collaboration Network' }));
    expect(screen.getByText('Fokus Tampilan: Collaboration Network')).toBeInTheDocument();
    expect(screen.getByText('Program Kerja Sama')).toBeInTheDocument();
    expect(screen.getByText('456 Program')).toBeInTheDocument();
    expect(screen.getByText('Mitra Dunia Usaha')).toBeInTheDocument();
    expect(screen.getByText('88 Industri')).toBeInTheDocument();
    // Collaboration table row check
    expect(screen.getByText('PT Telkom Indonesia')).toBeInTheDocument();
    expect(screen.getByText('PT Dirgantara Indonesia')).toBeInTheDocument();

    // 3. Switch to Student Pathway
    fireEvent.click(screen.getByRole('button', { name: 'Student Pathway' }));
    expect(screen.getByText('Fokus Tampilan: Student Pathway')).toBeInTheDocument();
    expect(screen.getByText('Transisi SD ➔ SMP')).toBeInTheDocument();
    expect(screen.getByText('98,2%')).toBeInTheDocument();
    expect(screen.getByText('Angka Lanjut PT')).toBeInTheDocument();
    expect(screen.getByText('34,4%')).toBeInTheDocument();
    expect(screen.getByText('SMA Negeri 1 Bandung')).toBeInTheDocument();

    // 4. Switch to Teacher Mobility
    fireEvent.click(screen.getByRole('button', { name: 'Teacher Mobility' }));
    expect(screen.getByText('Fokus Tampilan: Teacher Mobility')).toBeInTheDocument();
    expect(screen.getByText('Total Guru Bergerak')).toBeInTheDocument();
    expect(screen.getByText('14.280')).toBeInTheDocument();
    expect(screen.getByText('Penugasan Daerah 3T')).toBeInTheDocument();
    expect(screen.getByText('3.420 Guru')).toBeInTheDocument();
    expect(screen.getByText('Kab. Timor Tengah Selatan (NTT)')).toBeInTheDocument();

    // 5. Switch to Program Dependency
    fireEvent.click(screen.getByRole('button', { name: 'Program Dependency' }));
    expect(screen.getByText('Fokus Tampilan: Program Dependency')).toBeInTheDocument();
    expect(screen.getByText('Program Terintegrasi')).toBeInTheDocument();
    expect(screen.getByText('18 Program')).toBeInTheDocument();
    expect(screen.getByText('Dapodik Pusat')).toBeInTheDocument();
    expect(screen.getAllByText('Rapor Pendidikan').length).toBeGreaterThanOrEqual(1);

    // 6. Switch to Other
    fireEvent.click(screen.getByRole('button', { name: 'Other' }));
    expect(screen.getByText('Fokus Tampilan: Other')).toBeInTheDocument();
    expect(screen.getByText('Total Nodus Graf')).toBeInTheDocument();
    expect(screen.getByText('12.450')).toBeInTheDocument();
    expect(screen.getByText('Total Tautan (Edges)')).toBeInTheDocument();
    expect(screen.getByText('38.200')).toBeInTheDocument();
  });

  it('should open and close the entity inspection modal when a node or collaboration row is clicked', () => {
    render(
      <MemoryRouter>
        <FlowPage />
      </MemoryRouter>,
    );

    // Initial state: Modal should not be displayed
    expect(screen.queryByText('Detail Entitas Jejaring Pendidikan')).not.toBeInTheDocument();

    // Find and click a collaboration row item (e.g. Universitas Indonesia)
    const uiRow = screen.getAllByText('Universitas Indonesia')[0];
    fireEvent.click(uiRow);

    // Modal should now be open
    expect(screen.getByText('Detail Entitas Jejaring Pendidikan')).toBeInTheDocument();
    expect(screen.getByText('Koneksi / Derajat Hubungan')).toBeInTheDocument();
    expect(screen.getByText('Inisiatif & Program')).toBeInTheDocument();
    expect(screen.getByText('Keterangan Profil Jejaring')).toBeInTheDocument();

    // Close the modal via Tutup button
    const closeBtn = screen.getByRole('button', { name: 'Tutup' });
    fireEvent.click(closeBtn);

    // Modal should now be closed
    expect(screen.queryByText('Detail Entitas Jejaring Pendidikan')).not.toBeInTheDocument();
  });

  it('should support network zoom in, zoom out, and reset controls', () => {
    const { container } = render(
      <MemoryRouter>
        <FlowPage />
      </MemoryRouter>,
    );

    const svgEl = container.querySelector('svg[viewBox="0 0 600 360"]') as SVGSVGElement;
    expect(svgEl).toBeInTheDocument();
    expect(svgEl.style.transform).toBe('scale(1)');

    // Click Zoom In
    const zoomInBtn = screen.getByTitle('Perbesar');
    fireEvent.click(zoomInBtn);
    expect(svgEl.style.transform).toBe('scale(1.2)');

    // Click Zoom Out
    const zoomOutBtn = screen.getByTitle('Perkecil');
    fireEvent.click(zoomOutBtn);
    expect(svgEl.style.transform).toBe('scale(1)');

    // Click Zoom In twice then Reset
    fireEvent.click(zoomInBtn);
    fireEvent.click(zoomInBtn);
    expect(svgEl.style.transform).toBe('scale(1.4)');

    const resetZoomBtn = screen.getByTitle('Reset Zoom');
    fireEvent.click(resetZoomBtn);
    expect(svgEl.style.transform).toBe('scale(1)');
  });
});
