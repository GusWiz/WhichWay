import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';
import '../../TriponHome.css';

function TriponHome() {
  const [editMode, setEditMode] = useState(false);
  const [tripId, setTripId] = useState(null);
  const [tripDetails, setTripDetails] = useState({
    name: 'Trip to Paris',
    destination: 'Paris, France',
    date: '2025-06-15',
  });
  const [trips, setTrips] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [pastTrips, setPastTrips] = useState([]);
  const [hideUpcoming, setHideUpcoming] = useState(false);
  const [hidePast, setHidePast] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      const tripQuery = query(
        collection(db, 'trips'),
        orderBy('startDate', 'desc')
      );
      const querySnapshot = await getDocs(tripQuery);
      const tripsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().tripName,
        destination: doc.data().destination,
        date: doc.data().startDate,
      }));

      setTrips(tripsList);

      const today = new Date().toISOString().split('T')[0];
      setUpcomingTrips(tripsList.filter((trip) => trip.date >= today));
      setPastTrips(tripsList.filter((trip) => trip.date < today));
    };

    fetchTrips();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTripDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setEditMode(false);
    if (tripId) {
      await updateDoc(doc(db, 'trips', tripId), {
        tripName: tripDetails.name,
        destination: tripDetails.destination,
        startDate: tripDetails.date,
      });
    } else {
      const docRef = await addDoc(collection(db, 'trips'), {
        tripName: tripDetails.name,
        destination: tripDetails.destination,
        startDate: tripDetails.date,
      });
      setTripId(docRef.id);
    }
  };

  return (
    <>
      <div className='triphome-body'>
        <h1>Trip Dashboard</h1>
        <div className='trip-container'>
          <button
            className='triphome-button'
            onClick={() => setHideUpcoming(!hideUpcoming)}
          >
            {hideUpcoming ? 'Show Upcoming Trips' : 'Hide Upcoming Trips'}
          </button>
          <button
            className='triphome-button'
            onClick={() => setHidePast(!hidePast)}
          >
            {hidePast ? 'Show Past Trips' : 'Hide Past Trips'}
          </button>

          {!hideUpcoming && (
            <div className='trip-section'>
              <h2>Upcoming Trips</h2>
              <table>
                <thead>
                  <tr>
                    <th>Trip Name</th>
                    <th>Date</th>
                    <th>Destination</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingTrips.length > 0 ? (
                    upcomingTrips.map((trip) => (
                      <tr key={trip.id}>
                        <td>{trip.name}</td>
                        <td>{trip.date}</td>
                        <td>{trip.destination}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan='3'>No upcoming trips</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!hidePast && (
            <div className='trip-section'>
              <h2>Past Trips</h2>
              <table>
                <thead>
                  <tr>
                    <th>Trip Name</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {pastTrips.length > 0 ? (
                    pastTrips.map((trip) => (
                      <tr key={trip.id}>
                        <td>{trip.name}</td>
                        <td>{trip.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan='2'>No past trips</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className='trip-section'>
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
                  <td>
                    {editMode ? (
                      <input
                        type='text'
                        name='name'
                        value={tripDetails.name}
                        onChange={handleInputChange}
                      />
                    ) : (
                      tripDetails.name
                    )}
                  </td>
                  <td>
                    {editMode ? (
                      <input
                        type='date'
                        name='date'
                        value={tripDetails.date}
                        onChange={handleInputChange}
                      />
                    ) : (
                      tripDetails.date
                    )}
                  </td>
                  <td>
                    {editMode ? (
                      <input
                        type='text'
                        name='destination'
                        value={tripDetails.destination}
                        onChange={handleInputChange}
                      />
                    ) : (
                      tripDetails.destination
                    )}
                  </td>
                  <td>
                    <button
                      className='triphome-button'
                      onClick={() => {
                        if (editMode) handleSave();
                        setEditMode(!editMode);
                      }}
                    >
                      {editMode ? 'Save' : 'Edit'}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <button className='triphome-button'>View Itinerary</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default TriponHome;
