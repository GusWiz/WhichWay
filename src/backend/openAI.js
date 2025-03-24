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
- Always return the JSON exactly in the format specified, without deviation.
- Ensure there are no additional spaces, characters, or notes outside the JSON.
`;

const generateItinerary = async () => {
  console.log('in generate itinerary');
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      max_tokens: 100, //CHANGE THIS WHEN TESTING
      messages: [
        { role: 'system', content: systemRules },
        { role: 'user', content: openaiRequest },
      ],
    });

    console.log(response.choices[0].message.content);
    return response.choices[0].message.content; // Return response for further use
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return null; // Always return something to avoid undefined issues
  }
};

export { generateItinerary };
