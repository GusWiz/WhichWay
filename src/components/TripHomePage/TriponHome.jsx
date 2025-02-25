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
import '../../TriponHome.css';

const TripTable = ({
  title,
  trips,
  hide,
  toggleHide,
  onEdit,
  onView,
  onRemove,
}) => (
  <>
    <button onClick={toggleHide}>
      {hide ? `Show ${title}` : `Hide ${title}`}
    </button>
    {!hide && (
      <div className='trip-section'>
        <h2>{title}</h2>
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
                  {['name', 'date', 'destination'].map((field) => (
                    <td key={field}>
                      <EditableField
                        field={field}
                        value={{ name, date, destination }[field]}
                        tripId={id}
                      />
                    </td>
                  ))}
                  <td>
                    {title === 'Upcoming Trips' ? (
                      <button onClick={() => onRemove(id)}>🅧</button>
                    ) : (
                      <button onClick={() => onView(id)}>View</button>
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

const EditableField = ({ field, value, tripId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = async () => {
    if (tempValue !== value) {
      await updateDoc(doc(db, 'trips', tripId), { [field]: tempValue });
    }
    setIsEditing(false);
  };

  return isEditing ? (
    <input
      type={field === 'date' ? 'date' : 'text'}
      value={tempValue}
      onChange={(e) => setTempValue(e.target.value)}
      onBlur={handleSave}
      autoFocus
    />
  ) : (
    <span onClick={() => setIsEditing(true)}>{tempValue}</span>
  );
};

export default function TripManager() {
  const [trips, setTrips] = useState([]);
  const [tripDetails, setTripDetails] = useState({
    name: '',
    date: '',
    destination: '',
  });
  const [tripId, setTripId] = useState(null);
  const [hideUpcoming, setHideUpcoming] = useState(false);
  const [hidePast, setHidePast] = useState(false);
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

  const handleInputChange = ({ target: { name, value } }) =>
    setTripDetails((prev) => ({ ...prev, [name]: value }));

  const handleSave = async () => {
    if (Object.values(tripDetails).some((v) => !v)) return;
    if (tripId) {
      await updateDoc(doc(db, 'trips', tripId), tripDetails);
    } else {
      const docRef = await addDoc(collection(db, 'trips'), tripDetails);
      setTrips((prev) => [...prev, { id: docRef.id, ...tripDetails }]);
    }
    setTripId(null);
    setTripDetails({ name: '', date: '', destination: '' });
  };

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
    <div>
      <h1>Trip Dashboard</h1>
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
      <div>
        <h2>{tripId ? 'Edit Trip' : 'New Trip'}</h2>
        {['name', 'date', 'destination'].map((field) => (
          <input
            key={field}
            type={field === 'date' ? 'date' : 'text'}
            name={field}
            value={tripDetails[field]}
            onChange={handleInputChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          />
        ))}
        <button onClick={handleSave}>{tripId ? 'Save' : 'Add Trip'}</button>
      </div>
    </div>
  );
}
