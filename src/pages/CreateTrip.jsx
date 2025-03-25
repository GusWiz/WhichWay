import { signOut } from 'firebase/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TripInputField from '../components/Createtrip-Components/TripInputField';
import './CreateTrip.css';
import './Createitinerary.css';
import './Home.css';
import { ToastContainer, toast } from 'react-toastify';
import { saveUserTrip } from '../api/dataModel.js';
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
import LocationSearch from '../components/Createtrip-Components/LocationSearch.jsx';
import LocationAutocomplete from '../components/Createtrip-Components/LocationAutocomplete';
import { fetchActivitiesByLocation } from '../api/placesService';

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

  //Aldo's updated itinerary modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen); // Toggle the modal visibility
  };

  //Vinny's functions

  const [details, setDetails] = useState({
    budget: '',
    cost: '0',
    destination: '', // Add destination to the details state
  });
  const [displayedBudget, setDisplayedBudget] = useState({
    budget: 'NULL',
  });
  const [displayedCost, setDisplayedCost] = useState({
    cost: '0',
  });

  const handleCostChange = (price) => {
    setDisplayedCost((prevCost) => {
      const currCost = parseInt(prevCost.cost); // Using the previous state value directly
      return { ...prevCost, cost: currCost + parseInt(price) };
    });
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setDetails((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const budgetSubmit = (event) => {
    event.preventDefault();
    if (details.budget < 0) {
      return toast('Error: Invalid Budget Entered.');
    } else if (details.budget < displayedCost.cost) {
      return toast('Error: Budget would be less than Cost.');
    } else {
      setDisplayedBudget((prev) => {
        return { ...prev, budget: details.budget };
      });

      // Also update the tripDetails budget to match
      setTripDetails((prev) => ({
        ...prev,
        budget: details.budget,
      }));
    }

    console.log(details);
  };

  const budgetTest = () => {
    console.log('we in here');

    setDisplayedBudget((prev) => {
      return { ...prev, budget: 100 };
    });

    // setTimeout(() => {handleSelect('entertainment', 'Concert', '90')}, 1000);
    // setTimeout(() => {handleSelect('entertainment', 'Movie', '25')}, 2000);
    // setTimeout(() => {handleSelect('entertainment', 'Theater', '50')}, 3000);

    setTimeout(() => {
      setDisplayedBudget((prev) => {
        return { ...prev, budget: 20 };
      });
    }, 1000);
  };

  // Structure to send all relevant functions from this file to ConsoleCommands
  // Structure to send all relevant functions from this file to ConsoleCommands
  const cmdPassthru = {
    budgetTest,
  };
  // end of Vinny's functions

  // Aaron's functions

  const [loading, setLoading] = useState(false);

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

  const [selectedFoods, setSelectedFoods] = useState([]);
  const [selectedEntertainment, setSelectedEntertainment] = useState([]);
  const [selectedOutdoor, setSelectedOutdoor] = useState([]);

  const handleSelect = (category, item) => {
    switch (category) {
      case 'food':
        if (
          displayedBudget.budget - displayedCost.cost - item.price < 0 &&
          !selectedFoods.some((food) => food.name === item.name)
        ) {
          return toast('Error: Cost would be more than Budget.');
        } else {
          if (selectedFoods.some((food) => food.name === item.name)) {
            handleCostChange(item.price * -1);
            setSelectedFoods((prev) =>
              prev.filter((food) => food.name !== item.name)
            ); // Remove item by name
          } else {
            handleCostChange(item.price);
            setSelectedFoods((prev) => [...prev, item]); // Add the item to the selected foods
          }
          saveActivities(selectedFoods, selectedEntertainment, selectedOutdoor);
        }
        break;
      case 'entertainment':
        if (
          displayedBudget.budget - displayedCost.cost - item.price < 0 &&
          !selectedEntertainment.some(
            (entertainment) => entertainment.name === item.name
          )
        ) {
          return toast('Error: Cost would be more than Budget.');
        } else {
          if (
            selectedEntertainment.some(
              (entertainment) => entertainment.name === item.name
            )
          ) {
            handleCostChange(item.price * -1);
            setSelectedEntertainment((prev) =>
              prev.filter((entertainment) => entertainment.name !== item.name)
            ); // Remove item by name
          } else {
            handleCostChange(item.price);
            setSelectedEntertainment((prev) => [...prev, item]); // Add the item to the selected foods
          }
          saveActivities(selectedFoods, selectedEntertainment, selectedOutdoor);
        }
        break;
      case 'outdoor':
        if (
          displayedBudget.budget - displayedCost.cost - item.price < 0 &&
          !selectedOutdoor.some((outdoor) => outdoor.name === item.name)
        ) {
          return toast('Error: Cost would be more than Budget.');
        } else {
          if (selectedOutdoor.some((outdoor) => outdoor.name === item.name)) {
            handleCostChange(item.price * -1);
            setSelectedOutdoor((prev) =>
              prev.filter((outdoor) => outdoor.name !== item.name)
            ); // Remove item by name
          } else {
            handleCostChange(item.price);
            setSelectedOutdoor((prev) => [...prev, item]); // Add the item to the selected foods
          }
          saveActivities(selectedFoods, selectedEntertainment, selectedOutdoor);
        }
        break;
      default:
        break;
    }
  };

  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handlePlaceSelected = async (placeData) => {
    setSelectedLocation(placeData);

    // Update trip details with the location data
    setDetails(prev => ({
      ...prev,
      destination: placeData.name,
      location: placeData.location
    }));

    // Set loading state while fetching activities
    setIsLoadingActivities(true);

    try {
      // Fetch activities for the selected location
      const activitiesData = await fetchActivitiesByLocation(placeData.location);

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

  const [foodOptions, setFoodOptions] = useState([
    {
      name: 'Chilis',
      imgSrc: '/images/activities/food/chilis.jpg',
      price: '40',
      groupSize: '2-4',
    },
    // Keep your existing options as fallback
  ]);

  const [entertainmentOptions, setEntertainmentOptions] = useState([
    { name: 'Movie', imgSrc: 'movie.jpg', price: '25' },
    // Keep your existing options as fallback
  ]);

  const [outdoorOptions, setOutdoorOptions] = useState([
    { name: 'Gustavo Hiking Trail', imgSrc: 'hiking.jpg', price: '0' },
    // Keep your existing options as fallback
  ]);

  // End of Aaron's functions

// handle the place selected from LocationSearch
const handleLocationSelect = (placeDetails) => {
  setDetails((prev) => ({
    ...prev,
    destination: placeDetails.formatted_address,
  }));
};

// Add this function to your CreateTrip component, after the other state variables
const [tripName, setTripName] = useState('');
const [duration, setDuration] = useState('');

const handleSaveDetails = async () => {
  try {
    // Check if user is authenticated
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error("Please log in to save trip details", { position: "bottom-center" });
      return;
    }

    // Validate required fields
    if (!tripName) {
      toast.error("Trip name is required", { position: "bottom-center" });
      return;
    }

    if (!details.destination) {
      toast.error("Destination is required", { position: "bottom-center" });
      return;
    }

    // Create trip details object
    const tripDetails = {
      name: tripName,
      destination: details.destination,
      duration: duration || '1 day', // Default to 1 day if not specified
      budget: displayedBudget.budget !== 'NULL' ? displayedBudget.budget : '0',
      location: details.location || null,
    };

    // Save details locally
    saveDetails(tripName, details.destination, duration, displayedBudget.budget);

    // Save to Firebase
    const tripId = await saveUserTrip(
      currentUser.uid,
      tripDetails,
      duration,
      getSavedActivities()
    );

    toast.success("Trip details saved successfully!", { position: "bottom-center" });
    console.log("Trip saved with ID:", tripId);
  } catch (error) {
    console.error("Error saving trip details:", error);
    toast.error("Failed to save trip details", { position: "bottom-center" });
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
                <h1>Create Trip</h1>
              </div>
            <div>
              <form action='#' className='form'>
                <TripInputField
                  type='text'
                  placeholder='Trip Name'
                  value={tripName}
                  onChange={e => setTripName(e.target.value)}
                  name="tripName"
                />
                <LocationAutocomplete
                  value={details.destination}
                  onChange={handleChange}
                  onPlaceSelected={handlePlaceSelected}
                />
                <TripInputField
                  type='text'
                  placeholder='Duration'
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  name="duration"
                />
              </form>
              <label>
                {displayedBudget.budget >= 0
                  ? 'Budget = $'
                  : 'No budget entered.'}
              </label>
              <label id='displayedBudget'>{displayedBudget.budget}</label>
              <br></br>
              <label>Cost = $</label>
              <label id='displayedCost'>{displayedCost.cost}</label>
              <br></br>
              <label>
                {displayedBudget.budget >= 0 ? 'Remaining Budget = $' : ''}
              </label>
              <label id='displayedRemainingBudget'>
                {displayedBudget.budget >= 0
                  ? displayedBudget.budget - displayedCost.cost
                  : ''}
              </label>
              <form action='#' className='form' onSubmit={budgetSubmit}>
                <input
                  type='number'
                  name='budget'
                  placeholder='Budget'
                  id='budgetInput'
                  onChange={handleChange}
                />
                <button type='submit'>Change Budget</button>
                <button onClick={budgetTest}>
                  {displayedBudget.budget == 103 ? 'Budget Unit Test 1' : ''}
                </button>
              </form>

              <button
                type='button'
                onClick={handleSaveDetails}
                className='trip-preference-btn'
              >
                Save Trip Details
              </button>

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

                {/* Add button to open modal */}
                <button
                  type='button'
                  onClick={handleModalToggle}
                  className='trip-preference-btn'
                >
                  Trip Preferences
                </button>

                <button
                  type='button'
                  onClick={handleSaveActivities}
                  className='trip-preference-btn'
                >
                  Save Selections
                </button>

                <button
                  onClick={handleItinerary}
                  disabled={loading}
                  className='gen-itinerary-button'
                >
                  {loading ? (
                    <span className='loader'></span>
                  ) : (
                    'Generate Itinerary'
                  )}
                </button>
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
        <div className="loading-container">
          <p>Loading activities for {details.destination}...</p>
          {/* You can add a spinner here if you want */}
        </div>
      )}
    </>
  );
}

export default CreateTrip;
