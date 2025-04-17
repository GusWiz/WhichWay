import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
    collection,
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
}));

jest.mock('../src/components/firebase', () => ({
    db: jest.fn(),
}));

describe('saveGeneratedItinerary Function', () => {
    const mockTripId = 'testTrip123';
    const mockItineraryData = {
        schedule: [
            { date: '2025-05-17', activities: [{ name: 'Activityy 1' } ]},
        ],
    };
    const mockTripName = 'Test Trip Name';
    const mockExistingItineraryId = 'existingItineraryID123';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test Case 1: Verify that the function throws an error if the trip id is missing/null
    it('Should throw an error if TripId is missing', async () => {
        await expect(
            saveGeneratedItinerary(null, mockItineraryData, mockTripName)
        ).rejects.toThrow('Trip ID is required');
        expect(getDoc).not.toHaveBeenCalled();
        expect(setDoc).not.toHaveBeenCalled();
        expect(updateDoc).not.toHaveBeenCalled();
    });

    // Test Case 2: Verify that the function throws an error if the Itinerary Data is missing/null
    it('Should throw an error if itineraryData.schedule is missing', async () => {
        await expect(
            saveGeneratedItinerary(mockTripId, null, mockTripName)
        ).rejects.toThrow('Valid itinerary data is required');
        expect(getDoc).not.toHaveBeenCalled();
        expect(setDoc).not.toHaveBeenCalled();
        expect(updateDoc).not.toHaveBeenCalled();
    });
});