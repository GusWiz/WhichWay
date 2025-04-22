import { signOut } from 'firebase/auth';
import { auth, db } from '../components/firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  collection,
} from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import './Home.css';
import './Landing.css';
import './CreateItinerary.css';
import './CreateTrip.css';
import './Account.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

import NavigationBar from '../components/Landing-Components/NavigationBar';
import Sidebar from '../components/Homepage-Components/Sidebar';
import TripInputField from '../components/Createtrip-Components/TripInputField';
import LocationAutocomplete from '../components/Createtrip-Components/LocationAutocomplete';
import ActivitiesDisplay from '../components/Createtrip-Components/ActivitiesDisplay';
import { fetchActivitiesByLocation } from '../components/api/placesService.js';
import { generateItinerary } from '../backend/openAI';
import DateSelector from '../components/Createtrip-Components/DateSelector.jsx';

function EditTrip() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [tripsData, setTripsData] = useState([]);
  const [editingTrip, setEditingTrip] = useState(null);

  const [tripName, setTripName] = useState('');
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [details, setDetails] = useState({
    destination: '',
    location: null,
  });
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [selectedEntertainment, setSelectedEntertainment] = useState([]);
  const [selectedOutdoor, setSelectedOutdoor] = useState([]);
  const [foodOptions, setFoodOptions] = useState([]);
  const [entertainmentOptions, setEntertainmentOptions] = useState([]);
  const [outdoorOptions, setOutdoorOptions] = useState([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itineraryData, setItineraryData] = useState(null);
  const [showItinerary, setShowItinerary] = useState(false); // New state variable

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user) return;
      try {
        const userDocRef = doc(db, 'Users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const tripIds = userData.trips || [];
          const trips = await Promise.all(
            tripIds.map(async (id) => {
              const tripDocRef = doc(db, 'trips', id);
              const tripDocSnap = await getDoc(tripDocRef);
              if (tripDocSnap.exists()) {
                const tripData = tripDocSnap.data();
                return {
                  id,
                  ...tripData,
                  createdAt: tripData.createdAt?.toDate(),
                };
              }
              return null;
            })
          );
          setTripsData(trips.filter((trip) => trip !== null));
        }
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };
    fetchTrips();
  }, [user]);

  useEffect(() => {
    const fetchTripToEdit = async () => {
      if (editingTrip) {
        try {
          const tripDocRef = doc(db, 'trips', editingTrip.id);
          const tripDocSnap = await getDoc(tripDocRef);
          if (tripDocSnap.exists()) {
            const tripData = tripDocSnap.data();
            setTripName(tripData.name);
            setDuration(tripData.duration);
            setStartDate(tripData.startDate || '');
            setEndDate(tripData.endDate || '');
            setDetails({
              destination: tripData.destination,
              location: tripData.location,
            });
            setSelectedFoods(tripData.preferences?.selectedFoods || []);
            setSelectedEntertainment(
              tripData.preferences?.selectedEntertainment || []
            );
            setSelectedOutdoor(tripData.preferences?.selectedOutdoor || []);
            if (tripData.itineraryId) {
              const itineraryDocRef = doc(
                db,
                'Itineraries',
                tripData.itineraryId
              );
              const itineraryDocSnap = await getDoc(itineraryDocRef);
              if (itineraryDocSnap.exists()) {
                setItineraryData(itineraryDocSnap.data().schedule);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching trip to edit:', error);
        }
      }
    };
    fetchTripToEdit();
  }, [editingTrip]);

  const logout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (error) {
      console.log(error);
    }
  };

  const handleGenerateItinerary = async () => {
    setLoading(true);
    try {
      const openaiRequest = `
      Location: ${details.destination}
      Start date: ${startDate || new Date().toISOString().split('T')[0]}
      End date: ${endDate || new Date().toISOString().split('T')[0]}
      Duration: ${duration}
      Activity List:
      ${[
        ...selectedFoods.map((food) => `- ${food.name}`),
        ...selectedEntertainment.map(
          (entertainment) => `- ${entertainment.name}`
        ),
        ...selectedOutdoor.map((outdoor) => `- ${outdoor.name}`),
      ].join('\n')}
      `;

      const itineraryResponse = await generateItinerary(openaiRequest);

      if (!itineraryResponse) {
        throw new Error('Failed to generate a valid itinerary');
      }

      let jsonString = itineraryResponse;

      if (itineraryResponse.includes('```')) {
        const matches = itineraryResponse.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (matches && matches[1]) {
          jsonString = matches[1].trim();
        }
      }

      const parsedItinerary = JSON.parse(jsonString);

      if (!parsedItinerary || !parsedItinerary.schedule) {
        throw new Error('Invalid itinerary format received');
      }

      setItineraryData(parsedItinerary.schedule);
      setShowItinerary(true); // Show itinerary
    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast.error('Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItinerary = async () => {
    try {
      if (!itineraryData) {
        toast.error('No itinerary data to save.');
        return;
      }

      const itineraryDocRef = editingTrip.itineraryId
        ? doc(db, 'Itineraries', editingTrip.itineraryId)
        : doc(collection(db, 'Itineraries'));

      await setDoc(itineraryDocRef, { schedule: itineraryData });

      await updateDoc(doc(db, 'trips', editingTrip.id), {
        name: tripName,
        duration: duration,
        startDate: startDate || '',
        endDate: endDate || '',
        destination: details.destination,
        location: details.location,
        preferences: {
          selectedFoods,
          selectedEntertainment,
          selectedOutdoor,
        },
        itineraryId: itineraryDocRef.id,
      });

      toast.success('Itinerary saved!');
      navigate('/home');
    } catch (error) {
      console.error('Error saving itinerary:', error);
      toast.error('Failed to save itinerary.');
    }
  };

  const handleCancelEdit = () => {
    setEditingTrip(null);
    setItineraryData(null);
    setShowItinerary(false); // Hide itinerary
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleDaterangeChange = ({ startDate, endDate }) => {
    setStartDate(startDate ? startDate.toISOString().split('T')[0] : '');
    setEndDate(endDate ? endDate.toISOString().split('T')[0] : '');

    if (startDate && endDate) {
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDuration(`${diffDays} days`);
    }
  };

  const handleSelect = (category, item) => {
    switch (category) {
      case 'food':
        if (selectedFoods.some((food) => food.name === item.name)) {
          setSelectedFoods((prev) =>
            prev.filter((food) => food.name !== item.name)
          );
        } else {
          setSelectedFoods((prev) => [...prev, item]);
        }
        break;
      case 'entertainment':
        if (
          selectedEntertainment.some(
            (entertainment) => entertainment.name === item.name
          )
        ) {
          setSelectedEntertainment((prev) =>
            prev.filter((entertainment) => entertainment.name !== item.name)
          );
        } else {
          setSelectedEntertainment((prev) => [...prev, item]);
        }
        break;
      case 'outdoor':
        if (selectedOutdoor.some((outdoor) => outdoor.name === item.name)) {
          setSelectedOutdoor((prev) =>
            prev.filter((outdoor) => outdoor.name !== item.name)
          );
        } else {
          setSelectedOutdoor((prev) => [...prev, item]);
        }
        break;
      default:
        break;
    }
  };

  const handlePlaceSelected = async (placeData) => {
    setDetails((prev) => ({
      ...prev,
      destination: placeData.name,
      location: placeData.location,
    }));
    setIsLoadingActivities(true);
    try {
      const activitiesData = await fetchActivitiesByLocation(
        placeData.location
      );
      if (activitiesData.food?.length > 0) setFoodOptions(activitiesData.food);
      if (activitiesData.entertainment?.length > 0)
        setEntertainmentOptions(activitiesData.entertainment);
      if (activitiesData.outdoor?.length > 0)
        setOutdoorOptions(activitiesData.outdoor);
      toast.success('Activities loaded!');
    } catch (error) {
      console.error('Error loading activities:', error);
      toast.error('Failed to load activities');
    } finally {
      setIsLoadingActivities(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      await deleteDoc(doc(db, 'trips', tripId));
      setTripsData(tripsData.filter((trip) => trip.id !== tripId));
      toast.success('Trip deleted successfully!');
    } catch (error) {
      console.error('Error deleting trip:', error);
      toast.error('Failed to delete trip.');
    }
  };

  return (
    <>
      <NavigationBar />
      <div className='home-page'>
        <div className='home-container'>
          <Sidebar logout={logout} />
          <div className='home-contents'>
            <div className='itinerary-container'>
              {editingTrip ? (
                <>
                  <h1 style={{ fontSize: '1.5rem' }}>Edit Trip</h1>
                  <div className='form-container'>
                    {showItinerary ? (
                      <div>
                        {/* Display Itinerary Data */}
                        {itineraryData.map((dayData, dayIndex) => (
                          <div key={dayIndex} className='itinerary-day'>
                            <div className='itinerary-daytitle'>
                              <h2>
                                Day {dayIndex + 1}: {dayData.date}
                              </h2>
                            </div>
                            <div className='itinerary-itemscontainer'>
                              {dayData.activities.map(
                                (activity, activityIndex) => (
                                  <div
                                    key={activityIndex}
                                    className='itinerary-item'
                                  >
                                    <div className='itinerary-itemtime'>
                                      <h3>
                                        {activity.start_time} -{' '}
                                        {activity.end_time || 'TBD'}
                                      </h3>
                                    </div>
                                    <div className='itinerary-item-details'>
                                      <div className='itinerary-item-title'>
                                        <h3>{activity.name}</h3>
                                      </div>
                                      <p>
                                        {activity.description ||
                                          'No description available'}
                                      </p>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        ))}
                        <div className='itinerary-buttons'>
                          <button
                            onClick={handleGenerateItinerary}
                            disabled={loading}
                            className='itinerary-button'
                          >
                            {loading ? (
                              <span className='loader'></span>
                            ) : (
                              'Regenerate'
                            )}
                          </button>
                          <button
                            onClick={handleSaveItinerary}
                            className='itinerary-button'
                          >
                            Save
                          </button>
                          <button className='itinerary-button'>
                            Download PDF
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className='itinerary-button'
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <form
                          className='form'
                          onSubmit={(e) => e.preventDefault()}
                        >
                          <TripInputField
                            type='text'
                            placeholder='Trip Name'
                            value={tripName}
                            onChange={(e) => setTripName(e.target.value)}
                            name='tripName'
                          />
                          <LocationAutocomplete
                            value={details.destination}
                            onChange={handleChange}
                            onPlaceSelected={handlePlaceSelected}
                          />
                          <DateSelector
                            onDateRangeChange={handleDaterangeChange}
                            initialStartDate={
                              startDate ? new Date(startDate) : null
                            }
                            initialEndDate={endDate ? new Date(endDate) : null}
                          />
                          <TripInputField
                            type='text'
                            placeholder='Duration'
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            name='duration'
                          />
                        </form>
                        <ActivitiesDisplay
                          foodOptions={foodOptions}
                          selectedFoods={selectedFoods}
                          handleSelectFood={(item) =>
                            handleSelect('food', item)
                          }
                          entertainmentOptions={entertainmentOptions}
                          selectedEntertainment={selectedEntertainment}
                          handleSelectEntertainment={(item) =>
                            handleSelect('entertainment', item)
                          }
                          outdoorOptions={outdoorOptions}
                          selectedOutdoor={selectedOutdoor}
                          handleSelectOutdoor={(item) =>
                            handleSelect('outdoor', item)
                          }
                        />
                        <div className='create-trip-buttons'>
                          <button
                            onClick={handleGenerateItinerary}
                            disabled={loading}
                            className='trip-preference-btn'
                          >
                            {loading ? (
                              <span className='loader'></span>
                            ) : (
                              'Generate New Itinerary'
                            )}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className='trip-preference-btn'
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className='edittrip-heading'>
                    <h1>Edit Trip</h1>
                  </div>
                  <div>
                    <table>
                      <thead>
                        <tr>
                          <th>Trip Name</th>
                          <th>Destination</th>
                          <th>Time Frame</th>
                          <th>Entertainment Activities</th>
                          <th>Food Activities</th>
                          <th>Outdoor Activities</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tripsData.map((trip) => (
                          <tr key={trip.id}>
                            <td>{trip.name}</td>
                            <td>{trip.destination}</td>
                            <td>{trip.duration}</td>
                            <td>
                              {trip.preferences?.selectedEntertainment
                                ?.length || 0}
                            </td>
                            <td>
                              {trip.preferences?.selectedFoods?.length || 0}
                            </td>
                            <td>
                              {trip.preferences?.selectedOutdoor?.length || 0}
                            </td>
                            <td>{trip.createdAt?.toLocaleDateString()}</td>
                            <td>
                              <button
                                className='edit-button'
                                onClick={() => setEditingTrip(trip)}
                              >
                                <FaEdit /> Edit
                              </button>
                              <button
                                className='delete-button'
                                onClick={() => handleDeleteTrip(trip.id)}
                              >
                                <FaTrash /> Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      {isLoadingActivities && (
        <div className='loading-container'>
          <p>Loading activities for {details.destination}...</p>
        </div>
      )}
    </>
  );
}

export default EditTrip;
