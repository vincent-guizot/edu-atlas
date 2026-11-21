import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KpiCardsRow } from './KpiCardsRow';

describe('KpiCardsRow Component', () => {
  it('should render all 4 KPI cards with default metrics', () => {
    render(<KpiCardsRow />);

    expect(screen.getByText('Total Sekolah')).toBeInTheDocument();
    expect(screen.getByText('Total Siswa')).toBeInTheDocument();
    expect(screen.getByText('Total Guru')).toBeInTheDocument();
    expect(screen.getByText('Total Universitas')).toBeInTheDocument();

    // Default formatted numbers
    expect(screen.getByText('125.482')).toBeInTheDocument();
    expect(screen.getByText('42.560.321')).toBeInTheDocument();
    expect(screen.getByText('2.843.921')).toBeInTheDocument();
    expect(screen.getByText('3.216')).toBeInTheDocument();
  });

  it('should format custom metrics correctly with thousand dots', () => {
    render(
      <KpiCardsRow
        schools={50000}
        students={1000000}
        teachers={150000}
        universities={500}
      />,
    );

    expect(screen.getByText('50.000')).toBeInTheDocument();
    expect(screen.getByText('1.000.000')).toBeInTheDocument();
    expect(screen.getByText('150.000')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  it('should open detail modal when a KPI card is clicked and close on close button', () => {
    render(<KpiCardsRow />);

    // Click Total Sekolah card
    const sekolahCard = screen.getByRole('button', { name: /Buka detail Total Sekolah/i });
    fireEvent.click(sekolahCard);

    // Modal dialog title should appear
    expect(screen.getByText('Rincian Institusi Sekolah Nasional')).toBeInTheDocument();
    expect(screen.getByText('Terakreditasi A (Unggul)')).toBeInTheDocument();

    // Close button
    const closeBtn = screen.getByRole('button', { name: /Tutup Dialog/i });
    fireEvent.click(closeBtn);

    // Modal should be closed
    expect(screen.queryByText('Rincian Institusi Sekolah Nasional')).not.toBeInTheDocument();
  });
});
