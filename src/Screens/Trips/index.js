import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import * as firebase from 'firebase';

import './index.css';

import TripDetails from './TripDetails';
import TripsList from './TripsList';

// const firebase = window.firebase;

export default class TripsScreen extends Component {

   state = {
      trips: []
   }

   addTrip = (driverName, carType) => {
      db.collection("trips").add({
         driverName: driverName,
         carType: carType,
         isActive: true,
         id: this.state.trips.length +1
      })
      .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
            console.error("Error adding document: ", error);
      });
   }

   componentDidMount = () => {

      db.collection("trips").onSnapshot((querySnapshot) => {
         const tripItems = [];
         querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data().carType} ${doc.data().driverName} ${doc.data().id} `);
             tripItems.push(doc.data())
         });
         this.setState({
            trips: tripItems
         })
      });
   }
   
   render() {
      const { trips } = this.state;
      const { match } = this.props;
      return (
         <div className="screen-wrapper trips-screen">
            <Route path={`${match.url}/:tripId`} render={(props) => {
               return <TripDetails trips={trips} {...props} />
            }} />
            <Route exact path={match.url} render={(props) => {
               return <TripsList trips={trips} addTrip={this.addTrip} />
            }} />
         </div>
      )
   }
}

firebase.initializeApp({
   apiKey: "AIzaSyAuuKkl37npoOCFRJ7jEaH8R4LpqEvQryg",
   authDomain: "my-cars-85072.firebaseapp.com",
   databaseURL: "https://my-cars-85072.firebaseio.com",
   projectId: "my-cars-85072",
   storageBucket: "",
   messagingSenderId: "1069816540295"
});

// const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

// Initialize Cloud Firestore through Firebase
const db = firebase.firestore();


// The Old State without FireStore
// function GET_TRIPS() {
//    return [
//       { id: 1, carType: 'Mercedes', driverName: 'Younes', isActive: true },
//       { id: 2, carType: 'Mercedes 2', driverName: 'Younes', isActive: true },
//       { id: 3, carType: 'Mercedes 3', driverName: 'Younes', isActive: false },
//       { id: 4, carType: 'Mercedes 4', driverName: 'Younes', isActive: true },
//       { id: 5, carType: 'Mercedes 5', driverName: 'Younes', isActive: false },
//       { id: 6, carType: 'Mercedes 6', driverName: 'Younes', isActive: false },
//       { id: 7, carType: 'Mercedes 7', driverName: 'Younes', isActive: true },
//       { id: 8, carType: 'Mercedes 7', driverName: 'Younes', isActive: true },
//       { id: 9, carType: 'Mercedes 7', driverName: 'Younes', isActive: true },
//    ]
// }

