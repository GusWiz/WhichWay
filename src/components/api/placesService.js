/**
 * Google Places API Service
 *
 * This file contains functions for interacting with the Google Places API
 * to fetch nearby places and place details based on location.
 */

/**
 * Fetches nearby places based on location and type
 *
 * @param {Object} location - Location coordinates {lat, lng}
 * @param {String} type - Place type or comma-separated types
 * @param {Number} radius - Search radius in meters (default: 5000)
 * @returns {Array} Array of formatted place objects
 */
export const fetchNearbyPlaces = async (location, type, radius = 5000) => {
  try {
    // Create a hidden DOM element for the PlacesService
    let mapDiv = document.getElementById('map-service-div');
    if (!mapDiv) {
      mapDiv = document.createElement('div');
      mapDiv.id = 'map-service-div';
      mapDiv.style.display = 'none';
      document.body.appendChild(mapDiv);
    }

    const request = {
      location: new google.maps.LatLng(location.lat, location.lng),
      radius: radius,
    };

    if (type.includes(',')) {
      request.types = type.split(',');
    } else {
      request.type = type;
    }

    return new Promise((resolve) => {
      const service = new google.maps.places.PlacesService(mapDiv);

      service.nearbySearch(request, async (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // Format basic info first
          const formattedResults = await Promise.all(
            results.map(async (place) => {
              let description = null;
              try {
                const details = await fetchPlaceDetails(place.place_id);
                description = details?.editorial_summary?.overview || null;
              } catch (err) {
                console.warn('Failed to fetch details for place:', place.name, err);
              }

              return {
                name: place.name,
                imgSrc:
                  place.photos?.[0]?.getUrl({ maxWidth: 400 }) ||
                  '/images/placeholders/noImage.jpg',
                price: place.price_level ? String(place.price_level * 20) : '25',
                priceLevel: place.price_level || 0,
                priceRange: getPriceRangeText(place.price_level),
                rating: place.rating || 'N/A',
                userRatingCount: place.user_ratings_total || 0,
                vicinity: place.vicinity || 'No address available',
                placeId: place.place_id,
                groupSize: '2-4',
                description, // 🎯 the only thing pulled from getDetails
              };
            })
          );

          resolve(formattedResults);
        } else {
          console.log(`Places API returned status: ${status}`);
          resolve([]);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    return [];
  }
};

// export const fetchNearbyPlaces = async (location, type, radius = 5000) => {
//   try {
//     // Create a hidden DOM element for the PlacesService
//     let mapDiv = document.getElementById('map-service-div');
//     if (!mapDiv) {
//       mapDiv = document.createElement('div');
//       mapDiv.id = 'map-service-div';
//       mapDiv.style.display = 'none';
//       document.body.appendChild(mapDiv);
//     }

//     // Create search parameters
//     const request = {
//       location: new google.maps.LatLng(location.lat, location.lng),
//       radius: radius,
//     };

//     // Handle single vs. multiple types
//     if (type.includes(',')) {
//       request.types = type.split(',');
//     } else {
//       request.type = type;
//     }

//     // Execute the search
//     return new Promise((resolve) => {
//       const service = new google.maps.places.PlacesService(mapDiv);

//       service.nearbySearch(request, (results, status) => {
//         if (status === google.maps.places.PlacesServiceStatus.OK) {
//           // Format results for the application
//           const formattedResults = results.map((place) => ({
//             name: place.name,
//             imgSrc:
//               place.photos && place.photos.length > 0
//                 ? place.photos[0].getUrl({ maxWidth: 400 })
//                 : '/images/placeholders/noImage.jpg',
//             price: place.price_level ? String(place.price_level * 20) : '25',
//             priceLevel: place.price_level || 0,
//             priceRange: getPriceRangeText(place.price_level),
//             rating: place.rating || 'N/A',
//             userRatingCount: place.user_ratings_total || 0,
//             vicinity: place.vicinity || 'No address available',
//             placeId: place.place_id,
//             groupSize: '2-4',
//             description: place.editorial_summary?.overview,
//           }));

//           resolve(formattedResults);
//         } else {
//           console.log(`Places API returned status: ${status}`);
//           resolve([]);
//         }
//       });
//     });
//   } catch (error) {
//     console.error('Error fetching nearby places:', error);
//     return [];
//   }
// };
// function to to make the price level (that will be displayed)
const getPriceRangeText = (priceLevel) => {
  switch (priceLevel) {
    case 0:
      return 'Free';
    case 1:
      return '$';
    case 2:
      return '$$';
    case 3:
      return '$$$';
    case 4:
      return '$$$$';
    default:
      return 'Unknown';
  }
};

/**
 * Fetches detailed information about a place by ID
 *
 * @param {String} placeId - Google Places API place ID
 * @returns {Object|null} Place details or null if error
 */
export const fetchPlaceDetails = async (placeId) => {
  try {
    // Create or reuse hidden DOM element
    let mapDiv = document.getElementById('map-service-div');
    if (!mapDiv) {
      mapDiv = document.createElement('div');
      mapDiv.id = 'map-service-div';
      mapDiv.style.display = 'none';
      document.body.appendChild(mapDiv);
    }

    return new Promise((resolve) => {
      const service = new google.maps.places.PlacesService(mapDiv);

      service.getDetails(
        {
          placeId: placeId,
          fields: [
            'name',
            'rating',
            'formatted_phone_number',
            'formatted_address',
            'website',
            'opening_hours',
            'price_level',
            'reviews',
            'user_ratings_total',
            'editorial_summary',
          ],
        },
        (result, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            // checks if result has a pricelevel
            if (result.price_level !== undefined) {
              result.priceRange = getPriceRangeText(result.price_level);
            }
            resolve(result);
          } else {
            console.error(`Place details API returned status: ${status}`);
            resolve(null);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
};

/**
 * Fetches nearby activities organized by category for a location
 *
 * @param {Object} location - Location coordinates {lat, lng}
 * @returns {Object} Activities grouped by category
 */
export const fetchActivitiesByLocation = async (location) => {
  try {
    const restaurants = await fetchNearbyPlaces(location, 'restaurant');
    const entertainment = await fetchNearbyPlaces(
      location,
      'amusement_park,museum,movie_theater'
    );
    const outdoor = await fetchNearbyPlaces(
      location,
      'park,campground,natural_feature,beach'
    );

    return {
      food: restaurants.slice(0, 5),
      entertainment: entertainment.slice(0, 5),
      outdoor: outdoor.slice(0, 5),
    };
  } catch (error) {
    console.error('Error fetching activities:', error);
    return {
      food: [],
      entertainment: [],
      outdoor: [],
    };
  }
};
