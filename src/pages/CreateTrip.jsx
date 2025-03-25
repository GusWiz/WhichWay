import React, { useState } from 'react';
import InputField from '../components/Login-Components/InputField';
// import { useNavigate } from 'react-router-dom';
import './CreateTrip.css';
import './Home.css';
import { ToastContainer, toast } from 'react-toastify';

import {
  getSavedActivities,
  saveActivities,
  saveDetails,
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

  // const handleCostChange = (price) => {
  //   const currCost = parseInt(displayedCost.cost);
  //   // const activityPrice = parseInt(price);
  //   // const sum = currCost + activityPrice;
  //   console.log(displayedCost.cost);
  //   setDisplayedCost((prev) => {
  //     return { ...prev, cost: currCost + parseInt(price)};
  //   });
  // };

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
    // console.log(details);
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
    }

    console.log(details);
  };

  const budgetTest = () => {
    console.log("we in here");

    setDisplayedBudget((prev) => {
      return { ...prev, budget: 100 };
    });

    // setTimeout(() => {handleSelect('entertainment', 'Concert', '90')}, 1000);
    // setTimeout(() => {handleSelect('entertainment', 'Movie', '25')}, 2000);
    // setTimeout(() => {handleSelect('entertainment', 'Theater', '50')}, 3000);

    setTimeout(() => {setDisplayedBudget((prev) => {
      return { ...prev, budget: 20};
    });
    }, 1000);
  }

  // Structure to send all relevant functions from this file to ConsoleCommands
  const cmdPassthru = {
    budgetTest
  };
  // end of Vinny's functions

  // Aaron's functions

  const handleSaveActivities = () => {
    console.log('displaying current selections: ');
    console.log(selectedEntertainment);
    console.log(selectedFoods);
    console.log(selectedOutdoor);

    saveActivities(selectedFoods, selectedEntertainment, selectedOutdoor);

    const savedActivities = getSavedActivities();
    console.log(savedActivities);
  };

  const handleSaveDetails = () => {
    saveDetails(name);
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
        }
        break;
      case 'entertainment':
        if (displayedBudget.budget - displayedCost.cost - item.price < 0 && !selectedEntertainment.some(entertainment => entertainment.name === item.name)) {
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
        }
        break;
      case 'outdoor':
        if (displayedBudget.budget - displayedCost.cost - item.price < 0 && !selectedOutdoor.some(outdoor => outdoor.name === item.name)) {
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


  return (
    <>
      <NavigationBar />
      <div className='home-page'>
        <div className='home-container'>
          <Sidebar logout={logout} />
          <div className='home-contents'>
            <div className='title-container'>
              <h1>Create Trip</h1>
            </div>

            <div>
              <form action='#' className='form'>
                <InputField type='text' placeholder='Trip Name' />
                <LocationAutocomplete
                  value={details.destination}
                  onChange={handleChange}
                  onPlaceSelected={handlePlaceSelected}
                />
                <InputField type='text' placeholder='Duration' />
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
            </div>

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
              type='button'
              onClick={generateItinerary}
              className='trip-preference-btn'
            >
              Generate Itinerary
            </button>

            {/* Conditionally render the modal */}
            {isModalOpen && <PreferenceModal onClose={handleModalToggle} />}
            <ToastContainer />
            <ConsoleCommands cmdPassThru={cmdPassthru} />
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
