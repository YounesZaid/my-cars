import React, { Component } from 'react';
import { Button, Card, Elevation } from "@blueprintjs/core";


export default class CardItem extends Component {

   render() {
      const { card, deleteCard } = this.props;
      const cardId = card.cardId;
      return (
         <Card interactive={true} elevation={Elevation.TWO}>
            <h5><a href="#card">Card : {card.cardId}</a></h5>
            <h4>Card informations</h4>
            <p>card for : {card.cardType}</p>
            <p>card identifier : {card.cardIdentifier}</p>
            <Button onClick={(e) => {
               deleteCard(cardId);
            }}>Delete</Button>
         </Card>
      )
   }
}
