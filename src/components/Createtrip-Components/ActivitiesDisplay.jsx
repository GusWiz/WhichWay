// ActivitiesDisplay.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ActivitiesDisplay.css';
import Model from './ActivityModal';

function ActivitiesDisplay({
  foodOptions,
  selectedFoods,
  handleSelectFood,
  entertainmentOptions,
  selectedEntertainment,
  handleSelectEntertainment,
  outdoorOptions,
  selectedOutdoor,
  handleSelectOutdoor,
}) {
  const [showModal, setShowModal] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  // const [imageSrc, setImageSrc] = useState('');

  const handleExpand = (item) => {
    console.log('in handleExpand');
    console.log(item.imgSrc);
    setExpandedItem(item);
    setShowModal(true); // Open the modal
  };

  const handleClose = () => {
    setShowModal(false); // Close the modal
  };

  return (
    <div className='activities-container'>
      <h2>Activities</h2>

      <div className='categories-container'>
        {/* Entertainment Selection */}
        <div className='category'>
          <h2 className='form-title'>Entertainment</h2>
          <div className='selectable-container'>
            {entertainmentOptions.map((item) => (
              <label
                key={item.name}
                className={`selectable-box ${
                  selectedEntertainment.some(
                    (entertainment) => entertainment.name === item.name
                  )
                    ? 'selected'
                    : ''
                }`}
              >
                <input
                  type='checkbox'
                  name='entertainment'
                  value={item.name}
                  checked={selectedEntertainment.some(
                    (entertainment) => entertainment.name === item.name
                  )}
                  onChange={() => handleSelectEntertainment(item)}
                />
                <img
                  src={item.imgSrc}
                  //   alt={"Could not find Image"}
                  className='selectable-image'
                />
                <div className='selectable-title-container'>
                  <span className='selectable-title'>{item.name}</span>
                  <span className='selectable-title'>${item.price}</span>
                  <span className='selectable-title'>{item.priceRange}</span>

                  {item.rating !== 'N/A' && (
                    <span className='selectable-title'>
                      <span className='selectable-title-text'>
                        ★ {item.rating} ({item.userRatingCount})
                      </span>
                    </span>
                  )}

                  <span className='selectable-title'>
                    <img
                      src='images/icons/person-icon.jpg'
                      alt='icon'
                      className='selectable-title-icon'
                    />
                    <span className='selectable-title-text'>
                      {item.groupSize}
                    </span>
                  </span>
                </div>

                {/*button for functionality */}
                <button
                  className='selectable-button'
                  onClick={() => handleExpand(item)}
                >
                  <img
                    src='/images/icons/expand.jpg'
                    alt='icon'
                    className='selectable-button-icon'
                  />
                </button>
              </label>
            ))}
          </div>
        </div>

        <br />

        {/* Food Selection */}
        <div className='category'>
          <h2 className='form-title'>Food</h2>
          <div className='selectable-container'>
            {foodOptions.map((item) => (
              <label
                key={item.name}
                className={`selectable-box ${
                  selectedFoods.some((food) => food.name === item.name)
                    ? 'selected'
                    : ''
                }`}
              >
                <input
                  type='checkbox'
                  name='food'
                  value={item.name}
                  checked={selectedEntertainment.some(
                    (food) => food.name === item.name
                  )}
                  onChange={() => handleSelectFood(item)}
                />
                <img
                  src={item.imgSrc}
                  //   alt={item.name}
                  className='selectable-image'
                />
                <div className='selectable-title-container'>
                  <span className='selectable-title'>{item.name}</span>
                  <span className='selectable-title'>${item.price}</span>
                  <span className='selectable-title'>{item.priceRange}</span>

                  {item.rating !== 'N/A' && (
                    <span className='selectable-title'>
                      <span className='selectable-title-text'>
                        ★ {item.rating} ({item.userRatingCount})
                      </span>
                    </span>
                  )}

                  <span className='selectable-title'>
                    <img
                      src='images/icons/person-icon.jpg'
                      alt='icon'
                      className='selectable-title-icon'
                    />
                    <span className='selectable-title-text'>
                      {item.groupSize}
                    </span>
                  </span>
                </div>
                {/*button for functionality */} {/*LOOK HERE*/}
                <button
                  className='selectable-button'
                  onClick={() => {
                    console.log('in onClick');
                    console.log(item); // Log the imageSrc to the console
                    handleExpand(item); // Pass the imageSrc to handleExpand
                  }}
                >
                  <img
                    src='/images/icons/expand.jpg'
                    alt='icon'
                    className='selectable-button-icon'
                  />
                </button>
              </label>
            ))}
          </div>
        </div>

        <br />

        {/* Outdoor Selection */}
        <div className='category'>
          <h2 className='form-title'>Outdoor</h2>
          <div className='selectable-container'>
            {outdoorOptions.map((item) => (
              <label
                key={item.name}
                className={`selectable-box ${
                  selectedOutdoor.some((outdoor) => outdoor.name === item.name)
                    ? 'selected'
                    : ''
                }`}
              >
                <input
                  type='checkbox'
                  name='outdoor'
                  value={item.name}
                  checked={selectedEntertainment.some(
                    (outdoor) => outdoor.name === item.name
                  )}
                  onChange={() => handleSelectOutdoor(item)}
                />
                <img
                  src={item.imgSrc}
                  //   alt={item.name}
                  className='selectable-image'
                />
                <div className='selectable-title-container'>
                  <span className='selectable-title'>{item.name}</span>
                  <span className='selectable-title'>${item.price}</span>
                  <span className='selectable-title'>{item.priceRange}</span>

                  {item.rating !== 'N/A' && (
                    <span className='selectable-title'>
                      <span className='selectable-title-text'>
                        ★ {item.rating} ({item.userRatingCount})
                      </span>
                    </span>
                  )}

                  <span className='selectable-title'>
                    <img
                      src='images/icons/person-icon.jpg'
                      alt='icon'
                      className='selectable-title-icon'
                    />
                    <span className='selectable-title-text'>
                      {item.groupSize}
                    </span>
                  </span>
                </div>

                {/*button for functionality */}
                <button
                  className='selectable-button'
                  onClick={() => handleExpand(item)}
                >
                  <img
                    src='/images/icons/expand.jpg'
                    alt='icon'
                    className='selectable-button-icon'
                  />
                </button>
              </label>
            ))}
            <Model
              show={showModal}
              closeModal={handleClose}
              item={expandedItem}
            />{' '}
            {/*LOOK HERE*/}
          </div>
        </div>

        <br />
      </div>
    </div>
  );
}

ActivitiesDisplay.propTypes = {
  foodOptions: PropTypes.array.isRequired,
  selectedFoods: PropTypes.array.isRequired,
  handleSelectFood: PropTypes.func.isRequired,
  entertainmentOptions: PropTypes.array.isRequired,
  selectedEntertainment: PropTypes.array.isRequired,
  handleSelectEntertainment: PropTypes.func.isRequired,
  outdoorOptions: PropTypes.array.isRequired,
  selectedOutdoor: PropTypes.array.isRequired,
  handleSelectOutdoor: PropTypes.func.isRequired,
};

export default ActivitiesDisplay;
