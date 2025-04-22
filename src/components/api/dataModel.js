import { db } from '../firebase.js';
import {
  doc,
  setDoc,
  addDoc,
  getDoc,
  collection,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore';

// Add this function at the top of your file
function sanitizeData(obj) {
  if (obj === undefined) return null;

  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeData(item));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeData(value);
  }

  return sanitized;
}

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
        itineraries: [],
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
};

export const createItineraryDocument = async (tripId, itineraryData) => {
  console.log('in create itinerary document');
  try {
    if (!tripId) throw new Error('Trip ID is requqired');
    if (!itineraryData) throw new Error('Trip details are required');

    console.log('creating itinerary with data: ', itineraryData);

    const itineraryWithTripId = {
      ...itineraryData,
      tripId,
      createdAt: serverTimestamp(),
    };

    const itineraryRef = doc(db, 'trips', tripId);
    await updateDoc(tripRef, {
      itineraryID: itineraryRef.id,
      lastUpdated: serverTimestamp(),
    });
    console.log('Itinerary created with ID:', itineraryRef.id);

    return itineraryRef.id;
  } catch (error) {
    console.error('Error creating itinerary document:', error);
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
      startDate: tripDetails.startDate || '',
      endDate: tripDetails.endDate || '',
      budget: tripDetails.budget || '0',
      location: tripDetails.location || { lat: 0, lng: 0 },
      preferences: preferences || {},
      createdAt: serverTimestamp(),
      itineraryID: '',
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
  setTripId = null // <- Make this parameter optional with a default value of null
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

    // Sanitize the data before creating the tripData object
    const sanitizedTripDetails = sanitizeData(tripDetails);
    const sanitizedActivities = sanitizeData(selectedActivities);

    // Create tripData with sanitized values
    const tripData = {
      userId,
      name: sanitizedTripDetails.name || 'Unnamed Trip',
      destination: sanitizedTripDetails.destination || 'No destination',
      duration: timeFrame || sanitizedTripDetails.duration || '',
      startDate: sanitizedTripDetails.startDate || '',
      endDate: sanitizedTripDetails.endDate || '',
      budget: sanitizedTripDetails.budget || '0',
      location: sanitizedTripDetails.location || { lat: 0, lng: 0 },
      preferences: sanitizedActivities || {},
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

      // Only call setTripId if it's a function
      if (setTripId && typeof setTripId === 'function') {
        setTripId(finalTripId);
      }

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

// Function to save an itinerary generated by OpenAI to Firestore
export const saveGeneratedItinerary = async (
  tripId,
  itineraryData,
  tripName = null
) => {
  try {
    if (!tripId) throw new Error('Trip ID is required');
    if (!itineraryData || !itineraryData.schedule)
      throw new Error('Valid itinerary data is required');

    const tripRef = doc(db, 'trips', tripId);
    const tripDoc = await getDoc(tripRef);
    let userId = null;

    if (tripDoc.exists()) {
      userId = tripDoc.data().userId;
    }
    if (!userId) {
      console.log(
        'No userId found in the trip document. Trying to current user as fallback'
      );
      const auth = (await import('../firebase.js')).auth;
      userId = auth.currentUser?.uid;
    }

    if (!userId) {
      throw new Error('Cannot determine user ID for the itinerary');
    }
    // Create the itinerary data object
    const firestoreData = {
      tripId,
      userId: userId || 'NO ID',
      name: tripName || itineraryData.name || 'Generated Itinerary',
      schedule: itineraryData.schedule,
      createdAt: serverTimestamp(),
    };

    console.log('Saving generated itinerary:', firestoreData);

    // Save to Firestore
    const itineraryRef = await addDoc(
      collection(db, 'Itineraries'),
      firestoreData
    );

    // Update the trip to reference this itinerary
    await updateDoc(doc(db, 'trips', tripId), {
      itineraryId: itineraryRef.id,
      lastUpdated: serverTimestamp(),
    });

    await addItineraryToUser(userId, itineraryRef.id);

    console.log('Itinerary saved with ID:', itineraryRef.id);
    return itineraryRef.id;
  } catch (error) {
    console.error('Error saving generated itinerary:', error);
    throw error;
  }
};

export const saveUserItinerary = async (
  itineraryData,
  tripId,
  tripName = null
) => {
  console.log('in save user itinerary');
  try {
    if (!tripId) throw new Error('Trip ID is required');
    if (!itineraryData) throw new Error('Trip details are required');

    return await saveGeneratedItinerary(tripId, itineraryData, tripName);
  } catch (error) {
    console.error('Error saving itinerary:', error);
    throw error;
  }
};

export const addItineraryToUser = async (userId, itineraryId) => {
  try {
    if (!userId) throw new Error('user ID is required');
    if (!itineraryId) throw new Error('Itinerary ID is required');
    console.log(`Adding itinerary ${itineraryId} to user ${userId}`);

    const userRef = doc(db, 'Users', userId);
    const userDoc = await getDoc(userRef);

    const userData = userDoc.data();
    if (!userData.itineraries) {
      console.log(
        `Itineraries field doesn't exist in user document, creating it`
      );
      // The field doesn't exist, so we need to create it with merge
      await setDoc(
        userRef,
        {
          itineraries: [itineraryId],
        },
        { merge: true }
      );
    } else {
      // The field exists, so use arrayUnion to add the new ID
      await updateDoc(userRef, {
        itineraries: arrayUnion(itineraryId),
      });
    }

    console.log(
      `Successfully added Itinerary ${itineraryId} to user ${userId}`
    );
    return true;
  } catch (error) {
    console.error('Error adding itinerary to user:', error);
    throw error;
  }
};
//creating the new data model of how to save the itinerary to the db.
// export const createItineraryModel = async (tripId) => {
//   try {
//     // check if tripID is correct
//     if (!tripId) throw new Error('Trip ID is required');

//     //using aaron's dataCollect.js, get all data from dataCollect.js
//     const itineraryDetails = {
//       name: tripDetails.name, //from saveDetails()
//       days: getItineraryData()?.days || [], //from saveItineraryData()
//       activities: getSavedActivities(), //from saveActivities()
//       budget: tripDetails.budget, //from saveDetails()
//       preferences: getPreferences(), //from collectPreferences()
//     };

//     // creates a doc in with this datamodel structure
//     const itineraryData = {
//       tripId,
//       name: itineraryDetails.name || 'Unnamed Itinerary',
//       days: itineraryDetails.days,
//       activities: itineraryDetails.activities,
//       budget: itineraryDetails.budget || '0',
//       preferences: itineraryDetails.preferences || {},
//       createdAt: serverTimestamp(),
//     };
//     console.log('Creating itinerary with data:', itineraryData);
//     //need to start saving this data, according to Jira task description
//     const itineraryRef = await addDoc(
//       collection(db, 'itineraries'),
//       itineraryData
//     );
//     console.log('Itinerary created with ID:', itineraryRef.id);
//     return itineraryRef.id;
//   } catch (error) {
//     console.error('Error creating itinerary document:', error);
//     throw error;
//   }
// };
