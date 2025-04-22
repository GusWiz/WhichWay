import React, { useState } from 'react';
import './ActivityModal.css';

const fallbackImage = '/images/placeholders/noImage.jpg';
const fallbackDescription = 'No description available for this item.';
const fallbackGroupSize = 'Not specified';
const fallbackAtmosphere = 'Atmosphere not specified';

const ActivityModal = ({ show, closeModal, item }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (!show) return null;

  // Display photo from Google Places if available, otherwise use existing image
  const displayImage = item?.photoUrls && item.photoUrls.length > 0
    ? item.photoUrls[0]
    : item?.imgSrc || fallbackImage;

  // Add this function within your component
  const formatDescription = (text) => {
    if (!text) return fallbackDescription;

    // Split into sentences to create better paragraph breaks
    const sentences = text.split(/(?<=[.!?])\s+/);

    // Group sentences into paragraphs (every 2-3 sentences)
    const paragraphs = [];
    for (let i = 0; i < sentences.length; i += 2) {
      paragraphs.push(sentences.slice(i, i + 2).join(' '));
    }

    // Join paragraphs with line breaks
    return paragraphs.join('\n\n');
  };

  // Update the description processing
  const description = item?.description || fallbackDescription;
  const formattedDescription = formatDescription(description);

  // Format the description to be more compact
  const shortDescription = description.length > 150
    ? `${description.substring(0, 150)}...`
    : description;

  const displayDescription = showFullDescription ? formattedDescription : shortDescription;

  return (
    <div className='activity-modal-overlay'>
      <div className='activity-modal-content'>
        <button className='activity-modal-close-button' onClick={closeModal}>
          &times;
        </button>

        {/* Image with enhanced fallback logic */}
        <img
          src={displayImage}
          alt={item?.name || 'Activity'}
          className='activity-modal-image'
        />

        {/* Title */}
        <h2 className='activity-modal-title'>{item?.name}</h2>

        {/* Enhanced description with read more/less toggle */}
        <div className='activity-description-container'>
          <p className='activity-modal-description'>{displayDescription}</p>
          {description.length > 150 && (
            <button
              className='read-more-btn'
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* List of features */}
        <ul className='activity-modal-features'>
          {/* <li> */}
            {/* <strong>Group Size:</strong> {item?.groupSize || fallbackGroupSize}
          </li> */}
          {/* <li>
            <strong>Atmosphere:</strong>{' '}
            {item?.atmosphere || fallbackAtmosphere}
          </li> */}
        </ul>

        {/* Details section with enhanced information */}
        {item && (
          <div className='modal-details'>
            <h2>{item.name}</h2>

            {/* Price Information */}
            <div className='detail-row'>
              <div className='detail-item'>
                <strong>Price Range:</strong>{' '}
                {item.priceRange || 'Not available'}
              </div>
            </div>

            {/* Rating Information with enhanced display */}
            <div className='detail-row'>
              <div className='detail-item'>
                <strong>Rating:</strong>{' '}
                {item.rating !== 'N/A' ? (
                  <span>
                    ★ {item.rating} (
                    {item.userRatingCount || item.user_ratings_total || 0}{' '}
                    reviews)
                  </span>
                ) : (
                  'No ratings yet'
                )}
              </div>
            </div>

            {/* Location */}
            <div className='detail-row'>
              <div className='detail-item'>
                <strong>Location:</strong>{' '}
                {item.vicinity ||
                  item.formatted_address ||
                  'Location not available'}
              </div>
            </div>

            {/* Hours if available from Google Places */}
            {item.opening_hours && item.opening_hours.weekday_text && (
              <div className='detail-row'>
                <div className='detail-item'>
                  <strong>Hours:</strong>
                  <ul className='hours-list'>
                    {item.opening_hours.weekday_text.map((day, idx) => (
                      <li key={idx}>{day}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Group size */}
            <div className='detail-row'>
              <div className='detail-item'>
                <strong>Group Size:</strong> {item.groupSize || 'Not specified'}
              </div>
            </div>

            {/* Website if available */}
            {item.website && (
              <div className='detail-row'>
                <div className='detail-item'>
                  <strong>Website:</strong>{' '}
                  <a
                    href={item.website}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            )}
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
