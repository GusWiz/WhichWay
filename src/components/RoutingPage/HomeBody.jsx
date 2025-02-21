import React from 'react';
//import '../../static/HomeBody.css';

// Mising proper routing after the buttons are pressed
function HomeBody() {
  return (
    <main className="home-container"> 
      <div className="option-boxes"> 
        <button onClick={() => history.push('/create-trip')}>Create New Trip</button>
        <button onClick={() => history.push('/load-trip')}>Load Existing Trip</button>
      </div>
    </main>
  );
}

export default HomeBody;