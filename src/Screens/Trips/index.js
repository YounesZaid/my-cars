import React, { Component } from 'react';
import { Button, Dialog, Intent } from '@blueprintjs/core';

import './index.css';
import TripItem from './TripItem';
// import TripDetails from './TripDetails';

export default class TripsScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      showComponent: false
    }
  }

  _onButtonClick = () => {
    this.setState({
      showComponent: true,
    });
  };

  _toggleDialog = () => {
    this.setState({ 
      isOpen: !this.state.isOpen 
    })
  }
  
  render() {
    return (
      <div className="screen-wrapper trips-screen">
        <header>
          <h3>Trips</h3>
          <a href="#add-content" onClick={ e => {
            e.preventDefault();
            this._onButtonClick();
          }}>ADD NEW TRIP <i className="zmdi zmdi-plus-square"></i></a>
        </header>
        <section>
          {GET_TRIPS().map((carObject, i) => {
            return (
              <TripItem key={carObject.id} tripId={carObject.id} carType={carObject.carType}
                driverName={carObject.driverName} isActive={carObject.isActive} />
              // <TripDetails key={carObject.id} carType={carObject.carType}
              // driverName={carObject.driverName} isActive={carObject.isActive}/>
            )
          })}
          { this.state.showComponent ? <AddTripDialog toggleDialog={this.state._toggleDialog} isOpen={this.state.isOpen}/> : null }
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

const AddTripDialog = ({toggleDialog, isOpen}) => (
  <div>
    <Dialog
        icon="inbox"
        isOpen={isOpen}
        onClose={toggleDialog}
        usePortal={true}
        canOutsideClickClose={false}
        canEscapeKeyClose={true}
        title="Adding New Trip">
      <div className="pt-dialog-body">
        <p>
          <strong> In this Dialog you can do something </strong>
        </p>
        <label class="pt-label">
          Driver Name
          <span className="pt-text-muted">(required)</span>
          <input className="pt-input" type="text" placeholder="Text input" dir="auto" />
        </label>
        <label class="pt-label">
          Car identifier
          <input className="pt-input" type="text" placeholder="Text input" dir="auto" />
        </label>
        <label class="pt-label">
          Card number
          <input className="pt-input" type="text" placeholder="Text input" dir="auto" />
        </label>
      </div>
      <div className="pt-dialog-footer">
        <div className="pt-dialog-footer-actions">
          <Button 
            text="Add"
            icon="add"
            intent={Intent.ADD}
          />
          <Button 
              intent={Intent.DANGER}
              onClick={toggleDialog}
              text="Close"
          />
        </div>
      </div>
    </Dialog>
  </div>
)
