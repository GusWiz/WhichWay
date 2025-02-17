import React from 'react';

function Login() {
  return (
    <>
      <div className='container'>
        <h2 className='form-title'>Log in with</h2>
        <div className='social-login'>
          <button className='social-button'>
            <img
              src='./src/assets/google.svg'
              atl='Google'
              className='social-icon'
            />
            Google
          </button>
        </div>

        <p className='separator'>
          <span>or</span>
        </p>

        <form action='#' className='form'>
          <div className='input-wrapper'>
            <input
              type='email'
              placeholder='Email'
              className='input-field'
              required
            />
          </div>

          <div className='input-wrapper'>
            <input
              type='password'
              placeholder='Password'
              className='input-field'
              required
            />
          </div>
          <a href='#' className='forgot-pass-link'>
            Forgot Password?
          </a>
          <button className='button'>Log In</button>
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
