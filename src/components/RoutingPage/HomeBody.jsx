import React from 'react';
import '../../HomeBody.css';
import NavigationBar from './NavigationBar';
import { useNavigate } from 'react-router-dom';

// Mising proper routing after the buttons are pressed
function HomeBody() {
  const navigate = useNavigate();

  return (
    <>
      <NavigationBar />
      <main className='home-body'>
        <div className='option-boxes'>
          <button onClick={() => navigate('/create-trip')}>
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

export default HomeBody;
