import React, { Component } from 'react';
import { Button, Dialog, Intent, Tooltip } from '@blueprintjs/core';
import { db } from 'Database/config';
import moment from 'moment';
import Spinner from 'react-spinkit';

import AppToaster from 'Components/Toast';
import TripItem from './TripItem';

export default class TripsList extends Component {
  state = {
    trips: [],
    isLoading: true,
    isAddTripDialogOpen: false,
  }

  showAddTripToast = () => {
    AppToaster.show({
      message: "Trip added successfully !",
      intent: "success"
    });
  }

  showErrorToast = (error) => {
    AppToaster.show({
      message: `Something went wrong ! ${error}`,
      intent: "danger"
    });
  }


  // showAddErrorTripToast = () => {
  //   AppToaster.show({
  //     message: "Trip not added please try again !",
  //     intent: "success",
  //   });
  // }

  addTrip = (driverId, carId, cardId) => {
    db.collection("trips").add({
      driverId,
      carId,
      cardId,
      isActive: true,
      postedTripAt: moment().format('MMMM Do YYYY, h:mm:ss a')
    }).then(docRef => {
      this.showAddTripToast();
    }).catch(error => {
      this.showErrorToast(error);
    });
  }

  componentDidMount() {
    db.collection("trips").orderBy('postedTripAt', 'desc').onSnapshot((querySnapshot) => {
      const tripItems = [];
      const driverIdsDocPromises = [];
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
          postedTripAt: data.postedTripAt
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
          this.showErrorToast(error);
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
              driverId={trip.driverId} isActive={trip.isActive} postedTripAt={trip.postedTripAt}
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
    db.collection("drivers").orderBy('postedDriverAt', 'desc').onSnapshot(driverDoc => {
      const driverItems = [];
      driverDoc.forEach((doc) => {
        const data = doc.data();
        const docItem = {
          driverFirstName: data.driverFirstName,
          driverLastName: data.driverLastName,
          driverId: doc.id
        }
        driverItems.push(docItem);
      });
      db.collection("cars").orderBy('postedCarAt', 'desc').onSnapshot(carDoc => {
        const carItems = [];
        carDoc.forEach((doc) => {
          let docItem = {
            carName: doc.data().carName,
            carId: doc.id
          }
          carItems.push(docItem);
        });
        db.collection("cards").orderBy('postedCardAt', 'desc').onSnapshot((DocRef) => {
          const cardItems = [];
          DocRef.forEach(doc => {
            const data = doc.data();
            let docItem = {
              cardType: data.cardType,
              cardIdentifier: data.cardIdentifier,
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
        isCloseButtonShown={true}
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
                  return <option key={i} value={card.cardId}>{card.cardIdentifier}</option>
                })}
              </select>
            </div>
          </label>
        </div>
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Tooltip content="This button is hooked up to close the dialog.">
              <Button intent={Intent.DANGER} onClick={this.props.closeDialog}>Close</Button>
            </Tooltip>
            <Button
              text="Add Trip"
              icon="add"
              disabled={!driverId || !cardId || !carId}
              intent={Intent.PRIMARY}
              onClick={(e) => {
                e.preventDefault();
                this.props.addTrip(driverId, carId, cardId);
                this.setState({
                  driverId: '',
                  carId: '',
                  cardId: ''
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