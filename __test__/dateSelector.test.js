import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DateSelector from '../src/components/Createtrip-Components/DateSelector';
import '@testing-library/jest-dom';

// Mock react-datepicker to simplify the DOM
jest.mock('react-datepicker', () => (props) => {
  return (
    <div data-testid="mock-datepicker" onClick={() => props.onChange(new Date(2025, 3, 17))}>
      Mock DatePicker
    </div>
  );
});

describe('DateSelector', () => {
  it('renders with default display text', () => {
    render(<DateSelector />);
    expect(screen.getByText('Select travel dates')).toBeInTheDocument();
  });

  it('opens the date picker when clicked', () => {
    render(<DateSelector />);
    const textElement = screen.getByText('Select travel dates');
    fireEvent.click(textElement);

    expect(screen.getByTestId('mock-datepicker')).toBeInTheDocument();
  });

  it('calls onDateRangeChange after selecting a start and end date', () => {
    const mockCallback = jest.fn();
    render(<DateSelector onDateRangeChange={mockCallback} />);

    const textElement = screen.getByText('Select travel dates');
    fireEvent.click(textElement); // Open date picker

    const datePicker = screen.getByTestId('mock-datepicker');
    fireEvent.click(datePicker); // First click (start date)
    fireEvent.click(datePicker); // Second click (end date)

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({
      startDate: new Date(2025, 3, 17),
      endDate: new Date(2025, 3, 17),
    });
  });

  it('closes the picker when clicking outside', () => {
    render(<DateSelector />);
    const textElement = screen.getByText('Select travel dates');
    fireEvent.click(textElement); // Open picker
    expect(screen.getByTestId('mock-datepicker')).toBeInTheDocument();

    fireEvent.mouseDown(document); // Simulate outside click
    expect(screen.queryByTestId('mock-datepicker')).not.toBeInTheDocument();
  });
});
