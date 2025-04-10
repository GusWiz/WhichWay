import { openai } from '../../config/openaiConfig';

const openaiRequest = `Location: San Marcos
Start date: 2025-03-22
End date: 2025-03-24
Day Start Time: 09:00
Day End Time: 20:00
Activity List:
- Chilis
- Sewell Park
- Double Daves
- EVO
- Chi Lantro
- Golds Gym
- Hiking trail`;

const systemRules = `You are a scheduling assistant that generates structured schedules in JSON format.
Always return a response in the following JSON structure:

{
  "schedule": [
    {
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "name": "Activity Name",
          "start_time": "HH:MM",
          "end_time": "HH:MM,
          "Duration": "# Days"
        }
      ]
    }
  ]
}

Rules:
- Never repeat activities within the schedule.
- Ensure each activity has a start and end time.
- Ensure each activities start and end is a normal duration for that activity
- Ensure start times are after the locations opening time
- Adjust time slots to fit within the user's specified day start and end times.
- Distribute activities evenly across the provided date range.
- If the number of activities does not evenly fit into the days, distribute them as logically as possible.
- Use 12-hour time format (HH:MM PM/AM).
- Do not add any extra text or explanations outside the JSON response.
- Always return the JSON exactly in the format specified, without deviation.
- Ensure there are no additional spaces, characters, or notes outside the JSON.
`;

const generateItinerary = async (openaiRequest) => {
  console.log('Generating itinerary with OpenAI amazing AI capabilities');

  try {
    // Validate openaiRequest parameter
    if (!openaiRequest) {
      console.error('Invalid openaiRequest:', openaiRequest);
      throw new Error('Missing openaiRequest parameter');
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemRules },
        { role: 'user', content: openaiRequest },
      ],
    });

    // Check if response and choices are valid before accessing them
    if (
      !response ||
      !response.choices ||
      !response.choices[0] ||
      !response.choices[0].message
    ) {
      throw new Error('Invalid response format received from OpenAI API.');
    }

    const itinerary = response.choices[0].message.content;
    return itinerary; // Return the response data for further use
  } catch (error) {
    console.error('Error generating itinerary:', error.message || error);
    throw error; // Make sure to throw the error for proper handling
  }
};

export { generateItinerary };
