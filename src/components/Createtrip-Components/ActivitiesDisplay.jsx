// ActivitiesDisplay.jsx
import React from 'react';
import PropTypes from 'prop-types'; // For type checking (optional)
import './ActivitiesDisplay.css';

function ActivitiesDisplay({
  foodOptions,
  selectedFoods,
  handleSelectFood,
  entertainmentOptions,
  selectedEntertainment,
  handleSelectEntertainment,
  outdoorOptions,
  selectedOutdoor,
  handleSelectOutdoor
}) {
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
                  selectedEntertainment.includes(item.name) ? 'selected' : ''
                }`}
              >
                <input
                  type='checkbox'
                  name='entertainment'
                  value={item.name}
                  checked={selectedEntertainment.includes(item.name)}
                  onChange={() => handleSelectEntertainment(item.name, item.price)}
                />
                <img
                  src={item.imgSrc}
                //   alt={"Could not find Image"}
                  className='selectable-image'
                />
                 <div className='selectable-title-container'>
                    <span className='selectable-title'>{item.name}</span>
                    <span className='selectable-title'>${item.price}</span>  

                    <span className='selectable-title'>
                        <img 
                            src='images/icons/person-icon.jpg'
                            alt='icon'
                            className='selectable-title-icon'
                        />
                        <span className='selectable-title-text'>{item.groupSize}</span>

                    </span>
                </div>

                {/*button for functionality */}
                <button className='selectable-button'>
                    <img src="/images/icons/expand.jpg" alt="icon" className='selectable-button-icon'/>
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
                  selectedFoods.includes(item.name) ? 'selected' : ''
                }`}
              >
                <input
                  type='checkbox'
                  name='food'
                  value={item.name}
                  checked={selectedFoods.includes(item.name)}
                  onChange={() => handleSelectFood(item.name, item.price)}
                />
                <img
                  src={item.imgSrc}
                //   alt={item.name}
                  className='selectable-image'
                />
                <div className='selectable-title-container'>
                    <span className='selectable-title'>{item.name}</span>
                    <span className='selectable-title'>${item.price}</span>  

                    <span className='selectable-title'>
                        <img 
                            src='images/icons/person-icon.jpg'
                            alt='icon'
                            className='selectable-title-icon'
                        />
                        <span className='selectable-title-text'>{item.groupSize}</span>

                    </span>
                </div>

                {/*button for functionality */}
                <button className='selectable-button'>
                    <img src="/images/icons/expand.jpg" alt="icon" className='selectable-button-icon'/>
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
                  selectedOutdoor.includes(item.name) ? 'selected' : ''
                }`}
              >
                <input
                  type='checkbox'
                  name='outdoor'
                  value={item.name}
                  checked={selectedOutdoor.includes(item.name)}
                  onChange={() => handleSelectOutdoor(item.name, item.price)}
                />
                <img
                  src={item.imgSrc}
                //   alt={item.name}
                  className='selectable-image'
                />
                 <div className='selectable-title-container'>
                    <span className='selectable-title'>{item.name}</span>
                    <span className='selectable-title'>${item.price}</span>  

                    <span className='selectable-title'>
                        <img 
                            src='images/icons/person-icon.jpg'
                            alt='icon'
                            className='selectable-title-icon'
                        />
                        <span className='selectable-title-text'>{item.groupSize}</span>

                    </span>
                </div>

                {/*button for functionality */}
                <button className='selectable-button'>
                    <img src="/images/icons/expand.jpg" alt="icon" className='selectable-button-icon'/>
                </button>
              </label>
            ))}
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
  handleSelectOutdoor: PropTypes.func.isRequired
};

export default ActivitiesDisplay;
