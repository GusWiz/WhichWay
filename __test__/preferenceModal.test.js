import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PreferenceModal from '../src/components/Createtrip-Components/PreferenceModal';
import '@testing-library/jest-dom';

jest.mock('../src/components/firebase.js', () => ({
  db: {},
}));
jest.mock('../src/backend/dataCollect', () => ({
  collectPreferences: jest.fn(),
  getPreferences: jest.fn(() => ({
    cuisine: 'asian',
    activityType: 'entertainment',
    budget: 'medium',
    transportation: 'public',
    moreDetails: '',
  })),
}));
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(async () => ({ id: 'mocked-id' })),
}));

describe('PreferenceModal', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  }); //makes the unit test look clean and can be removed to see the actual output if needed

  it('renders modal content', () => {
    render(<PreferenceModal onClose={() => {}} />);

    expect(screen.getByText('Trip Preferences')).toBeInTheDocument();
    expect(screen.getByLabelText(/Cuisine Preference/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Activity Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Budget Preference/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Transportation Preference/i)
    ).toBeInTheDocument();
  });

  it('fills and submits form', async () => {
    const mockClose = jest.fn();
    render(<PreferenceModal onClose={mockClose} />);

    fireEvent.change(screen.getByLabelText(/Cuisine Preference/i), {
      target: { value: 'asian' },
    });
    fireEvent.change(screen.getByLabelText(/Activity Type/i), {
      target: { value: 'entertainment' },
    });
    fireEvent.change(screen.getByLabelText(/Budget Preference/i), {
      target: { value: 'medium' },
    });
    fireEvent.change(screen.getByLabelText(/Transportation Preference/i), {
      target: { value: 'public' },
    });
    fireEvent.change(screen.getByLabelText(/Additional Details/i), {
      target: { value: 'No allergies' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: /Submit Preferences/i })
    );

    await waitFor(() => {
      expect(mockClose).toHaveBeenCalled();
    });
  });

  it('calls onClose when X button is clicked', () => {
    const mockClose = jest.fn();
    render(<PreferenceModal onClose={mockClose} />);

    const closeBtn = screen.getByTestId('close-btn');
    fireEvent.click(closeBtn);
    expect(mockClose).toHaveBeenCalled();
  });
});
