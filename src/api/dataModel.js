import { db } from './firestore'; // import the firestore instance
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';

// function to creates a new user document in the Users collection
export const createUserDocument = async (Users) => {
  const userRef = doc(db, 'Users', user.uid);
  await setDoc(userRef, {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    trips: [], // the purpose for this trips array is for it to be connected to a specific user
  });
};

// function to create a new trip document in the trips collection
//refactored this code so parsing is possible and storing in firebase is easier
export const createTripDocument = async (userId, placeData, duration, preferences) => {
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

// function to add a trup to a user's trips array
export const addTripToUser = async (userId, tripId) => {
  const userRef = doc(db, 'Users', userId); // get a reference to the user document
  await updateDoc(userRef, {
    // arrayUnion checks if tripId is already in the trips array.
    // // If it is, it won't add it again.
    trips: arrayUnion(tripId), // add the tripId to the user's trips array
  });
};
