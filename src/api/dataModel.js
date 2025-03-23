import { db } from './firestore'; // Import Firestore instance
import {
  doc,
  setDoc,
  addDoc,
  collection,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';

// Create a new user document in the Users collection
export const createUserDocument = async (Users) => {
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
  placeData,
  duration,
  preferences
) => {
  const tripData = {
    userId, // Link trip to user
    place_id: placeData.place_id,
    name: placeData.name,
    formatted_address: placeData.formatted_address,
    location: placeData.geometry.location, // { lat, lng }
    rating: placeData.rating,
    user_ratings_total: placeData.user_ratings_total,
    types: placeData.types,
    website: placeData.website,
    formatted_phone_number: placeData.formatted_phone_number,
    duration, // User input
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

// function that saves a user's trip to Firestore
export const saveUserTrip = async (userId, destination, timeFrame, selectedActivities) => {
  try {
    // saves trip date to db
    const tripId = await createTripDocument(userId, destination, timeFrame, selectedActivities);

    // link the trip to the User trip array (trip array has all trips)
    await addTripToUser(userId, tripId);
    console.log('Trip saved and linked to user successfully');
  } catch (error) {
    console.log('Error saving user trip: ', error);
  }
};
