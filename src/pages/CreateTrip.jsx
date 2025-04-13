import { signOut } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TripInputField from '../components/Createtrip-Components/TripInputField';
import './CreateTrip.css';
import './CreateItinerary.css';
import './Home.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  saveUserTrip,
  saveUserItinerary,
} from '../components/api/dataModel.js';
import { auth } from '../components/firebase.js';
import {
  getSavedActivities,
  saveActivities,
  saveDetails,
  saveItineraryData,
  getItineraryData,
} from '../backend/dataCollect';

import { generateItinerary } from '../backend/openAI';
import NavigationBar from '../components/Landing-Components/NavigationBar';
import Sidebar from '../components/Homepage-Components/Sidebar';
import PreferenceModal from '../components/Createtrip-Components/PreferenceModal';
import ActivitiesDisplay from '../components/Createtrip-Components/ActivitiesDisplay';
import ConsoleCommands from '../components/Universal-Components/ConsoleCommands.jsx';
import LocationAutocomplete from '../components/Createtrip-Components/LocationAutocomplete';
import { fetchActivitiesByLocation } from '../components/api/placesService.js';
import DateSelector from '../components/Createtrip-Components/DateSelector.jsx';

function CreateTrip() {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (error) {
      console.log(error);
    }
  };

  // State variables for trip details
  const [tripName, setTripName] = useState('');
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tripId, setTripId] = useState(null);

  // State for place/destination details
  const [details, setDetails] = useState({
    destination: '',
    location: null,
  });

  // States for selected activities
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [selectedEntertainment, setSelectedEntertainment] = useState([]);
  const [selectedOutdoor, setSelectedOutdoor] = useState([]);

  // States for loading states
  const [loading, setLoading] = useState(false);
  const [loadingItinerary, setLoadingItinerary] = useState(false);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

  // Initial default options for activities
  const [foodOptions, setFoodOptions] = useState([
    {
      name: 'Chilis',
      imgSrc: '/images/activities/food/chilis.jpg',
      groupSize: '2-4',
    },
  ]);

  const [entertainmentOptions, setEntertainmentOptions] = useState([
    { name: 'Movie', imgSrc: 'movie.jpg' },
  ]);

  const [outdoorOptions, setOutdoorOptions] = useState([
    { name: 'Gustavo Hiking Trail', imgSrc: 'hiking.jpg' },
  ]);

  // Debug console commands
  const cmdPassthru = {};

  useEffect(() => {
    const storedTripId = localStorage.getItem('tripId');
    if (storedTripId) {
      setTripId(storedTripId); // Update the state with tripId from localStorage
    } else {
      setTripId(null); // In case tripId is null in localStorage
    }
  }, []);

  // Toggle the preference modal
  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Handle input changes
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setDetails((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleDaterangeChange = ({ startDate, endDate }) => {
    setStartDate(startDate ? startDate.toISOString().split('T')[0] : '');
    setEndDate(endDate ? endDate.toISOString().split('T')[0] : '');

    if (startDate && endDate) {
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDuration(`${diffDays} days`);
    }
  };

  const handleItinerary = async () => {
    setLoading(true); // Disable button and show loading spinner
    try {
      const response = await generateItinerary(); // Wait for API response

      if (response) {
        saveItineraryData(response); // Store itinerary
        console.log('Itinerary saved:', getItineraryData()); // Debugging

        navigate('/createItinerary'); // Navigate only after response is successfully stored
      } else {
        console.error('Failed to generate itinerary. No response received.');
      }
    } catch (error) {
      console.error('Error handling itinerary:', error);
    } finally {
      setLoading(false); // Hide loading spinner and re-enable button
    }
  };

  const handleSaveActivities = () => {
    console.log('displaying current selections: ');
    console.log(selectedEntertainment);
    console.log(selectedFoods);
    console.log(selectedOutdoor);

    saveActivities(selectedFoods, selectedEntertainment, selectedOutdoor);

    const savedActivities = getSavedActivities();
    console.log(savedActivities);
  };

  const handleSelect = (category, item) => {
    switch (category) {
      case 'food':
        if (selectedFoods.some((food) => food.name === item.name)) {
          setSelectedFoods((prev) =>
            prev.filter((food) => food.name !== item.name)
          );
        } else {
          setSelectedFoods((prev) => [...prev, item]);
        }
        saveActivities(selectedFoods, selectedEntertainment, selectedOutdoor);
        break;
      case 'entertainment':
        if (
          selectedEntertainment.some(
            (entertainment) => entertainment.name === item.name
          )
        ) {
          setSelectedEntertainment((prev) =>
            prev.filter((entertainment) => entertainment.name !== item.name)
          );
        } else {
          setSelectedEntertainment((prev) => [...prev, item]);
        }
        saveActivities(selectedFoods, selectedEntertainment, selectedOutdoor);
        break;
      case 'outdoor':
        if (selectedOutdoor.some((outdoor) => outdoor.name === item.name)) {
          setSelectedOutdoor((prev) =>
            prev.filter((outdoor) => outdoor.name !== item.name)
          );
        } else {
          setSelectedOutdoor((prev) => [...prev, item]);
        }
        saveActivities(selectedFoods, selectedEntertainment, selectedOutdoor);
        break;
      default:
        break;
    }
  };

  // Handle location selection
  const handlePlaceSelected = async (placeData) => {
    // Update trip details with the location data
    setDetails((prev) => ({
      ...prev,
      destination: placeData.name,
      location: placeData.location,
    }));

    // Set loading state while fetching activities
    setIsLoadingActivities(true);

    try {
      // Fetch activities for the selected location
      const activitiesData = await fetchActivitiesByLocation(
        placeData.location
      );

      // Update the activities options with the fetched data
      if (activitiesData.food?.length > 0) {
        setFoodOptions(activitiesData.food);
      }

      if (activitiesData.entertainment?.length > 0) {
        setEntertainmentOptions(activitiesData.entertainment);
      }

      if (activitiesData.outdoor?.length > 0) {
        setOutdoorOptions(activitiesData.outdoor);
      }

      toast.success('Activities loaded successfully!');
    } catch (error) {
      console.error('Error loading activities:', error);
      toast.error('Failed to load activities for this location');
    } finally {
      setIsLoadingActivities(false);
    }
  };

  // Handle the place selected from LocationSearch
  const handleLocationSelect = (placeDetails) => {
    setDetails((prev) => ({
      ...prev,
      destination: placeDetails.formatted_address,
    }));
  };

  // Save the trip details to Firestore
  const handleSaveTrip = async () => {
    try {
      setIsSubmitting(true);

      // Check if user is authenticated
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error('Please log in to save trip details');
        return;
      }

      // Validate required fields
      if (!tripName) {
        toast.error('Trip name is required');
        return;
      }

      if (!details.destination) {
        toast.error('Destination is required');
        return;
      }

      // Create trip details object
      const tripDetails = {
        name: tripName,
        destination: details.destination,
        startDate: startDate || '',
        endDate: endDate || '',
        duration: duration || '1 day', // Default to 1 day if not specified
        location: details.location || { lat: 0, lng: 0 },
      };

      // Save details locally
      saveDetails(tripName, details.destination, duration, startDate, endDate);

      // Save to Firebase
      const savedTripId = await saveUserTrip(
        currentUser.uid,
        tripDetails,
        duration,
        {
          selectedFoods,
          selectedEntertainment,
          selectedOutdoor,
        }
      );

      setTripId(savedTripId);
      toast.success('Trip saved successfully!');
      console.log('Trip saved with ID:', savedTripId);
    } catch (error) {
      console.error('Error saving trip:', error);
      toast.error('Failed to save trip details');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to generate an itinerary and navigate to the itinerary page
  const handleGenerateItinerary = async () => {
    setLoadingItinerary(true);
    try {
      // Validate required fields first
      if (!tripName) {
        toast.error('Please enter a trip name');
        setLoadingItinerary(false);
        return;
      }

      if (!details.destination) {
        toast.error('Please enter a trip location');
        setLoadingItinerary(false);
        return;
      }

      if (!duration) {
        toast.error('Please enter a trip duration');
        setLoadingItinerary(false);
        return;
      }

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
              'Restaurant',
              'Park',
              'Museum',
              'Cafe',
              'Historic Site',
              'Local Attraction',
            ];

      // Construct the OpenAI request content
      const openaiRequest = `
Location: ${details.destination}
Start date: ${startDate || new Date().toISOString().split('T')[0]}
End date: ${endDate || new Date().toISOString().split('T')[0]}
Duration: ${duration}
Activity List:
${finalActivityList.map((activity) => `- ${activity}`).join('\n')}
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
          console.log('Extracted JSON string:', jsonString);
        }
      }

      saveItineraryData(jsonString);

      console.log('after save itinerary data');

      // Parse the JSON response
      const parsedItinerary = JSON.parse(jsonString);

      if (!parsedItinerary || !parsedItinerary.schedule) {
        throw new Error('Invalid itinerary format received');
      }

      // First save the trip to get a tripId if not already set
      let savedTripId = tripId;
      if (auth.currentUser && !tripId) {
        savedTripId = await saveUserTrip(
          auth.currentUser.uid,
          {
            name: tripName,
            destination: details.destination,
            location: details.location || { lat: 0, lng: 0 },
            budget: '0',
          },
          duration,
          {
            selectedFoods,
            selectedEntertainment,
            selectedOutdoor,
          }
        );
        setTripId(savedTripId);
        toast.success('Trip saved successfully!');
      }

      // Navigate to the itinerary page with all the data
      navigate('/createItinerary', {
        state: {
          location: details.destination,
          startDate: startDate || new Date().toISOString().split('T')[0],
          duration: duration,
          selectedFoods,
          selectedEntertainment,
          selectedOutdoor,
          tripName,
          tripId: savedTripId,
          itineraryData: parsedItinerary.schedule || [],
        },
      });
    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast.error('Failed to generate itinerary. Please try again.');
    } finally {
      setLoadingItinerary(false);
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
              <button
                onClick={handleModalToggle}
                className='trip-preference-btn'
              >
                Trip Preferences
              </button>
              <div className='createititnerary-title'>
                <h1>Create Trip</h1>
              </div>
              <div className='form-container'>
                <form action='#' className='form'>
                  <TripInputField
                    type='text'
                    placeholder='Trip Name'
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    name='tripName'
                  />
                  <LocationAutocomplete
                    value={details.destination}
                    onChange={handleChange}
                    onPlaceSelected={handlePlaceSelected}
                  />
                  <DateSelector
                    onDateRangeChange={handleDaterangeChange}
                    initialStartDate={startDate ? new Date(startDate) : null}
                    initialEndDate={endDate ? new Date(endDate) : null}
                  />
                  <TripInputField
                    type='text'
                    placeholder='Duration'
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    name='duration'
                  />
                </form>

                <div className='create-trip-buttons'>
                  <button
                    className='trip-preference-btn'
                    onClick={handleSaveTrip}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Trip'}
                  </button>

                  <button
                    className='trip-preference-btn'
                    onClick={handleGenerateItinerary}
                    disabled={loadingItinerary || isSubmitting}
                  >
                    {loadingItinerary ? 'Generating...' : 'Generate Itinerary'}
                  </button>
                </div>

                {/* Render ActivitiesDisplay component */}
                <ActivitiesDisplay
                  foodOptions={foodOptions}
                  selectedFoods={selectedFoods}
                  handleSelectFood={(item) => {
                    handleSelect('food', item);
                  }}
                  entertainmentOptions={entertainmentOptions}
                  selectedEntertainment={selectedEntertainment}
                  handleSelectEntertainment={(item) =>
                    handleSelect('entertainment', item)
                  }
                  outdoorOptions={outdoorOptions}
                  selectedOutdoor={selectedOutdoor}
                  handleSelectOutdoor={(item) => handleSelect('outdoor', item)}
                />
              </div>

              {/* Conditionally render the modal */}
              {isModalOpen && <PreferenceModal onClose={handleModalToggle} />}
              <ToastContainer />
              <ConsoleCommands cmdPassThru={cmdPassthru} />
            </div>
          </div>
        </div>
      </div>
      {isLoadingActivities && (
        <div className='loading-container'>
          <p>Loading activities for {details.destination}...</p>
          <div className='spinner'></div>
        </div>
      )}
    </>
  );
}

export default CreateTrip;
