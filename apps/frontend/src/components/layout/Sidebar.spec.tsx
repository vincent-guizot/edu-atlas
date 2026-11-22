import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { Sidebar } from './Sidebar';

describe('Sidebar Component', () => {
  it('should render brand name, logo, and tagline', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );

    expect(screen.getByText('EduAtlas')).toBeInTheDocument();
    expect(screen.getByText(/Explore Education/i)).toBeInTheDocument();
    expect(screen.getByText(/Through Data/i)).toBeInTheDocument();

    const logoImg = screen.getByAltText('EduAtlas');
    expect(logoImg).toBeInTheDocument();
    expect(logoImg).toHaveAttribute('src', '/brand/icon-mark.png');

    // Header container is horizontal flex with logo icon on left and text on right
    const headerContainer = logoImg.parentElement;
    expect(headerContainer).toHaveClass('flex', 'items-center');

    const textWrapper = headerContainer?.querySelector('div');
    expect(textWrapper).toHaveClass('flex', 'flex-col');
  });

  it('should render all 12 navigation links with correct destinations', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );

    const routes = [
      { text: 'Overview', href: '/overview' },
      { text: 'Visualizations', href: '/visualizations' },
      { text: 'Advanced Visualization', href: '/visualizations/advanced' },
      { text: 'Interactive Maps', href: '/maps' },
      { text: 'Advanced Maps', href: '/maps/advanced' },
      { text: 'Data Explorer', href: '/data-explorer' },
      { text: 'Advanced Data Grid', href: '/data-grid' },
      { text: 'Calendar & Scheduling', href: '/calendar' },
      { text: 'Timeline & Gantt', href: '/timeline' },
      { text: 'Flow & Network', href: '/flow' },
      { text: 'Simulator Proyeksi', href: '/simulator' },
      { text: 'Policy Brief Studio', href: '/policy-brief' },
      { text: 'Disparitas 3T', href: '/equity-studio' },
      { text: 'Transparansi Anggaran', href: '/budget-analytics' },
      { text: 'Komparator Institusi', href: '/comparator' },
      { text: 'API & Data Status', href: '/data-status' },
      { text: 'Reports & Export', href: '/reports' },
    ];

    routes.forEach((route) => {
      const link = screen.getByRole('link', { name: new RegExp(route.text, 'i') });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', route.href);
    });
  });
});
