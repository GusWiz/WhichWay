import { generateItinerary } from "../backend/openAI"; // import Aaron's function

export const generateItineraryService = async ({
    // parameters
    location,
    startDate,
    duration,
    activities,
}) => {
    try {
        // make OpenAI requestion content (basically GET Request with trip data)
        const openaiRequest = `
Location: ${location}
startDate: ${startDate}
duration: ${duration}
Activity List:
${activities.map((activity) => `- ${activity}`).join('\n')}
`;
        const itinerary = await generateItinerary(openaiRequest);

        if (!itinerary){
            throw new Error('Failed to generate itinerary.')
        }
        // parse the response into JSON
        const parsedItinerary = JSON.parse(itinerary);
        return parsedItinerary;
    } catch (error) {
        console.error('Error generating itinerary:', error);
        throw error;
    }
};
