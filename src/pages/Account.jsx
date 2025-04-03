import { signOut } from 'firebase/auth';
import { auth } from '../components/firebase';
import React from 'react';

import './Home.css';

import NavigationBar from '../components/Landing-Components/NavigationBar';
import Sidebar from '../components/Homepage-Components/Sidebar';

function Account() {
  const logout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <NavigationBar />
      <div className='home-page'>
        <div className='home-container'>
          <Sidebar logout={logout} />
          <div className='home-contents'>
            <div className='home-card'>
              <p>Coming Soon Maybe</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Account;
