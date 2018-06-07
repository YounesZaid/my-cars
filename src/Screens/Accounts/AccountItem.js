import React from 'react';
import { Button, Intent, Popover, PopoverInteractionKind, Position } from "@blueprintjs/core";

const AccountItem = () => (
  <div className="account-item-container">
    <h6>Item</h6>
    <Popover
      interactionKind={PopoverInteractionKind.CLICK}
      popoverClassName="pt-popover-content-sizing"
      position={Position.TOP}>
      <a role="button" className="pt-button pt-minimal pt-large pt-intent-danger" tabIndex="0">Delete</a>
      <div>
        <h5>Confirm deletion</h5>
        <p>Are you sure you want to delete these items? You won't be able to recover them.</p>
        <Button intent={Intent.PRIMARY} className="pt-popover-dismiss" style={{ marginRight: 10 }}>Dismiss</Button>
        <Button intent={Intent.DANGER} className="pt-popover-dismiss" onClick={(e) => {
          e.preventDefault();
          alert('deleted')
        }}>Delete</Button>
      </div>
    </Popover>
  </div>
)

export default AccountItem;
