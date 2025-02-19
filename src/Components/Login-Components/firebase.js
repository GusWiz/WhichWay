import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBw4TAvtMCrfuCAiqas0uR9QZVGNTuUWbo",
  authDomain: "whichway-9040f.firebaseapp.com",
  projectId: "whichway-9040f",
  storageBucket: "whichway-9040f.firebasestorage.app",
  messagingSenderId: "122788128214",
  appId: "1:122788128214:web:1baab0cd3178fddec7f077"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export default app;
