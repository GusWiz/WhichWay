import React from 'react';
import LoginButton from './LoginButton';
import InputField from './InputField';

function ForgotPassword() {
  return (
    <>
      <div className='container'>
        <h2 className='form-title'>Enter Your Email</h2>

        <form action='#' className='form'>
          <InputField type='email' placeholder='Email Address' />

          <LoginButton text='Send Verification Code' />
        </form>
      </div>
    </>
  );
}

export default ForgotPassword;
