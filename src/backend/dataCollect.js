//HANDLE TRIP DETAIL
const tripDetails = new Map([
    ["name", null],
    ["Destination", null],
    ["Duration", null],
]);


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
const preferencesMap = new Map([
    ["destination", null],
    ["cuisine", null],
    ["activityType", null],
    ["budget", null],
    ["transportation", null],
    ["moreDetails", null],
]);

function collectPreferences (destination = null, cuisine = null, activityType = null, budget = null, transportation = null, moreDetails = null)
{

    preferencesMap.set("destination", destination);
    preferencesMap.set("cuisine", cuisine);
    preferencesMap.set("activityType", activityType);
    preferencesMap.set("budget", budget);
    preferencesMap.set("transportation", transportation);
    preferencesMap.set("moreDetails", moreDetails);
    
}


export { saveActivities, getSavedActivities };