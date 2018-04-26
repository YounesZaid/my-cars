import React, { Component } from 'react';
import Spinner from 'react-spinkit';

import AppToaster from 'Components/Toast';
import { db } from 'Database/config';


export default class CarDetails extends Component {
  state = {
    car: null,
    isLoading: true
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
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
  }

  componentDidMount = () => {
    db.collection("cars").doc(`${this.props.match.params.carId}`).onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data();
        this.setState({
          car: {
            carName: data.carName,
            carMatricule: data.carMatricule,
            carType: data.carType,
            carPlaces: data.carPlaces,
            postedCarAt: data.postedCarAt,
            carId: doc.id
          },
          isLoading: false
        })
      } else {
        this.props.history.replace(`/cars`);
      }
    });
  }

  render() {
    const { car, isLoading } = this.state;
    if (isLoading) {
      return [
        <header key={0}>
          <h3>Car Details Not Found</h3>
        </header>,
        <section key={1}>
          <Spinner name="three-bounce" fadeIn="quarter" className="spinner-three-bounce" />
        </section>
      ]
    }

    return [
      <header key={0}>
        <h3>Car Details </h3>
        <div>
          <button type="button" className="pt-button" onClick={e => {
            e.preventDefault();
            alert("content edited !");
          }}><i className="zmdi zmdi-border-color zmdi-icon"></i></button>
          <button type="button" className="pt-button" onClick={e => {
            e.preventDefault();
            this.deleteCar(car.carId);
          }}><i className="zmdi zmdi-close zmdi-icon"></i></button>
        </div>
      </header>,
      <section key={1}>
        <div className="car-title">
          {/* <img src="http://www.pngmart.com/files/4/Car-PNG-HD.png" alt="car"/> */}
          <i className="zmdi zmdi-car zmdi-hc-5x"></i>
          <div className="informations-wrapper">
            <div className="name-wrapper">
              <p>Car name </p>
              <p>{car.carName}</p>
            </div>
            <div className="matricule-wrapper">
              <p>Car Matricule</p>
              <p>{car.carMatricule}</p>
            </div>
          </div>
          <div className="informations-wrapper">
            <div className="name-wrapper">
              <p>Car type </p>
              <p>{car.carType}</p>
            </div>
            <div className="matricule-wrapper">
              <p>Car places</p>
              <p>{car.carPlaces}</p>
            </div>
          </div>
        </div>
        <div className="car-content">

        </div>
      </section>
    ]
  }
}