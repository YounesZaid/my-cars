import React from 'react';
import { Button, Intent, Popover, PopoverInteractionKind, Position } from "@blueprintjs/core";


const CarItem = ({ car, deleteCar, carId, onItemClicked }) => (
  <div className="car-item">
    <div className="car-infos" onClick={onItemClicked}>
      <i className="zmdi zmdi-car zmdi-hc-5x"></i>
      <h3>{car.carName}</h3>
      <p>Click for more informations ...</p>
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
        <Button intent={Intent.DANGER} className="pt-popover-dismiss" onClick={e => {
          e.preventDefault();
          deleteCar(carId);
        }}>Delete</Button>
      </div>
    </Popover>
  </div>
)

export default CarItem;