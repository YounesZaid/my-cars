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

  addTrip = (driverId, carId) => {
    db.collection("trips").add({
      driverId,
      carId,
      isActive: true,
      locations: [
        { latitude: 34.002271, longitude: -6.8543258 },
        { latitude: 34.002109, longitude: -6.854280 },
        { latitude: 34.003172, longitude: -6.852823 },
        { latitude: 34.002802, longitude: -6.851271 },
        { latitude: 34.001915, longitude: -6.850802 },
        { latitude: 34.000556, longitude: -6.850090 },
        { latitude: 33.997885, longitude: -6.847561 },
      ],
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
      const driverAndCarPromises = [[], []];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const driverPromise = db.collection("drivers").doc(data.driverId).get();
        const carPromise = db.collection("cars").doc(data.carId).get();
        driverAndCarPromises[0].push(driverPromise);
        driverAndCarPromises[1].push(carPromise);
        tripItems.push({
          driverId: data.driverId,
          carId: data.carId,
          id: doc.id,
          isActive: data.isActive,
          postedTripAt: data.postedTripAt
        });
      });
      const promise4All = Promise.all(driverAndCarPromises.map(Promise.all, Promise));
      promise4All
        .then(driversAndCars => {
          const driverDocs = driversAndCars[0];
          const carDocs = driversAndCars[1];
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
          carDocs.forEach(carDoc => {
            tripItems.forEach((tripObj, i) => {
              if (tripObj.carId === carDoc.id) {
                tripItems[i] = {
                  ...tripObj,
                  ...(carDoc.data())
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
          {!isLoading && <div className="no-trip-found-container">
            <h2 className="blank-text-page">
              <i className="zmdi zmdi-pin zmdi-hc-2x"></i> No trips found ..!
            </h2>
            <button type="button" className="pt-button pt-large pt-intent-primary pt-icon-add" onClick={e => {
                e.preventDefault();
                this.setState({
                  isAddTripDialogOpen: true,
                });
            }}>
              PLEASE ADD A NEW TRIP
            </button>
            <AddTripDialog closeDialog={this.closeAddTripDialog} isOpen={isAddTripDialogOpen} addTrip={this.addTrip} />
          </div>}
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
    driverId: '',
    carId: '',
    isLoading: true,
  }

  _getDriversAndCardsAndCars = () => {
    const carsPromise = db.collection("cars").orderBy('postedCarAt', 'desc').get();
    const driversPromise = db.collection("drivers").orderBy('postedDriverAt', 'desc').get();
    Promise.all([carsPromise, driversPromise])
      .then(carsAndDrivers => {
        const carDocs = carsAndDrivers[0],
          cars = [];
        const driverDocs = carsAndDrivers[1],
          drivers = [];
        carDocs.forEach(car => {
          cars.push({
            carId: car.id,
            ...(car.data())
          });
        });
        driverDocs.forEach(driver => {
          drivers.push({
            driverId: driver.id,
            ...(driver.data())
          });
        });

        this.setState({
          isLoading: false,
          drivers,
          cars
        })
      })
      .catch(error => {

      })
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isOpen && nextProps.isOpen) {
      // we're opening the dialog
      this._getDriversAndCardsAndCars();
    }
  }

  _renderDialogInputs = (drivers, cars, driverId, carId) => {
    return (
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
            }} value={driverId}>
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
            }} value={carId}>
              {cars.map((car, i) => {
                return <option key={i} value={car.carId}>{car.carName}</option>
              })}
            </select>
          </div>
        </label>
      </div>
    )
  }

  render() {
    const { isLoading, drivers, cars, driverId, carId } = this.state;
    const { isOpen, closeDialog, addTrip } = this.props;
    return (
      <Dialog
        isCloseButtonShown={true}
        icon="inbox"
        isOpen={isOpen}
        onClose={closeDialog}
        usePortal={true}
        canOutsideClickClose={false}
        canEscapeKeyClose={true}
        title="Adding New Trip">
        {isLoading && <div className="pt-dialog-body">
          loading ..
        </div>}
        {!isLoading && this._renderDialogInputs(drivers, cars, driverId, carId)}
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Tooltip content="This button is hooked up to close the dialog.">
              <Button intent={Intent.DANGER} onClick={closeDialog}>Close</Button>
            </Tooltip>
            <Button
              text="Add Trip"
              icon="add"
              disabled={!driverId || !carId}
              intent={Intent.PRIMARY}
              onClick={(e) => {
                e.preventDefault();
                addTrip(driverId, carId);
                this.setState({
                  driverId: '',
                  carId: '',
                  cardId: ''
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