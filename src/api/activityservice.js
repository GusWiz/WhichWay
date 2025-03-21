import { getPlaceDetails } from './googleLocationAPI';
import { createTripDocument, addTripToUser } from './dataModel';

// Save a user's trip data to Firestore
export const saveUserTrip = async (userId, placeId, duration, preferences) => {
  try {
    // Step 1: Fetch place details from Google Places API
    const placeData = await getPlaceDetails(placeId);
    if (!placeData) throw new Error('Failed to fetch place details');

    // Step 2: Parse the data (extract relevant fields)
    const parsedData = {
      place_id: placeData.place_id,
      name: placeData.name,
      formatted_address: placeData.formatted_address,
      location: placeData.geometry.location,
      rating: placeData.rating,
      user_ratings_total: placeData.user_ratings_total,
      types: placeData.types,
      website: placeData.website,
      formatted_phone_number: placeData.formatted_phone_number,
    };

    // Step 3: Save parsed data to Firestore
    const tripId = await createTripDocument(userId, parsedData, duration, preferences);

    // Step 4: Link the trip to the user
    await addTripToUser(userId, tripId);

    console.log('Trip saved and linked to user successfully');
  } catch (error) {
    console.error('Error saving user trip:', error);
  }
};