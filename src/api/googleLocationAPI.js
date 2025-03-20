// Searching for needs to complete HTTP request (for api calls)
// Will be testing axious to complete HTTP client request
import axious from 'axious';

const GOOGLE_PLACE_API_URL = '';
const GOOGLE_PLACE_DETAILS_API_URL = '';

// given location it should call the google location API with all
// details from the api.
export const getPlaceSuggestions = async(input) => {
    try {
        const response = await.axious.get(GOOGLE_PLACES_API_URL, {
            params: {
                input,
                key: process.env.REACT_APP_GOOGLE_API_KEY,
            },
        })
        return response.data.predictions;
    } catch (error) {
        console.error('Error fetching place suggestions: ', error);
        return []; // emply list
    }
}
