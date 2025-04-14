import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InputField from '../src/components/Login-Components/InputField';
import '@testing-library/jest-dom';

describe('InputField', () => {
  it('renders input field with correct type and placeholder', () => {
    render(
      <InputField
        type='text'
        placeholder='Enter your name'
        onChange={() => {}}
      />
    );

    const inputElement = screen.getByPlaceholderText('Enter your name');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'text');
    expect(inputElement).toHaveClass('ainput-field');
  });

  it('calls onChange handler when input value changes', () => {
    const mockOnChange = jest.fn();
    render(
      <InputField
        type='password'
        placeholder='Enter password'
        onChange={mockOnChange}
      />
    );

    const inputElement = screen.getByPlaceholderText('Enter password');
    fireEvent.change(inputElement, { target: { value: 'new password' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('has required attribute', () => {
    render(
      <InputField type='email' placeholder='Enter email' onChange={() => {}} />
    );

    const inputElement = screen.getByPlaceholderText('Enter email');
    expect(inputElement).toHaveAttribute('required');
  });
});
