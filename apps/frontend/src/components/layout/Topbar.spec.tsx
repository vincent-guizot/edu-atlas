import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Topbar } from './Topbar';

describe('Topbar Component', () => {
  it('should render user avatar badge and user name', () => {
    render(<Topbar />);

    expect(screen.getByText('PS')).toBeInTheDocument();
    expect(screen.getByText('Lord Percival Sterling')).toBeInTheDocument();
  });
});
