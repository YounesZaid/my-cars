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

  addTrip = (driverId, carId, cardId) => {
    db.collection("trips").add({
      driverId,
      carId,
      cardId,
      isActive: true,
      posted: moment().format('MMMM Do YYYY, h:mm:ss a')
    })
      .then(docRef => {
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
      const driverIdsDocPromises = [];
      // const carIdsDocPromises = [];
      // const cardIdsDocPromises = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const promise = db.collection("drivers").doc(data.driverId).get();
        driverIdsDocPromises.push(promise);
        tripItems.push({
          driverId: data.driverId,
          carId: data.carId,
          cardId: data.cardId,
          id: doc.id,
          isActive: data.isActive,
          posted: data.posted
        });
      });

      Promise.all(driverIdsDocPromises)
        .then(driverDocs => {
          driverDocs.forEach(driverDoc => {
            tripItems.forEach((tripObj, i) => {
              if (tripObj.driverId === driverDoc.id) {
                tripItems[i] = {
                  ...tripObj,
                  ...(driverDoc.data())
                }
              }
            })
          });
          this.setState({
            trips: tripItems,
            isLoading: false,
          })
        })
        .catch(error => {
          // SOMETHING WENT WRONG!
          alert("OuPs ! Failed to Load the items .. !")
        })
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
            <TripItem key={trip.id} trip={trip} tripId={trip.id} carId={trip.carId}
              driverId={trip.driverId} isActive={trip.isActive} posted={trip.posted}
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
    drivers: [],
    cars: [],
    cards: [],
    driverId: null,
    carId: null,
    cardId: null
  }

  _getDriversAndCardsAndCars = () => {
    // const driversPromise = db.collection("drivers").orderBy('posted', 'desc').get();
    // const carsPromise = db.collection("cars").orderBy('posted', 'desc').get();
    // const cardsPromise = db.collection("cards").orderBy('posted', 'desc').get();
    // Promise.all(driversPromise, carsPromise, cardsPromise)
    //   .then(responses => {
    //     // set State
    //     console.log('LOADED')
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   })
    db.collection("drivers").orderBy('posted', 'desc').onSnapshot(driverDoc => {
      const driverItems = [];
      driverDoc.forEach((doc) => {
        const data = doc.data();
        let docItem = {
          driverFirstName: data.driverFirstName,
          driverLastName: data.driverLastName,
          driverId: doc.id
        }
        driverItems.push(docItem);
      });
      db.collection("cars").orderBy('posted', 'desc').onSnapshot(carDoc => {
        const carItems = [];
        carDoc.forEach((doc) => {
          let docItem = {
            carName: doc.data().carName,
            carId: doc.id
          }
          carItems.push(docItem);
        });
        db.collection("cards").orderBy('posted', 'desc').onSnapshot((DocRef) => {
          const cardItems = [];
          DocRef.forEach(doc => {
            let docItem = {
              cardType: doc.data().cardType,
              cardId: doc.id,
            }
            cardItems.push(docItem);
          });
         this.setState({
           drivers: driverItems,
           cars: carItems,
           cards: cardItems
         })
        });
      });
    });

  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isOpen && nextProps.isOpen) {
      // we're opening the dialog
      this._getDriversAndCardsAndCars();
    }
  }

  componentDidMount() {
    // .onSnapshot((querySnapshot) => {
    //   const driversItems = [];
    //   querySnapshot.forEach((doc) => {
    //     console.log(`${doc.id} => Get drivers collection with success`);
    //     let docItem = {
    //       driverFirstName: doc.data().driverFirstName,
    //       driverLastName: doc.data().driverLastName,
    //       driverId: doc.id
    //     }
    //     driverItems.push(docItem);
    //   });
    //   this.setState({
    //     drivers: driversItems,
    //   })
    // });

    // db.collection("cars").orderBy('posted', 'desc').onSnapshot((QuerySnapshot) => {
    //   const carsItems = [];
    //   QuerySnapshot.forEach((doc) => {
    //     console.log(`${doc.id} => Get Cars Collection with Success`);
    //     let docItem = {
    //       carName: doc.data().carName,
    //       carId: doc.id
    //     }
    //     carsItems.push(docItem);
    //   });
    //   this.setState({
    //     cars: carsItems,
    //   })
    // });

    // db.collection("cards").orderBy('posted', 'desc').onSnapshot((DocRef) => {
    //   const cardsItems = [];
    //   DocRef.forEach(doc => {
    //     console.log(`${doc.id} => Get Cards collection with success`);
    //     let docItem = {
    //       cardType: doc.data().cardType,
    //       cardId: doc.id,
    //     }
    //     cardsItems.push(docItem);
    //   });
    //   this.setState({
    //     cards: cardsItems,
    //   })
    // });
  }

  render() {
    const { drivers, cars, cards, driverId, carId, cardId } = this.state;
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
            Driver name
            <div className="pt-select">
              <select onChange={e => {
                e.preventDefault();
                this.setState({
                  driverId: e.target.value
                });
              }}>
                <option defaultValue>Choose a driver...</option>
                {drivers.map((driver, i) => {
                  return <option key={i} value={driver.driverId}>{driver.driverFirstName} {driver.driverLastName}</option>
                })}
              </select>
            </div>
          </label>
          <label className="pt-label">
            Car type
            <div className="pt-select">
              <select onChange={e => {
                e.preventDefault();
                this.setState({
                  carId: e.target.value
                })
              }}>
                <option defaultValue>Choose a car...</option>
                {cars.map((car, i) => {
                  return <option key={i} value={car.carId}>{car.carName}</option>
                })}
              </select>
            </div>
          </label>
          <label className="pt-label">
            Card number
            <div className="pt-select">
              <select onChange={e => {
                e.preventDefault();
                this.setState({
                  cardId: e.target.value
                })
              }}>
                <option defaultValue>Choose a card...</option>
                {cards.map((card, i) => {
                  return <option key={i} value={card.cardId}>{card.cardType}</option>
                })}
              </select>
            </div>
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
              disabled={!driverId || !cardId || !carId}
              intent={Intent.PRIMARY}
              onClick={(e) => {
                e.preventDefault();
                this.props.addTrip(driverId, carId, cardId);
                this.props.closeDialog();
              }}
            />
          </div>
        </div>
      </Dialog>
    )
  }
}