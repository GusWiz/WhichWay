import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TripManager from '../src/components/Homepage-Components/TriponHome';
import * as firestore from 'firebase/firestore';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../src/components/firebase.js', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
}));

const mockTrips = [
  {
    id: '1',
    name: 'Trip to Mars',
    date: '2099-01-01',
    destination: 'Mars',
  },
  {
    id: '2',
    name: 'Trip to the Moon',
    date: '2020-01-01',
    destination: 'Moon',
  },
];

describe('TripManager', () => {
  beforeEach(() => {
    firestore.getDocs.mockResolvedValue({
      docs: mockTrips.map((trip) => ({
        id: trip.id,
        data: () => ({
          name: trip.name,
          date: trip.date,
          destination: trip.destination,
        }),
      })),
    });
  });

  it('renders without crashing and shows title', async () => {
    render(
      <BrowserRouter>
        <TripManager />
      </BrowserRouter>
    );

    expect(screen.getByText('Trip Dashboard')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Trip to Mars')).toBeInTheDocument();
      expect(screen.getByText('Trip to the Moon')).toBeInTheDocument();
    });
  });

  it('can toggle visibility of trip sections', async () => {
    render(
      <BrowserRouter>
        <TripManager />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Trip to Mars')).toBeInTheDocument();
    });

    const toggleButton = screen.getByText('Hide Upcoming Trips');
    fireEvent.click(toggleButton);
    expect(screen.queryByText('Trip to Mars')).not.toBeInTheDocument();
    fireEvent.click(toggleButton);
    expect(screen.queryByText('Trip to Mars')).toBeInTheDocument();
  });

  it('handles input changes and adds a new trip', async () => {
    firestore.addDoc.mockResolvedValue({ id: '3' });

    render(
      <BrowserRouter>
        <TripManager />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { value: 'Trip to Pluto' },
    });
    fireEvent.change(screen.getByPlaceholderText('Date'), {
      target: { value: '2100-12-12' },
    });
    fireEvent.change(screen.getByPlaceholderText('Destination'), {
      target: { value: 'Pluto' },
    });

    fireEvent.click(screen.getByText('Add Trip'));

    await waitFor(() => {
      expect(firestore.addDoc).toHaveBeenCalledTimes(1);
    });
  });

  it('allows editing an inline field (EditableField)', async () => {
    render(
      <BrowserRouter>
        <TripManager />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Trip to Mars')).toBeInTheDocument();
    });

    const span = screen.getByText('Trip to Mars');
    fireEvent.click(span);

    const input = screen.getByDisplayValue('Trip to Mars');
    fireEvent.change(input, { target: { value: 'Trip to Saturn' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(firestore.updateDoc).toHaveBeenCalled();
    });
  });
});
