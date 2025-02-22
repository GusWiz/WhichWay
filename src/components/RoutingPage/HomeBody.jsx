import React from 'react';
import '../../HomeBody.css';
import Sidebar from '../Homepage-Components/Sidebar';

// Mising proper routing after the buttons are pressed
function HomeBody() {
  return (
    <>
      <Sidebar />
      <main className='home-body'>
        <div className='option-boxes'>
          <button onClick={() => history.push('/create-trip')}>
            Create New Trip
          </button>
          <button onClick={() => history.push('/load-trip')}>
            Load Existing Trip
          </button>
        </div>
      </main>
    </>
  );
}

export default HomeBody;
