import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../components/firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Import directly from backend instead of through api layer
import { generateItinerary } from '../backend/openAI';
import { saveUserItinerary } from '../components/api/dataModel';
import { getItineraryData as getStoredItineraryData } from '../backend/dataCollect';

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

  const logout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (error) {
      console.log(error);
    }
  };

  // Function to download itinerary as PDF
  const handleDownloadPDF = async () => {
    const element = printRef.current;

    if (!element) {
      toast.error('No content to download');
      return;
    }

    try {
      const canvas = await html2canvas(element);
      const data = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: 'a4',
      });

      const imageProperties = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight =
        (imageProperties.height * pdfWidth) / imageProperties.width;

      pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Itinerary.pdf');
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download PDF');
    }
  };

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

      // Add logging to see what's being sent
      console.log('Saving itinerary data:', {
        userId: auth.currentUser.uid,
        tripId: tripId,
        data: {
          name: tripName,
          schedule: itineraryData
        }
      });

      // When processing activities before saving
      const processedSchedule = itineraryData.map((day) => ({
        ...day,
        activities: day.activities.map((activity) => {
          // Ensure Google Places data is preserved and handle undefined values
          return {
            name: activity.name || 'Unnamed Activity',
            start_time: activity.start_time || '12:00 PM',
            end_time: activity.end_time || '1:00 PM',
            description: activity.description || `Visit ${activity.name}`,
            location: activity.location || 'Location not specified',
            // Preserve additional Google Places data with null fallbacks
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

      // Save the processed data
      const itineraryId = await saveUserItinerary(
        auth.currentUser?.uid, // Add safety check
        tripId || null, // Ensure null if undefined
        {
          name: tripName || 'My Itinerary',
          schedule: processedSchedule,
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
  const enrichItineraryWithPlaceDetails = async (schedule, selectedActivities) => {
    // Create a map of activity names to their place details
    const activityDetailsMap = {};

    // Combine all selected activities into one array for easier lookup
    const allSelectedActivities = [
      ...selectedFoods,
      ...selectedEntertainment,
      ...selectedOutdoor
    ];

    // Create a lookup map by activity name
    allSelectedActivities.forEach(activity => {
      if (activity.description) {
        activityDetailsMap[activity.name.toLowerCase()] = {
          description: activity.description,
          photoUrls: activity.photoUrls || [],
          rating: activity.rating,
          website: activity.website,
          vicinity: activity.vicinity,
          priceRange: activity.priceRange,
          opening_hours: activity.opening_hours
        };
      }
    });

    // Enrich the schedule with place details
    const enrichedSchedule = await Promise.all(schedule.map(async (day) => {
      const enrichedActivities = await Promise.all(day.activities.map(async (activity) => {
        // First check if OpenAI already provided a description
        if (activity.description) {
          return activity;
        }

        const activityName = activity.name.toLowerCase();

        // Check if we have details from Google Places
        if (activityDetailsMap[activityName]) {
          return {
            ...activity,
            ...activityDetailsMap[activityName]
          };
        }

        // Try to fetch from Google Places if we have placeId
        if (activity.placeId) {
          try {
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
                opening_hours: details.opening_hours
              };
            }
          } catch (error) {
            console.error(`Error fetching details for ${activity.name}:`, error);
          }
        }

        // If all else fails, generate a fallback description
        return {
          ...activity,
          description: generateFallbackDescription(activity)
        };
      }));

      return {
        ...day,
        activities: enrichedActivities
      };
    }));

    return enrichedSchedule;
  };

  // Add this helper function
  const generateFallbackDescription = (activity) => {
    const timeInfo = activity.start_time && activity.end_time ?
      `Scheduled from ${activity.start_time} to ${activity.end_time}.` : '';

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
              <div className='createititnerary-title'>
                <h1>Create Itinerary</h1>
                <h2>for {tripLocation}</h2>
              </div>

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
                            {/* Add the description here */}
                            <p className="activity-description">
                              {activity.description || 'No description available'}
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
                <button
                  className='itinerary-button'
                  onClick={handleDownloadPDF}
                  disabled={!itineraryData.length}
                >
                  Download Itinerary
                </button>
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
