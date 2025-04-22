import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../components/firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import directly from backend instead of through api layer
import { generateItinerary } from '../backend/openAI';
import { saveUserItinerary } from '../components/api/dataModel';
// Add this import at the top with your other imports
import { fetchPlaceDetails } from '../components/api/placesService';

import './Home.css';
import './Landing.css';
import './CreateItinerary.css';

import NavigationBar from '../components/Landing-Components/NavigationBar';
import Sidebar from '../components/Homepage-Components/Sidebar';

function Itinerary() {
  const navigate = useNavigate();
  const location = useLocation();
  const printRef = useRef(null);

  // Get data from location state or use defaults
  const {
    location: tripLocation = 'San Marcos',
    startDate: startDateValue = '2025-04-15',
    duration: durationValue = '3 days',
    selectedFoods = [],
    selectedEntertainment = [],
    selectedOutdoor = [],
    tripName = 'My Trip',
    tripId = null,
    itineraryData: initialItineraryData = [],
  } = location.state || {};

  // Use the provided itinerary data if available
  const [itineraryData, setItineraryData] = useState(initialItineraryData);
  const [loading, setLoading] = useState(false);
  const [selectedSchedule, setSchedule] = useState(null);
  const [selectedName, setName] = useState(null);

  const logout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (error) {
      console.log(error);
    }
  };

  // const exportItinerary = () => {
  //   const stringSchedule = JSON.stringify(itineraryData);
  //   const stringName = JSON.stringify(name);
  //   localStorage.setItem('exportSchedule', schedule);
  //   localStorage.setItem('exportTripName', name);
  //   const printWindow = window.open('/export', '_blank');
  //   printWindow.focus();
  // };

  const getItineraryData = () => {
    if (!itineraryData || itineraryData.length === 0) {
      return null;
    }

    return {
      name: tripName,
      schedule: itineraryData,
    };
  };

  // Check this function in your CreateItinerary.jsx
  const itineraryToDb = async () => {
    try {
      // First check if we have valid data
      if (!itineraryData || itineraryData.length === 0) {
        toast.error('No itinerary data to save');
        return;
      }

      // Sanitize data for Firestore (replace undefined with null)
      const sanitizeForFirestore = (obj) => {
        if (obj === undefined) return null;
        if (obj === null || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) return obj.map(sanitizeForFirestore);

        const result = {};
        for (const [key, value] of Object.entries(obj)) {
          result[key] = sanitizeForFirestore(value);
        }
        return result;
      };

      // Process and sanitize the itinerary data
      const processedSchedule = itineraryData.map((day) => ({
        ...day,
        activities: day.activities.map((activity) => {
          // Build a clean activity object with fallbacks for all fields
          return {
            name: activity.name || 'Unnamed Activity',
            start_time: activity.start_time || '12:00 PM',
            end_time: activity.end_time || '1:00 PM',
            description: activity.description || `Visit ${activity.name}`,
            location: activity.location || 'Location not specified',
            // Google Places data with fallbacks
            placeId: activity.placeId || null,
            rating: activity.rating || null,
            photoUrls: activity.photoUrls || [],
            priceRange: activity.priceRange || null,
            website: activity.website || null,
            vicinity: activity.vicinity || null,
            opening_hours: activity.opening_hours || null,
          };
        }),
      }));

      // Final sanitization to catch any remaining undefined values
      const sanitizedSchedule = sanitizeForFirestore(processedSchedule);

      // Save to database
      const itineraryId = await saveUserItinerary(
        auth.currentUser?.uid,
        tripId || null,
        {
          name: tripName || 'My Itinerary',
          schedule: sanitizedSchedule,
        }
      );

      if (itineraryId) {
        toast.success('Itinerary saved successfully!');
      }
    } catch (error) {
      console.error('Error saving itinerary:', error);
      toast.error('Failed to save itinerary: ' + error.message);
    }
  };

  // Function to generate itinerary with OpenAI directly
  // Uses the same approach as in EditTrip.jsx
  const handleGenerateItinerary = async () => {
    setLoading(true);
    try {
      // Create activities array from selected items
      const activityList = [
        ...selectedFoods.map((food) => food.name),
        ...selectedEntertainment.map((entertainment) => entertainment.name),
        ...selectedOutdoor.map((outdoor) => outdoor.name),
      ];

      // Use default activities if activityList is empty
      const finalActivityList =
        activityList.length > 0
          ? activityList
          : [
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
Location: ${tripLocation}
Start date: ${startDateValue}
Duration: ${durationValue}
Activity List:
${finalActivityList.map((activity) => `- ${activity}`).join('\n')}

IMPORTANT INSTRUCTIONS:
- Include a detailed description (2-3 sentences) for EACH activity in your response
- Each activity should have name, start_time, end_time, and description fields
- Make descriptions informative and useful for travelers
- If the activity is a known landmark or business, include relevant information about it
- Format as proper JSON with a schedule array containing days, each with an activities array
`;

      console.log('OpenAI Request:', openaiRequest);

      // Call the generateItinerary function directly
      const itineraryResponse = await generateItinerary(openaiRequest);

      if (!itineraryResponse) {
        throw new Error('Failed to generate a valid itinerary');
      }

      // Extract JSON from the response if it contains markdown code blocks
      let jsonString = itineraryResponse;

      if (itineraryResponse.includes('```')) {
        const matches = itineraryResponse.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (matches && matches[1]) {
          jsonString = matches[1].trim();
        }
      }

      // Now parse the cleaned JSON
      const parsedItinerary = JSON.parse(jsonString);

      if (!parsedItinerary || !parsedItinerary.schedule) {
        throw new Error('Invalid itinerary format received');
      }

      // Enrich the itinerary with place details
      const enrichedSchedule = await enrichItineraryWithPlaceDetails(
        parsedItinerary.schedule,
        { selectedFoods, selectedEntertainment, selectedOutdoor }
      );

      // Update state with the enriched schedule
      setItineraryData(enrichedSchedule);
      toast.success('Itinerary generated successfully!');
    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast.error('Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add this function to your CreateItinerary component
  const enrichItineraryWithPlaceDetails = async (
    schedule,
    selectedActivities
  ) => {
    // Create a lookup map by activity name
    const activityDetailsMap = {};

    // Combine all selected activities into one array
    const allSelectedActivities = [
      ...(selectedActivities.selectedFoods || []),
      ...(selectedActivities.selectedEntertainment || []),
      ...(selectedActivities.selectedOutdoor || []),
    ];

    // Add all activities to the lookup map
    allSelectedActivities.forEach((activity) => {
      if (activity && activity.name) {
        activityDetailsMap[activity.name.toLowerCase()] = {
          description: activity.description,
          photoUrls: activity.photoUrls || [],
          rating: activity.rating,
          website: activity.website,
          vicinity: activity.vicinity,
          priceRange: activity.priceRange,
          opening_hours: activity.opening_hours,
          placeId: activity.placeId,
        };
      }
    });

    console.log(
      'Activity details map created with',
      Object.keys(activityDetailsMap).length,
      'entries'
    );

    // Process each day in the schedule
    const enrichedSchedule = await Promise.all(
      schedule.map(async (day) => {
        // Process each activity in the day
        const enrichedActivities = await Promise.all(
          day.activities.map(async (activity) => {
            // Skip if activity doesn't have a name
            if (!activity || !activity.name) return activity;

            const activityName = activity.name.toLowerCase();
            let enrichedActivity = { ...activity };

            // Case 1: Activity already has a description from OpenAI
            if (activity.description && activity.description.length > 20) {
              console.log(
                `Activity ${activity.name} already has a description`
              );
              return activity;
            }

            // Case 2: We have the activity details in our map
            if (activityDetailsMap[activityName]) {
              console.log(
                `Found details for ${activity.name} in selected activities`
              );
              return {
                ...activity,
                ...activityDetailsMap[activityName],
              };
            }

            // Case 3: Try to fetch from Google Places using placeId
            if (activity.placeId) {
              try {
                console.log(
                  `Fetching details for ${activity.name} using placeId`
                );
                const details = await fetchPlaceDetails(activity.placeId);
                if (details) {
                  return {
                    ...activity,
                    description: details.description,
                    photoUrls: details.photoUrls || [],
                    rating: details.rating,
                    website: details.website,
                    vicinity: details.vicinity,
                    priceRange: details.priceRange,
                    opening_hours: details.opening_hours,
                  };
                }
              } catch (error) {
                console.error(
                  `Error fetching details for ${activity.name}:`,
                  error
                );
              }
            }

            // Case 4: Generate a fallback description
            console.log(`Generating fallback description for ${activity.name}`);
            enrichedActivity.description =
              generateFallbackDescription(activity);
            return enrichedActivity;
          })
        );

        return {
          ...day,
          activities: enrichedActivities,
        };
      })
    );

    console.log('Schedule enriched with descriptions');
    return enrichedSchedule;
  };

  // Add this helper function
  const generateFallbackDescription = (activity) => {
    const timeInfo =
      activity.start_time && activity.end_time
        ? `Scheduled from ${activity.start_time} to ${activity.end_time}.`
        : '';

    return `Visit ${activity.name}, an activity included in your ${tripLocation} itinerary. ${timeInfo} Enjoy your time at this location during your trip.`;
  };

  return (
    <>
      <NavigationBar />
      <div className='home-page'>
        <div className='home-container'>
          <Sidebar logout={logout} />
          <div className='home-contents'>
            <div ref={printRef} className='itinerary-container'>
              <h1 className='createititnerary-title'>Itinerary</h1>
              <p className='itinerary-subtitle'>for {tripLocation}</p>

              {/* Display loading spinner or itinerary data */}
              {loading ? (
                <div className='loading-container'>
                  <p>Loading itinerary...</p>
                  <div className='spinner'></div>
                </div>
              ) : itineraryData.length > 0 ? (
                itineraryData.map((dayData, dayIndex) => (
                  <div key={dayIndex} className='itinerary-day'>
                    <div className='itinerary-daytitle'>
                      <h2>
                        Day {dayIndex + 1}: {dayData.date}
                      </h2>
                    </div>
                    <div className='itinerary-itemscontainer'>
                      {dayData.activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className='itinerary-item'>
                          <div className='itinerary-itemtime'>
                            <h3>
                              {activity.start_time} -{' '}
                              {activity.end_time || 'TBD'}
                            </h3>
                          </div>
                          <div className='itinerary-item-details'>
                            <div className='itinerary-item-title'>
                              <h3>{activity.name}</h3>
                            </div>
                            <p className='activity-description'>
                              {activity.description
                                ? activity.description.length > 200
                                  ? `${activity.description.substring(0, 200)}...`
                                  : activity.description
                                : 'No description available'}
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

              <div className='itinerary-buttons'>
                <button
                  className='itinerary-button'
                  onClick={itineraryToDb}
                  disabled={loading}
                >
                  {loading ? 'Saving' : 'Save Itinerary'}
                </button>
                <button
                  className='itinerary-button'
                  onClick={handleGenerateItinerary}
                  disabled={loading}
                >
                  {loading ? 'Generating...' : 'Generate Itinerary'}
                </button>

                <button
                  className='itinerary-button'
                  onClick={() => navigate('/home')}
                >
                  Back to Home
                </button>
                {/* <button
                  className='itinerary-button'
                  onClick={() => exportItinerary()}
                  disabled={!itineraryData.length}
                >
                  Download Itinerary
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position='bottom-center' />
    </>
  );
}

export default Itinerary;
