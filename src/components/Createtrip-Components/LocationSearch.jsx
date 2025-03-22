import React, { useState } from 'react';
import { getPlaceSuggestions, getPlaceDetails } from '../../api/googleLocationApi';

function LocationSearch({ onSelect }) {
  const [input, setInput] = useState(''); // Create value to store user input
  const [suggestions, setSuggestions] = useState([]); // List of place suggestions
  const [selectedPlace, setSelectedPlace] = useState(null); // Create value to store the details of the selected location

  // Function to handle changes in the input field
  const handleInputChange = async (event) => {
    const value = event.target.value;
    setInput(value);

    if (value) {
      // Fetch place suggestions based on the user input
      const placeSuggestions = await getPlaceSuggestions(value);
      setSuggestions(placeSuggestions);
    } else {
      // Clear suggestions if the input is empty
      setSuggestions([]);
    }
  };

  // Function to handle the selection of a place suggestion
  const handleSuggestionClick = async (placeId) => {
    // Fetch detailed information about the selected place
    const placeDetails = await getPlaceDetails(placeId);
    setSelectedPlace(placeDetails);
    // Clear suggestions and update the input field with the selected place name
    setSuggestions([]);
    setInput(placeDetails.name);
    onSelect(placeDetails); // Pass the selected place details to the parent component
  };

  return (
    <div>
      {/* Input field for entering a location */}
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Enter a location"
      />
      {/* Display the list of place suggestions */}
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() => handleSuggestionClick(suggestion.place_id)}
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
      {/* Display the details of the selected place */}
      {selectedPlace && (
        <div>
          <h3>Selected Place Details:</h3>
          <p>Name: {selectedPlace.name}</p>
          <p>Address: {selectedPlace.formatted_address}</p>
          <p>Rating: {selectedPlace.rating}</p>
        </div>
      )}
    </div>
  );
}

export default LocationSearch;
