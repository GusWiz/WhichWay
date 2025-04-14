import React from 'react';
import './login-styling.css';
import googlesvg from '../images/google.svg';

const SocialLogin = ({ onClick }) => {
  return (
    <div className='social-login'>
      <button className='social-button' onClick={() => onClick()}>
        <img src={googlesvg} atl='Google' className='social-icon' />
        Google
      </button>
    </div>
  );
};

export default SocialLogin;
