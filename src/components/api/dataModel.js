import { db } from '../firebase.js';
import {
  doc,
  setDoc,
  addDoc,
  collection,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore';

// Create a new user document in the Users collection
export const createUserDocument = async (user) => {
  try {
    const userRef = doc(db, 'Users', user.uid);
    await setDoc(
      userRef,
      {
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        trips: [], // Array to store trip IDs
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
};

// Create a new trip document in the trips collection
export const createTripDocument = async (
  userId,
  tripDetails,
  duration,
  preferences
) => {
  try {
    // Ensure we have valid data before saving
    if (!userId) throw new Error('User ID is required');
    if (!tripDetails) throw new Error('Trip details are required');

    // Create the trip data object with all the necessary fields
    const tripData = {
      userId,
      name: tripDetails.name || 'Unnamed Trip',
      destination: tripDetails.destination || 'No destination',
      duration: duration || tripDetails.duration || '', // Use duration parameter or fall back to tripDetails.duration
      budget: tripDetails.budget || '0',
      location: tripDetails.location || { lat: 0, lng: 0 },
      preferences: preferences || {},
      createdAt: serverTimestamp(),
    };

    console.log('Creating trip with data:', tripData);

    const tripRef = await addDoc(collection(db, 'trips'), tripData);
    console.log('Trip created with ID:', tripRef.id);
    return tripRef.id;
  } catch (error) {
    console.error('Error creating trip document:', error);
    throw error;
  }
};

//creating the new data model of how to save the itinerary to the db.
export const createItineraryModel = async (tripId) => {
  try {
    // check if tripID is correct
    if (!tripId) throw new Error('Trip ID is required');

    //using aaron's dataCollect.js, get all data from dataCollect.js
    const itineraryDetails = {
      name: tripDetails.name, //from saveDetails()
      days: getItineraryData()?.days || [], //from saveItineraryData()
      activities: getSavedActivities(), //from saveActivities()
      budget: tripDetails.budget, //from saveDetails()
      preferences: getPreferences(), //from collectPreferences()
    };

    // creates a doc in with this datamodel structure
    const itineraryData = {
      tripId,
      name: itineraryDetails.name || 'Unnamed Itinerary',
      days: itineraryDetails.days,
      activities: itineraryDetails.activities,
      budget: itineraryDetails.budget || '0',
      preferences: itineraryDetails.preferences || {},
      createdAt: serverTimestamp(),
    };
    console.log('Creating itinerary with data:', itineraryData);
    //need to start saving this data, according to Jira task description
    const itineraryRef = await addDoc(
      collection(db, 'itineraries'),
      itineraryData
    );
    console.log('Itinerary created with ID:', itineraryRef.id);
    return itineraryRef.id;
  } catch (error) {
    console.error('Error creating itinerary document:', error);
    throw error;
  }
};

// Add a trip ID to a user's trips array
export const addTripToUser = async (userId, tripId) => {
  try {
    if (!userId) throw new Error('User ID is required');
    if (!tripId) throw new Error('Trip ID is required');

    const userRef = doc(db, 'Users', userId);
    await updateDoc(userRef, {
      trips: arrayUnion(tripId),
    });
    console.log(`Trip ${tripId} linked to user ${userId}`);
  } catch (error) {
    console.error('Error adding trip to user:', error);
    throw error;
  }
};

// Function that saves a user's trip to Firestore
export const saveUserTrip = async (
  userId,
  tripDetails,
  timeFrame,
  selectedActivities = null,
  tripId = null,
  setTripId // <-- Add this as a parameter for state setter
) => {
  try {
    if (!userId) throw new Error('User ID is required');
    if (!tripDetails) throw new Error('Trip details are required');

    console.log('[saveUserTrip] Input:', {
      userId,
      tripDetails,
      timeFrame,
      selectedActivities,
      tripId,
    });

    const tripData = {
      userId,
      name: tripDetails.name || 'Unnamed Trip',
      destination: tripDetails.destination || 'No destination',
      duration: timeFrame || tripDetails.duration || '',
      budget: tripDetails.budget || '0',
      location: tripDetails.location || { lat: 0, lng: 0 },
      preferences: selectedActivities || {},
      updatedAt: serverTimestamp(),
    };

    let finalTripId = tripId;

    if (tripId) {
      // 🔁 Update existing trip
      const tripRef = doc(db, 'trips', tripId);
      console.log('[saveUserTrip] Updating existing trip with ID:', tripId);
      await updateDoc(tripRef, tripData);
    } else {
      // 🆕 Create new trip
      console.log('[saveUserTrip] Creating new trip...');
      const tripRef = await addDoc(collection(db, 'trips'), {
        ...tripData,
        createdAt: serverTimestamp(),
      });
      finalTripId = tripRef.id;

      setTripId(finalTripId); // <-- Use finalTripId here
      localStorage.setItem('tripId', finalTripId); // <-- persist!

      console.log('[saveUserTrip] New trip created with ID:', finalTripId);
      await addTripToUser(userId, finalTripId);
    }

    return finalTripId;
  } catch (error) {
    console.error('[saveUserTrip] ERROR:', error);
    throw error;
  }
};
