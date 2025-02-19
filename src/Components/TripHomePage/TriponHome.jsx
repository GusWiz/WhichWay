import React from "react";
import './TriponHome.css';
function TriponHome() {
    return (
      <>
        <h1>Trip Dashboard</h1>

        <div className="trip-container">
          {/* Upcoming Trips */}
          <div className="trip-section">
            <h2>Upcoming Trips</h2>
            <button disabled>No Trips Available</button>
          </div>

          {/* Past Trips */}
          <div className="trip-section">
            <h2>Past Trips</h2>
            <button disabled>No Trips Available</button>
          </div>

          {/* Current Trip */}
          <div className="trip-section">
            <h2>Current Trip</h2>
            <button disabled>No Trips Available</button>
          </div>
        </div>
      </>
    );
  }

export default TriponHome;