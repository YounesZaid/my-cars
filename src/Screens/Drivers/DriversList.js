import React, { Component } from 'react';
import { Button, Dialog, Intent } from '@blueprintjs/core';
import { db } from 'Database/config';
import moment from 'moment';
import Spinner from 'react-spinkit';

import DriverItem from './DriverItem';

export default class DriverList extends Component {
  state = {
    drivers: [],
    isLoading: true,
    isAddDriverDialogOpen: false,
  }

  addDriver = (driverFirstName, driverLastName, driverRegistrationNumber, driverPhoneNumber) => {
    db.collection("drivers").add({
      driverFirstName,
      driverLastName,
      driverRegistrationNumber,
      driverPhoneNumber,
      posted: moment().format('MMMM Do YYYY, h:mm:ss a')
    })
      .then(function (docRef) {
        alert(`Trip with the driver ${driverFirstName} was added successfully!`);
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function (error) {
        alert("Something went wrong!");
        console.error("Error adding document: ", error);
      });
  }

  deleteDriver = (driverId) => {
    db.collection("drivers").doc(driverId).delete().then(function () {
      console.log("Document successfully deleted!");
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
  }

  closeAddDriverDialog = () => {
    this.setState({
      isAddDriverDialogOpen: false,
    });
  }

  componentDidMount() {
    db.collection("drivers").orderBy('posted', 'desc').onSnapshot((QuerySnapshot) => {
      const driversItems = [];
      QuerySnapshot.forEach((doc) => {
        console.log(`${doc.id} => Get drivers collection with success`);
        let docItem = {
          driverFirstName: doc.data().driverFirstName,
          driverLastName: doc.data().driverLastName,
          driverRegistrationNumber: doc.data().driverRegistrationNumber,
          driverPhoneNumber: doc.data().driverPhoneNumber,
          driverId: doc.id
        }
        driversItems.push(docItem);
      });
      this.setState({
        drivers: driversItems,
        isLoading: false
      })
    });
  }

  render() {
    const { isAddDriverDialogOpen, isLoading, drivers } = this.state;
    if (isLoading || drivers.length === 0) {
      return [
        <header key={0} >
          <h3>Drivers</h3>
        </header>,
        <section key={1}>
          {isLoading && <Spinner name="three-bounce" fadeIn="quarter" className="spinner-three-bounce" />}
          {!isLoading && <h2 className="blank-list-page">
            <i className="zmdi zmdi-pin zmdi-hc-2x"></i> No drivers found! ..
            <a href="#add-content" onClick={e => {
              e.preventDefault();
              this.setState({
                isAddDriverDialogOpen: true,
              });
            }}>ADD NEW DRIVER <i className="zmdi zmdi-plus-square zmdi-hc-lg"></i></a>
            <AddDriverDialog closeDialog={this.closeAddDriverDialog} isAddDriverDialogOpen={isAddDriverDialogOpen} addDriver={this.addDriver} />
          </h2>}
        </section>
      ]
    }
    return [
      <header key={0}>
        <h3>Drivers</h3>
        <a href="#add-content" onClick={e => {
          e.preventDefault();
          this.setState({
            isAddDriverDialogOpen: true,
          });
        }}>ADD NEW DRIVER <i className="zmdi zmdi-plus-square zmdi-hc-lg"></i></a>
        <AddDriverDialog closeDialog={this.closeAddDriverDialog} isAddDriverDialogOpen={isAddDriverDialogOpen} addDriver={this.addDriver} />
      </header>,
      <section key={1}>
        {drivers.map((driver, i) => {
          return (
            <DriverItem key={driver.driverId} driverId={driver.driverId}
              driver={driver} deleteDriver={this.deleteDriver}
              onItemClicked={e => {
                e.preventDefault();
                this.props.history.push(`/drivers/${driver.driverId}`);
              }} />
          )
        })}
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
