import React from 'react';
import SocialLogin from './SocialLogin';
import LoginButton from './LoginButton';
import InputField from './InputField';

function Login() {
  return (
    <>
      <div className='container'>
        <h2 className='form-title'>Log in with</h2>
        <SocialLogin />

        <p className='separator'>
          <span>or</span>
        </p>

        <form action='#' className='form'>
          <InputField type='email' placeholder='Email Address' />
          <InputField type='password' placeholder='Password' />

          <a href='#' className='forgot-pass-link'>
            Forgot Password?
          </a>

          <LoginButton text='Log In' />
        </form>

        <p className='text'>
          Don't have an account?{' '}
          <a href='./src/components/Signup.jsx'>Signup</a>
        </p>
      </div>
    </>
  );
}

export default Login;
