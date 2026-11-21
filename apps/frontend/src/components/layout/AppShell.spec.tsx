import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { AppShell } from './AppShell';

describe('AppShell Component', () => {
  it('should render fixed layout where outer shell is fixed and only internal content scrolls', () => {
    const { container } = render(
      <MemoryRouter>
        <AppShell />
      </MemoryRouter>
    );

    // Sidebar rendered
    expect(screen.getByText('EduAtlas')).toBeInTheDocument();

    // Outer shell is fixed with overflow-hidden
    const outerShell = container.firstChild as HTMLElement;
    expect(outerShell.className).toContain('h-screen');
    expect(outerShell.className).toContain('overflow-hidden');

    // Main App Card is fixed in height matching floating Sidebar
    const mainCard = container.querySelector('.flex-1.ml-\\[244px\\]') as HTMLElement;
    expect(mainCard).toBeInTheDocument();
    expect(mainCard.className).toContain('my-4');
    expect(mainCard.className).toContain('mr-4');
    expect(mainCard.className).toContain('h-[calc(100vh-2rem)]');
    expect(mainCard.className).toContain('overflow-hidden');

    // Main element has overflow-y-auto so only internal page content scrolls
    const mainElement = container.querySelector('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement?.className).toContain('overflow-y-auto');

    // Floating Export button rendered
    expect(screen.getByRole('button', { name: /Export Data/i })).toBeInTheDocument();
  });
});
