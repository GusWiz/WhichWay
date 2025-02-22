import { signOut } from 'firebase/auth';
import { auth } from '../components/firebase';
import React from 'react';
import HomeBody from '../components/RoutingPage/HomeBody';
import NavigationBar from '../components/RoutingPage/NavigationBar';

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
      {/* <button onClick={logout}> Logout </button>
      <h1>Home Page</h1> */}
      <HomeBody />
    </>
  );
}

export default Home;
