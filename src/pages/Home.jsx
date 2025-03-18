import { signOut } from 'firebase/auth';
import { auth } from '../components/firebase';
import React from 'react';
import NavigationBar from '../components/Landing-Components/NavigationBar';
import Sidebar from '../components/Homepage-Components/Sidebar';
import TriponHome from '../components/Homepage-Components/TriponHome';
import './Home.css';

function Home() {
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
            <TriponHome />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
