//order matters here, since we only want to test with mock data,
//if these jest.mocks arent here, they will render the real modules
jest.mock('../src/components/firebase', () => ({
  auth: {},
}));

jest.mock('firebase/auth', () => ({
  signOut: jest.fn(() => Promise.resolve()),
}));

jest.mock('../src/components/Homepage-Components/Sidebar', () => () => (
  <div data-testid='sidebar' />
));
jest.mock('../src/components/Landing-Components/NavigationBar', () => () => (
  <div data-testid='navbar' />
));

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Account from '../src/pages/Account';

const mockUser = {
  displayName: 'Aldo Guerrero',
  email: 'aldo@example.com',
  metadata: {
    creationTime: new Date('2023-01-01').toISOString(),
  },
};

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          city: 'San Marcos',
          region: 'Texas',
          country_name: 'USA',
        }),
    })
  );
});

describe('Account', () => {
  it('renders user info after IP location is fetched', async () => {
    render(<Account user={mockUser} />);

    expect(await screen.findByText('Account Settings')).toBeInTheDocument();
    expect(screen.getByText(/Aldo Guerrero/i)).toBeInTheDocument();
    expect(screen.getByText(/aldo@example.com/i)).toBeInTheDocument();

    await screen.findByText((content) =>
      content.includes('San Marcos, Texas, USA')
    );

    expect(screen.getByText(/Member Since:/i)).toBeInTheDocument();
    expect(screen.getByText(/auto-detected/i)).toBeInTheDocument();
  });
});
