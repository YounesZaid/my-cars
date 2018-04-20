import React from 'react';
import { Route } from 'react-router-dom';
import './index.css';

import CarsList from './CarsList';
import CarDetails from './CarDetails';

const CarsScreen = ({ match }) => (
  <div className="screen-wrapper cars-screen">
    <Route path={`${match.url}/:cardId`} render={props => <CarDetails {...props} />} />
    <Route path={match.url} render={(props) => <CarsList {...props} />} />
  </div>
)

export default CarsScreen;

