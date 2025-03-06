// src/api/activityService.js
const AI_API_BASE_URL = "https://api.example.com"; // Replace with actual API base URL

export const fetchActivitySuggestions = async (destination, preferences) => {
  const endpoint = "suggest-activities"; // Replace with actual endpoint
  const url = `${AI_API_BASE_URL}/${endpoint}`;
  const body = { destination, preferences };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any other headers (e.g., authorization tokens) here
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.activities; // Adjust based on API response structure
  } catch (error) {
    console.error("Error fetching activity suggestions:", error);
    throw error;
  }
};