import React from 'react';
import LoginButton from './LoginButton';
import InputField from '../InputField';

function ResetPassword() {
  return (
    <>
      <div className='container'>
        <h2 className='form-title'>Enter A New Password</h2>

        <form action='#' className='form'>
          <InputField type='password' placeholder='Password' />
          <InputField type='password' placeholder='Confirm Password' />

          <LoginButton text='Change Password' />
        </form>
      </div>
    </>
  );
}

export default ResetPassword;
