import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import TripDetails from './TripDetails';

const TripItem = ({ tripId, carType, driverName, isActive }) => (
  <div className="trip-item">
    <a href="#trip-item" className="trip-content">
      <span>{carType} / {driverName}</span> 
    </a> 
    <span className="isActive">
      {isActive && <b>ACTIVE</b>}
    </span>
  </div>
)

TripItem.defaulProps = {
  carType: '',
  driverName: '',
  isActive: false
}

export default TripItem;