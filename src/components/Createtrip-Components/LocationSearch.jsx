import React, { useState } from 'react';
import { getPlaceSuggestions, getPlaceDetails } from '../../api/googleLocationAPI';

function LocationSearch() {
    const [input, setInput] = useState(''); /// create value to store user input
    const [suggestions, setSuggestions] = useState([]); // list of place suggestions
    const [selectedPlace, setSelectedPlace] = useState(null); // create val to store the details of the selected location

    // Function that handles changes in the input fields.
    const handleInputChange = async (event) => {
        const value = event.target.value;
        setInput(value);

        // if has an input (the name of a location)
        if (value) {
            const placeSuggestions = await getPlaceSuggestions(value);
            setSuggestions(placeSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    // funciton that handles the selection of the place suggestion
    const handleSuggestionClick = async (placeId) => {
        const placeDeatils = await getPlaceDetails(placeId); // fetches info from selected place
        setSelectedPlace(placeDetails);

        setSuggestions([]);
        setInput(placeDetails.name);
        onselect(placeDetails);
    };


    return (
        <div>
            <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Enter a location"
        />
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
        {selectedPlace && (
            <div>
              <h3>SelectedPlaceDetails:</h3>
              <p>Name: {selectedPlace.name}</p>
              <p>Address: {selectedPlace.formatted_address}</p>
              <p>Rating: {selectedPlace.rating}</p>
              </div>
        )}
        </div>
    );
}

export default LocationSearch;
