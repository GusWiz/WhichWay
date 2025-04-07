import { signOut } from 'firebase/auth';
import { auth } from '../components/firebase';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import './Home.css';
import './Landing.css';
import './CreateItinerary.css';

import NavigationBar from '../components/Landing-Components/NavigationBar';
import Sidebar from '../components/Homepage-Components/Sidebar';
import logo from '../components/images/logo.svg';
import { duration } from '@mui/material';

function Itinerary() {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (error) {
      console.log(error);
    }
  };
  const location = useLocation();
  const [itineraryData, setItineraryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    location: tripLocation,
    startDate,
    duration,
    selectedFoods = [],
    selectedEntertainment = [],
    selectedOutdoor = [],
  } = location.state || {};

const handleRegenerateItinerary = async () => {
  setLoading(true);
  // Create activities array from selected items
  const activityList = [
    ...selectedFoods.map(food => food.name),
    ...selectedEntertainment.map(entertainment => entertainment.name),
    ...selectedOutdoor.map(outdoor => outdoor.name)
  ];
  try {
    // Ensure all required variables have fallback values
    const location = tripLocation || 'Austin';
    const startDateValue = startDate || '2025-05-22';
    const durationValue = duration || '10 days';
    const activityList = activities.length > 0 ? activities : [
      'Chilis',
      'Sewell Park',
      'Double Daves',
      'EVO',
      'Chi Lantro',
      'Golds Gym',
      'Hiking trail',
    ];

    // Construct the OpenAI request content
    const openaiRequest = `
Location: ${location}
Start date: ${startDateValue}
Duration: ${durationValue}
Activity List:
${activityList.map((activity) => `- ${activity}`).join('\n')}
`;

    console.log('OpenAI Request:', openaiRequest); // Debugging the request

    // Call the itinerary generation service
    const newItinerary = await generateItineraryService({
      location,
      startDate: startDateValue,
      duration: durationValue,
      activities: activityList,
    });

    setItineraryData(newItinerary.schedule || []);
    console.log('New itinerary generated:', newItinerary);
  } catch (error) {
    console.error('Error regenerating itinerary:', error);
  } finally {
    setLoading(false);
  }
};

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
              </div>

              {/* Display loading spinner or itinerary data */}
              {loading ? (
                <div className='loading-container'>
                  <p>Loading itinerary...</p>
                </div>
              ) : itineraryData.length > 0 ? (
                itineraryData.map((dayData, dayIndex) => (
                  <div key={dayIndex} className='itinerary-day'>
                    <div className='itinerary-daytitle'>
                      <h2>Day {dayIndex + 1}</h2>
                    </div>
                    <div className='itinerary-itemscontainer'>
                      {dayData.activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className='itinerary-item'>
                          <div className='itinerary-itemtime'>
                            <h3>
                              {activity.start_time} - {activity.end_time}
                            </h3>
                          </div>
                          <div className='itinerary-item-details'>
                            <div className='itinerary-item-title'>
                              <h3>{activity.name}</h3>
                            </div>
                            <p>
                              {activity.description ||
                                'No description available'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p>
                  No itinerary data available. Click "Regenerate Itinerary" to
                  create one.
                </p>
              )}

              {/* Buttons for regenerating and saving the itinerary */}
              <div className='itinerary-buttons'>
                <button
                  className='itinerary-button'
                  onClick={handleRegenerateItinerary}
                  disabled={loading}
                >
                  {loading ? 'Regenerating...' : 'Regenerate Itinerary'}
                </button>
                <button
                  className='itinerary-button'
                  onClick={() => navigate('/home')}
                >
                  Save Itinerary
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Itinerary;
