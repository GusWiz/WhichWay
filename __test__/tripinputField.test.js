import TripInputField from '../src/components/Createtrip-Components/TripInputField';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';

describe('TripInputField', () => {
  it('renders the input field with correct props and responds to changes', () => {
    const mockOnChange = jest.fn();
    const props = {
      type: 'text',
      placeholder: 'Destination',
      value: 'Austin',
      onChange: mockOnChange,
      name: 'destination',
    };

    render(<TripInputField {...props} />);

    const input = screen.getByPlaceholderText('Destination');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Austin');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('name', 'destination');

    fireEvent.change(input, { target: { value: 'Dallas' } });
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });
});
