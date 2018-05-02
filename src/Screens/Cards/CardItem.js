import React, { Component } from 'react';
import { Button, Dialog, Intent, Tooltip } from "@blueprintjs/core";
import { db } from 'Database/config';
import { Card, Elevation } from '@blueprintjs/core';

import AppToaster from 'Components/Toast';

export default class CardItem extends Component {
  state = {
    isUpdateCardDialogOpen: false
  }

  closeUpdateCardDialog = () => {
    this.setState({
      isUpdateCardDialogOpen: false,
    });
  }

  showUpdatedCardToast = () => {
    AppToaster.show({
      message: "card is updated successfully √ ",
      intent: "success"
    });
  }

  updateCard = (cardType, cardIdentifier) => {
    db.collection("cards").doc(this.props.card.cardId).update({
      cardType,
      cardIdentifier
    }).then(() => {
      this.showUpdatedCardToast();
    }).catch(error => {
      alert("SOMETHIMG WENT WRONG !");
    })
  }

  render() {
    const { card, deleteCard } = this.props;
    const { isUpdateCardDialogOpen } = this.state;
    const cardId = card.cardId;
    return (
      <Card elevation={Elevation.ONE} className="card-item">
        <div className="card-header">
          <h5><a href="#card">Card : {cardId}</a></h5>
          <i className="zmdi zmdi-close zmdi-hc-2x" onClick={(e) => {
            e.preventDefault();
            deleteCard(cardId);
          }}></i>
        </div>
        <h4>Card informations</h4>
        <p>card for : {card.cardType}</p>
        <p>card identifier : {card.cardIdentifier}</p>
        <button type="button" className="card-edit-button" onClick={e => {
          this.setState({
            isUpdateCardDialogOpen: true
          })
        }}>
          <UpdateCardDialog card={card} updateCard={this.updateCard} closeDialog={this.closeUpdateCardDialog} isUpdateCardDialogOpen={isUpdateCardDialogOpen}/>
          <i className="zmdi zmdi-border-color btn-edit"></i>
        </button>
      </Card>
    )
  }
}

class UpdateCardDialog extends Component {
  state = {
    cardType: this.props.card.cardType,
    cardIdentifier: this.props.card.cardIdentifier
  }

  render() {
    const { cardType, cardIdentifier } = this.state;
    const { isUpdateCardDialogOpen, closeDialog, updateCard } = this.props;
    return (
      <Dialog
        icon="inbox"
        isOpen={isUpdateCardDialogOpen}
        onClose={closeDialog}
        usePortal={true}
        canOutsideClickClose={false}
        canEscapeKeyClose={true}
        title="Updating Card">
        <div className="pt-dialog-body">
          <p>
            <strong> In this Dialog you can update your driver</strong>
          </p>
          <label className="pt-label">
            Card type
            <span className="pt-text-muted">(required)</span>
            <input className="pt-input" type="text"  dir="auto" name="cardType" value={cardType} onChange={(e) => {
              e.preventDefault();
              this.setState({
                cardType: e.target.value
              });
            }} />
          </label>
          <label className="pt-label">
            Card identifier
            <input className="pt-input" type="text"  dir="auto" name="cardIdentifier" value={cardIdentifier} onChange={(e) => {
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
              <Button intent={Intent.DANGER} onClick={closeDialog}>Close</Button>
            </Tooltip>
            <Button
              text="Update"
              intent={Intent.PRIMARY}
              onClick={(e) => {
                e.preventDefault();
                updateCard(cardType, cardIdentifier);
                closeDialog();
              }}
            />
          </div>
        </div>
      </Dialog>
    )
  }
}