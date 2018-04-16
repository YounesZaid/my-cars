import React from 'react';
import { withRouter } from 'react-router-dom';

const TripItem = ({ tripId, posted, carType, driverName, isActive, history }) => (
   <div className="trip-item" onClick={e => {
      history.push(`/trips/${tripId}`)
   }}>
      {/* <p href="#trip-item" className="trip-content">
         <span>{carType} / {driverName}</span>
      </p>
      <span className="isActive">
         {isActive && <b>ACTIVE</b>}
      </span> */}
      <ul>
         <li className="li-dirveName"><i className="zmdi zmdi-account-circle item-icon"></i> {driverName}</li>
         <li><i className="zmdi zmdi-car item-icon"></i> {carType} </li>
         <li><i className="zmdi zmdi-calendar item-icon"></i> {posted}</li>
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

export default withRouter(TripItem);