import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../components/firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { generateItineraryService } from '../api/itineraryFunctions';

import './Home.css';
import './Landing.css';
import './CreateItinerary.css';

import NavigationBar from '../components/Landing-Components/NavigationBar';
import Sidebar from '../components/Homepage-Components/Sidebar';

function Itinerary() {
  const navigate = useNavigate();
  const location = useLocation();
  const [itineraryData, setItineraryData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get data from location state or use defaults
  const {
    location: tripLocation = 'San Marcos',
    startDate: startDateValue = '2025-04-15',
    duration: durationValue = '3 days',
    selectedFoods = [],
    selectedEntertainment = [],
    selectedOutdoor = [],
    tripName = 'My Trip'
  } = location.state || {};

  const logout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (error) {
      console.log(error);
    }
  };

  // Function to generate itinerary with OpenAI
  const handleRegenerateItinerary = async () => {
    setLoading(true);
    try {
      // Create activities array from selected items
      const activityList = [
        ...selectedFoods.map(food => food.name),
        ...selectedEntertainment.map(entertainment => entertainment.name),
        ...selectedOutdoor.map(outdoor => outdoor.name)
      ];

      // Use default activities if activityList is empty
      const finalActivityList = activityList.length > 0 ? activityList : [
        'Chilis',
        'Sewell Park',
        'test',
        'EVO',
        'Chi Lantro',
        'Golds Gym',
        'Hiking trail',
      ];

      // Construct the OpenAI request content
      const openaiRequest = `
Location: ${tripLocation}
Start date: ${startDateValue}
Duration: ${durationValue}
Activity List:
${finalActivityList.map((activity) => `- ${activity}`).join('\n')}
`;

      console.log('OpenAI Request:', openaiRequest);

      // Call the itinerary generation service
      const newItinerary = await generateItineraryService({
        location: tripLocation,
        startDate: startDateValue,
        duration: durationValue,
        activities: finalActivityList,
      });

      if (!newItinerary || !newItinerary.schedule) {
        throw new Error('Failed to generate a valid itinerary');
      }

      setItineraryData(newItinerary.schedule || []);
      toast.success('Itinerary generated successfully!');
    } catch (error) {
      console.error('Error regenerating itinerary:', error);
      toast.error('Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Test function with custom parameters
  const testWithCustomParams = () => {
    const testParams = {
      location: 'New York City',
      startDate: '2025-06-15',
      duration: '7 days',
      selectedFoods: [{ name: 'Pizza' }, { name: 'Bagels' }],
      selectedEntertainment: [{ name: 'Broadway Show' }, { name: 'Central Park' }],
      selectedOutdoor: [{ name: 'High Line' }]
    };

    // Update component state with test parameters
    Object.keys(testParams).forEach(key => {
      // Use this approach to avoid directly mutating location.state
      window.history.replaceState(
        { ...location.state, [key]: testParams[key] },
        document.title
      );
    });

    // Call the regenerate function
    handleRegenerateItinerary();
  };

  return (
    <>
      <NavigationBar />
      <div className="home-page">
        <div className="home-container">
          <Sidebar logout={logout} />
          <div className="home-contents">
            <div className="itinerary-container">
              <div className="createititnerary-title">
                <h1>Create Itinerary</h1>
                <h2>for {tripLocation}</h2>
              </div>

              {/* Display loading spinner or itinerary data */}
              {loading ? (
                <div className="loading-container">
                  <p>Loading itinerary...</p>
                  <div className="spinner"></div>
                </div>
              ) : itineraryData.length > 0 ? (
                itineraryData.map((dayData, dayIndex) => (
                  <div key={dayIndex} className="itinerary-day">
                    <div className="itinerary-daytitle">
                      <h2>Day {dayIndex + 1}: {dayData.date}</h2>
                    </div>
                    <div className="itinerary-itemscontainer">
                      {dayData.activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className="itinerary-item">
                          <div className="itinerary-itemtime">
                            <h3>
                              {activity.start_time} - {activity.end_time || 'TBD'}
                            </h3>
                          </div>
                          <div className="itinerary-item-details">
                            <div className="itinerary-item-title">
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
                  No itinerary data available. Click "Generate Itinerary" to
                  create one.
                </p>
              )}

              {/* Buttons for managing itinerary */}
              <div className="itinerary-buttons">
                <button
                  className="itinerary-button"
                  onClick={handleRegenerateItinerary}
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate Itinerary"}
                </button>

                {/* <button
                  className="itinerary-button"
                  onClick={testWithCustomParams}
                  disabled={loading}
                >
                  Test Custom Params
                </button> */}

                <button
                  className="itinerary-button"
                  onClick={() => navigate('/home')}
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-center" />
    </>
  );
}

export default Itinerary;
