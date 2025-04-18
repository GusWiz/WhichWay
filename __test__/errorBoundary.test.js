const fetch = require('node-fetch');
const { Response } = jest.requireActual('node-fetch');
const { handler } = require('../netlify/functions/googlePlaces');

jest.mock('node-fetch');

describe('Google Places handler', () => {
  const mockEvent = {
    queryStringParameters: {
      lat: '37.7749',
      lng: '-122.4194',
      type: 'restaurant',
      radius: '1500',
    },
  };

  beforeEach(() => {
    process.env.GOOGLE_API_KEY = 'test-api-key';
    fetch.mockClear();
  });

  it('returns results when API responds with OK', async () => {
    const mockApiResponse = {
      status: 'OK',
      results: [{ name: 'Place A' }, { name: 'Place B' }],
    };

    fetch.mockResolvedValue(
      new Response(JSON.stringify(mockApiResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const response = await handler(mockEvent, {});
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(body.length).toBe(2);
    expect(body[0].name).toBe('Place A');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('returns error when API responds with non-OK status', async () => {
    const mockErrorResponse = { status: 'ZERO_RESULTS' };

    fetch.mockResolvedValue(
      new Response(JSON.stringify(mockErrorResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const response = await handler(mockEvent, {});
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(500);
    expect(body.error).toContain('Error fetching places');
  });

  it('returns error when fetch throws', async () => {
    fetch.mockRejectedValue(new Error('Network failure'));

    const response = await handler(mockEvent, {});
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(500);
    expect(body.error).toBe('Network failure');
  });
});
