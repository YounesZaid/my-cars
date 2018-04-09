import React, { Component } from 'react';
import { Button, Dialog, Intent} from "@blueprintjs/core";

import './index.css';

export default class CardsScreen extends Component {
   state = {
      isAddCardDialogOpen: false,
   }

   closeAddCardDialog = () => {
      this.setState({
         isAddCardDialogOpen: false,
      });
   }
  render() {
   const { isAddCardDialogOpen } = this.state;
   return (
      <div className="screen-wrapper cards-screen">
         <header>
            <h3>Cards</h3>
            <a href="#add-content" onClick= { e => {
               e.preventDefault();
               this.setState({
                  isAddCardDialogOpen: true,
               });
            }}> ADD NEW CARD <i className="zmdi zmdi-plus-square zmdi-hc-lg"></i></a>
            <AddCardDialog closeDialog={this.closeAddCardDialog} isAddCardDialogOpen={isAddCardDialogOpen} />
         </header>
         <section>
            <h3> Cards List</h3>
         </section>
      </div>
    )
   }
}

class AddCardDialog extends Component {

   render() {
      return (
         <Dialog
            icon="inbox"
            isOpen={this.props.isAddCardDialogOpen}
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
