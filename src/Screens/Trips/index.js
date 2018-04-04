import React, { Component } from 'react';
import { Button, Dialog, Intent } from '@blueprintjs/core';

import './index.css';
import TripItem from './TripItem';
import TripDetails from './TripDetails';

export default class TripsScreen extends Component {

  state = {
    trips: GET_TRIPS(),
    isAddTripDialogOpen: false,
  }

  closeAddTripDialog = () => {
    this.setState({ 
      isAddTripDialogOpen: false
    })
  }
  
  render() {
    const { isAddTripDialogOpen, trips } = this.state;
    return (
      <div className="screen-wrapper trips-screen">
        <header>
          <h3>Trips</h3>
          <a href="#add-content" onClick={ e => {
            e.preventDefault();
            this.setState({
              isAddTripDialogOpen: true,
            });
          }}>ADD NEW TRIP <i className="zmdi zmdi-plus-square"></i></a>
          <AddTripDialog closeDialog={this.closeAddTripDialog} isOpen={isAddTripDialogOpen} />
        </header>
        <section>
          {trips.map((carObject, i) => {
            return (
              <TripItem key={carObject.id} tripId={carObject.id} carType={carObject.carType}
                driverName={carObject.driverName} isActive={carObject.isActive} />
              )
          })}
          <TripDetails key={({}).id} carType={({}).carType}
            driverName={({}).driverName} isActive={({}).isActive}/>
        </section>
      </div>
      
    )
  }
}

function GET_TRIPS() {
  return [
    {id: 1, carType: 'Mercedes', driverName: 'Younes', isActive: true},
    {id: 2, carType: 'Mercedes 2', driverName: 'Younes', isActive: true},
    {id: 3, carType: 'Mercedes 3', driverName: 'Younes', isActive: false},
    {id: 4, carType: 'Mercedes 4', driverName: 'Younes', isActive: true},
    {id: 5, carType: 'Mercedes 5', driverName: 'Younes', isActive: false},
    {id: 6, carType: 'Mercedes 6', driverName: 'Younes', isActive: false},
    {id: 7, carType: 'Mercedes 7', driverName: 'Younes', isActive: true},
    {id: 8, carType: 'Mercedes 7', driverName: 'Younes', isActive: true},
    {id: 9, carType: 'Mercedes 7', driverName: 'Younes', isActive: true},
  ]
}

const AddTripDialog = ({closeDialog, isOpen}) => (
  <Dialog
    icon="inbox"
    isOpen={isOpen}
    onClose={closeDialog}
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
        <input className="pt-input" type="text" placeholder="Text input" dir="auto" />
      </label>
      <label className="pt-label">
        Car identifier
        <input className="pt-input" type="text" placeholder="Text input" dir="auto" />
      </label>
      <label className="pt-label">
        Card number
        <input className="pt-input" type="text" placeholder="Text input" dir="auto" />
      </label>
    </div>
    <div className="pt-dialog-footer">
      <div className="pt-dialog-footer-actions">
        <Button 
          onClick={closeDialog}
          text="Cancel"
        />
        <Button 
          text="Add Trip"
          icon="add"
          intent={Intent.PRIMARY}
        />
      </div>
    </div>
  </Dialog>
)
