import React from 'react';
import SocialLogin from './SocialLogin';
import LoginButton from './LoginButton';
import InputField from './InputField';

function Signup() {
  return (
    <>
      <div className='container'>
        <h2 className='form-title'>Signup with</h2>
        <SocialLogin />

        <p className='separator'>
          <span>or</span>
        </p>

        <form action='#' className='form'>
          <InputField type='text' placeholder='First Name' />
          <InputField type='text' placeholder='Last Name' />
          <InputField type='email' placeholder='Email Address' />
          <InputField type='password' placeholder='Password' />
          <InputField type='password' placeholder='Confirm Password' />

          <LoginButton text='Sign Up' />
        </form>
        <p className='text'>
          Already have an account?{' '}
          <a href='./src/components/Login.jsx'>Login</a>
        </p>
      </div>
    </>
  );
}

export default Signup;
