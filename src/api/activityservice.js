import { fetchUserInfo } from "../firestore";

const AI_API_BASE_URL = "https://api.example.com"; //replace later

export const fetchActivitySuggestions = async (userId) => {
  try {
    //fetch user details from firestore
    const { destination, duration, preferences, selectedActivities } = await fetchUserInfo(userId);

    if (!destination || !duration || !preferences.length) {
      throw new Error("Missing user trip details.");
    }

    //make api request

    const endpoint = "suggest-activities";
    const url = `${AI_API_BASE_URL}/${endpoint}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destination, duration, preferences, selectedActivities }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.activities;
  } catch (error) {
    console.error("Error fetching activity suggestions:", error);
    throw error;
  }
};
