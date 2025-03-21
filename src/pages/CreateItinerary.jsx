import React from 'react';
import { useLocation } from 'react-router-dom';

import './Home.css';
import './CreateItinerary.css';

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
              <div className='createititnerary-title'>
                <h1>Create Itinerary</h1>

                <div className='itinerary-day'>
                  <h1>Day 1</h1>

                  <div className='itinerary-item'>
                    <h1>9:00 AM - 12:00 PM</h1>

                    <div className='itinerary-item-details'>
                      <h1>Double Dave's</h1>
                    </div>
                  </div>

                  <div className='itinerary-item'>
                    <h1>12:00 PM - 2:00 PM</h1>

                    <div className='itinerary-item-details'>
                      <h1>Triple Dave's</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Itinerary;
