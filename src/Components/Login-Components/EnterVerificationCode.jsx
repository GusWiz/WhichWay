import React from 'react';
import SocialLogin from './SocialLogin';
import LoginButton from './LoginButton';
import InputField from './InputField';
import Login from './Login';

function EnterVerificationCode() {
  return (
    <>
      <div className='container'>
        <h2 className='form-title'>Enter Verification Code</h2>

        <form action='#' className='form'>
          <InputField type='text' placeholder='Code' />
          <LoginButton text='Enter' />
        </form>
      </div>
    </>
  );
}

export default EnterVerificationCode;
