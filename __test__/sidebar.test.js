import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../src/components/Homepage-Components/Sidebar';
import { getSidebarData } from '../src/components/Homepage-Components/SidebarData';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock localStorage
beforeEach(() => {
  Storage.prototype.setItem = jest.fn();
  Storage.prototype.getItem = jest.fn();
  Storage.prototype.clear = jest.fn();
});

// Mock useNavigate from react-router
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

// Mock getSidebarData
jest.mock('../src/components/Homepage-Components/SidebarData', () => ({
  getSidebarData: jest.fn(),
}));

describe('Sidebar', () => {
  const mockLogout = jest.fn();
  const mockNavigate = jest.fn();

  const sidebarItems = [
    {
      title: 'Home',
      icon: <div data-testid="icon-home" />,
      link: '/home',
    },
    {
      title: 'Create Trip',
      icon: <div data-testid="icon-create" />,
      link: '/createtrip',
    },
    {
      title: 'Logout',
      icon: <div data-testid="icon-logout" />,
      onClick: mockLogout,
    },
  ];

  beforeEach(() => {
    getSidebarData.mockReturnValue(sidebarItems);
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('renders sidebar items with titles and icons', () => {
    render(
      <MemoryRouter>
        <Sidebar logout={mockLogout} />
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Create Trip')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();

    expect(screen.getByTestId('icon-home')).toBeInTheDocument();
    expect(screen.getByTestId('icon-create')).toBeInTheDocument();
    expect(screen.getByTestId('icon-logout')).toBeInTheDocument();
  });

  it('calls logout function when "Logout" is clicked', () => {
    render(
      <MemoryRouter>
        <Sidebar logout={mockLogout} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Logout'));
    expect(mockLogout).toHaveBeenCalled();
  });

  it('resets tripId and navigates when "Create Trip" is clicked', () => {
    render(
      <MemoryRouter>
        <Sidebar logout={mockLogout} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Create Trip'));

    expect(localStorage.setItem).toHaveBeenCalledWith('tripId', '');
    expect(mockNavigate).toHaveBeenCalledWith('/createtrip');
  });

  it('navigates directly to link when static item is clicked', () => {
    // Mock window.location
    const originalLocation = window.location;
    delete window.location;
    window.location = { pathname: '', assign: jest.fn() };

    render(
      <MemoryRouter>
        <Sidebar logout={mockLogout} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Home'));
    expect(window.location.pathname).toBe('/home');

    // Restore original window.location
    window.location = originalLocation;
  });
});
