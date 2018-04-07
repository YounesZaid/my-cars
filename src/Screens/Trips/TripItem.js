import React from 'react';
import { withRouter } from 'react-router-dom';

const TripItem = ({ tripId, carType, driverName, isActive, history }) => (
  <div className="trip-item" onClick={e => {
      history.push(`/trips/${tripId}`)
  }}>
    <p href="#trip-item" className="trip-content">
      <span>{carType} / {driverName}</span> 
    </p> 
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

export default withRouter(TripItem);