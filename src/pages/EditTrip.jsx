import { signOut } from 'firebase/auth';
import { auth, db } from '../components/firebase';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './Home.css';
import './Landing.css';
import './CreateItinerary.css';

import NavigationBar from '../components/Landing-Components/NavigationBar';
import Sidebar from '../components/Homepage-Components/Sidebar';
import TripInputField from '../components/Createtrip-Components/TripInputField';
import LocationAutocomplete from '../components/Createtrip-Components/LocationAutocomplete';
import ActivitiesDisplay from '../components/Createtrip-Components/ActivitiesDisplay';
import { fetchActivitiesByLocation } from '../components/api/placesService.js';

function EditTrip() {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const [user, setUser] = useState(null);
  const [tripsData, setTripsData] = useState([]);
  const [editingTrip, setEditingTrip] = useState(null);

  const [tripName, setTripName] = useState('');
  const [duration, setDuration] = useState('');
  const [details, setDetails] = useState({
    budget: '',
    cost: '0',
    destination: '',
    location: null,
  });
  const [displayedBudget, setDisplayedBudget] = useState({ budget: 'NULL' });
  const [displayedCost, setDisplayedCost] = useState({ cost: '0' });
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [selectedEntertainment, setSelectedEntertainment] = useState([]);
  const [selectedOutdoor, setSelectedOutdoor] = useState([]);
  const [foodOptions, setFoodOptions] = useState([]);
  const [entertainmentOptions, setEntertainmentOptions] = useState([]);
  const [outdoorOptions, setOutdoorOptions] = useState([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

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
      if (tripId) {
        try {
          const tripDocRef = doc(db, 'trips', tripId);
          const tripDocSnap = await getDoc(tripDocRef);
          if (tripDocSnap.exists()) {
            const tripData = tripDocSnap.data();
            setEditingTrip({ id: tripId, ...tripData });
            setTripName(tripData.name);
            setDuration(tripData.duration);
            setDetails({
              budget: tripData.budget,
              destination: tripData.destination,
              location: tripData.location,
            });
            setDisplayedBudget({ budget: tripData.budget });
            setSelectedFoods(tripData.preferences?.selectedFoods || []);
            setSelectedEntertainment(
              tripData.preferences?.selectedEntertainment || []
            );
            setSelectedOutdoor(tripData.preferences?.selectedOutdoor || []);
          }
        } catch (error) {
          console.error('Error fetching trip to edit:', error);
        }
      }
    };
    fetchTripToEdit();
  }, [tripId]);

  const logout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateTrip = async () => {
    console.log(tripId);
    console.log(editingTrip);
    if (!tripId) return;
    try {
      const tripDocRef = doc(db, 'trips', tripId);
      console.log(tripId);
      console.log(editingTrip);
      await updateDoc(tripDocRef, {
        name: tripName,
        duration: duration,
        budget: details.budget,
        destination: details.destination,
        location: details.location,
        preferences: {
          selectedFoods,
          selectedEntertainment,
          selectedOutdoor,
        },
      });
      toast.success('Trip updated successfully!');
      navigate('/home');
    } catch (error) {
      console.error('Error updating trip:', error);
      toast.error('Failed to update trip.');
    }
  };

  const handleCancelEdit = () => {
    setEditingTrip(null);
  };

  const handleCostChange = (price) => {
    setDisplayedCost((prevCost) => {
      const currCost = parseInt(prevCost.cost);
      return { ...prevCost, cost: currCost + parseInt(price) };
    });
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const budgetSubmit = (event) => {
    event.preventDefault();
    if (details.budget < 0 || details.budget < displayedCost.cost) {
      toast.error('Invalid budget');
      return;
    }
    setDisplayedBudget({ budget: details.budget });
    setDetails((prev) => ({ ...prev, budget: details.budget }));
  };

  const handleSelect = (category, item) => {
    // ... (Your handleSelect logic here)
    const costCheck = displayedBudget.budget - displayedCost.cost - item.price;
    if (
      costCheck < 0 &&
      !editingTrip?.preferences?.[
        `selected${category.charAt(0).toUpperCase() + category.slice(1)}`
      ]?.some((selectedItem) => selectedItem.name === item.name)
    ) {
      toast.error('Cost exceeds budget');
      return;
    }

    switch (category) {
      case 'food':
        if (selectedFoods.some((food) => food.name === item.name)) {
          handleCostChange(item.price * -1);
          setSelectedFoods((prev) =>
            prev.filter((food) => food.name !== item.name)
          );
        } else {
          handleCostChange(item.price);
          setSelectedFoods((prev) => [...prev, item]);
        }
        break;
      case 'entertainment':
        if (
          selectedEntertainment.some(
            (entertainment) => entertainment.name === item.name
          )
        ) {
          handleCostChange(item.price * -1);
          setSelectedEntertainment((prev) =>
            prev.filter((entertainment) => entertainment.name !== item.name)
          );
        } else {
          handleCostChange(item.price);
          setSelectedEntertainment((prev) => [...prev, item]);
        }
        break;
      case 'outdoor':
        if (selectedOutdoor.some((outdoor) => outdoor.name === item.name)) {
          handleCostChange(item.price * -1);
          setSelectedOutdoor((prev) =>
            prev.filter((outdoor) => outdoor.name !== item.name)
          );
        } else {
          handleCostChange(item.price);
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
                  <div className='createititnerary-title'>
                    <h1>Edit Trip</h1>
                  </div>
                  <div className='form-container'>
                    <form className='form' onSubmit={(e) => e.preventDefault()}>
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
                      <TripInputField
                        type='text'
                        placeholder='Duration'
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        name='duration'
                      />
                    </form>
                    <label>Budget = ${displayedBudget.budget}</label>
                    <br />
                    <label>Cost = ${displayedCost.cost}</label>
                    <br />
                    <label>
                      Remaining Budget = $
                      {displayedBudget.budget - displayedCost.cost}
                    </label>
                    <br />
                    <form className='form' onSubmit={budgetSubmit}>
                      <input
                        type='number'
                        name='budget'
                        placeholder='Budget'
                        onChange={handleChange}
                        value={details.budget}
                      />
                      <button type='submit'>Change Budget</button>
                    </form>
                    <ActivitiesDisplay
                      foodOptions={foodOptions}
                      selectedFoods={selectedFoods}
                      handleSelectFood={(item) => handleSelect('food', item)}
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
                    <button onClick={handleUpdateTrip}>Save Changes</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div className='createititnerary-title'>
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
                              <button onClick={() => setEditingTrip(trip)}>
                                Edit
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
