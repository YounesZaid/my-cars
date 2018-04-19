import React, { Component } from 'react';
import { Button, Dialog, Intent } from '@blueprintjs/core';

import DriverItem from './DriverItem';

export default class DriverList extends Component {
   state = {
      isAddDriverDialogOpen: false,
   }

   closeAddDriverDialog = () => {
      this.setState({
         isAddDriverDialogOpen: false,
      });
   }

   render() {
      const { isAddDriverDialogOpen } = this.state;
      const { drivers, addDriver, deleteDriver } = this.props;
      if (drivers.length > 0) {
         return [
            <header key={0}>
               <h3>Drivers</h3>
               <a href="#add-content" onClick={e => {
                  e.preventDefault();
                  this.setState({
                     isAddDriverDialogOpen: true,
                  });
               }}>ADD NEW DRIVER <i className="zmdi zmdi-plus-square zmdi-hc-lg"></i></a>
               <AddDriverDialog closeDialog={this.closeAddDriverDialog} isAddDriverDialogOpen={isAddDriverDialogOpen} addDriver={addDriver} />
            </header>,
            <section key={1}>
               {drivers.map((driver, i) => {
                  return (
                     <DriverItem key={driver.driverId} driverId={driver.driverId} driver={driver} deleteDriver={deleteDriver} />
                  )
               })}
            </section>
         ]
      }
      // Else
      return [
         <header key={0} >
            <h3>Drivers</h3>
            <a href="#add-content" onClick={e => {
               e.preventDefault();
               this.setState({
                  isAddDriverDialogOpen: true,
               });
            }}>ADD NEW DRIVER <i className="zmdi zmdi-plus-square zmdi-hc-lg"></i></a>
            <AddDriverDialog closeDialog={this.closeAddDriverDialog} isAddDriverDialogOpen={isAddDriverDialogOpen} addDriver={addDriver} />
         </header>,
         <section key={1}>
            <Spinner name="three-bounce" fadeIn="quarter" className="spinner-three-bounce" />
         </section>
      ]
   }
}

class AddDriverDialog extends Component {
   state = {
      driverFirstName: '',
      driverLastName: '',
      driverRegistrationNumber: '',
      driverPhoneNumber: ''
   }
   render() {
      const { driverFirstName, driverLastName, driverPhoneNumber, driverRegistrationNumber } = this.state;
      const { addDriver, isAddDriverDialogOpen, closeDialog } = this.props;
      return (
         <Dialog
            icon="inbox"
            isOpen={isAddDriverDialogOpen}
            onClose={closeDialog}
            usePortal={true}
            canOutsideClickClose={false}
            canEscapeKeyClose={true}
            title="Adding New Card">
            <div className="pt-dialog-body">
               <p>
                  <strong> In this Dialog you can add driver information </strong>
               </p>
               <label className="pt-label">
                  First Name
                  <span className="pt-text-muted"></span>
                  <input className="pt-input" type="text" placeholder="driver first name" dir="auto" name="driverFirstName" value={driverFirstName} onChange={(e) => {
                     e.preventDefault();
                     this.setState({
                        driverFirstName: e.target.value
                     });
                  }} />
               </label>
               <label className="pt-label">
                  Last Name
                  <span className="pt-text-muted"></span>
                  <input className="pt-input" type="text" placeholder="driver last name" dir="auto" name="driverLastName" value={driverLastName} onChange={(e) => {
                     e.preventDefault();
                     this.setState({
                        driverLastName: e.target.value
                     })
                  }} />
               </label>
               <label className="pt-label">
                  Phone number
                  <input className="pt-input" type="text" placeholder="driver phone number" dir="auto" name="driverPhoneNumber" value={driverPhoneNumber} onChange={(e) => {
                     e.preventDefault();
                     this.setState({
                        driverPhoneNumber: e.target.value
                     })
                  }} />
               </label>
               <label className="pt-label">
                  Registration number
                  <input className="pt-input" type="text" placeholder="driver registration number" dir="auto" name="driverRegistrationNumber" value={driverRegistrationNumber} onChange={(e) => {
                     e.preventDefault();
                     this.setState({
                        driverRegistrationNumber: e.target.value
                     })
                  }} />
               </label>
            </div>
            <div className="pt-dialog-footer">
               <div className="pt-dialog-footer-actions">
                  <Button
                     intent={Intent.DANGER}
                     onClick={this.props.closeDialog}
                     text="Close"
                  />
                  <Button
                     text="Add"
                     icon="add"
                     intent={Intent.ADD}
                     onClick={() => {
                        addDriver(driverFirstName, driverLastName, driverRegistrationNumber, driverPhoneNumber);
                        this.setState({
                           driverFirstName: '',
                           driverLastName: '',
                           driverRegistrationNumber: '',
                           driverPhoneNumber: ''
                        })
                        closeDialog();
                     }}
                  />
               </div>
            </div>
         </Dialog>
      )
   }
}

const Spinner = require('react-spinkit');