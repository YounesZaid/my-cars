import React, { Component } from 'react';
import { Button, Dialog, Intent } from "@blueprintjs/core";
import moment from 'moment';

import {db} from '../../Database/config';

import './index.css';
import CarItem from './CarItem';

export default class CarsScreen extends Component {
   state = {
      isAddCarDialogOpen: false,
      cars: []
   }

   closeAddCarDialog = () => {
      this.setState({
         isAddCarDialogOpen: false,
      });
   }

   deleteCar = (carId) => {
      db.collection("cars").doc(carId).delete().then(function() {
            console.log("Document successfully deleted!");
      }).catch(function(error) {
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
      .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
            console.error("Error adding document: ", error);
      });
   }

   componentDidMount = () => {
      db.collection("cars").orderBy('posted','desc').onSnapshot((QuerySnapshot) => {
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
      const { isAddCarDialogOpen, cars } = this.state;
      return (
         <div className="screen-wrapper cars-screen">
            <header>
               <h3>Cars</h3>
               <a href="#add-content" onClick={ e => {
                  e.preventDefault();
                  this.setState({
                     isAddCarDialogOpen: true,
                  });
               }}>ADD NEW CAR <i className="zmdi zmdi-plus-square zmdi-hc-lg"></i></a>
               <AddCarDialog closeDialog={this.closeAddCarDialog} isAddCarDialogOpen={isAddCarDialogOpen} addCar={this.addCar} />
            </header>
            <section>
               {cars.map((carObject, i) =>{
                  return (
                     <CarItem key={carObject.carId} car={carObject} deleteCar={this.deleteCar}/>
                  )
               })}
            </section>
         </div>

      )
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
      const { isAddCarDialogOpen, closeDialog, addCar, deleteCar} = this.props;
      const { carName, carMatricule, carType, carPlaces} = this.state;
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
                  Card type
                  <input className="pt-input" type="text" placeholder="Text input" dir="auto" name="" value={carType} onChange={(e) => {
                     e.preventDefault();
                     this.setState({
                        carType: e.target.value
                     });
                  }} />
               </label>
               <label className="pt-label">
                  Card number places
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
