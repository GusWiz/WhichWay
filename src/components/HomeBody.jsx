import React from 'react';
import '../static/HomeBody.css'; // Import the CSS file

function HomeBody() {
  return (
    <main className="home-body">
      <div className="option-boxes">
        <button onClick={() => history.push('/create-trip')}>Create New Trip</button>
        <button onClick={() => history.push('/load-trip')}>Load Existing Trip</button>
      </div>
    </main>
  );
}

export default HomeBody;