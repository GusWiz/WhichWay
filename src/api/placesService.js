// Function to get nearby places based on type
export const fetchNearbyPlaces = async (location, type, radius = 5000) => {
  try {
    const { lat, lng } = location;
    // Use a CORS proxy to avoid CORS issues
    const corsProxy = "https://cors-anywhere.herokuapp.com/";
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    const url = `${corsProxy}https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;

    const response = await fetch(url, {
      headers: {
        'Origin': window.location.origin,
      }
    });

    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Error from Google API: ${data.status}`);
    }

    // If no results, return empty array
    if (data.status === 'ZERO_RESULTS' || !data.results) {
      return [];
    }

    return data.results.map(place => ({
      name: place.name,
      imgSrc: place.photos ?
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}` :
        '/images/placeholders/noImage.jpg',
      price: place.price_level ? String(place.price_level * 20) : '25',
      rating: place.rating || 'N/A',
      vicinity: place.vicinity || 'No address available',
      placeId: place.place_id,
      groupSize: '2-4',
    }));
  } catch (error) {
    console.error("Error fetching nearby places:", error);
    return [];
  }
};

// Function to get detailed place information
export const fetchPlaceDetails = async (placeId) => {
  try {
    const corsProxy = "https://cors-anywhere.herokuapp.com/";
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    const url = `${corsProxy}https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,formatted_phone_number,formatted_address,website,opening_hours,price_level,reviews&key=${apiKey}`;

    const response = await fetch(url, {
      headers: {
        'Origin': window.location.origin,
      }
    });

    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Error from Google API: ${data.status}`);
    }

    return data.result;
  } catch (error) {
    console.error("Error fetching place details:", error);
    return null;
  }
};

// Function to get nearby activities organized by category
export const fetchActivitiesByLocation = async (location) => {
  try {
    const restaurants = await fetchNearbyPlaces(location, 'restaurant');
    const entertainment = await fetchNearbyPlaces(location, 'amusement_park,movie_theater,museum,night_club,park,theater,casino');
    const outdoor = await fetchNearbyPlaces(location, 'campground,park,natural_feature,beach');

    return {
      food: restaurants.slice(0, 5),
      entertainment: entertainment.slice(0, 5),
      outdoor: outdoor.slice(0, 5)
    };
  } catch (error) {
    console.error("Error fetching activities:", error);
    return {
      food: [],
      entertainment: [],
      outdoor: []
    };
  }
};
