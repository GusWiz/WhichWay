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
  destination: null,
  cuisine: null,
  activityType: null,
  budget: null,
  transportation: null,
  moreDetails: null,
};

function collectPreferences(
  destination,
  cuisine,
  activityType,
  budget,
  transportation,
  moreDetails
) {
  preferences.destination = destination;
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

function saveItineraryData(itineraryData) {
  const parsedData = JSON.parse(itineraryData);

  parsedData.schedule.forEach((day) => {
    console.log(`Date: ${day.date}`);
    day.activities.forEach((activity) => {
      console.log(`  Activity: ${activity.name}`);
      console.log(`  Start Time: ${activity.start_time}`);
      console.log(`  End Time: ${activity.end_time}`);
    });
  });
}

export {
  saveActivities,
  getSavedActivities,
  collectPreferences,
  getPreferences,
  saveDetails,
};
