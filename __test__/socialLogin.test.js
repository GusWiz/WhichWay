import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SocialLogin from '../src/components/Login-Components/SocialLogin';
import '@testing-library/jest-dom';

// Mock image import
jest.mock('../src/images/google.svg', () => 'google.svg');

describe('SocialLogin', () => {
  it('renders the Google login button with icon and text', () => {
    render(<SocialLogin onClick={() => {}} />);

    const button = screen.getByRole('button', { name: /google/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('social-button');

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'google.svg');
    expect(image).toHaveClass('social-icon');
  });

  it('calls the onClick function when button is clicked', () => {
    const handleClick = jest.fn();
    render(<SocialLogin onClick={handleClick} />);

    const button = screen.getByRole('button', { name: /google/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
