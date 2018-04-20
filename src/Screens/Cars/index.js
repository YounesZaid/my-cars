import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import moment from 'moment';

import { db } from '../../Database/config';

import './index.css';
import CarsList from './CarsList';
import CarDetails from './CarDetails';

export default class CarsScreen extends Component {

   state = {
      cars: []
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
         carName: carName,
         carMatricule: carMatricule,
         carType: carType,
         carPlaces: carPlaces,
         posted: moment().format('MMMM Do YYYY, h:mm:ss a')
      })
         .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
         })
         .catch(function (error) {
            console.error("Error adding document: ", error);
         });
   }

   componentDidMount = () => {
      db.collection("cars").orderBy('posted', 'desc').onSnapshot((QuerySnapshot) => {
         const carItems = [];
         QuerySnapshot.forEach((doc) => {
            console.log(`${doc.id} => Get element with Success`);
            let docItem = {
               carName: doc.data().carName,
               carMatricule: doc.data().carMatricule,
               carType: doc.data().carType,
               carPlaces: doc.data().carPlaces,
               posted: doc.data().posted,
               carId: doc.id
            }
            carItems.push(docItem);
         });
         this.setState({
            cars: carItems
         })
      });
   }

   render() {
      const { cars } = this.state;
      const { match } = this.props;
      return (
         <div className="screen-wrapper cars-screen">
            <Route path={`${match.url}/:cardId`} render={(props) => {
               return <CarDetails cars={cars} {...props}/>
            }} />
            <Route path={match.url} render={(props) => {
               return <CarsList cars={cars} addCar={this.addCar} deleteCar={this.deleteCar}/>
            }} />
         </div>
      )
   }
}

