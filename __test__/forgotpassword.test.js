import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/jest-dom';
import '@testing-library/jest-dom';
import { getAuth } from 'firebase/auth';
import ForgotPassword from '../src/components/Login-Components/ForgotPassword';
