//Temp firestore code

//When addind code here, make sure to update env file
//with

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getfirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'temp',
  authDomain: 'temp',
  projectId: 'temp',
  storageBucket: 'temp',
  messagingSenderId: 'temp',
  appId: 'temp',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
