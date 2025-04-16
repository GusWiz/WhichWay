import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import ForgotPassword from '../src/components/Login-Components/ForgotPassword';

jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
}));

// Mock window.location.href because the component tries to redirect
const originalLocation = window.location; // Stores the original window.location
beforeAll(() => { // Before the Unit test run, delete the original window.location (aka login page)
    delete window.location;
    window.location = {herf: ''};
});
afterAll(() => {
    // once the test have ran restore the original window.location
    window.location = originalLocation;
});


mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

describe('ForgotPassword Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        window.location.href = '';
    });

    // Helps use to make the test run DRY (Don't repeate yourself)
    const renderForgotPassword = () => {
        render(<ForgotPassword />);
    };

    // Test case 1: Checks if the component renders the basic elements (2 input boxes) correctly
    it('renders the email input and send button', () => {
        renderForgotPassword();

        expect(screen.getByPlaceholderText(/Email Address/i)).toBeInTheDocument();

        expect(screen.getByRole('button', {name: /Send Email/i })).toBeInTheDocument();
    });

    // Test case 2: Checks if typing an email updates the value
    it('updates email input value on change', () => {
        renderForgotPassword();
        // Find the email input element
        const emailInput = screen.getByPlaceholderText(/Email Address/i);
        // Simulates a change event when user inputs
        fireEvent.change(emailInput, { target: { value: 'unitTest@example.com'}});
        expect(emailInput.value).toBe('unitTest@example.com');
    });
});