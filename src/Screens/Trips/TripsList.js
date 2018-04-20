import React, { Component } from 'react';
import { Button, Dialog, Intent } from '@blueprintjs/core';
import { db } from 'Database/config';
import * as firebase from 'firebase';
import moment from 'moment';
import Spinner from 'react-spinkit';

import TripItem from './TripItem';

export default class TripsList extends Component {
  state = {
    trips: [],
    isLoading: true,
    isAddTripDialogOpen: false,
  }

  addTrip = (driverName, carType) => {
    db.collection("trips").add({
      driverName,
      carType,
      isActive: true,
      posted: moment().format('MMMM Do YYYY, h:mm:ss a')
    })
      .then(docRef => {
        alert(`Trip with the driver ${driverName} was added successfully!`);
        console.log("Document written with ID: ", firebase.firestore.FieldPath.documentId());
      })
      .catch(error => {
        alert('Something went wrong!');
        console.error("Error adding document: ", error);
      });
  }

  componentDidMount() {
    db.collection("trips").orderBy('posted', 'desc').onSnapshot((querySnapshot) => {
      const tripItems = [];
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => Get trips collection with success`);
        const docItem = {
          driverName: doc.data().driverName,
          carType: doc.data().carType,
          id: doc.id,
          isActive: doc.data().isActive,
          posted: doc.data().posted
        }
        tripItems.push(docItem);
      });
      this.setState({
        trips: tripItems,
        isLoading: false,
      })
      //  this.setState({
      //    trips: querySnapshot.map(doc => {
      //      return {
      //       riverName: doc.data().driverName,
      //       carType: doc.data().carType,
      //       id: doc.id,
      //       isActive: doc.data().isActive, 
      //       posted: doc.data().posted
      //      }
      //    })
      //  })
    });
  }

  closeAddTripDialog = () => {
    this.setState({
      isAddTripDialogOpen: false
    });
  }

  render() {
    const { isAddTripDialogOpen, isLoading, trips } = this.state;
    if (isLoading || trips.length === 0) {
      return [
        <header key={0}>
          <h3>Trips</h3>
        </header>,
        <section key={1}>
          {isLoading && <Spinner name="three-bounce" fadeIn="quarter" className="spinner-three-bounce" />}
          {!isLoading && <h2 className="blank-list-page">
            <i className="zmdi zmdi-pin zmdi-hc-2x"></i> No trips found! ..
            <a href="#add-content" onClick={e => {
              e.preventDefault();
              this.setState({
                isAddTripDialogOpen: true,
              });
            }}>ADD NEW TRIP <i className="zmdi zmdi-plus-square zmdi-hc-lg"></i></a>
            <AddTripDialog closeDialog={this.closeAddTripDialog} isOpen={isAddTripDialogOpen} addTrip={this.addTrip} />
          </h2>}
        </section>
      ]
    }

    return [
      <header key={0}>
        <h3>Trips</h3>
        <a href="#add-content" onClick={e => {
          e.preventDefault();
          this.setState({
            isAddTripDialogOpen: true,
          });
        }}>ADD NEW TRIP <i className="zmdi zmdi-plus-square zmdi-hc-lg"></i></a>
        <AddTripDialog closeDialog={this.closeAddTripDialog} isOpen={isAddTripDialogOpen} addTrip={this.addTrip} />
      </header>,
      <section key={1}>
        {trips.map((trip, i) => {
          return (
            <TripItem key={trip.id} tripId={trip.id} carType={trip.carType}
              driverName={trip.driverName} isActive={trip.isActive} posted={trip.posted}
              onItemClicked={e => {
                e.preventDefault();
                this.props.history.push(`/trips/${trip.id}`);
              }} />
          )
        })}
      </section>
    ]
  }
}


class AddTripDialog extends Component {
  state = {
    carType: '',
    driverName: ''
  }

  render() {
    return (
      <Dialog
        icon="inbox"
        isOpen={this.props.isOpen}
        onClose={this.props.closeDialog}
        usePortal={true}
        canOutsideClickClose={false}
        canEscapeKeyClose={true}
        title="Adding New Trip">
        <div className="pt-dialog-body">
          <p>
            <strong> In this Dialog you can add a new trip </strong>
          </p>
          <label className="pt-label">
            Driver Name
                  <span className="pt-text-muted">(required)</span>
            <input className="pt-input" type="text" placeholder="Your driver name" name="driverName" value={this.state.driverName} onChange={(e) => {
              e.preventDefault();
              this.setState({
                driverName: e.target.value
              });
            }} />
          </label>
          <label className="pt-label">
            Car Type
                  <input className="pt-input" type="text" placeholder="Your car type" name="carType" value={this.state.carType} onChange={(e) => {
              e.preventDefault();
              this.setState({
                carType: e.target.value
              });
            }} />
          </label>
          <label className="pt-label">
            Card number
                  <input className="pt-input" type="text" placeholder="Your card number" dir="auto" />
          </label>
        </div>
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Button
              onClick={this.props.closeDialog}
              text="Cancel"
            />
            <Button
              text="Add Trip"
              icon="add"
              intent={Intent.PRIMARY}
              onClick={(e) => {
                e.preventDefault();
                this.props.addTrip(this.state.driverName, this.state.carType);
                this.setState({
                  carType: '',
                  driverName: ''
                })
                this.props.closeDialog();
              }}
            />
          </div>
        </div>
      </Dialog>
    )
  }
}