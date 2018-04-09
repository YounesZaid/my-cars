import React, { Component } from 'react';
import { Button, Dialog, Intent } from '@blueprintjs/core';

import TripItem from './TripItem';

export default class TripsList extends Component {
   state = {
      isAddTripDialogOpen: false,
   }

   closeAddTripDialog = () => {
      this.setState({
         isAddTripDialogOpen: false
      });
   }

   render() {
      const { isAddTripDialogOpen } = this.state;
      const { trips, addTrip } = this.props;
      return [
         <header key={0}>
            <h3>Trips</h3>
            <a href="#add-content" onClick={e => {
               e.preventDefault();
               this.setState({
                  isAddTripDialogOpen: true,
               });
            }}>ADD NEW TRIP <i className="zmdi zmdi-plus-square zmdi-hc-lg"></i></a>
            <AddTripDialog closeDialog={this.closeAddTripDialog} isOpen={isAddTripDialogOpen} addTrip={addTrip} />
         </header>,
         <section key={1}>
            {trips.map((carObject, i) => {
               return (
                  <TripItem key={carObject.id} tripId={carObject.id} carType={carObject.carType}
                     driverName={carObject.driverName} isActive={carObject.isActive} />
               )
            })}
         </section>
      ]
   }
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
                  }} />
               </label>
               <label className="pt-label">
                  Car Type
                  <input className="pt-input" type="text" placeholder="Your car type" name="carType" value={this.state.carType} onChange={(e) => {
                     e.preventDefault();
                     this.setState({
                        carType: e.target.value
                     });
                  }} />
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
                           carType: '',
                           driverName: ''
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