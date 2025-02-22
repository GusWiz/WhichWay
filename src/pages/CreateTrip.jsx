import React, { useState } from 'react';
import InputField from '../components/Login-Components/InputField';
import LoginButton from '../components/Login-Components/LoginButton';
import { useNavigate } from 'react-router-dom';
import "../create-trip-styling.css";

function CreateTrip() {
  const navigate = useNavigate();
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [selectedEntertainment, setSelectedEntertainment] = useState([]);
  const [selectedOutdoor, setSelectedOutdoor] = useState([]);

  const handleSelect = (category, value) => {
    switch (category) {
      case "food":
        setSelectedFoods((prev) =>
          prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
        break;
      case "entertainment":
        setSelectedEntertainment((prev) =>
          prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
        break;
      case "outdoor":
        setSelectedOutdoor((prev) =>
          prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
        break;
      default:
        break;
    }
  };

  const foodOptions = [
    { name: "Chilis", imgSrc: "chilis.jpg" },
    { name: "Grimaldis", imgSrc: "grimaldis.jpg" },
    { name: "McDonalds", imgSrc: "mcdonalds.jpg" }
  ];

  const entertainmentOptions = [
    { name: "Movie", imgSrc: "movie.jpg" },
    { name: "Concert", imgSrc: "concert.jpg" },
    { name: "Theater", imgSrc: "theater.jpg" }
  ];

  const outdoorOptions = [
    { name: "Gustavo Hiking Trail", imgSrc: "hiking.jpg" },
    { name: "Vinny Rosy River", imgSrc: "river.jpg" },
    { name: "Alan De Le Torre Lake", imgSrc: "lake.jpg" }
  ];

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
      </div>

      <div>
        <div className='activities-container'>
          <h2>Activities</h2>
        </div>

        <div className="categories-container">
          {/* Entertainment Selection */}
          <div className="category">
            <h2 className="form-title">Entertainment</h2>
            <div className="selectable-container">
              {entertainmentOptions.map((item) => (
                <label
                  key={item.name}
                  className={`selectable-box ${
                    selectedEntertainment.includes(item.name) ? "selected" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    name="entertainment"
                    value={item.name}
                    checked={selectedEntertainment.includes(item.name)}
                    onChange={() => handleSelect("entertainment", item.name)}
                  />
                  <img src={item.imgSrc} alt={item.name} className="selectable-image" />
                  <span className="selectable-title">{item.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Food Selection */}
          <div className="category">
            <h2 className="form-title">Food</h2>
            <div className="selectable-container">
              {foodOptions.map((food) => (
                <label
                  key={food.name}
                  className={`selectable-box ${
                    selectedFoods.includes(food.name) ? "selected" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    name="food"
                    value={food.name}
                    checked={selectedFoods.includes(food.name)}
                    onChange={() => handleSelect("food", food.name)}
                  />
                  <img src={food.imgSrc} alt={food.name} className="selectable-image" />
                  <span className="selectable-title">{food.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Outdoor Selection */}
          <div className="category">
            <h2 className="form-title">Outdoor</h2>
            <div className="selectable-container">
              {outdoorOptions.map((item) => (
                <label
                  key={item.name}
                  className={`selectable-box ${
                    selectedOutdoor.includes(item.name) ? "selected" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    name="outdoor"
                    value={item.name}
                    checked={selectedOutdoor.includes(item.name)}
                    onChange={() => handleSelect("outdoor", item.name)}
                  />
                  <img src={item.imgSrc} alt={item.name} className="selectable-image" />
                  <span className="selectable-title">{item.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <LoginButton text='Create Itinerary' />
      </div>

      {/* Current Itinerary Container */}
      <div className="itinerary-container">
        <h2>Current Itinerary</h2>

        <div className="itinerary-section">
          <h3>Food</h3>
          <ul>
            {selectedFoods.map((food) => (
              <li key={food}>{food}</li>
            ))}
          </ul>
        </div>

        <div className="itinerary-section">
          <h3>Outdoor</h3>
          <ul>
            {selectedOutdoor.map((outdoor) => (
              <li key={outdoor}>{outdoor}</li>
            ))}
          </ul>
        </div>

        <div className="itinerary-section">
          <h3>Entertainment</h3>
          <ul>
            {selectedEntertainment.map((entertainment) => (
              <li key={entertainment}>{entertainment}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default CreateTrip;
