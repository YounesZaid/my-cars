import React from 'react';

const TripItem = ({ carType, driverName, isActive }) => (
  <div className="trip-item">
    <a href="#trip-item" className="trip-content">
      <span>{carType} / {driverName}</span> 
    </a>
    {isActive && <b>ACTIVE</b>}
  </div>
)

TripItem.defaulProps = {
  carType: '',
  driverName: '',
  isActive: false
}

export default TripItem;