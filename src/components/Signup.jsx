import React from 'react';

function Signup() {
  return (
    <>
      <div className='container'>
        <h2 className='form-title'>Signup with</h2>
        <div className='social-login'>
          <button className='social-button'>
            <img
              src='./src/assets/google.svg'
              alt='Google'
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
              type='text'
              placeholder='First Name'
              className='input-field'
              required
            />
          </div>

          <div className='input-wrapper'>
            <input
              type='text'
              placeholder='Last Name'
              className='input-field'
              required
            />
          </div>

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

          <div className='input-wrapper'>
            <input
              type='password'
              placeholder='Confirm Password'
              className='input-field'
              required
            />
          </div>
          <button className='button'>Signup</button>
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
