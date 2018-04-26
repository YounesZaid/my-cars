import React from 'react';

const TripItem = ({ trip, tripId, postedTripAt, carId, driverId, isActive, onItemClicked }) => (
   <div className="trip-item" onClick={onItemClicked}>
      {/* <p href="#trip-item" className="trip-content">
         <span>{carType} / {driverName}</span>
      </p>
      <span className="isActive">
         {isActive && <b>ACTIVE</b>}
      </span> */}
      <ul>
         <li className="li-dirveName"><i className="zmdi zmdi-account-circle item-icon"></i><span id="driverFullName">{trip.driverFirstName}</span>{trip.driverLastName} </li>
         <li><i className="zmdi zmdi-car item-icon"></i> {carId} </li>
         <li><i className="zmdi zmdi-calendar item-icon"></i> {postedTripAt}</li>
      </ul>
      <span className="isActive">
         {isActive && <b>ACTIVE</b>}
      </span>
   </div>
)

TripItem.defaultProps = {
   carType: '',
   driverName: '',
   isActive: false
}

export default TripItem;