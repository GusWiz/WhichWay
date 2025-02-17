import React from 'react';
import LoginButton from '../Login-Components/LoginButton';
import InputField from '../InputField';

function CreateTrip() {
  return (
    <>
      <div className='container'>
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

export default CreateTrip;
