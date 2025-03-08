import React from 'react';
import { useLocation } from 'react-router-dom';

import './Home.css';

import NavigationBar from '../components/Landing-Components/NavigationBar';
import Sidebar from '../components/Homepage-Components/Sidebar';

function Itinerary() {
  const logout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (error) {
      console.log(error);
    }
  };

  const location = useLocation();
  const {
    selectedFoods = [],
    selectedEntertainment = [],
    selectedOutdoor = [],
  } = location.state || {};

  return (
    <>
      <NavigationBar />
      <div className='home-page'>
        <div className='home-container'>
          <Sidebar logout={logout} />
          <div className='home-contents'>
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
          </div>
        </div>
      </div>
    </>
  );
}

export default Itinerary;
