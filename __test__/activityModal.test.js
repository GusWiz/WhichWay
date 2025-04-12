import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ActivityModal from '../src/components/Createtrip-Components/ActivityModal';
import '@testing-library/jest-dom';

const mockItem = {
  name: 'Sunset Hike',
  imgSrc: '/sunset.jpg',
  description: 'A peaceful hike during sunset.',
  groupSize: '2-6',
  priceRange: '$',
  rating: '4.8',
  userRatingCount: 54,
  atmosphere: 'Relaxed',
  vicinity: 'Hill Country, TX',
};

describe('ActivityModal', () => {
  it('renders correctly with provided item', () => {
    render(<ActivityModal show={true} closeModal={() => {}} item={mockItem} />);

    expect(screen.getAllByText('Sunset Hike').length).toBeGreaterThan(0);
    expect(screen.getByText('A peaceful hike during sunset.')).toBeInTheDocument();
    expect(screen.getAllByText(/Group Size:/)).toHaveLength(2); // Appears twice
    expect(screen.getByText(/4.8/)).toBeInTheDocument();
    expect(screen.getByText(/Hill Country, TX/)).toBeInTheDocument();
  });

  it('calls closeModal when close button is clicked', () => {
    const mockClose = jest.fn();
    render(<ActivityModal show={true} closeModal={mockClose} item={mockItem} />);

    const buttons = screen.getAllByRole('button', { name: /×|close/i });
    fireEvent.click(buttons[0]);
    expect(mockClose).toHaveBeenCalled();
  });

  it('does not render when show is false', () => {
    render(<ActivityModal show={false} closeModal={() => {}} item={mockItem} />);
    expect(screen.queryByText('Sunset Hike')).not.toBeInTheDocument();
  });
});
