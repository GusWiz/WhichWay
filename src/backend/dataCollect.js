
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

