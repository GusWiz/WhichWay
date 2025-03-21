import React, { useState } from 'react';
import InputField from '../components/Login-Components/InputField';
// import { useNavigate } from 'react-router-dom';
import './CreateTrip.css';
import './Home.css';
import { ToastContainer, toast } from 'react-toastify';

import { getSavedActivities, saveActivities, saveDetails } from '../backend/dataCollect'
import NavigationBar from '../components/Landing-Components/NavigationBar';
import Sidebar from '../components/Homepage-Components/Sidebar';
import PreferenceModal from '../components/Createtrip-Components/PreferenceModal';
import ActivitiesDisplay from '../components/Createtrip-Components/ActivitiesDisplay';
import ConsoleCommands from '../components/Universal-Components/ConsoleCommands';


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
    setDisplayedBudget((prev) => {
      return { ...prev, budget: 100};
    });

    setDetails((prev) => {
      return { ...prev, budget: 100 };
    });

    budgetSubmit;

    
    setTimeout(() => {handleSelect('entertainment', 'Concert', '90')}, 1000);
    setTimeout(() => {handleSelect('entertainment', 'Movie', '25')}, 2000);
    setTimeout(() => {handleSelect('entertainment', 'Theater', '50')}, 3000);

    setTimeout(() => {setDetails((prev) => {
      return { ...prev, budget: 20 };
    });
    budgetSubmit;
    }, 4000);
    

    
    
  }
  // end of Vinny's functions

  // const navigate = useNavigate();
  // Aaron's functions

  const handleSaveActivities = () => {
    console.log("displaying current selections: ")
    console.log(selectedEntertainment); 
    console.log(selectedFoods); 
    console.log(selectedOutdoor);

    saveActivities(selectedFoods, selectedEntertainment, selectedOutdoor);

    const savedActivities = getSavedActivities();
    console.log(savedActivities);

  };

  const handleSaveDetails = () => 
  {
    saveDetails(name)
  }
  

  const [selectedFoods, setSelectedFoods] = useState([]);
  const [selectedEntertainment, setSelectedEntertainment] = useState([]);
  const [selectedOutdoor, setSelectedOutdoor] = useState([]);

  const handleSelect = (category, item) => {
  
    switch (category) {
      case 'food':
        if (displayedBudget.budget - displayedCost.cost - item.price < 0 && !selectedFoods.some(food => food.name === item.name)) {
          return toast('Error: Cost would be more than Budget.');
        } else {
          if (selectedFoods.some(food => food.name === item.name)) {
            handleCostChange(item.price * -1);
            setSelectedFoods(prev => prev.filter(food => food.name !== item.name));  // Remove item by name
          } else {
            handleCostChange(item.price);
            setSelectedFoods(prev => [...prev, item]);  // Add the item to the selected foods
          }
        }
        break;
      case 'entertainment':
        if (displayedBudget.budget - displayedCost.cost - item.price < 0 && !selectedFoods.some(food => food.name === item.name)) {
          return toast('Error: Cost would be more than Budget.');
        } else {
          if (selectedEntertainment.some(entertainment => entertainment.name === item.name)) {
            handleCostChange(item.price * -1);
            setSelectedEntertainment(prev => prev.filter(entertainment => entertainment.name !== item.name));  // Remove item by name
          } else {
            handleCostChange(item.price);
            setSelectedEntertainment(prev => [...prev, item]);  // Add the item to the selected foods
          }
        }
        break;
      case 'outdoor':
        if (displayedBudget.budget - displayedCost.cost - item.price < 0 && !selectedFoods.some(food => food.name === item.name)) {
          return toast('Error: Cost would be more than Budget.');
        } else {
          if (selectedOutdoor.some(outdoor => outdoor.name === item.name)) {
            handleCostChange(item.price * -1);
            setSelectedOutdoor(prev => prev.filter(outdoor => outdoor.name !== item.name));  // Remove item by name
          } else {
            handleCostChange(item.price);
            setSelectedOutdoor(prev => [...prev, item]);  // Add the item to the selected foods
          }
        }
        break;
      default:
        break;
    }

  };

  const foodOptions = [
    {
      name: 'Chilis',
      imgSrc: '/images/activities/food/chilis.jpg',
      price: '40',
      groupSize: '2-4',
    },
    { name: 'Grimaldis', imgSrc: 'grimaldis.jpg', price: '60', groupSize: '2' },
    { name: 'McDonalds', imgSrc: 'mcdonalds.jpg', price: '25', groupSize: '5' },
    { name: 'Dons', imgSrc: 'mcdonalds.jpg', price: '25', groupSize: '3-5' },
    { name: 'Yummy', imgSrc: 'mcdonalds.jpg', price: '25', groupSize: ':P' },
  ];

  const entertainmentOptions = [
    { name: 'Movie', imgSrc: 'movie.jpg', price: '25' },
    { name: 'Concert', imgSrc: 'concert.jpg', price: '90' },
    { name: 'Theater', imgSrc: 'theater.jpg', price: '50' },
  ];

  const outdoorOptions = [
    { name: 'Gustavo Hiking Trail', imgSrc: 'hiking.jpg', price: '0' },
    { name: 'Vinny Rosy River', imgSrc: 'river.jpg', price: '10' },
    { name: 'Alan De Le Torre Lake', imgSrc: 'lake.jpg', price: '5' },
  ];
  // End of Aaron's functions

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
                <InputField type='text' placeholder='Destination' />
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
              <label>{displayedBudget.budget >= 0 ? "Remaining Budget = $" : ""}</label>
              <label id='displayedRemainingBudget'>
                {displayedBudget.budget >= 0 ? displayedBudget.budget - displayedCost.cost: ""}
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
                <button onClick={budgetTest}>{displayedBudget.budget == 103 ? "Budget Unit Test 1" : ""}</button>
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
                  handleSelect('food', item)
                }}
                entertainmentOptions={entertainmentOptions}
                selectedEntertainment={selectedEntertainment}
                handleSelectEntertainment={(item) =>
                  handleSelect('entertainment', item)
                }
                outdoorOptions={outdoorOptions}
                selectedOutdoor={selectedOutdoor}
                handleSelectOutdoor={(item) =>
                  handleSelect('outdoor', item)
                }
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

            

            {/* Conditionally render the modal */}
            {isModalOpen && <PreferenceModal onClose={handleModalToggle} />}
            <ToastContainer />
            <ConsoleCommands />
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateTrip;
