import React from 'react';
import { withRouter } from 'react-router-dom';

const DriverItem = ({ driverId, driver, history}) => (
   <div className="driver-item" onClick={e => {
      history.push(`/drivers/${driverId}`);
   }}>
      <img src="https://s3.amazonaws.com/assets.materialup.com/users/pictures/000/014/117/thumb/TcZxZKU2_400x400.jpg?1507620119" alt="driver-profile" />
      <div className="driver-infos">
         <span><i className="zmdi zmdi-account-box-o"></i> {driver.driverFirstName} {driver.driverLastName}</span>
         {/* <span><i className="zmdi zmdi-account-box-phone"></i> {driver.driverRegistrationNumber}</span>
         <span><i className="zmdi zmdi-assignment-o"></i> {driver.driverPhoneNumber}</span> */}
      </div>
      <a href="#delete-driver"><i className="zmdi zmdi-close zmdi-hc-3x"></i></a>
   </div>
)

DriverItem.defaultProps = {
   fullName: 'Younes Zaid',
   number: '+212672849591',
   matricule: '12/2018'
}

export default withRouter(DriverItem);
