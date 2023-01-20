// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyBIIudTUeFIA0cIHMz9VdJu-1jh7UBzFrY',
    authDomain: 'domdomshow-tw.firebaseapp.com',
    projectId: 'domdomshow-tw',
    storageBucket: 'domdomshow-tw.appspot.com',
    messagingSenderId: '665044638592',
    appId: '1:665044638592:web:1ad6ec1d653adf768fff65',
    measurementId: 'G-30EHD2M6XX',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { db, auth };
