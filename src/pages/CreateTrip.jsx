import React, { useState } from 'react';
import InputField from '../components/Login-Components/InputField';
import { useNavigate } from 'react-router-dom';
import '../create-trip-styling.css';

function CreateTrip() {


  //Vinny's functions
    
  const [details, setDetails] = useState({
    budget: "",
    cost: "0"
  })
  const[displayedBudget, setDisplayedBudget] = useState({
    budget: ""
  })
  const[displayedCost, setDisplayedCost] = useState({
    cost: "0"
  })

  const handleCostChange = (price) => {
    const currCost = parseInt(displayedCost.cost);
    const activityPrice = parseInt(price);
    const sum = currCost + activityPrice;
    setDisplayedCost((prev) => {
      return {...prev, cost: sum}
    })
  }

  const handleChange = (event) =>{
    const name = event.target.name;
    const value = event.target.value;
    setDetails((prev) => {
      return {...prev, [name]: value}
    })
    // console.log(details);
  }

  const budgetSubmit = (event) =>{
    event.preventDefault();
    setDisplayedBudget((prev) => {
      return {...prev, budget: details.budget}
    })
    console.log(details);
  }
  // end of Vinny's functions

    
  const navigate = useNavigate();
  // Aaron's functions
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [selectedEntertainment, setSelectedEntertainment] = useState([]);
  const [selectedOutdoor, setSelectedOutdoor] = useState([]);

  const handleSelect = (category, value, price) => {
    
    switch (category) {
      case 'food':
        selectedFoods.includes(value)
            ? handleCostChange(price * -1)
            : handleCostChange(price)
        setSelectedFoods((prev) =>
          prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value]
        );
        break;
      case 'entertainment':
        selectedEntertainment.includes(value)
            ? handleCostChange(price * -1)
            : handleCostChange(price)
        setSelectedEntertainment((prev) =>
          prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value]
        );
        break;
      case 'outdoor':
        selectedOutdoor.includes(value)
            ? handleCostChange(price * -1)
            : handleCostChange(price)
        setSelectedOutdoor((prev) =>
          prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value]
        );
        break;
      default:
        break;
    }
  };

  const foodOptions = [
    { name: 'Chilis', imgSrc: 'chilis.jpg', price: '40'},
    { name: 'Grimaldis', imgSrc: 'grimaldis.jpg', price: '60'},
    { name: 'McDonalds', imgSrc: 'mcdonalds.jpg', price: '25'},
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
      <div className='title-container'>
        <h1>Create Trip</h1>
      </div>

      <div>
        <form action='#' className='form'>
          <InputField type='text' placeholder='Trip Name' />
          <InputField type='text' placeholder='Destination' />
          <InputField type='text' placeholder='Duration' />
        </form>
        <label>Budget = $</label>
        <label id='displayedBudget'>{displayedBudget.budget}</label>
        <form action='#' className='form' onSubmit={budgetSubmit}>
          <input
            type='number'
            name='budget'
            placeholder='Budget'
            id='budgetInput'
            onChange={handleChange}
          />
          <button type='submit'>Button</button>
        </form>

        <div className='activities-container'>
          <h2>Activities</h2>
        </div>

        <div className='categories-container'>
          {/* Entertainment Selection */}
          <div className='category'>
            <h2 className='form-title'>Entertainment</h2>
            <div className='selectable-container'>
              {entertainmentOptions.map((item) => (
                <label
                  key={item.name}
                  className={`selectable-box ${
                    selectedEntertainment.includes(item.name) ? 'selected' : ''
                  }`}
                >
                  <input
                    type='checkbox'
                    name='entertainment'
                    value={item.name}
                    checked={selectedEntertainment.includes(item.name)}
                    onChange={() => handleSelect('entertainment', item.name, item.price)}
                  />
                  <img
                    src={item.imgSrc}
                    alt={item.name}
                    className='selectable-image'
                  />
                  {/* <span className='selectable-title'>{item.name}</span> */}
                  <span className='selectable-price'>${item.price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Food Selection */}
          <div className='category'>
            <h2 className='form-title'>Food</h2>
            <div className='selectable-container'>
              {foodOptions.map((food) => (
                <label
                  key={food.name}
                  className={`selectable-box ${
                    selectedFoods.includes(food.name) ? 'selected' : ''
                  }`}
                >
                  <input
                    type='checkbox'
                    name='food'
                    value={food.name}
                    checked={selectedFoods.includes(food.name)}
                    onChange={() => handleSelect('food', food.name, food.price)}
                  />
                  <img
                    src={food.imgSrc}
                    alt={food.name}
                    className='selectable-image'
                  />
                  {/* <span className='selectable-title'>{food.name}</span> */}
                  <span className='selectable-price'>${food.price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Outdoor Selection */}
          <div className='category'>
            <h2 className='form-title'>Outdoor</h2>
            <div className='selectable-container'>
              {outdoorOptions.map((item) => (
                <label
                  key={item.name}
                  className={`selectable-box ${
                    selectedOutdoor.includes(item.name) ? 'selected' : ''
                  }`}
                >
                  <input
                    type='checkbox'
                    name='outdoor'
                    value={item.name}
                    checked={selectedOutdoor.includes(item.name)}
                    onChange={() => handleSelect('outdoor', item.name, item.price)}
                  />
                  <img
                    src={item.imgSrc}
                    alt={item.name}
                    className='selectable-image'
                  />
                  {/* <span className='selectable-title'>{item.name}</span> */}
                  <span className='selectable-price'>${item.price}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Current Itinerary Container */}
      <div className='itinerary-container'>
        <h2>Current Itinerary</h2>

        <div className='itinerary-section'>
          <h3>Food</h3>
          <ul>
            {selectedFoods.map((food) => (
              <li key={food}>{food}</li>
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

        <div className='itinerary-section'>
          <h3>Entertainment</h3>
          <ul>
            {selectedEntertainment.map((entertainment) => (
              <li key={entertainment}>{entertainment}</li>
            ))}
          </ul>
        </div>

        {/* Standard Button Added Here */}
        <button
          className='standard-button'
          onClick={() =>
            navigate('/Itinerary', {
              state: {
                selectedFoods,
                selectedEntertainment,
                selectedOutdoor,
              },
            })
          }
        >
          Create Itinerary
        </button>
      </div>
    </>
  );
}

export default CreateTrip;
