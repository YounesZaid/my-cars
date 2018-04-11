import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import moment from 'moment';

import './index.css';

import TripDetails from './TripDetails';
import TripsList from './TripsList';
import {db} from './config';

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
         posted: moment().format('MMMM Do YYYY, h:mm:ss a')
      })
      .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
            console.error("Error adding document: ", error);
      });
   }

   componentDidMount = () => {
      db.collection("trips").orderBy('posted','desc').onSnapshot((querySnapshot) => {
         const tripItems = [];
         querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data().carType} ${doc.data().driverName}`);
            let docItem = {
               driverName: doc.data().driverName,
               carType: doc.data().carType,
               id: doc.id,
               isActive: doc.data().isActive, 
               posted: doc.data().posted
            }
            tripItems.push(docItem);
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

// Initialize the moment js
require('moment');



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

