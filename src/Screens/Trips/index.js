import React from 'react';
import { Route } from 'react-router-dom';
import './index.css';

import TripDetails from './TripDetails';
import TripsList from './TripsList';

const TripsScreen = ({ match }) => (
  <div className="screen-wrapper trips-screen">
    <Route path={`${match.url}/:tripId`} render={props => <TripDetails  {...props} />} />
    <Route exact path={match.url} render={props => <TripsList {...props} />} />
  </div>
)

export default TripsScreen;





