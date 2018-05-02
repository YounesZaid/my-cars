import React, { Component } from 'react';
import { Button, Dialog, Intent, Tooltip } from "@blueprintjs/core";
import moment from 'moment';
import Spinner from 'react-spinkit';
import { db } from 'Database/config';

import AppToaster from 'Components/Toast';
import CardItem from './CardItem';

export default class CardsList extends Component {
  state = {
    cards: [],
    isLoading: true,
    isAddCardDialogOpen: false,
  }

  showDeleteCardToast = () => {
    AppToaster.show({
      message: "Card deleted :(",
      intent: "danger"
    });
  }

  showAddCardToast = () => {
    AppToaster.show({
      message: "Card added Successfully !",
      intent: "success"
    });
  }

  deleteCard = (cardId) => {
    db.collection("cards").doc(cardId).delete().then(doRef => {
      this.showDeleteCardToast();
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
  }

  addCard = (cardType, cardIdentifier) => {
    db.collection("cards").add({
      cardType,
      cardIdentifier,
      postedCardAt: moment().format('MMMM Do YYYY, h:mm:ss a')
    })
      .then(docRef => {
        this.showAddCardToast();
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
    db.collection("cards").orderBy('postedCardAt', 'desc').onSnapshot((DocRef) => {
      const cardItems = [];
      DocRef.forEach(doc => {
        const data = doc.data();
        let docItem = {
          cardType: data.cardType,
          cardIdentifier: data.cardIdentifier,
          cardId: doc.id,
          postedCardAt: data.postedCardAt
        }
        cardItems.push(docItem);
      });
      this.setState({
        cards: cardItems,
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
        </header>,
        <section key={1} id="cards-container">
          {isLoading && <Spinner name="three-bounce" fadeIn="quarter" className="spinner-three-bounce" />}
          {!isLoading && <div className="no-card-found-container">
            <h2 className="blank-text-page">
              No cards found ...!
            </h2>
            <button type="button" className="pt-button pt-large pt-intent-primary pt-icon-add" onClick={e => {
              e.preventDefault();
              this.setState({
                isAddCardDialogOpen: true,
              });
            }}>
              PLEASE ADD A NEW CARD
            </button>
            <AddCardDialog closeDialog={this.closeAddCardDialog} isAddCardDialogOpen={isAddCardDialogOpen} addCard={this.addCard} />
          </div>}
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
            <input className="pt-input" type="text" placeholder="Example diesel or gasoline" dir="auto" name="cardType" value={cardType} onChange={(e) => {
              e.preventDefault();
              this.setState({
                cardType: e.target.value
              });
            }} />
          </label>
          <label className="pt-label">
            Card identifier
                  <input className="pt-input" type="text" placeholder="card-..." dir="auto" name="cardIdentifier" value={cardIdentifier} onChange={(e) => {
              e.preventDefault();
              this.setState({
                cardIdentifier: e.target.value
              })
            }} />
          </label>
        </div>
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Tooltip content="This button is hooked up to close the dialog.">
              <Button intent={Intent.DANGER} onClick={this.props.closeDialog}>Close</Button>
            </Tooltip>
            <Button
              text="Add"
              icon="add"
              disabled={!cardType || !cardIdentifier}
              intent={Intent.PRIMARY}
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