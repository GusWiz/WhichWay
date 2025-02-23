import {db} from './firestore'; // import the firestore instance
import {doc, setDoc, addDoc, collection} from 'firebase/firestore';

// function to creates a new user document in the Users collection
export const createUserDocument = async (Users) => {
    const userRef = doc(db, 'Users', user.uid);
    await setDoc(userRef, {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        trips: [] // the purpose for this trips array is for it to be connected to a specific user
    });
};

// function to create a new trip document in the trips collection
export const createTripDocument = async (trips) => {
    const tripRef = await addDoc(collection(db, 'trips'), trips);
    return tripRef.id;
};

// function to add a trup to a user's trips array
export const addTripToUser = async (userId, tripId) => {
    const userRef = doc(db, 'Users', userId); // get a reference to the user document
    await updateDoc(userRef, {
        // arrayUnion checks if tripId is already in the trips array.
        // // If it is, it won't add it again.
        trips: arrayUnion(tripId) // add the tripId to the user's trips array
    });
};