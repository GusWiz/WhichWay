import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../src/components/Login-Components/Login';
import '@testing-library/jest-dom';

// Mock components
jest.mock(
  '../src/components/Login-Components/SocialLogin',
  () =>
    ({ onClick }) => <button onClick={onClick}>Google</button>
);
jest.mock(
  '../src/components/Login-Components/InputField',
  () =>
    ({ type, placeholder, onChange }) => (
      <input type={type} placeholder={placeholder} onChange={onChange} />
    )
);
jest.mock(
  '../src/components/Login-Components/LoginButton',
  () =>
    ({ text }) => <button type='submit'>{text}</button>
);
jest.mock('../src/components/Landing-Components/NavigationBar', () => () => (
  <nav>NavigationBar</nav>
));

// Mock Firebase Auth
const mockSignInWithEmailAndPassword = jest.fn();
const mockSignInWithPopup = jest.fn();

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: (...args) =>
    mockSignInWithEmailAndPassword(...args),
  signInWithPopup: (...args) => mockSignInWithPopup(...args),
}));

jest.mock('../src/components/firebase', () => ({
  auth: {},
  googleProvider: {},
}));

describe('Login Component', () => {
  beforeEach(() => {
    delete window.location;
    window.location = { href: '' };
  });

  const renderLogin = () => {
    render(<Login />);
  };

  it('renders login form with inputs and buttons', () => {
    renderLogin();

    expect(screen.getByText(/Log in with/i)).toBeInTheDocument();
    expect(screen.getByText(/Google/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account/i)).toBeInTheDocument();
  });

  it('allows user to type email and password', () => {
    renderLogin();

    const emailInput = screen.getByPlaceholderText(/Email Address/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('123456');
  });

  it('calls signInWithEmailAndPassword on form submit', async () => {
    mockSignInWithEmailAndPassword.mockResolvedValue({ user: {} });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/Email Address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123'
      );
      expect(window.location.href).toBe('/home');
    });
  });

  it('calls signInWithPopup when Google button is clicked', async () => {
    mockSignInWithPopup.mockResolvedValue({ user: {} });

    renderLogin();

    fireEvent.click(screen.getByText(/Google/i));

    await waitFor(() => {
      expect(mockSignInWithPopup).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything()
      );
      expect(window.location.href).toBe('/home');
    });
  });

  it('shows alert on login error', async () => {
    const mockError = new Error('Login failed');
    mockSignInWithEmailAndPassword.mockRejectedValue(mockError);
    window.alert = jest.fn();

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/Email Address/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Login failed');
    });
  });

  it('logs error on Google login failure', async () => {
    const mockError = new Error('Google Sign-In Failed');
    mockSignInWithPopup.mockRejectedValue(mockError);
    console.error = jest.fn();

    renderLogin();

    fireEvent.click(screen.getByText(/Google/i));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Google Sign-In Error: ',
        'Google Sign-In Failed'
      );
    });
  });
});
