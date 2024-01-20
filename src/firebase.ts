// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC3e61mWzFIEtB5bBiKHBRZCK9nmwyNgU8',
  authDomain: 'xclone-bb567.firebaseapp.com',
  projectId: 'xclone-bb567',
  storageBucket: 'xclone-bb567.appspot.com',
  messagingSenderId: '859429617123',
  appId: '1:859429617123:web:2aab5e836c23b54501f4d6',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const database = getFirestore(app);
