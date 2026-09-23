import { generateItinerary } from '../src/backend/openAI';
import { openai } from '../config/openaiConfig';

// creating mock openai values
jest.mock('../config/openaiConfig.js', () => ({
  openai: {
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  },
}));

describe('generateItinerary', () => {
  it('returns itinerary from mocked OpenAI response', async () => {
    // This is the fake JSON string OpenAI would have returned
    const mockResponseContent = JSON.stringify({
      schedule: [
        {
          date: '2025-03-22',
          activities: [
            {
              name: 'Chilis',
              start_time: '10:00 AM',
              end_time: '11:00 AM',
              Duration: '1 Day',
            },
          ],
        },
      ],
    });

    // This is what we want our mock `create()` to return
    openai.chat.completions.create.mockResolvedValue({
      choices: [
        {
          message: {
            content: mockResponseContent,
          },
        },
      ],
    });

    const prompt = 'Some itinerary request string';
    const result = await generateItinerary(prompt);

    expect(result).toBe(mockResponseContent); // Make sure it returns the correct string
    expect(openai.chat.completions.create).toHaveBeenCalledTimes(1); // Make sure it called the API once
    expect(openai.chat.completions.create).toHaveBeenCalledWith({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: expect.any(String) },
        { role: 'user', content: prompt },
      ],
    });
  });
});
