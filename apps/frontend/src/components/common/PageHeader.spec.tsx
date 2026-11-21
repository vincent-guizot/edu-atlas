import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PageHeader } from './PageHeader';

describe('PageHeader Component', () => {
  it('should render title, subtitle, and Indonesian scope filter', () => {
    render(
      <PageHeader
        title="Overview Dashboard"
        subtitle="Analitik komprehensif metrik pendidikan Indonesia"
      />,
    );

    expect(screen.getByText('Overview Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Analitik komprehensif metrik pendidikan Indonesia')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Filter Wilayah/i })).toBeInTheDocument();
  });

  it('should render exactly 3 global filter options, snapshot metadata, and user account info', () => {
    render(
      <PageHeader
        title="Overview Dashboard"
        subtitle="Subtitle"
      />,
    );

    expect(screen.getByRole('combobox', { name: /Filter Wilayah/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Filter Periode Tahun/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Filter Jenjang Pendidikan/i })).toBeInTheDocument();
    expect(screen.getByText(/Snapshot:/i)).toBeInTheDocument();
    expect(screen.getByText('Demo Data')).toBeInTheDocument();
    expect(screen.getByText('PS')).toBeInTheDocument();
    expect(screen.getByText('Lord Percival Sterling')).toBeInTheDocument();
  });

  it('should handle period change event', () => {
    const handlePeriodChange = vi.fn();
    render(
      <PageHeader
        title="Overview Dashboard"
        subtitle="Subtitle"
        period="2026"
        onPeriodChange={handlePeriodChange}
      />,
    );

    const periodSelect = screen.getByRole('combobox', { name: /Filter Periode Tahun/i });
    expect(periodSelect).toHaveValue('2026');

    fireEvent.change(periodSelect, { target: { value: '2025' } });
    expect(handlePeriodChange).toHaveBeenCalledWith('2025');
  });
});
