// Importing axios to handle HTTP requests
import axios from 'axios';

const GOOGLE_PLACES_API_URL =
  'https://maps.googleapis.com/maps/api/place/autocomplete/json';
const GOOGLE_PLACES_DETAILS_API_URL =
  'https://maps.googleapis.com/maps/api/place/details/json';

// Function that calls Google Places API to get place suggestions
export const getPlaceSuggestions = async (input) => {
  try {
    // Make a GET request to the API using the input and the API Key
    const response = await axios.get(GOOGLE_PLACES_API_URL, {
      params: {
        input, // The user input for place suggestions
        key: import.meta.env.VITE_GOOGLE_API_KEY, // The API key from the environment variables
      },
    });
    return response.data.predictions; // Return API response of the list of places
  } catch (error) {
    console.error('Error fetching place suggestions:', error);
    return []; // Return empty list if an error occurs
  }
};

// Function that gets detailed information about a specific location
export const getPlaceDetails = async (placeId) => {
  try {
    // Make a GET request to Google Places API with the specific location
    const response = await axios.get(GOOGLE_PLACES_DETAILS_API_URL, {
      params: {
        place_id: placeId, // The place ID for the specific place
        key: import.meta.env.VITE_GOOGLE_API_KEY, // The API key from the environment variables
      },
    });
    return response.data.result;
  } catch (error) {
    console.error('Error fetching place details from API:', error);
    return null;
  }
};
