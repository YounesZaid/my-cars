import React, { Component } from 'react';
import { Button, Dialog, Intent } from "@blueprintjs/core";
import Spinner from 'react-spinkit';

import CarItem from './CarItem';

export default class CarsList extends Component {

   state = {
      isAddCarDialogOpen: false,
   }

   closeAddCarDialog = () => {
      this.setState({
         isAddCarDialogOpen: false,
      });
   }

   render() {

      const { isAddCarDialogOpen } = this.state;
      const { cars, addCar, deleteCar } = this.props;
      if (cars.length > 0) {
         return [
            <header key={0}>
               <h3>Cars</h3>
               <a href="#add-content" onClick={e => {
                  e.preventDefault();
                  this.setState({
                     isAddCarDialogOpen: true,
                  });
               }}>ADD NEW CAR <i className="zmdi zmdi-plus-square zmdi-hc-lg"></i></a>
               <AddCarDialog closeDialog={this.closeAddCarDialog} isAddCarDialogOpen={isAddCarDialogOpen} addCar={addCar} />
            </header>,
            <section key={1}>
               {cars.map((carObject, i) => {
                  return (
                     <CarItem key={carObject.carId} car={carObject} deleteCar={deleteCar}
                        carId={carObject.carId} />
                  )
               })}
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
            <Spinner name="three-bounce" fadeIn="quarter" className="spinner-three-bounce" />
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
      const { isAddCarDialogOpen, closeDialog, addCar} = this.props;
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