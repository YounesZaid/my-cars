import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import './index.css';

import TripDetails from './TripDetails';
import TripsList from './TripsList';

export default class TripsScreen extends Component {

   state = {
      trips: GET_TRIPS()
   }

   addTrip = (driverName, carType) => {
      const tripItem = {
         id: this.state.trips.length + 1,
         carType: carType,
         driverName: driverName,
         isActive: true
      }
      // ES5
      // let tripsArray = [];
      // this.state.trips.forEach(element => {
      //    tripsArray.push(element);
      // });
      // tripsArray.push(tripItem);
      // this.setState({
      //    trips: tripsArray
      // });
      this.setState({
         trips: this.state.trips.concat(tripItem)
      })
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

