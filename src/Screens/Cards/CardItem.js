import React from 'react';
import { Button, Card, Elevation } from "@blueprintjs/core";


const CardItem = ({card}) => (
   <Card interactive={true} elevation={Elevation.TWO}>
      <h5><a href="#card">Card heading</a></h5>
      <p>Card informations</p>
      <p>card for : {card.cardType}</p>
      <p>card identifier : {card.cardIdentifier}</p>
      <Button>Delete</Button>
   </Card>
)

export default CardItem;