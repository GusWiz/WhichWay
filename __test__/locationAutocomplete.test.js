import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LocationAutocomplete from '../src/components/Createtrip-Components/LocationAutocomplete'; // Adjust path as needed

// --- Mock Google Maps API ---
const mockGetPlace = jest.fn();
const mockAddListener = jest.fn();
const mockClearInstanceListeners = jest.fn();

const mockAutocomplete = jest.fn(() => ({
  addListener: mockAddListener,
  getPlace: mockGetPlace,
}));

// Mock the global google object
global.google = {
  maps: {
    places: {
      Autocomplete: mockAutocomplete,
    },
    event: {
      clearInstanceListeners: mockClearInstanceListeners,
    },
    LatLng: jest.fn((lat, lng) => ({ lat: () => lat, lng: () => lng })), // Mock LatLng if needed elsewhere
  },
};

// Mock script loading
let scriptLoadCallback = null;
const mockScript = {
  set onload(callback) {
    scriptLoadCallback = callback;
  },
  set onerror(callback) {
  },
  remove: jest.fn(),
};
const mockAppendChild = jest.fn((script) => {
  // Simulate async loading and then success
  setTimeout(() => {
    if (scriptLoadCallback) {
      scriptLoadCallback(); // Trigger the onload callback
    }
  }, 50); // Small delay to simulate loading
});
const mockCreateElement = jest.fn(() => mockScript);

// --- Mock Environment Variables ---
// Vite uses import.meta.env, Jest uses process.env
// We need to ensure the key is available during the test
const originalEnv = process.env;
beforeAll(() => {
  process.env = {
    ...originalEnv,
    VITE_GOOGLE_API_KEY: 'test-api-key', // Provide a dummy key
  };
  // Mock DOM manipulation for script loading
  document.createElement = mockCreateElement;
  document.head.appendChild = mockAppendChild;
  // Mock querySelector for the script loading check
  document.querySelector = jest.fn(() => null); // Assume script not loaded initially
});

afterAll(() => {
  process.env = originalEnv; // Restore original env
  // Restore original DOM methods if necessary (though Jest usually handles this)
});
// --- End Mocks ---

describe('LocationAutocomplete Component', () => {
  let placeChangedCallback = null;
  const mockOnChange = jest.fn();
  const mockOnPlaceSelected = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    scriptLoadCallback = null;

    // Capture the 'place_changed' listener callback
    mockAddListener.mockImplementation((event, callback) => {
      if (event === 'place_changed') {
        placeChangedCallback = callback;
      }
    });

    // Default mock for getPlace
    mockGetPlace.mockReturnValue({
      name: 'Test Location',
      place_id: 'ChIJtestplaceid',
      geometry: {
        location: {
          lat: () => 34.0522,
          lng: () => -118.2437,
        },
      },
    });
  });

  test('renders input field and loads Google Maps API', async () => {
    render(
      <LocationAutocomplete
        value=''
        onChange={mockOnChange}
        onPlaceSelected={mockOnPlaceSelected}
      />
    );

    // Check initial rendering (might show loading)
    const input = screen.getByPlaceholderText(/Loading places autocomplete.../i);
    expect(input).toBeInTheDocument();
    expect(input).toBeDisabled();

    // Wait for the script loading simulation and initialization
    await waitFor(() => {
      expect(mockCreateElement).toHaveBeenCalledWith('script');
      expect(mockAppendChild).toHaveBeenCalled();
      expect(
        screen.getByPlaceholderText(/Enter destination/i)
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/Enter destination/i)
      ).not.toBeDisabled();
      expect(mockAutocomplete).toHaveBeenCalled();
      expect(mockAddListener).toHaveBeenCalledWith(
        'place_changed',
        expect.any(Function)
      );
    });
  });

  test('handles place selection', async () => {
    render(
      <LocationAutocomplete
        value=''
        onChange={mockOnChange}
        onPlaceSelected={mockOnPlaceSelected}
      />
    );

    // Wait for initialization
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/Enter destination/i)
      ).not.toBeDisabled();
    });

    // Simulate the 'place_changed' event
    expect(placeChangedCallback).toBeInstanceOf(Function);
    placeChangedCallback(); // Trigger the captured callback

    // Verify getPlace was called
    expect(mockGetPlace).toHaveBeenCalledTimes(1);

    // Verify onChange and onPlaceSelected were called with correct data
    await waitFor(() => {
      // onChange is called internally to update the input's display value
      expect(mockOnChange).toHaveBeenCalledWith({
        target: { name: 'destination', value: 'Test Location' },
      });

      // onPlaceSelected is called with the formatted data
      expect(mockOnPlaceSelected).toHaveBeenCalledWith({
        name: 'Test Location',
        location: {
          lat: 34.0522,
          lng: -118.2437,
        },
        placeId: 'ChIJtestplaceid',
      });
    });
  });

  test('cleans up listeners on unmount', async () => {
    const { unmount } = render(
      <LocationAutocomplete
        value=''
        onChange={mockOnChange}
        onPlaceSelected={mockOnPlaceSelected}
      />
    );

    // Wait for initialization
    await waitFor(() => {
      expect(mockAutocomplete).toHaveBeenCalled();
    });

    // Unmount the component
    unmount();

    // Verify cleanup function was called
    expect(mockClearInstanceListeners).toHaveBeenCalled();
  });

  test('handles case where getPlace returns no geometry', async () => {
     render(
      <LocationAutocomplete
        value=''
        onChange={mockOnChange}
        onPlaceSelected={mockOnPlaceSelected}
      />
    );

    // Wait for initialization
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/Enter destination/i)
      ).not.toBeDisabled();
    });

    // Mock getPlace to return incomplete data
    mockGetPlace.mockReturnValueOnce({
        name: 'Location Without Geometry',
        place_id: 'ChIJnogeometry'
        // No geometry property
    });

    // Simulate the 'place_changed' event
    expect(placeChangedCallback).toBeInstanceOf(Function);
    placeChangedCallback();

    // Verify getPlace was called
    expect(mockGetPlace).toHaveBeenCalledTimes(1);

    // Verify that onChange and onPlaceSelected were NOT called because data was invalid
    // Use waitFor with a small timeout to ensure async operations settle
    await new Promise(resolve => setTimeout(resolve, 10)); // Short delay
    expect(mockOnChange).not.toHaveBeenCalled();
    expect(mockOnPlaceSelected).not.toHaveBeenCalled();
  });

});
