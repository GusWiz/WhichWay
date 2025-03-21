import React from 'react';
import './ActivityModal.css';

const fallbackImage = '/images/placeholders/noImage.jpg'

const ActivityModal = ({ show, closeModal, item}) => {
  if (!show) return null;

  return (
    <div className="activity-modal-overlay">
      <div className="activity-modal-content">
        <button className="activity-modal-close-button" onClick={closeModal}>&times;</button>

        <img 
          src={item?.imgSrc || fallbackImage} // Use fallback image if imageSrc is missing
          alt="Activity" 
          className="activity-modal-image" 
        />

        <h2 className="activity-modal-title">{item?.name}</h2>
        <p>This content is displayed when the button is pressed.</p> 
        <button onClick={closeModal} className="activity-modal-submit-btn">Close</button>
      </div>
    </div>
  );
};

export default ActivityModal;
