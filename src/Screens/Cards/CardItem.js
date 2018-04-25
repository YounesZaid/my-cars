import React, { Component } from 'react';
import { Card, Elevation } from '@blueprintjs/core';


export default class CardItem extends Component {

  render() {
    const { card, deleteCard } = this.props;
    const cardId = card.cardId;
    return (
      <Card elevation={Elevation.ONE} className="card-item">
        <div className="card-header">
          <h5><a href="#card">Card : {card.cardId}</a></h5>
          <i className="zmdi zmdi-close zmdi-hc-2x" onClick={(e) => {
            e.preventDefault();
            deleteCard(cardId);
          }}></i>
        </div>
        <h4>Card informations</h4>
        <p>card for : {card.cardType}</p>
        <p>card identifier : {card.cardIdentifier}</p>
        <button type="button" className="card-edit-button" onClick={e => {
          alert("item to edit");
        }}>
          <i className="zmdi zmdi-border-color"></i>
        </button>
      </Card>
    )
  }
}
