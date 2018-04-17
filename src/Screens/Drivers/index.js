import React, { Component } from 'react';
import { Button, Dialog, Intent } from '@blueprintjs/core';
import * as firebase from 'firebase';
import moment from 'moment';

import DriverItem from './DriverItem';
import {db} from '../../Database/config';
import './index.css';

export default class DriversScreen extends Component {
   state = {
      isAddDriverDialogOpen: false,
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
            console.log("Document written with ID: ", firebase.firestore.FieldPath.documentId());
      })
      .catch(function(error) {
            console.error("Error adding document: ", error);
      });
   }

   closeAddDriverDialog = () => {
      this.setState({
         isAddDriverDialogOpen: false,
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
               driverPhoneNumber: doc.data().driverPhoneNumber
            }
            driverCollection.push(docItem);
         });
         debugger
         this.setState({
            drivers: driverCollection
         })
      });
   }

   render() {
      const { isAddDriverDialogOpen, drivers } = this.state;
      if(drivers.length > 0){
         return [
            <div key={0} className="screen-wrapper driver-screen">
               <header>
                  <h3>Drivers</h3>
                  <a href="#add-content" onClick={e => {
                     e.preventDefault();
                     this.setState({
                        isAddDriverDialogOpen: true,
                     });
                  }}>ADD NEW DRIVER <i className="zmdi zmdi-plus-square zmdi-hc-lg"></i></a>
                  <AddDriverDialog closeDialog={this.closeAddDriverDialog} isAddDriverDialogOpen={isAddDriverDialogOpen} addDriver={this.addDriver}/>
               </header>
               <section>
                  {drivers.map((driver, i) => {
                     return (
                        <DriverItem key={i} driver={driver} />
                     )
                  })}
               </section>
            </div>
         ]
      }
      // Else
      return [
         <div key={1} className="screen-wrapper driver-screen">
            <header>
               <h3>Drivers</h3>
               <a href="#add-content" onClick={e => {
                  e.preventDefault();
                  this.setState({
                     isAddDriverDialogOpen: true,
                  });
               }}>ADD NEW DRIVER <i className="zmdi zmdi-plus-square zmdi-hc-lg"></i></a>
               <AddDriverDialog closeDialog={this.closeAddDriverDialog} isAddDriverDialogOpen={isAddDriverDialogOpen} addDriver={this.addDriver}/>
            </header>
            <section>
               <Spinner name="three-bounce" fadeIn="quarter" className="spinner-three-bounce"/>
            </section>
         </div>
      ]

   }
}

class AddDriverDialog extends Component {
   state = {
      driverFirstName: '',
      driverLastName: '',
      driverRegistrationNumber: '',
      driverPhoneNumber: ''
   }
   render() {
      const { driverFirstName, driverLastName, driverPhoneNumber, driverRegistrationNumber} = this.state;
      const { addDriver, isAddDriverDialogOpen, closeDialog } = this.props;
      return (
         <Dialog
            icon="inbox"
            isOpen={isAddDriverDialogOpen}
            onClose={closeDialog}
            usePortal={true}
            canOutsideClickClose={false}
            canEscapeKeyClose={true}
            title="Adding New Card">
            <div className="pt-dialog-body">
               <p>
                  <strong> In this Dialog you can add driver information </strong>
               </p>
               <label className="pt-label">
                  First Name
                  <span className="pt-text-muted"></span>
                  <input className="pt-input" type="text" placeholder="driver first name" dir="auto" name="driverFirstName" value={driverFirstName} onChange={(e) =>{
                     e.preventDefault();
                     this.setState({
                        driverFirstName: e.target.value
                     });
                  }} />
               </label>
               <label className="pt-label">
                  Last Name
                  <span className="pt-text-muted"></span>
                  <input className="pt-input" type="text" placeholder="driver last name" dir="auto" name="driverLastName" value={driverLastName} onChange={(e) => {
                     e.preventDefault();
                     this.setState({
                        driverLastName: e.target.value
                     })
                  }}/>
               </label>
               <label className="pt-label">
                  Phone number
                  <input className="pt-input" type="text" placeholder="driver phone number" dir="auto" name="driverPhoneNumber" value={driverPhoneNumber} onChange={(e) => {
                     e.preventDefault();
                     this.setState({
                        driverPhoneNumber: e.target.value
                     })
                  }}/>
               </label>
               <label className="pt-label">
                  Registration number
                  <input className="pt-input" type="text" placeholder="driver registration number" dir="auto" name="driverRegistrationNumber" value={driverRegistrationNumber} onChange={(e) =>{
                     e.preventDefault();
                     this.setState({
                        driverRegistrationNumber: e.target.value
                     })
                  }}/>
               </label>
            </div>
            <div className="pt-dialog-footer">
               <div className="pt-dialog-footer-actions">
                  <Button 
                     intent={Intent.DANGER}
                     onClick={this.props.closeDialog}
                     text="Close"
                  />
                  <Button 
                     text="Add"
                     icon="add"
                     intent={Intent.ADD}
                     onClick={() => {
                        addDriver(driverFirstName, driverLastName, driverPhoneNumber, driverRegistrationNumber);
                        this.setState({
                           driverFirstName: '',
                           driverLastName: '',
                           driverRegistrationNumber: '',
                           driverPhoneNumber: ''
                        })
                        closeDialog();
                     }}
                  />
               </div>
            </div>
         </Dialog>
      )
   }
}

const Spinner = require('react-spinkit');