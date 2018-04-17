import * as firebase from 'firebase';

firebase.initializeApp({
   apiKey: "AIzaSyAuuKkl37npoOCFRJ7jEaH8R4LpqEvQryg",
   authDomain: "my-cars-85072.firebaseapp.com",
   databaseURL: "https://my-cars-85072.firebaseio.com",
   projectId: "my-cars-85072",
   storageBucket: "",
   messagingSenderId: "1069816540295"
});

// Required for side-effects
require("firebase/firestore");

// Initialize Cloud Firestore through Firebase
export const db = firebase.firestore();