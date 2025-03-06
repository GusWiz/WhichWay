import {
  createUserDocument,
  createTripDocument,
  addTripToUser,
} from '../../api/dataModel';
import { db } from '../../api/firestore';
import { doc, setDoc, addDoc, updateDoc, arrayUnion } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  arrayUnion: jest.fn(),
}));

describe('Firestore Functions', () => {
  it('should create a new user document', async () => {
    const user = {
      uid: 'userId1',
      email: 'user1@example.com',
      firstName: 'John',
      lastName: 'Doe',
    };
    await createUserDocument(user);
    expect(doc).toHaveBeenCalledWith(db, 'users', user.uid);
    expect(setDoc).toHaveBeenCalledWith(expect.any(Object), {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      trips: [],
    });
  });

  it('should create a new trip document', async () => {
    const tripData = {
      tripName: 'Trip to New York',
      destination: 'New York',
      duration: '3 days',
    };
    await createTripDocument(tripData);
    expect(addDoc).toHaveBeenCalledWith(expect.any(Object), tripData);
  });

  it("should add a trip to a user's trips array", async () => {
    const userId = 'userId1';
    const tripId = 'tripId1';
    await addTripToUser(userId, tripId);
    expect(doc).toHaveBeenCalledWith(db, 'users', userId);
    expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), {
      trips: arrayUnion(tripId),
    });
  });
});
