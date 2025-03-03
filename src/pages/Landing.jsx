import React from 'react';
import './Landing.css';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/Landing-Components/NavigationBar';

// Mising proper routing after the buttons are pressed
function Landing() {
  const navigate = useNavigate();
  return (
    <>
      <NavigationBar />
      <main className='home-body'>
        <div className='option-boxes'>
          <button onClick={() => navigate('/CreateTrip')}>
            Create New Trip
          </button>
          <button onClick={() => navigate('/load-trip')}>
            Load Existing Trip
          </button>
        </div>
      </main>
    </>
  );
}

export default Landing;
