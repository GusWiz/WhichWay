import React from 'react';
import '../../TriponHome.css';
function TriponHome() {
  return (
    <>
      <h1>Trip Dashboard</h1>

      <div className="trip-container">
        <div className="trip-row">
          {/* Upcoming Trips */}
          <div className="trip-section">
            <h2>Upcoming Trips</h2>
            <table>
              <thead>
                <tr>
                  <th>Trip Name</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>No Trips Available</td>
                  <td>-</td>
                  <td>-</td>
                  <td><button>Edit</button></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Past Trips */}
          <div className="trip-section">
            <h2>Past Trips</h2>
            <table>
              <thead>
                <tr>
                  <th>Trip Name</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>No Trips Available</td>
                  <td>-</td>
                  <td><button>View</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Current Trip */}
        <div className="trip-section">
          <h2>Current Trip</h2>
          <table>
            <thead>
              <tr>
                <th>Trip Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>No Trips Available</td>
                <td>-</td>
                <td>-</td>
                <td><button>Edit</button></td>
              </tr>
            </tbody>
          </table>
          <button>View Itinerary</button>
        </div>
      </div>
    </>
  );
}

export default TriponHome;
