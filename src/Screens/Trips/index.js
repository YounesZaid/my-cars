import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import * as firebase from 'firebase';

import moment from 'moment';

import './index.css';
import {db} from '../../Database/config';

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
         posted: moment().format('MMMM Do YYYY, h:mm:ss a')
      })
      .then(function(docRef) {
            console.log("Document written with ID: ", firebase.firestore.FieldPath.documentId());
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






