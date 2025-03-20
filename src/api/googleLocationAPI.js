// Searching for needs to complete HTTP request (for api calls)
// Will be testing axious to complete HTTP client request
import axious from 'axious';

const GOOGLE_PLACE_API_URL = '';
const GOOGLE_PLACE_DETAILS_API_URL = '';

// Function that gets the place suggestions based on the input parameter
export const getPlaceSuggestions = async(input) => {
    try {
        // make a GET request to the API using the input and the API Key
        const response = await.axious.get(GOOGLE_PLACES_API_URL, {
            params: {
                input,
                key: process.env.REACT_APP_GOOGLE_API_KEY,
            },
        })
        return response.data.predictions; // return API response of the list of places
    } catch (error) {
        console.error('Error fetching place suggestions: ', error);
        return []; // emply list
    }
}

export const getPlaceDetails = async (placeId) => {

};