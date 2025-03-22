import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import LoginButton from './LoginButton';
import InputField from './InputField';
import './login-styling.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert('email sent');
        window.location.href = '/login';
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };
  return (
    <>
      <div className='auth-page'>
        <div className='acontainer'>
          <h2 className='aform-title'>Enter Your Email</h2>

          <form className='aform' onSubmit={handleReset}>
            <InputField
              type='email'
              placeholder='Email Address'
              onChange={(e) => setEmail(e.target.value)}
            />

            <LoginButton text='Send Email' />
          </form>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
