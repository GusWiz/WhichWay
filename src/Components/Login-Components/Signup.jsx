import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import SocialLogin from './SocialLogin';
import LoginButton from './LoginButton';
import InputField from '../InputField';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);
      console.log('User Registered Successfully!');
    } catch (error) {
      console.log(error.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign-In Error: ', error.message);
    }
  };
  return (
    <>
      <div className='container'>
        <h2 className='form-title'>Signup with</h2>
        <SocialLogin onClick={signInWithGoogle} />

        <p className='separator'>
          <span>or</span>
        </p>

        <form className='form' onSubmit={handleRegister}>
          <InputField
            type='text'
            placeholder='First Name'
            onChange={(e) => setFname(e.target.value)}
          />
          <InputField
            type='text'
            placeholder='Last Name'
            onChange={(e) => setLname(e.target.value)}
          />
          <InputField
            type='email'
            placeholder='Email Address'
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            type='password'
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputField type='password' placeholder='Confirm Password' />

          <LoginButton text='Sign Up' />
        </form>
        <p className='text'>
          Already have an account? <Link to='/Login'>Login</Link>
        </p>
      </div>
    </>
  );
}

export default Signup;
