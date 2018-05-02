import React, { Component } from 'react';
import { Button, Dialog, Intent, Tooltip } from "@blueprintjs/core";
import Spinner from 'react-spinkit';
import moment from 'moment';
import { db } from 'Database/config';

import AppToaster from 'Components/Toast';
import CarItem from './CarItem';

export default class CarsList extends Component {

  state = {
    cars: [],
    isLoading: true,
    isAddCarDialogOpen: false,
  }

  showAddCarToast = () => {
    AppToaster.show({
      message: "Car added successfully !",
      intent: "success"
    });
  }

  showDeleteCarToast = () => {
    AppToaster.show({
      message: "Car deleted :(",
      intent: "danger"
    });
  }

  deleteCar = (carId) => {
    db.collection("cars").doc(carId).delete().then(docRef => {
      this.showDeleteCarToast();
    }).catch(error => {
      console.error("Error removing document: ", error);
    });
  }

  addCar = (carName, carMatricule, carType, carPlaces) => {
    db.collection("cars").add({
      carName,
      carMatricule,
      carType,
      carPlaces,
      postedCarAt: moment().format('MMMM Do YYYY, h:mm:ss a')
    })
      .then(docRef => {
        this.showAddCarToast();
      })
      .catch((error) => {
        alert('Something went wrong!');
        console.error("Error adding document: ", error);
      });
  }

  closeAddCarDialog = () => {
    this.setState({
      isAddCarDialogOpen: false,
    });
  }

  componentDidMount() {
    db.collection("cars").orderBy('postedCarAt', 'desc').onSnapshot((QuerySnapshot) => {
      const carItems = [];
      QuerySnapshot.forEach((doc) => {
        const data = doc.data();
        let docItem = {
          carName: data.carName,
          carMatricule: data.carMatricule,
          carType: data.carType,
          carPlaces: data.carPlaces,
          postedCarAt: data.postedCarAt,
          carId: doc.id
        }
        carItems.push(docItem);
      });
      this.setState({
        cars: carItems,
        isLoading: false
      })
    });
  }

  render() {
    const { isAddCarDialogOpen, isLoading, cars } = this.state;
    if (isLoading || cars.length === 0) {
      return [
        <header key={0}>
          <h3>Cars</h3>
        </header>,
        <section key={1}>
          {isLoading && <Spinner name="three-bounce" fadeIn="quarter" className="spinner-three-bounce" />}
          {!isLoading && <div className="no-car-found-container">
            <h2 className="blank-text-page">
              No cars found ...!
            </h2>
            <button type="button" className="pt-button pt-large pt-intent-primary pt-icon-add" onClick={e => {
              e.preventDefault();
              this.setState({
                isAddCarDialogOpen: true,
              });
            }}>
              PLEASE ADD A NEW CAR
            </button>
            <AddCarDialog closeDialog={this.closeAddCarDialog} isAddCarDialogOpen={isAddCarDialogOpen} addCar={this.addCar} />
          </div>}
        </section>

      ]
    }
    // Then
    return [
      <header key={0}>
        <h3>Cars</h3>
        <a href="#add-content" onClick={e => {
          e.preventDefault();
          this.setState({
            isAddCarDialogOpen: true,
          });
        }}>ADD NEW CAR <i className="zmdi zmdi-plus-square zmdi-hc-lg"></i></a>
        <AddCarDialog closeDialog={this.closeAddCarDialog} isAddCarDialogOpen={isAddCarDialogOpen} addCar={this.addCar} />
      </header>,
      <section key={1}>
        {cars.map((car, i) => {
          return (
            <CarItem key={car.carId} car={car} deleteCar={this.deleteCar}
              carId={car.carId}
              onItemClicked={e => {
                e.preventDefault();
                this.props.history.push(`/cars/${car.carId}`);
              }} />
          )
        })}
      </section>
    ]
  }
}

class AddCarDialog extends Component {
  state = {
    carName: '',
    carMatricule: '',
    carType: '',
    carPlaces: 0,
  }
  render() {
    const { isAddCarDialogOpen, closeDialog, addCar } = this.props;
    const { carName, carMatricule, carType, carPlaces } = this.state;
    return (
      <Dialog
        icon="inbox"
        isOpen={isAddCarDialogOpen}
        onClose={closeDialog}
        usePortal={true}
        canOutsideClickClose={false}
        canEscapeKeyClose={true}
        title="Adding New Car">
        <div className="pt-dialog-body">
          <p>
            <strong> In this Dialog you can do something </strong>
          </p>
          <label className="pt-label">
            Car name
            <span className="pt-text-muted">(required)</span>
            <input className="pt-input" type="text" placeholder="Example Dacia" dir="auto" name="" value={carName} onChange={(e) => {
              e.preventDefault();
              this.setState({
                carName: e.target.value
              });
            }} />
          </label>
          <label className="pt-label">
            Car matricule
            <input className="pt-input" type="text" placeholder="Expamlpe 1-A-755" dir="auto" name="" value={carMatricule} onChange={(e) => {
              e.preventDefault();
              this.setState({
                carMatricule: e.target.value
              });
            }} />
          </label>
          <label className="pt-label">
            Car type
            <input className="pt-input" type="text" placeholder="Example Diesel" dir="auto" name="" value={carType} onChange={(e) => {
              e.preventDefault();
              this.setState({
                carType: e.target.value
              });
            }} />
          </label>
          <label className="pt-label">
            Car number places
            <input className="pt-input" type="number" min="0" max="10" value={carPlaces} onChange={(e) => {
              e.preventDefault();
              this.setState({
                carPlaces: e.target.value
              });
            }} />
            {/* <NumericInput
              value={carPlaces}
              max={10}
              min={0}
              onChange={(e) => {
                this.setState({
                  carPlaces: e.target.value
                });
                alert(carPlaces);
              }}
            /> */}
          </label>
        </div>
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Tooltip content="This button is hooked up to close the dialog.">
              <Button intent={Intent.DANGER} onClick={closeDialog}>Close</Button>
            </Tooltip>
            <Button
              text="Add"
              icon="add"
              disabled={!carName || !carMatricule || !carType || !carPlaces}
              intent={Intent.PRIMARY}
              onClick={() => {
                addCar(carName, carMatricule, carType, carPlaces)
                this.setState({
                  carName: '',
                  carMatricule: '',
                  carType: '',
                  carPlaces: ''
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