import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './TriponHome.css';
import ErrorBoundary from './ErrorBoundary';

const TripTable = ({ title, trips, hide, toggleHide, onView, onRemove }) => (
  <>
    <button className='triphome-button' onClick={toggleHide}>
      {hide ? `Show ${title}` : `Hide ${title}`}
    </button>
    {!hide && (
      <div className='trip-section'>
        <h2 className='h2'>{title}</h2>
        {trips.length ? (
          <table>
            <thead>
              <tr>
                <th>Trip Name</th>
                <th>Date</th>
                <th>Destination</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.map(({ id, name, date, destination }) => (
                <tr key={id}>
                  <td>{name}</td>
                  <td>{date}</td>
                  <td>{destination}</td>
                  <td>
                    {title === 'Upcoming Trips' ? (
                      <button
                        className='triphome-button'
                        onClick={() => onRemove(id)}
                      >
                        🅧
                      </button>
                    ) : (
                      <button
                        className='triphome-button'
                        onClick={() => onView(id)}
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No available. Create a new trip to get started with {title}.</p>
        )}
      </div>
    )}
  </>
);

export default function TripManager() {
  const [trips, setTrips] = useState([]);
  const [hideUpcoming, setHideUpcoming] = useState(false);
  const [hidePast, setHidePast] = useState(false);
  const [hideAll, setHideAll] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const tripQuery = query(
        collection(db, 'trips'),
        orderBy('startDate', 'desc')
      );
      const querySnapshot = await getDocs(tripQuery);
      setTrips(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    })();
  }, []);

  const travelQuotes = [
    'Life is short and the world is wide.',
    'Travel is the only thing you buy that makes you richer.',
    'Jobs fill your pockets, but adventures fill your soul.',
    'Travel far enough, you meet yourself.',
    'Adventure is out there.',
    'Wherever you go becomes a part of you somehow.',
    'Take only memories, leave only footprints.',
    'The journey not the arrival matters.',
  ];

  const [quote, setQuote] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * travelQuotes.length);
    setQuote(travelQuotes[randomIndex]);
  }, []);

  const handleRemove = async (id) => {
    await deleteDoc(doc(db, 'trips', id));
    setTrips((prev) => prev.filter((trip) => trip.id !== id));
  };

  const upcomingTrips = trips.filter(
    ({ date }) => date >= new Date().toISOString().split('T')[0]
  );
  const pastTrips = trips.filter(
    ({ date }) => date < new Date().toISOString().split('T')[0]
  );

  return (
    <ErrorBoundary>
      <div className='triphome-body'>
        <div className='triphome-container'>
          <h1 className='h1'>Trip Dashboard</h1>
          <div className='quote-box'>
            <p>“{quote}”</p>
          </div>
          <TripTable
            title='Upcoming Trips'
            trips={upcomingTrips}
            hide={hideUpcoming}
            toggleHide={() => setHideUpcoming(!hideUpcoming)}
            onRemove={handleRemove}
          />

          <TripTable
            title='Past Trips'
            trips={pastTrips}
            hide={hidePast}
            toggleHide={() => setHidePast(!hidePast)}
            onView={navigate}
          />

          <button
            className='triphome-button'
            onClick={() => setHideAll(!hideAll)}
          >
            {hideAll ? 'Show All Trips' : 'Hide All Trips'}
          </button>

          {!hideAll && (
            <div className='trip-section'>
              {/* Summary section */}
              <div className='trip-summary'>
                <div>Total Trips: {trips.length}</div>
                <div>Upcoming: {upcomingTrips.length}</div>
                <div>Past: {pastTrips.length}</div>
              </div>
              <h2 className='h2'>All Trips</h2>
              <table>
                <thead>
                  <tr>
                    <th>Trip Name</th>
                    <th>Destination</th>
                    <th>Time Frame</th>
                    <th>Entertainment</th>
                    <th>Food</th>
                    <th>Outdoor</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip) => (
                    <tr key={trip.id}>
                      <td>{trip.name}</td>
                      <td>{trip.destination}</td>
                      <td>{trip.duration || 'N/A'}</td>
                      <td>{trip.selectedEntertainment?.length || 0}</td>
                      <td>{trip.selectedFoods?.length || 0}</td>
                      <td>{trip.selectedOutdoors?.length || 0}</td>
                      <td>
                        {trip.created?.seconds
                          ? new Date(
                              trip.created.seconds * 1000
                            ).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td>
                        <button
                          className='triphome-button'
                          onClick={() => handleRemove(trip.id)}
                        >
                          Delete
                        </button>
                        <button
                          className='triphome-button'
                          onClick={() => navigate(`/trip/${trip.id}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
