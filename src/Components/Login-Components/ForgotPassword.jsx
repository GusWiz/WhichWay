import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import LoginButton from './LoginButton';
import InputField from '../InputField';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert('email sent');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };
  return (
    <>
      <div className='container'>
        <h2 className='form-title'>Enter Your Email</h2>

        <form className='form'>
          <InputField
            type='email'
            placeholder='Email Address'
            onChange={(e) => setEmail(e.target.value)}
          />

          <LoginButton
            text='Send Verification Code'
            onClick={handleReset}
            type='button'
          />
        </form>
      </div>
    </>
  );
}

export default ForgotPassword;
