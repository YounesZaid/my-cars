import React, { Component } from 'react';
import { Button, Dialog, Intent } from '@blueprintjs/core';

import './index.css';
import TripItem from './TripItem';
// import TripDetails from './TripDetails';

export default class TripsScreen extends Component {

   state = {
      trips: GET_TRIPS(),
      isAddTripDialogOpen: false,
   }

   _addTrip = (driverName, carType) => {
      let tripItem = {
         id: this.state.trips.length + 1,
         carType: carType,
         driverName: driverName,
         isActive: true
      }
      let tripsArray = [];
      this.state.trips.forEach(element => {
         tripsArray.push(element);
      });
      tripsArray.push(tripItem);
      this.setState({
         trips: tripsArray
      });
   }

   closeAddTripDialog = () => {
      this.setState({
         isAddTripDialogOpen: false
      })
      // alert(this.state.trips.length + 1);
   }

   render() {
      const { isAddTripDialogOpen, trips } = this.state;
      return (
         <div className="screen-wrapper trips-screen">
            <header>
               <h3>Trips</h3>
               <a href="#add-content" onClick={e => {
                  e.preventDefault();
                  this.setState({
                     isAddTripDialogOpen: true,
                  });
               }}>ADD NEW TRIP <i className="zmdi zmdi-plus-square"></i></a>
               <AddTripDialog closeDialog={this.closeAddTripDialog} isOpen={isAddTripDialogOpen} addTrip={this._addTrip}/>
            </header>
            <section>
               {trips.map((carObject, i) => {
                  return (
                     <TripItem key={carObject.id} tripId={carObject.id} carType={carObject.carType}
                        driverName={carObject.driverName} isActive={carObject.isActive} />
                  )
               })}
               {/* <TripDetails key={({}).id} carType={({}).carType}
            driverName={({}).driverName} isActive={({}).isActive}/> */}
            </section>
         </div>

      )
   }
}

function GET_TRIPS() {
   return [
      { id: 1, carType: 'Mercedes', driverName: 'Younes', isActive: true },
      { id: 2, carType: 'Mercedes 2', driverName: 'Younes', isActive: true },
      { id: 3, carType: 'Mercedes 3', driverName: 'Younes', isActive: false },
      { id: 4, carType: 'Mercedes 4', driverName: 'Younes', isActive: true },
      { id: 5, carType: 'Mercedes 5', driverName: 'Younes', isActive: false },
      { id: 6, carType: 'Mercedes 6', driverName: 'Younes', isActive: false },
      { id: 7, carType: 'Mercedes 7', driverName: 'Younes', isActive: true },
      { id: 8, carType: 'Mercedes 7', driverName: 'Younes', isActive: true },
      { id: 9, carType: 'Mercedes 7', driverName: 'Younes', isActive: true },
   ]
}

class AddTripDialog extends Component {
   
   state = {
      carType: '',
      driverName: ''
   }
   render() {
      return (
         <Dialog
            icon="inbox"
            isOpen={this.props.isOpen}
            onClose={this.props.closeDialog}
            usePortal={true}
            canOutsideClickClose={false}
            canEscapeKeyClose={true}
            title="Adding New Trip">
            <div className="pt-dialog-body">
               <p>
                  <strong> In this Dialog you can do something </strong>
               </p>
               <label className="pt-label">
                  Driver Name
               <span className="pt-text-muted">(required)</span>
                  <input className="pt-input" type="text" placeholder="Your driver name" name="driverName" value={this.state.driverName} onChange={(e) => {
                     e.preventDefault();
                     this.setState({
                        driverName: e.target.value
                     });
                  }}/>
               </label>
               <label className="pt-label">
                  Car Type
               <input className="pt-input" type="text" placeholder="Your car type" name="carType" value={this.state.carType} onChange={(e) => {
                  e.preventDefault();
                  this.setState({
                     carType: e.target.value
                  });
               }}/>
               </label>
               <label className="pt-label">
                  Card number
               <input className="pt-input" type="text" placeholder="Your card number" dir="auto" />
               </label>
            </div>
            <div className="pt-dialog-footer">
               <div className="pt-dialog-footer-actions">
                  <Button
                     onClick={this.props.closeDialog}
                     text="Cancel"
                  />
                  <Button
                     text="Add Trip"
                     icon="add"
                     intent={Intent.PRIMARY}
                     onClick={(e) => {
                        e.preventDefault();
                        this.props.addTrip(this.state.driverName, this.state.carType);
                        this.setState({
                           carType:'',
                           driverName:''
                        })
                        this.props.closeDialog();
                     }}
                  />
               </div>
            </div>
         </Dialog>
      )
   }
}
  
