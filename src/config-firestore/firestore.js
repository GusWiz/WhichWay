import { app } from '../components/firebase'; // Adjust the path relative to firestore.js
import { getFirestore } from 'firebase/firestore';

// Initialize Firestore
export const db = getFirestore(app);
