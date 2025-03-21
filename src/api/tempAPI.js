// src/api/mockApi.js
export const getActivitySuggestions = async (destination, preferences) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
    return {
      activities: [
        { name: "Hiking in the mountains", type: "outdoor", duration: "4 hours" },
        { name: "Visit local museum", type: "indoor", duration: "2 hours" },
      ],
    };
  };