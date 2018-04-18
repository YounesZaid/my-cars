import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import moment from 'moment';

import {db} from '../../Database/config';
import './index.css';


import DriversList from './DriversList';
import DriverDetails from './DriverDetails';

export default class DriversScreen extends Component {
   state = {
      drivers: []
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
         const driverCollection = [];
         QuerySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data().driverFirstName} ${doc.data().driverLastName} ${doc.data().driverRegistrationNumber} ${doc.data().driverPhoneNumber}`);
            let docItem = {
               driverFirstName: doc.data().driverFirstName,
               driverLastName: doc.data().driverLastName,
               driverRegistrationNumber: doc.data().driverRegistrationNumber,
               driverPhoneNumber: doc.data().driverPhoneNumber,
               driverId: doc.id
            }
            driverCollection.push(docItem);
         });
         this.setState({
            drivers: driverCollection
         })
      });
   }

   render() {
      const { drivers } = this.state;
      const { match } = this.props;
      return(
         <div className="screen-wrapper driver-screen">
            {/* <Route path={`${match.url}:/driverId`} render={(props) => {
               return <DriverDetails drivers={drivers} {...props} />
            }} /> */}
            <Route path={`${match.url}:/driverId`} render={(props) => {
               return <DriverDetails drivers={drivers} {...props}/>
            }} />
            <Route exact path={match.url} render={(props) => {
               return <DriverDetails drivers={drivers} {...props}/>
            }} />
         </div>
      )
   }
}
