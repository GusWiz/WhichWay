const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const { lat, lng, type, radius } = event.queryStringParameters;
  const apiKey = process.env.GOOGLE_API_KEY;

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: `Error fetching places: ${data.status}`,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data.results),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
