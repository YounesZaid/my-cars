import React, { Component } from 'react';
import { Button, Dialog, Intent} from "@blueprintjs/core";
import * as firebase from 'firebase';
import moment from 'moment';

import {db} from '../../Database/config';
import './index.css';

import CardItem from './CardItem';

export default class CardsScreen extends Component {
   state = {
      cards:[],
      isAddCardDialogOpen: false,
   }

   deleteCard = (cardId) => {
      db.collection("cards").doc(cardId).delete().then(function() {
            console.log("Document successfully deleted!");
      }).catch(function(error) {
            console.error("Error removing document: ", error);
      });
   }

   addCard = (cardType, cardIdentifier) => {
      db.collection("cards").add({
         cardType: cardType,
         cardIdentifier: cardIdentifier,
         posted: moment().format('MMMM Do YYYY, h:mm:ss a')
      })
      .then(function(docRef) {
            console.log("Document written with ID: ", firebase.firestore.FieldPath.documentId());
      })
      .catch(function(error) {
            console.error("Error adding document: ", error);
      });
   }

   closeAddCardDialog = () => {
      this.setState({
         isAddCardDialogOpen: false,
      });
   }

   componentDidMount = () => {
      db.collection("cards").orderBy('posted','desc').onSnapshot((DocRef) => {
         const items = [];
         DocRef.forEach(doc => {
            console.log(`${doc.id} => ${doc.data().cardType} ${doc.data().cardIdentifier}`);
            let docItem = {
               cardType: doc.data().cardType,
               cardIdentifier: doc.data().cardIdentifier,
               cardId: doc.id,
               posted: doc.data().posted
            }
            items.push(docItem);
         });
         this.setState({
            cards: items,
         })
      });
      // this.onMapLoad();
   }

  render() {
   const { isAddCardDialogOpen, cards } = this.state;
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
            <AddCardDialog closeDialog={this.closeAddCardDialog} isAddCardDialogOpen={isAddCardDialogOpen} addCard={this.addCard}/>
         </header>
         <section id="cards-container">
               {cards.map((card, i) => {
                  return (
                     <CardItem key={card.cardId} card={card} deleteCard={this.deleteCard}/>
                  )
               })}
         </section>
      </div>
    )
   }
}

class AddCardDialog extends Component {
   state = {
      cardType: '',
      cardIdentifier: ''
   }

   render() {
      const {cardType, cardIdentifier} = this.state;
      const {isAddCardDialogOpen, closeDialog, addCard} = this.props;
      return (
         <Dialog
            icon="inbox"
            isOpen={isAddCardDialogOpen}
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
                  Card type
                  <span className="pt-text-muted">(required)</span>
                  <input className="pt-input" type="text" placeholder="your card type here" dir="auto" name="cardType" value={cardType} onChange={(e) => {
                     e.preventDefault();
                     this.setState({
                        cardType: e.target.value
                     });
                  }}/>
               </label>
               <label className="pt-label">
                  Card identifier
                  <input className="pt-input" type="text" placeholder="your card identifer here" dir="auto" name="cardIdentifier" value={cardIdentifier} onChange={(e) => {
                     e.preventDefault();
                     this.setState({
                        cardIdentifier: e.target.value
                     })
                  }} />
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
                     onClick={(e) => {
                        e.preventDefault();
                        addCard(cardType, cardIdentifier);
                        this.setState({
                           cardType:'',
                           cardIdentifier: ''
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
