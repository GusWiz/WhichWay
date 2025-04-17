import {
    doc,
    getDoc,
    setDoc,
    updatesDoc,
    serverTimestamp,
    collection,
} from 'firebase/firestore';
import { db } from '../src/components/firebase';
import { generateItinerary } from '../src/backend/openAI';

// Mock Firestore
jest.mock('firebase/firestore', () => ({
    doc: jest.fn(),
    getDoc: jest.fn(),
    setDoc: jest.fn(),
    updatesDoc: jest.fn(),
    serverTimestamp: jest.fn(() => 'mockTimestamp'),
    collection: jest.fn(),
}));
