import React, { Component } from 'react';

import './index.css';
import TripItem from './TripItem';
import TripDetails from './TripDetails';

export default class TripsScreen extends Component {
  render() {
    return (
      <div className="screen-wrapper trips-screen">
        <header>
          <h3>Trips</h3>
          <a href="#add-content">ADD NEW TRIP <i className="zmdi zmdi-plus-square"></i></a>
        </header>
        <section>
          {/* {GET_TRIPS().map((carObject, i) => {
            return (
              <TripItem key={carObject.id} carType={carObject.carType}
                driverName={carObject.driverName} isActive={carObject.isActive} />

            )
          })} */}
          {GET_TRIPS().map((carObject, i) => {
            return (
              <TripDetails key={carObject.id} carType={carObject.carType}
              driverName={carObject.driverName} isActive={carObject.isActive}/>
            )
          })}
        </section>
      </div>
      
    )
  }
}

function GET_TRIPS() {
  return [
    {id: 1, carType: 'Mercedes', driverName: 'Younes', isActive: true},
    // {id: 2, carType: 'Mercedes 2', driverName: 'Younes', isActive: true},
    // {id: 3, carType: 'Mercedes 3', driverName: 'Younes', isActive: false},
    // {id: 4, carType: 'Mercedes 4', driverName: 'Younes', isActive: true},
    // {id: 5, carType: 'Mercedes 5', driverName: 'Younes', isActive: false},
    // {id: 6, carType: 'Mercedes 6', driverName: 'Younes', isActive: false},
    // {id: 7, carType: 'Mercedes 7', driverName: 'Younes', isActive: true},
  ]
}