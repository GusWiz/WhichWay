import { db } from '../components/firebase'; // Import Firestore instance
import {
  doc,
  setDoc,
  addDoc,
  collection,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';

// Create a new user document in the Users collection
export const createUserDocument = async (user) => {
  const userRef = doc(db, 'Users', user.uid);
  await setDoc(userRef, {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    trips: [], // Array to store trip IDs
  });
};

// Create a new trip document in the trips collection
export const createTripDocument = async (
  userId,
  tripDetails,
  duration,
  preferences
) => {
  const tripData = {
    userId, // Link trip to user
    name: tripDetails.name,
    destination: tripDetails.destination,
    //location: placeData.geometry.location, // { lat, lng }
    // rating: placeData.rating,
    // user_ratings_total: placeData.user_ratings_total,
    // types: placeData.types,
    // website: placeData.website,
    // formatted_phone_number: placeData.formatted_phone_number,
    duration, // User input
    budget: tripDetails.budget,
    location: tripDetails.location, // { lat, lng }
    preferences, // User input
  };

  const tripRef = await addDoc(collection(db, 'trips'), tripData);
  return tripRef.id; // Return the trip ID to link to the user
};

// Add a trip ID to a user's trips array
export const addTripToUser = async (userId, tripId) => {
  const userRef = doc(db, 'Users', userId);
  await updateDoc(userRef, {
    trips: arrayUnion(tripId), // Add the trip ID to the user's trips array
  });
};

// Function that saves a user's trip to Firestore
export const saveUserTrip = async (userId, tripDetails, timeFrame, selectedActivities = null) => {
  try {
    // Save trip data to Firestore
    const tripId = await createTripDocument(userId, tripDetails, timeFrame, selectedActivities);

    // link the trip to the User trip array (trip array has all trips)
    await addTripToUser(userId, tripId);

    console.log('Trip saved and linked to user successfully');
  } catch (error) {
    console.error('Error saving user trip:', error);
  }
};
