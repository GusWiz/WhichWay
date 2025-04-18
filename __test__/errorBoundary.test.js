import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../src/components/Homepage-Components/ErrorBoundary';

// A mock component that throws an error when rendered
const ProblemChild = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  it('renders child component when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Normal Component</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal Component')).toBeInTheDocument();
  });

  it('renders fallback UI when a child throws an error', () => {
    // Suppress error logs for cleaner test output
    jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();

    // Restore original error logger
    console.error.mockRestore();
  });
});
