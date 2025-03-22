import { openai } from '../../config/openaiConfig';

const openaiRequest = `Location: San Marcos
Start date: 03/22/25
End date: 03/25/25
Day Start Time: 9:00am
Day End Time: 8:00pm
Activity List: Chilis, Sewell Park, Double Daves, EVO, Chi Lantro, Golds Gym, Hiking trail.`;

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
          "end_time": "HH:MM"
        }
      ]
    }
  ]
}

Rules:
- Never repeat activities within the schedule.
- Ensure each activity has a start and end time.
- Adjust time slots to fit within the user's specified day start and end times.
- Distribute activities evenly across the provided date range.
- If the number of activities does not evenly fit into the days, distribute them as logically as possible.
- Use 24-hour time format (HH:MM).
- Do not add any extra text or explanations outside the JSON response.

The user will provide a prompt with parameters such as location, start date, end date, day start time, day end time, and a list of activities. Use this information to generate a schedule that follows the specified rules.
Always return the JSON exactly in the format specified, without deviation.
`;

const generateItinerary = async () => {
  console.log('in generate itinerary');
  try {
    const response = await openai.chat.completions.create({
      // Use the correct method for chat completions
      model: 'gpt-4', // Ensure you use the correct model name (e.g., gpt-4 or gpt-4o)
      messages: [
        { role: 'system', content: systemRules },
        { role: 'user', content: openaiRequest },
      ],
    });

    console.log(response.choices[0].message.content);
    return response.choices[0].message.content; // Return response for further use
  } catch (error) {
    console.error('Error generating itinerary:', error);
  }
};

export { generateItinerary };
