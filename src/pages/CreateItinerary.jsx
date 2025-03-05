import React from 'react';
import { useLocation } from 'react-router-dom';

function Itinerary() {
  const location = useLocation();
  const {
    selectedFoods = [],
    selectedEntertainment = [],
    selectedOutdoor = [],
  } = location.state || {};

  return (
    <div className='itinerary-container'>
      <h1>Itinerary</h1>

      <div className='itinerary-section'>
        <h3>Food</h3>
        <ul>
          {selectedFoods.map((food) => (
            <li key={food}>{food}</li>
          ))}
        </ul>
      </div>

      <div className='itinerary-section'>
        <h3>Entertainment</h3>
        <ul>
          {selectedEntertainment.map((entertainment) => (
            <li key={entertainment}>{entertainment}</li>
          ))}
        </ul>
      </div>

      <div className='itinerary-section'>
        <h3>Outdoor</h3>
        <ul>
          {selectedOutdoor.map((outdoor) => (
            <li key={outdoor}>{outdoor}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Itinerary;
