import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, googleProvider, db } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';

import SocialLogin from './SocialLogin';
import LoginButton from './LoginButton';
import InputField from './InputField';

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
      if (user) {
        await setDoc(doc(db, 'Users', user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
        });
      }
      console.log('User Registered Successfully!');
      window.location.href = '/home';
    } catch (error) {
      console.log(error.message);
      const errorMessage = error.message;
      alert(errorMessage);
    }
  };

  const signInWithGoogle = async () => {
    try {
      // userCredentials is the object that contains the user information
      // from the Google sign-in
      const userCredentials = await signInWithPopup(auth, googleProvider);
      const user = userCredentials.user;
      await setDoc(
        doc(db, 'Users', user.uid),
        {
          email: user.email,
          firstName: user.displayName.split(' ')[0],
          lastName: user.displayName.split(' ')[1],
        },
        { merge: true }
      );
      window.location.href = '/home';
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
