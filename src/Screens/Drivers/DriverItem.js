import React from 'react';

const DriverItem = ({ driverId, driver, onItemClicked, deleteDriver }) => (
  <div className="driver-item">
    <div className="driver-infos" onClick={onItemClicked}>
      <img src="https://s3.amazonaws.com/uifaces/faces/twitter/dvdwinden/128.jpg" alt="driver-profile" />
      <h3>{driver.driverFirstName} {driver.driverLastName}</h3>
      {/* <span><i className="zmdi zmdi-account-box-phone"></i> {driver.driverRegistrationNumber}</span>
         <span><i className="zmdi zmdi-assignment-o"></i> {driver.driverPhoneNumber}</span> */}
    </div>
    <a href="#delete-driver" onClick={(e) => {
      e.preventDefault();
      deleteDriver(driver.driverId);
      // alert("cilcked");
    }}><i className="zmdi zmdi-close zmdi-hc-2x"></i></a>
  </div>
)

DriverItem.defaultProps = {
  fullName: 'Younes Zaid',
  number: '+212672849591',
  matricule: '12/2018'
}

export default DriverItem;
