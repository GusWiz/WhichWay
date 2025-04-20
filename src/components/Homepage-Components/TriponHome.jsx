import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './TriponHome.css';
import ErrorBoundary from './ErrorBoundary';
import { FaEye } from 'react-icons/fa';

const TripTable = ({ title, trips, hide, toggleHide, onView }) => (
  <>
    <div className='button-row'>
      <button className='triphome-button' onClick={toggleHide}>
        {hide ? `Show ${title}` : `Hide ${title}`}
      </button>
    </div>
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
              {trips.map(({ id, name, startDate, destination }) => (
                <tr key={id}>
                  <td>{name}</td>
                  <td>{startDate || 'N/A'}</td>
                  <td>{destination}</td>
                  <td>
                    <button className='view-button'>
                      <FaEye style={{ marginRight: '6px' }} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className='empty-msg'>No trips found. Start planning one!</p>
        )}
      </div>
    )}
  </>
);

export default function TripManager() {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [hideUpcoming, setHideUpcoming] = useState(false);
  const [hideAll, setHideAll] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const loadTrips = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'Users', user.uid));
        if (!userDoc.exists()) return;

        const tripIds = userDoc.data().trips || [];
        const tripsData = await Promise.all(
          tripIds.map(async (id) => {
            const tripDoc = await getDoc(doc(db, 'trips', id));
            return tripDoc.exists() ? { id, ...tripDoc.data() } : null;
          })
        );

        setTrips(tripsData.filter(Boolean));
      } catch (err) {
        console.error('Error loading trips:', err);
      }
    };

    loadTrips();
  }, [user]);

  const quoteBank = [
    'Life is short and the world is wide.',
    'Travel is the only thing you buy that makes you richer.',
    'Jobs fill your pockets, but adventures fill your soul.',
    'Travel far enough, you meet yourself.',
    'Adventure is out there.',
    'Wherever you go becomes a part of you somehow.',
    'Take only memories, leave only footprints.',
    'The journey not the arrival matters.',
  ];

  const greetingBank = [
    'Hi',
    'Hey',
    'Welcome',
    'Greetings',
    'What’s up',
    'Hola',
    'Yo',
  ];
  const [greeting] = useState(
    () => greetingBank[Math.floor(Math.random() * greetingBank.length)]
  );

  const [quote] = useState(
    () => quoteBank[Math.floor(Math.random() * quoteBank.length)]
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingTrips = trips.filter(({ startDate }) => {
    const tripDate = new Date(startDate);
    tripDate.setHours(0, 0, 0, 0);
    return tripDate >= today;
  });

  return (
    <ErrorBoundary>
      <div className='triphome-body'>
        <div className='triphome-container'>
          <h1 className='h1'>
            {user?.displayName
              ? `${user.displayName}'s Dashboard 🌎`
              : 'Your Dashboard'}
          </h1>

          <p className='subtle-greeting'>Welcome, traveler.</p>

          <TripTable
            title='Upcoming Trips'
            trips={upcomingTrips}
            hide={hideUpcoming}
            toggleHide={() => setHideUpcoming(!hideUpcoming)}
            onView={(id) => navigate(`/trip/${id}`)}
          />

          <div className='button-row'>
            <button
              className='triphome-button'
              onClick={() => setHideAll(!hideAll)}
            >
              {hideAll ? 'Show All Trips' : 'Hide All Trips'}
            </button>
          </div>

          {!hideAll && (
            <div className='trip-section'>
              <div className='trip-summary'></div>
              <h2 className='h2'>All Trips</h2>
              <table>
                <thead>
                  <tr>
                    <th>Trip Name</th>
                    <th>Destination</th>
                    <th>Time Frame</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip) => (
                    <tr key={trip.id}>
                      <td>{trip.name}</td>
                      <td>{trip.destination}</td>
                      <td>{trip.duration || 'N/A'}</td>
                      <td>
                        <button className='view-button'>
                          <FaEye style={{ marginRight: '6px' }} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className='trip-count'>Total Trips: {trips.length}</div>
            </div>
          )}
        </div>
        <div className='quote-footer'>
          <blockquote>“{quote}” ✈️</blockquote>
        </div>
      </div>
    </ErrorBoundary>
  );
}
