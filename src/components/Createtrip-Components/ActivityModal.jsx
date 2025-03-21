import React from 'react';
import './ActivityModal.css';

const ActivityModal = ({ show, closeModal }) => {
  if (!show) return null;

  return (
    <div className="activity-modal-overlay">
      <div className="activity-modal-content">
        <button className="activity-modal-close-button" onClick={closeModal}>&times;</button>
        <h2 className="activity-modal-title">Expanded Activity View</h2>
        <p>This content is displayed when the button is pressed.</p>
        <button onClick={closeModal} className="activity-modal-submit-btn">Close</button>
      </div>
    </div>
  );
};

export default ActivityModal;
