import React, { useEffect, useRef, useState } from 'react';
import '../Login-Components/login-styling.css';

/**
 * LocationAutocomplete Component
 *
 * This component provides a location search input with Google Places autocomplete functionality.
 * It uses the Google Maps JavaScript API to fetch location suggestions as the user types.
 *
 * @param {string} value - The current input value
 * @param {function} onChange - Function to handle input changes
 * @param {function} onPlaceSelected - Function called when a place is selected from the suggestions
 */
const LocationAutocomplete = ({ value, onChange, onPlaceSelected }) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const scriptRef = useRef(null);

  useEffect(() => {
    // Load Google Maps API only once
    const loadGoogleMapsApi = () => {
      // Check if script already exists in document
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        initializeAutocomplete();
        return;
      }

      // Create and add script to document
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      scriptRef.current = script;

      script.onload = initializeAutocomplete;
      script.onerror = () => {
        console.error('Failed to load Google Maps API');
        setIsLoading(false);
      };

      document.head.appendChild(script);
    };

    // Initialize autocomplete when Google Maps API is loaded
    const initializeAutocomplete = () => {
      if (!inputRef.current || !window.google?.maps?.places) {
        setIsLoading(false);
        return;
      }

      try {
        // Create autocomplete instance
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          { types: ['(cities)'] }
        );

        // Add event listener for place selection
        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace();

          if (place?.geometry?.location) {
            // Format location data for parent component
            const placeData = {
              name: place.name,
              location: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              },
              placeId: place.place_id,
            };

            // Update input value and notify parent component
            onChange({ target: { name: 'destination', value: place.name } });
            onPlaceSelected(placeData);
          }
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing Places Autocomplete:', error);
        setIsLoading(false);
      }
    };

    // Start loading Google Maps API
    if (window.google?.maps?.places) {
      initializeAutocomplete();
    } else {
      loadGoogleMapsApi();
    }

    // Cleanup function
    return () => {
      // Remove event listeners to prevent memory leaks
      if (autocompleteRef.current && window.google?.maps) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onChange, onPlaceSelected]);

  return (
    <div className='ainput-wrapper'>
      <input
        ref={inputRef}
        type='text'
        name='destination'
        placeholder={
          isLoading ? 'Loading places autocomplete...' : 'Enter destination'
        }
        value={value || ''}
        onChange={onChange}
        className='ainput-field'
        disabled={isLoading}
      />
    </div>
  );
};

export default LocationAutocomplete;
