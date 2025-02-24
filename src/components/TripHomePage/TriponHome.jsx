import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import '../../TriponHome.css';

function TriponHome() {
  const [editMode, setEditMode] = useState(false);
  const [tripId, setTripId] = useState(null);
  const [tripDetails, setTripDetails] = useState({
    name: 'Trip to Paris',
    destination: 'Paris, France',
    date: '2025-06-15'
  });

  useEffect(() => {
    const fetchTrips = async () => {
      const querySnapshot = await getDocs(collection(db, 'trips'));
      if (!querySnapshot.empty) {
        const trip = querySnapshot.docs[0];
        setTripDetails({
          name: trip.data().tripName,
          destination: trip.data().destination,
          date: trip.data().startDate
        });
        setTripId(trip.id);
      }
    };
    fetchTrips();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTripDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setEditMode(false);
    if (tripId) {
      await updateDoc(doc(db, 'trips', tripId), {
        tripName: tripDetails.name,
        destination: tripDetails.destination,
        startDate: tripDetails.date
      });
    } else {
      const docRef = await addDoc(collection(db, 'trips'), {
        tripName: tripDetails.name,
        destination: tripDetails.destination,
        startDate: tripDetails.date
      });
      setTripId(docRef.id);
    }
  };

  return (
    <>
      <h1>Trip Dashboard</h1>
      <div className="trip-container">
        <div className="trip-row">
          <div className="trip-section">
            <h2>Upcoming Trips</h2>
            <table>
              <thead>
                <tr>
                  <th>Trip Name</th>
                  <th>Date</th>
                  <th>Destination</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{editMode ? <input type="text" name="name" value={tripDetails.name} onChange={handleInputChange} /> : tripDetails.name}</td>
                  <td>{editMode ? <input type="date" name="date" value={tripDetails.date} onChange={handleInputChange} /> : tripDetails.date}</td>
                  <td>{editMode ? <input type="text" name="destination" value={tripDetails.destination} onChange={handleInputChange} /> : tripDetails.destination}</td>
                  <td>
                    <button onClick={() => {
                      if (editMode) handleSave();
                      setEditMode(!editMode);
                    }}>{editMode ? 'Save' : 'Edit'}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

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
                  <td><button className="small-button">View</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="trip-section">
          <h2>Current Trip</h2>
          <table>
            <thead>
              <tr>
                <th>Trip Name</th>
                <th>Date</th>
                <th>Destination</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{editMode ? <input type="text" name="name" value={tripDetails.name} onChange={handleInputChange} /> : tripDetails.name}</td>
                <td>{editMode ? <input type="date" name="date" value={tripDetails.date} onChange={handleInputChange} /> : tripDetails.date}</td>
                <td>{editMode ? <input type="text" name="destination" value={tripDetails.destination} onChange={handleInputChange} /> : tripDetails.destination}</td>
                <td>
                  <button onClick={() => {
                    if (editMode) handleSave();
                    setEditMode(!editMode);
                  }}>{editMode ? 'Save' : 'Edit'}</button>
                </td>
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