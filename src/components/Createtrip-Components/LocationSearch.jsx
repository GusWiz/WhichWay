import React, { useState } from 'react';
import { getPlaceSuggestions, getPlaceDetails } from '../../api/googleLocationAPI';

function LocationSearch() {
    const [input, setInput] = useState(''); /// create value to store user input
    const [ suggestions, setSuggestions ] = useState([]); // list of place suggestions
    const [selectedPlace, setSelectedPlace] = useState(null); // create val to store the details of the selected location



}

