import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

import SocialLogin from './SocialLogin';
import LoginButton from './LoginButton';
import InputField from './InputField';
import NavigationBar from '../Landing-Components/NavigationBar';

// CSS
import './login-styling.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in Successfully');
      window.location.href = '/home';
    } catch (error) {
      console.log(error.message);
      const errorMessage = error.message;
      alert(errorMessage);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      window.location.href = '/home';
    } catch (error) {
      console.error('Google Sign-In Error: ', error.message);
    }
  };
  return (
    <>
      <NavigationBar />
      <div className='auth-page'>
        <div className='acontainer'>
          <h2 className='aform-title'>Log in with</h2>
          <SocialLogin onClick={signInWithGoogle} />

          <p className='aseparator'>
            <span>or</span>
          </p>

          <form className='aform' onSubmit={handleLogin}>
            <InputField
              type='email'
              placeholder='Email Address'
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
              type='password'
              placeholder='Password'
              onChange={(e) => setPassword(e.target.value)}
            />

            <a href='/ForgotPassword' className='forgot-pass-link'>
              Forgot Password?
            </a>

            <LoginButton text='Log In' />
          </form>

          <p className='atext'>
            Don't have an account? <Link to='/signup'>Signup</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
