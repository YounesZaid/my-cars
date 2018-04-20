import React from 'react';
import { Route } from 'react-router-dom';
import './index.css';


import DriverDetails from './DriverDetails';
import DriversList from './DriversList';

const DriversScreen = ({ match }) => (
  <div className="screen-wrapper driver-screen">
    <Route path={`${match.url}:/driverId`} render={props => <DriverDetails {...props} />} />
    <Route exact path={match.url} render={props => <DriversList {...props} />} />
  </div>
)

export default DriversScreen;