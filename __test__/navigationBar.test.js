import React from 'react';
import { render, screen } from '@testing-library/react';
import NavigationBar from '../src/components/Landing-Components/NavigationBar';
import '@testing-library/jest-dom';

describe('NavigationBar', () => {
  it('renders the logo image with alt text', () => {
    render(<NavigationBar />);
    const logoImg = screen.getByAltText('Logo');
    expect(logoImg).toBeInTheDocument();
    expect(logoImg).toHaveClass('logo-icon');
  });

  it('renders the title "WhichWay"', () => {
    render(<NavigationBar />);
    const title = screen.getByText('WhichWay');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H1');
  });

  it('has the correct layout classes', () => {
    render(<NavigationBar />);
    expect(screen.getByRole('banner')).toHaveClass('navbar-header');
    expect(document.querySelector('.navbar-container')).toBeInTheDocument();
    expect(document.querySelector('.navbar-logo')).toBeInTheDocument();
    expect(document.querySelector('.navbar-title')).toBeInTheDocument();
  });
});
