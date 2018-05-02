import React from 'react';
import { Button, Intent, Popover, PopoverInteractionKind, Position } from "@blueprintjs/core";


const DriverItem = ({ driverId, driver, onItemClicked, deleteDriver }) => (
  <div className="driver-item">
    <div className="driver-infos" onClick={onItemClicked}>
      <img src="https://s3.amazonaws.com/uifaces/faces/twitter/antonyzotov/128.jpg" alt="driver-profile" />
      <h3>{driver.driverFirstName} {driver.driverLastName}</h3>
      {/* <span><i className="zmdi zmdi-account-box-phone"></i> {driver.driverRegistrationNumber}</span>
         <span><i className="zmdi zmdi-assignment-o"></i> {driver.driverPhoneNumber}</span> */}
    </div>
    <Popover
      interactionKind={PopoverInteractionKind.CLICK}
      popoverClassName="pt-popover-content-sizing"
      position={Position.TOP}
    >
      <a><i className="zmdi zmdi-close zmdi-hc-2x"></i></a>
      <div>
        <h5>Confirm deletion</h5>
        <p>Are you sure you want to delete these items? You won't be able to recover them.</p>
        <Button intent={Intent.PRIMARY} className="pt-popover-dismiss" style={{ marginRight: 10 }}>Dismiss</Button>
        <Button intent={Intent.DANGER} className="pt-popover-dismiss" onClick={(e) => {
          e.preventDefault();
          deleteDriver(driver.driverId);
          // alert("cilcked");
        }}>Delete</Button>
      </div>
    </Popover>
  </div>
)

DriverItem.defaultProps = {
  fullName: 'Younes Zaid',
  number: '+212672849591',
  matricule: '12/2018'
}

export default DriverItem;

