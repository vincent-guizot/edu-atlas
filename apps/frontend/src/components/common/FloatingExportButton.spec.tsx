import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FloatingExportButton } from './FloatingExportButton';

describe('FloatingExportButton Component', () => {
  it('should render the export button with label', () => {
    render(<FloatingExportButton />);
    expect(screen.getByText('Export Data')).toBeInTheDocument();
  });

  it('should trigger onExport callback on click', () => {
    const handleExport = vi.fn();
    render(<FloatingExportButton onExport={handleExport} />);

    const button = screen.getByRole('button', { name: /export data/i });
    fireEvent.click(button);
    expect(handleExport).toHaveBeenCalledTimes(1);
  });
});
