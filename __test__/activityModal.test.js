import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ActivityModal from '../src/components/Createtrip-Components/ActivityModal';
import '@testing-library/jest-dom';

const mockItem = {
  name: 'Sunset Hike',
  imgSrc: '/sunset.jpg',
  description: 'A beautiful hike during sunset.',
  groupSize: '4-8',
  priceRange: '$$',
  rating: '4.8',
  userRatingCount: 150,
  atmosphere: 'Relaxed',
  vicinity: 'Hill Country, TX',
};

const mockClose = jest.fn();

describe('ActivityModal', () => {
  it('does not render when show is false', () => {
    const { container } = render(
      <ActivityModal show={false} item={mockItem} closeModal={mockClose} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly with provided item', () => {
    render(<ActivityModal show={true} item={mockItem} closeModal={mockClose} />);

    expect(screen.getByText('Sunset Hike')).toBeInTheDocument();
    expect(screen.getByText('A beautiful hike during sunset.')).toBeInTheDocument();
    expect(screen.getByText(/Group Size:/)).toHaveTextContent('Group Size: 4-8');
    expect(screen.getByText(/Price Range:/)).toHaveTextContent('Price Range: $$');
    expect(screen.getByText(/Rating:/)).toHaveTextContent('★ 4.8 (150 reviews)');
    expect(screen.getByText(/Location:/)).toHaveTextContent('Hill Country, TX');
    expect(screen.getByText('Relaxed')).toBeInTheDocument();
  });

  it('renders fallback values when some fields are missing', () => {
    const partialItem = {
      name: 'Mystery Spot',
      rating: 'N/A',
    };

    render(<ActivityModal show={true} item={partialItem} closeModal={mockClose} />);

    expect(screen.getByText('No description available for this item.')).toBeInTheDocument();
    expect(screen.getByText('Group Size: Not specified')).toBeInTheDocument();
    expect(screen.getByText('Atmosphere not specified')).toBeInTheDocument();
    expect(screen.getByText('No ratings yet')).toBeInTheDocument();
  });

  it('calls closeModal when the close button is clicked', () => {
    render(<ActivityModal show={true} item={mockItem} closeModal={mockClose} />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach(btn => fireEvent.click(btn)); // simulate both × and Close clicks

    expect(mockClose).toHaveBeenCalled();
  });
});
