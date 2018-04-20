import React, { Component } from 'react';
import { Button, Dialog, Intent } from "@blueprintjs/core";
import * as firebase from 'firebase';
import moment from 'moment';
import Spinner from 'react-spinkit';
import { db } from 'Database/config';

import CardItem from './CardItem';

export default class CardsList extends Component {
  state = {
    cards: [],
    isLoading: true,
    isAddCardDialogOpen: false,
  }

  deleteCard = (cardId) => {
    db.collection("cards").doc(cardId).delete().then(function () {
      console.log("Document successfully deleted!");
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
  }

  addCard = (cardType, cardIdentifier) => {
    db.collection("cards").add({
      cardType,
      cardIdentifier,
      posted: moment().format('MMMM Do YYYY, h:mm:ss a')
    })
      .then(function (docRef) {
        alert(`Trip with the driver ${cardType} was added successfully!`);
        console.log("Document written with ID: ", firebase.firestore.FieldPath.documentId());
      })
      .catch(function (error) {
        alert('Something went wrong!');
        console.error("Error adding document: ", error);
      });
  }

  closeAddCardDialog = () => {
    this.setState({
      isAddCardDialogOpen: false,
    });
  }

  componentDidMount() {
    db.collection("cards").orderBy('posted', 'desc').onSnapshot((DocRef) => {
      const cardsItems = [];
      DocRef.forEach(doc => {
        console.log(`${doc.id} => Get Cards collection with success`);
        let docItem = {
          cardType: doc.data().cardType,
          cardIdentifier: doc.data().cardIdentifier,
          cardId: doc.id,
          posted: doc.data().posted
        }
        cardsItems.push(docItem);
      });
      this.setState({
        cards: cardsItems,
        isLoading: false
      })
    });
  }
  render() {
    const { isAddCardDialogOpen, isLoading, cards } = this.state;
    if (isLoading || cards.length === 0) {
      return [
        <header key={0}>
          <h3>Cards</h3>
          <a href="#add-content" onClick={e => {
            e.preventDefault();
            this.setState({
              isAddCardDialogOpen: true,
            });
          }}> ADD NEW CARD <i className="zmdi zmdi-plus-square zmdi-hc-lg"></i></a>
          <AddCardDialog closeDialog={this.closeAddCardDialog} isAddCardDialogOpen={isAddCardDialogOpen} addCard={this.addCard} />
        </header>,
        <section key={1} id="cards-container">
          {isLoading && <Spinner name="three-bounce" fadeIn="quarter" className="spinner-three-bounce" />}
          {!isLoading && <h2 className="blank-list-page">
            <i className="zmdi zmdi-pin zmdi-hc-2x"></i> No cards found! ..
            <a href="#add-content" onClick={e => {
              e.preventDefault();
              this.setState({
                isAddCardDialogOpen: true,
              });
            }}> ADD NEW CARD <i className="zmdi zmdi-plus-square zmdi-hc-lg"></i></a>
            <AddCardDialog closeDialog={this.closeAddCardDialog} isAddCardDialogOpen={isAddCardDialogOpen} addCard={this.addCard} />
          </h2>}
        </section>
      ]
    }
    //Else
    return [
      <header key={0}>
        <h3>Cards</h3>
        <a href="#add-content" onClick={e => {
          e.preventDefault();
          this.setState({
            isAddCardDialogOpen: true,
          });
        }}> ADD NEW CARD <i className="zmdi zmdi-plus-square zmdi-hc-lg"></i></a>
        <AddCardDialog closeDialog={this.closeAddCardDialog} isAddCardDialogOpen={isAddCardDialogOpen} addCard={this.addCard} />
      </header>,
      <section key={1} id="cards-container">
        {cards.map((card, i) => {
          return (
            <CardItem key={card.cardId} card={card} deleteCard={this.deleteCard} />
          )
        })}
      </section>
    ]
  }
}

class AddCardDialog extends Component {
  state = {
    cardType: '',
    cardIdentifier: ''
  }

  render() {
    const { cardType, cardIdentifier } = this.state;
    const { isAddCardDialogOpen, closeDialog, addCard } = this.props;
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
            }} />
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
                  cardType: '',
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