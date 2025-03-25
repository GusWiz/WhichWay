import React from 'react';
import './ActivityModal.css';

const fallbackImage = '/images/placeholders/noImage.jpg';
const fallbackDescription = 'No description available for this item.';
const fallbackGroupSize = 'Not specified'; // Fallback for group size
const fallbackPrice = 'Price not available'; // Fallback for price
const fallbackAtmosphere = 'Atmosphere not specified'; // Fallback for atmosphere

const ActivityModal = ({ show, closeModal, item }) => {
  if (!show) return null;

  return (
    <div className='activity-modal-overlay'>
      <div className='activity-modal-content'>
        <button className='activity-modal-close-button' onClick={closeModal}>
          &times;
        </button>

        {/* Image with fallback */}
        <img
          src={item?.imgSrc || fallbackImage} // Use fallback image if imgSrc is missing
          alt='Activity'
          className='activity-modal-image'
        />

        {/* Title */}
        <h2 className='activity-modal-title'>{item?.name}</h2>

        {/* Description with fallback */}
        <p className='activity-modal-description'>
          {item?.description || fallbackDescription}
        </p>

        {/* List of features */}
        <ul className='activity-modal-features'>
          <li>
            <strong>Group Size:</strong> {item?.groupSize || fallbackGroupSize}
          </li>
          <li>
            <strong>Price:</strong> {item?.price || fallbackPrice}
          </li>
          <li>
            <strong>Atmosphere:</strong>{' '}
            {item?.atmosphere || fallbackAtmosphere}
          </li>
        </ul>

        {/* New details section */}
        {item && (
          <div className='modal-details'>
            <h2>{item.name}</h2>

            {/* Price and Rating Information */}
            <div className='detail-row'>
              <div className='detail-item'>
                <strong>Price Range:</strong> {item.priceRange}
              </div>
              <div className='detail-item'>
                <strong>Price:</strong> ${item.price}
              </div>
            </div>

            <div className='detail-row'>
              <div className='detail-item'>
                <strong>Rating:</strong>{' '}
                {item.rating !== 'N/A' ? (
                  <span>
                    ★ {item.rating} ({item.userRatingCount} reviews)
                  </span>
                ) : (
                  'No ratings yet'
                )}
              </div>
            </div>

            {/* Existing content */}
            <div className='detail-row'>
              <div className='detail-item'>
                <strong>Location:</strong> {item.vicinity}
              </div>
            </div>

            {/* Group size */}
            <div className='detail-row'>
              <div className='detail-item'>
                <strong>Group Size:</strong> {item.groupSize}
              </div>
            </div>
          </div>
        )}

        {/* Close button */}
        <button onClick={closeModal} className='activity-modal-submit-btn'>
          Close
        </button>
      </div>
    </div>
  );
};

export default ActivityModal;
