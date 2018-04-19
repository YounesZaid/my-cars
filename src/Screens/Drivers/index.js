import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import moment from 'moment';

import './index.css';
import {db} from '../../Database/config';


import DriverDetails from './DriverDetails';
import DriversList from './DriversList';

export default class DriversScreen extends Component {
   state = {
      drivers: []
   }

   deleteDriver = (driverId) => {
      db.collection("drivers").doc(driverId).delete().then(function() {
            console.log("Document successfully deleted!");
      }).catch(function(error) {
            console.error("Error removing document: ", error);
      });
   }

   addDriver = (driverFirstName, driverLastName, driverRegistrationNumber, driverPhoneNumber) => {
      db.collection("drivers").add({
         driverFirstName: driverFirstName,
         driverLastName: driverLastName,
         driverRegistrationNumber: driverRegistrationNumber,
         driverPhoneNumber: driverPhoneNumber,
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
      db.collection("drivers").orderBy('posted','desc').onSnapshot((QuerySnapshot) => {
         const driverItems = [];
         QuerySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data().driverFirstName} ${doc.data().driverLastName} ${doc.data().driverRegistrationNumber} ${doc.data().driverPhoneNumber}`);
            let docItem = {
               driverFirstName: doc.data().driverFirstName,
               driverLastName: doc.data().driverLastName,
               driverRegistrationNumber: doc.data().driverRegistrationNumber,
               driverPhoneNumber: doc.data().driverPhoneNumber,
               driverId: doc.id
            }
            driverItems.push(docItem);
         });
         this.setState({
            drivers: driverItems
         })
      });
   }

   render() {
      const { drivers } = this.state;
      const { match } = this.props;
      return(
         <div className="screen-wrapper driver-screen">
            <Route path={`${match.url}:/driverId`} render={(props) => {
               return <DriverDetails drivers={drivers} {...props}/>
            }} />
            <Route exact path={match.url} render={(props) => {
               return <DriversList drivers={drivers} addDriver={this.addDriver} deleteDriver={this.deleteDriver} />
            }} />
         </div>
      )
   }
}
