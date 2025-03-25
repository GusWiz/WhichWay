//HANDLE TRIP DETAIL
let tripDetails = {
  name: null,
  destination: null,
  duration: null,
  budget: null,
};

function saveDetails(name, destination, duration, budget) {
  tripDetails.name = name;
  tripDetails.destination = destination;
  tripDetails.duration = duration;
  tripDetails.budget = budget;
}

// HANDLE ACTIVITIES
let selectedFoods = [];
let selectedEntertainment = [];
let selectedOutdoor = [];

function saveActivities(foodArray, entertainmentArray, outdoorArray) {
  selectedFoods = foodArray;
  selectedEntertainment = entertainmentArray;
  selectedOutdoor = outdoorArray;
}

function getSavedActivities() {
  return {
    selectedFoods,
    selectedEntertainment,
    selectedOutdoor,
  };
}

//HANDLE ACTIVITY PREFERENCES
let preferences = {
  cuisine: null,
  activityType: null,
  budget: null,
  transportation: null,
  moreDetails: null,
};

function collectPreferences(
  cuisine,
  activityType,
  budget,
  transportation,
  moreDetails
) {
  preferences.cuisine = cuisine;
  preferences.activityType = activityType;
  preferences.budget = budget;
  preferences.transportation = transportation;
  preferences.moreDetails = moreDetails;
}

function getPreferences() {
  return preferences;
}

//HANDLE ITINERARY

let itineraryObj = null;

function saveItineraryData(itineraryData) {
  try {
    if (!itineraryData) {
      throw new Error('No itinerary data provided');
    }

    if (typeof itineraryData !== 'string') {
      throw new Error(
        'Expected itinerary data to be a string, received ' +
          typeof itineraryData
      );
    }

    const cleanedData = itineraryData.trim();

    itineraryObj = JSON.parse(cleanedData);

    console.log('Itinerary successfully saved:', itineraryObj);
  } catch (error) {
    console.error('Error parsing itinerary data:', error.message);
    console.error(
      'Received data (first 100 chars):',
      itineraryData.slice(0, 100)
    );
  }
}

function getItineraryData() {
  if (!itineraryObj) {
    console.warn('No itinerary data found!');
  }
  return itineraryObj;
}

export {
  saveActivities,
  getSavedActivities,
  collectPreferences,
  getPreferences,
  saveDetails,
  saveItineraryData,
  getItineraryData,
};
