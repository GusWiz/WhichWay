import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './TriponHome.css';
import ErrorBoundary from './ErrorBoundary';
import { FaEye } from 'react-icons/fa';
import ExportItinerary from '../../pages/ExportItinerary';


const TripTable = ({ title, trips, hide, toggleHide, onViewItinerary }) => (
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
                    <button className='view-button' onClick={() => onViewItinerary(id)}>
                      <FaEye style={{ marginRight: '6px' }} /> View Itinerary
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
  // const [selectedTripId, setSelectedTripId] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedItineraryId, setSelectedItineraryId] = useState(null);
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [hideUpcoming, setHideUpcoming] = useState(false);
  const [hideAll, setHideAll] = useState(true);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

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

  const exportItinerary = () => {
    const stringSchedule = JSON.stringify(sampleSchedule);
    const stringName = JSON.stringify(name);
    localStorage.setItem('exportSchedule', stringSchedule);
    localStorage.setItem('exportTripName', stringName);
    const printWindow = window.open('/export', '_blank');
    printWindow.focus();
  };

  const findItineraryForTrip = async (tripId) => {
    try {
      // Find the itinerary ID associated with the trip
      const snapshot = await getDocs(
        query(collection(db, 'itineraries'), where('tripid', '==', tripId))
      );

      if (!snapshot.empty) {
        const itinerary = snapshot.docs[0]; // Assuming you want the first match
        const itineraryId = itinerary.id;  // Get the itinerary ID

        // Now, fetch just the 'schedule' field from the itinerary document using the itineraryId
        const itineraryDoc = await getDoc(doc(db, 'itineraries', itineraryId));

        if (itineraryDoc.exists()) {
          const schedule = itineraryDoc.data().schedule; // Get the 'schedule' field
          console.log("Itinerary Schedule:", schedule);

          // You can now store the schedule data if needed
          // For example, you can set the schedule to state
          setSelectedSchedule(schedule); // Assuming you have a state hook for this
        } else {
          console.log("Itinerary document not found.");
        }

        setSelectedItineraryId(itineraryId);  // Set the selected itinerary ID
      } else {
        console.log("No itinerary found for this trip.");
      }
    } catch (err) {
      console.error("Error finding itinerary:", err);
    }
  };


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
            onViewItinerary={(id) => {x
              // setSelectedTripId(id);
              findItineraryForTrip(id);
              setShowModal(true);
            }}
            // onView={(id) => navigate(`/trip/${id}`)}
          />

          <div className='button-row'>
            <button
              className='triphome-button'
              onClick={() => setHideAll(!hideAll)}
            >
              {hideAll ? 'Show All Trips' : 'Hide All Trips'}
            </button>
          </div>

          {showModal && (
            <div className='modal-overlay' onClick={() => setShowModal(false)}>
              <div
                className='modal-content'
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className='close-button'
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
                <h2>Itinerary Details</h2>
                <div>
                  <ItineraryDisplay schedule={selectedSchedule} />
                </div>

                <button
                  className='triphome-button'
                  style={{ marginTop: '20px' }}
                  onClick={exportItinerary}
                >
                  Export to PDF
                </button>
              </div>
            </div>
          )}

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
