import React, { Component } from 'react';
import { Button, Dialog, Intent } from "@blueprintjs/core";

import './index.css';

export default class CarsScreen extends Component {
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
               <AddCarDialog closeDialog={this.closeAddCarDialog} isAddCarDialogOpen={isAddCarDialogOpen} />
            </header>
            <section>
               <h3>Cars List</h3>
            </section>
         </div>

      )
   }
}

class AddCarDialog extends Component {

   render() {
      return (
         <Dialog
            icon="inbox"
            isOpen={this.props.isAddCarDialogOpen}
            onClose={this.props.closeDialog}
            usePortal={true}
            canOutsideClickClose={false}
            canEscapeKeyClose={true}
            title="Adding New Card">
            <div className="pt-dialog-body">
               <p>
                  <strong> In this Dialog you can do something </strong>
               </p>
               <label className="pt-label">
                  Card type
                  <span className="pt-text-muted">(required)</span>
                  <input className="pt-input" type="text" placeholder="Text input" dir="auto" />
               </label>
               <label className="pt-label">
                  Card identifier
                  <input className="pt-input" type="text" placeholder="Text input" dir="auto" />
               </label>
               <label className="pt-label">
                  Card owner
                  <input className="pt-input" type="text" placeholder="Text input" dir="auto" />
               </label>
            </div>
            <div className="pt-dialog-footer">
               <div className="pt-dialog-footer-actions">
                  <Button 
                     intent={Intent.DANGER}
                     onClick={this.props.closeDialog}
                     text="Close"
                  />
                  <Button 
                     text="Add"
                     icon="add"
                     intent={Intent.ADD}
                     onClick={() => {
                        alert("Added succefully");
                        this.props.closeDialog();
                     }}
                  />
               </div>
            </div>
         </Dialog>
      )
   }
}
