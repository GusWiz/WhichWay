import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import LoginButton from '../src/components/Login-Components/LoginButton';

describe('LoginButton Component', () => {
  it('renders with the correct text', () => {
    render(<LoginButton text='Login' />);
    const buttonElement = screen.getByRole('button', { name: /login/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('has the correct class name', () => {
    render(<LoginButton text='Sign In' />);
    const buttonElement = screen.getByRole('button', { name: /sign in/i });
    expect(buttonElement).toHaveClass('abutton');
  });

  it('is a submit type button', () => {
    render(<LoginButton text='Submit' />);
    const buttonElement = screen.getByRole('button', { name: /submit/i });
    expect(buttonElement).toHaveAttribute('type', 'submit');
  });
});
