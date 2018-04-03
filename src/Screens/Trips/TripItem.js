import React from 'react';

const TripItem = ({ carType, driverName, isActive }) => (
  <div className="trip-item">
    <span>{carType} / {driverName}</span>
    {isActive && <b>ACTIVE</b>}
  </div>
)

TripItem.defaulProps = {
  carType: '',
  driverName: '',
  isActive: false
}

export default TripItem;