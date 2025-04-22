import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
} from 'firebase/firestore';
import { db } from '../src/components/firebase';
import { saveGeneratedItinerary } from '../src/components/api/dataModel';

// Mock Firestore
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  serverTimestamp: jest.fn(() => 'mockTimestamp'),
  collection: jest.fn(),
  addDoc: jest.fn(() => Promise.resolve({ id: 'mockGeneratedItineraryId' })),
  arrayUnion: jest.fn((...args) => `arrayUnion(${args.join(', ')})`), // Add mock for arrayUnion
}));

jest.mock('../src/components/firebase', () => ({
  db: jest.fn(),
  auth: {
    // Add mock auth
    currentUser: {
      uid: 'testUser123', // Provide a mock user ID
    },
  },
}));

describe('saveGeneratedItinerary Function', () => {
  const mockTripId = 'testTrip123';
  const mockItineraryData = {
    schedule: [{ date: '2025-05-17', activities: [{ name: 'Activityy 1' }] }],
  };
  const mockTripName = 'Test Trip Name';
  const mockExistingItineraryId = 'existingItineraryID123';
  // Define mock refs consistently
  const mockTripRef = { id: mockTripId, path: `trips/${mockTripId}` };
  const mockExistingItineraryRef = {
    id: mockExistingItineraryId,
    path: `Itineraries/${mockExistingItineraryId}`,
  };
  const mockUserRef = { id: 'testUser123', path: `Users/testUser123` }; // Mock user ref

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset specific mock implementations if needed (optional, but good practice)
    doc.mockClear();
    getDoc.mockClear();
    addDoc.mockClear();
    updateDoc.mockClear();
    setDoc.mockClear();
    collection.mockClear();

    // Default mock implementations (can be overridden in specific tests)
    doc.mockImplementation((db, collectionName, id) => {
      if (collectionName === 'trips') return mockTripRef;
      // Use existing ID if provided for Itineraries, otherwise generate one (though addDoc is usually used)
      if (collectionName === 'Itineraries')
        return {
          id: id || 'mockGeneratedItineraryId',
          path: `Itineraries/${id || 'mockGeneratedItineraryId'}`,
        };
      if (collectionName === 'Users')
        return {
          id: id || 'testUser123',
          path: `Users/${id || 'testUser123'}`,
        }; // Mock user ref creation
      return {
        id: id || 'mockGenericId',
        path: `${collectionName}/${id || 'mockGenericId'}`,
      };
    });
    addDoc.mockResolvedValue({ id: 'mockGeneratedItineraryId' }); // Default addDoc success
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ userId: 'user123' }),
    }); // Default getDoc success (with userId)
    updateDoc.mockResolvedValue(); // Default updateDoc success
    setDoc.mockResolvedValue(); // Default setDoc success
    collection.mockImplementation((db, collectionName) => ({
      path: collectionName,
    })); // Default collection mock
  });

  // --- Basic Validation Tests ---
  it('Should throw an error if TripId is missing', async () => {
    await expect(
      saveGeneratedItinerary(null, mockItineraryData, mockTripName)
    ).rejects.toThrow('Trip ID is required');
    expect(getDoc).not.toHaveBeenCalled();
    expect(addDoc).not.toHaveBeenCalled();
    expect(updateDoc).not.toHaveBeenCalled();
    expect(setDoc).not.toHaveBeenCalled();
  });

  // Test Case 2: Verify that the function throws an error if the Itinerary Data is missing/null
  it('Should throw an error if itineraryData is missing', async () => {
    await expect(
      saveGeneratedItinerary(mockTripId, null, mockTripName)
    ).rejects.toThrow('Valid itinerary data is required');
    expect(getDoc).not.toHaveBeenCalled();
    expect(addDoc).not.toHaveBeenCalled();
    expect(updateDoc).not.toHaveBeenCalled();
    expect(setDoc).not.toHaveBeenCalled();
  });
  // Test Case 3: Verify that the functions throws an error if itinerary data is but lacks the 'schedule'
  it('Should throw an error if itineraryData.schedule is missing', async () => {
    await expect(
      saveGeneratedItinerary(mockTripId, {}, mockTripName)
    ).rejects.toThrow('Valid itinerary data is required');
    expect(getDoc).not.toHaveBeenCalled();
    expect(addDoc).not.toHaveBeenCalled();
    expect(updateDoc).not.toHaveBeenCalled();
    expect(setDoc).not.toHaveBeenCalled();
  });
  it('should handle Firestore errors during getDoc (trip)', async () => {
    const firestoreError = new Error('Firestore permission denied');
    getDoc.mockRejectedValueOnce(firestoreError); // Simulate getDoc failure ONLY on the first call (trip)

    await expect(
      saveGeneratedItinerary(mockTripId, mockItineraryData, mockTripName)
    ).rejects.toThrow(firestoreError);

    expect(getDoc).toHaveBeenCalledTimes(1); // Only the first getDoc was called
    expect(addDoc).not.toHaveBeenCalled();
    expect(updateDoc).not.toHaveBeenCalled();
    expect(setDoc).not.toHaveBeenCalled();
  });

  // Renamed from setDoc to addDoc
  it('should handle Firestore errors during addDoc', async () => {
    // Mock getDoc to succeed
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ userId: 'user123' }),
    });
    collection.mockReturnValue({ path: 'Itineraries' });

    const firestoreError = new Error('Firestore write failed');
    addDoc.mockRejectedValue(firestoreError); // Simulate addDoc failure

    await expect(
      saveGeneratedItinerary(mockTripId, mockItineraryData, mockTripName)
    ).rejects.toThrow(firestoreError);

    expect(getDoc).toHaveBeenCalledWith(mockTripRef);
    expect(collection).toHaveBeenCalledWith(db, 'Itineraries');
    expect(addDoc).toHaveBeenCalled(); // It was called but failed
    expect(updateDoc).not.toHaveBeenCalled(); // Should not be called if addDoc fails
    expect(setDoc).not.toHaveBeenCalled(); // Should not call addItineraryToUser parts
  });

  it('should handle Firestore errors during updateDoc (on trip)', async () => {
    // Mock getDoc and addDoc to succeed
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ userId: 'user123' }),
    });
    collection.mockReturnValue({ path: 'Itineraries' });
    addDoc.mockResolvedValue({ id: 'mockGeneratedItineraryId' });

    const firestoreError = new Error('Firestore update failed');
    // Make updateDoc reject *only when called on the tripRef*
    updateDoc.mockImplementation(async (ref, data) => {
      if (ref.path === mockTripRef.path) {
        throw firestoreError;
      }
      return Promise.resolve(); // Allow other updateDoc calls (if any)
    });

    await expect(
      saveGeneratedItinerary(mockTripId, mockItineraryData, mockTripName)
    ).rejects.toThrow(firestoreError);

    expect(getDoc).toHaveBeenCalledWith(mockTripRef);
    expect(addDoc).toHaveBeenCalled();
    expect(updateDoc).toHaveBeenCalledWith(mockTripRef, expect.anything()); // It was called on tripRef but failed
    expect(setDoc).not.toHaveBeenCalled(); // addItineraryToUser parts should not be reached
  });
});
