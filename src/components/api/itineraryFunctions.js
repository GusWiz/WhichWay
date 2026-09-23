import { generateItinerary } from '../backend/openAI'; // import Aaron's function

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
