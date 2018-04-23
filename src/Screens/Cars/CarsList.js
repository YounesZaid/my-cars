import React, { Component } from 'react';
import { Button, Dialog, Intent } from "@blueprintjs/core";
import Spinner from 'react-spinkit';
import moment from 'moment';
import { db } from 'Database/config';

import CarItem from './CarItem';

export default class CarsList extends Component {

  state = {
    cars: [],
    isLoading: true,
    isAddCarDialogOpen: false,
  }

  deleteCar = (carId) => {
    db.collection("cars").doc(carId).delete().then(function () {
      console.log("Document successfully deleted!");
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
  }

  addCar = (carName, carMatricule, carType, carPlaces) => {
    db.collection("cars").add({
      carName,
      carMatricule,
      carType,
      carPlaces,
      posted: moment().format('MMMM Do YYYY, h:mm:ss a')
    })
      .then(function (docRef) {
        alert(`Trip with the driver ${carName} was added successfully!`);
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function (error) {
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
    db.collection("cars").orderBy('posted', 'desc').onSnapshot((QuerySnapshot) => {
      const carsItems = [];
      QuerySnapshot.forEach((doc) => {
        console.log(`${doc.id} => Get Cars Collection with Success`);
        let docItem = {
          carName: doc.data().carName,
          carMatricule: doc.data().carMatricule,
          carType: doc.data().carType,
          carPlaces: doc.data().carPlaces,
          posted: doc.data().posted,
          carId: doc.id
        }
        carsItems.push(docItem);
      });
      this.setState({
        cars: carsItems,
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
          {!isLoading && <h2 className="blank-list-page">
            <i className="zmdi zmdi-pin zmdi-hc-2x"></i> No cars found! ..
            <a href="#add-content" onClick={e => {
              e.preventDefault();
              this.setState({
                isAddCarDialogOpen: true,
              });
            }}>ADD NEW CAR <i className="zmdi zmdi-plus-square zmdi-hc-lg"></i></a>
            <AddCarDialog closeDialog={this.closeAddCarDialog} isAddCarDialogOpen={isAddCarDialogOpen} addCar={this.addCar} />
          </h2>}
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
    carPlaces: '',
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
        title="Adding New Card">
        <div className="pt-dialog-body">
          <p>
            <strong> In this Dialog you can do something </strong>
          </p>
          <label className="pt-label">
            Car name
            <span className="pt-text-muted">(required)</span>
            <input className="pt-input" type="text" placeholder="Text input" dir="auto" name="" value={carName} onChange={(e) => {
              e.preventDefault();
              this.setState({
                carName: e.target.value
              });
            }} />
          </label>
          <label className="pt-label">
            Car matricule
              <input className="pt-input" type="text" placeholder="Text input" dir="auto" name="" value={carMatricule} onChange={(e) => {
              e.preventDefault();
              this.setState({
                carMatricule: e.target.value
              });
            }} />
          </label>
          <label className="pt-label">
            Car type
              <input className="pt-input" type="text" placeholder="Text input" dir="auto" name="" value={carType} onChange={(e) => {
              e.preventDefault();
              this.setState({
                carType: e.target.value
              });
            }} />
          </label>
          <label className="pt-label">
            Car number places
              <input className="pt-input" type="text" placeholder="Text input" dir="auto" name="" value={carPlaces} onChange={(e) => {
              e.preventDefault();
              this.setState({
                carPlaces: e.target.value
              });
            }} />
          </label>
        </div>
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Button
              intent={Intent.DANGER}
              onClick={closeDialog}
              text="Close"
            />
            <Button
              text="Add"
              icon="add"
              intent={Intent.ADD}
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