import React, { useEffect, useRef, useState } from 'react';
import '../Login-Components/login-styling.css';

const LocationAutocomplete = ({ value, onChange, onPlaceSelected }) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Define the function to load Google Maps API using the recommended pattern
    const initGoogleMaps = async () => {
      if (!window.google) {
        try {
          // Add the loader script once to the window
          window.initGoogleMapsAPI = (g => {
            var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary",
                q = "__ib__", m = document, b = window;
            b = b[c] || (b[c] = {});
            var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams, u = () => h || (h = new Promise(async (f, n) => {
              await (a = m.createElement("script"));
              e.set("libraries", [...r] + "");
              for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
              e.set("callback", c + ".maps." + q);
              a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
              d[q] = f;
              a.onerror = () => h = n(Error(p + " could not load."));
              a.nonce = m.querySelector("script[nonce]")?.nonce || "";
              m.head.append(a)
            }));
            d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n))
          })({
            key: import.meta.env.VITE_GOOGLE_API_KEY,
            v: "weekly"
          });

          // Import the Places library
          const { Autocomplete } = await window.google.maps.importLibrary("places");
          initAutocomplete(Autocomplete);
        } catch (error) {
          console.error("Error loading Google Maps API:", error);
          setIsLoading(false);
        }
      } else {
        // If Google Maps is already loaded, initialize autocomplete
        try {
          const { Autocomplete } = await window.google.maps.importLibrary("places");
          initAutocomplete(Autocomplete);
        } catch (error) {
          console.error("Error initializing autocomplete:", error);
          setIsLoading(false);
        }
      }
    };

    initGoogleMaps();

    // Cleanup function
    return () => {
      if (autocompleteRef.current && window.google?.maps) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  const initAutocomplete = (Autocomplete) => {
    if (!inputRef.current) {
      setIsLoading(false);
      return;
    }

    try {
      // Create a new autocomplete instance
      autocompleteRef.current = new Autocomplete(inputRef.current, {
        types: ['(cities)'],
        fields: ['name', 'geometry', 'place_id']
      });

      // Add event listener for place selection
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        if (place && place.geometry) {
          const placeData = {
            name: place.name,
            location: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            },
            placeId: place.place_id
          };

          // Update the input value and call the callback
          onChange({ target: { name: 'destination', value: place.name } });
          onPlaceSelected(placeData);
        }
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing Google Places Autocomplete:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className='ainput-wrapper'>
      <input
        ref={inputRef}
        type="text"
        name="destination"
        placeholder={isLoading ? "Loading places autocomplete..." : "Enter destination"}
        value={value || ''}
        onChange={onChange}
        className='ainput-field'
        disabled={isLoading}
      />
    </div>
  );
};

export default LocationAutocomplete;
