import { generateItinerary } from '../../backend/openAI'; // import Aaron's function
import { fetchPlaceDetails } from './placesService';

export const generateItineraryService = async ({
  // parameters
  location,
  startDate,
  duration,
  activities,
}) => {
  try {
    // Ensure all required parameters are provided
    if (!location || !startDate || !duration || !activities) {
      throw new Error('Missing required parameters for itinerary generation.');
    }
    // Create OpenAI request content
    const openaiRequest = `
Location: ${location}
Start date: ${startDate}
Duration: ${duration}
Activity List:
${activities.map((activity) => `- ${activity}`).join('\n')}
`;
    const itinerary = await generateItinerary(openaiRequest);

    if (!itinerary) {
      throw new Error('Failed to generate itinerary.');
    }
    // parse the response into JSON
    const parsedItinerary = JSON.parse(itinerary);
    return parsedItinerary;
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw error;
  }
};

export const enrichItineraryWithPlaceDetails = async (
  schedule,
  selectedActivities,
  tripLocation = 'your destination'
) => {
  // Create a lookup map by activity name
  const activityDetailsMap = {};

  // Combine all selected activities into one array
  const allSelectedActivities = [
    ...(selectedActivities.selectedFoods || []),
    ...(selectedActivities.selectedEntertainment || []),
    ...(selectedActivities.selectedOutdoor || []),
  ];

  // Add all activities to the lookup map
  allSelectedActivities.forEach((activity) => {
    if (activity && activity.name) {
      activityDetailsMap[activity.name.toLowerCase()] = {
        description: activity.description,
        photoUrls: activity.photoUrls || [],
        rating: activity.rating,
        website: activity.website,
        vicinity: activity.vicinity,
        priceRange: activity.priceRange,
        opening_hours: activity.opening_hours,
        placeId: activity.placeId,
      };
    }
  });

  console.log(
    'Activity details map created with',
    Object.keys(activityDetailsMap).length,
    'entries'
  );

  // Process each day in the schedule
  const enrichedSchedule = await Promise.all(
    schedule.map(async (day) => {
      // Process each activity in the day
      const enrichedActivities = await Promise.all(
        day.activities.map(async (activity) => {
          // Skip if activity doesn't have a name
          if (!activity || !activity.name) return activity;

          const activityName = activity.name.toLowerCase();
          let enrichedActivity = { ...activity };

          // Case 1: Activity already has a description from OpenAI
          if (activity.description && activity.description.length > 20) {
            console.log(`Activity ${activity.name} already has a description`);
            return activity;
          }

          // Case 2: We have the activity details in our map
          if (activityDetailsMap[activityName]) {
            console.log(
              `Found details for ${activity.name} in selected activities`
            );
            return {
              ...activity,
              ...activityDetailsMap[activityName],
            };
          }

          // Case 3: Try to fetch from Google Places using placeId
          if (activity.placeId) {
            try {
              console.log(
                `Fetching details for ${activity.name} using placeId`
              );
              const details = await fetchPlaceDetails(activity.placeId);
              if (details) {
                return {
                  ...activity,
                  description: details.description,
                  photoUrls: details.photoUrls || [],
                  rating: details.rating,
                  website: details.website,
                  vicinity: details.vicinity,
                  priceRange: details.priceRange,
                  opening_hours: details.opening_hours,
                };
              }
            } catch (error) {
              console.error(
                `Error fetching details for ${activity.name}:`,
                error
              );
            }
          }

          // Case 4: Generate a fallback description
          console.log(`Generating fallback description for ${activity.name}`);
          enrichedActivity.description = generateFallbackDescription(
            activity,
            'your destination'
          );
          return enrichedActivity;
        })
      );

      return {
        ...day,
        activities: enrichedActivities,
      };
    })
  );

  console.log('Schedule enriched with descriptions');
  return enrichedSchedule;
};

const generateFallbackDescription = (
  activity,
  tripLocation = 'your destination'
) => {
  const timeInfo =
    activity.start_time && activity.end_time
      ? `Scheduled from ${activity.start_time} to ${activity.end_time}.`
      : '';

  return `Visit ${activity.name}, an activity included in your ${tripLocation} itinerary. ${timeInfo} Enjoy your time at this location during your trip.`;
};

export const generateEnhancedItinerary = async ({
  tripLocation,
  startDate,
  duration,
  selectedFoods = [],
  selectedEntertainment = [],
  selectedOutdoor = [],
}) => {
  try {
    // Create activities array from selected items
    const activityList = [
      ...selectedFoods.map((food) => food.name),
      ...selectedEntertainment.map((entertainment) => entertainment.name),
      ...selectedOutdoor.map((outdoor) => outdoor.name),
    ];

    // Use default activities if activityList is empty
    const finalActivityList =
      activityList.length > 0
        ? activityList
        : ['Restaurant', 'Park', 'Museum', 'Cafe'];

    // Construct the OpenAI request content with location emphasis
    const openaiRequest = `
Location: ${tripLocation}
Start date: ${startDate}
Duration: ${duration}
Activity List:
${finalActivityList.map((activity) => `- ${activity}`).join('\n')}

IMPORTANT INSTRUCTIONS:
- Include a detailed description (2-3 sentences) for EACH activity in your response
- Focus specifically on activities located in ${tripLocation}
- Each activity should have name, start_time, end_time, and description fields
- Make descriptions informative and useful for travelers visiting ${tripLocation}
- Format as proper JSON with a schedule array containing days, each with an activities array
`;

    console.log('OpenAI Request:', openaiRequest);

    // Call the generateItinerary function
    const itineraryResponse = await generateItinerary(openaiRequest);

    if (!itineraryResponse) {
      throw new Error('Failed to generate a valid itinerary');
    }

    // Extract JSON from the response if it contains markdown code blocks
    let jsonString = itineraryResponse;

    if (itineraryResponse.includes('```')) {
      const matches = itineraryResponse.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (matches && matches[1]) {
        jsonString = matches[1].trim();
      }
    }

    // Now parse the cleaned JSON
    const parsedItinerary = JSON.parse(jsonString);

    if (!parsedItinerary || !parsedItinerary.schedule) {
      throw new Error('Invalid itinerary format received');
    }

    // Enrich the itinerary with place details
    const enrichedSchedule = await enrichItineraryWithPlaceDetails(
      parsedItinerary.schedule,
      { selectedFoods, selectedEntertainment, selectedOutdoor },
      tripLocation // Pass the user's selected location
    );

    return enrichedSchedule;
  } catch (error) {
    console.error('Error in generateEnhancedItinerary:', error);
    throw error;
  }
};
