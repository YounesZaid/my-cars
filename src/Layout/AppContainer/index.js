import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import './index.css';
import * as firebase from 'firebase';

import TripsScreen from 'Screens/Trips';
import CarsScreen from 'Screens/Cars';
import DriversScreen from 'Screens/Drivers';
import CardsScreen from 'Screens/Cards';
import AccountScreen from 'Screens/Accounts';


const handleSignOut = () => {
  firebase.auth().signOut().then(() => {
    alert('See u Again ;)');
  })
    .catch((error) => {
      alert('Error while disconnecting : ' + error)
    });
}
const AppContainer = ({ toggleDrawer }) => (

  <div id="app-container">
    <header>
      <div className="header-left">
        <a href="#menu" className="zmdi zmdi-menu" onClick={e => {
          e.preventDefault();
          toggleDrawer();
        }}> </a>
        <a href="#home" className="logo">LOGO</a>
      </div>
      <div className="header-right">
        <form>
          {/* <input defaultValue="Search .." /> */}
          <a href="#search" className="zmdi zmdi-search " onClick={e => { }}> </a>
          <input id="search" className="pt-input " type="search" placeholder="Search..." dir="auto" />
        </form>
        <div>
          <a href="#show-search" className="zmdi zmdi-search" onClick={e => {
            e.preventDefault();
            document.querySelector('#header-search-form').classList.toggle('is-open');
          }}> </a>
          <p>
            <span>Hi, Younes.</span>
            <img src="https://lh3.googleusercontent.com/-bslOcKGLOK4/AAAAAAAAAAI/AAAAAAAAAAA/AB6qoq2r_iLwcSUlmYrEjcHmzDJj1s2y4A/s32-c-mo/photo.jpg" alt="user-profile" />
          </p>
          <a href="#search" className="zmdi zmdi-notifications" onClick={e => {
            // const user = firebase.auth().currentUser;
          }}> </a>
          <button className="pt-button pt-minimal pt-intent-warning pt-icon-log-out" onClick={(e) => {
            handleSignOut();
          }}>Log out</button>
        </div>
      </div>
    </header>
    <div id="header-search-form" />
    <section id="app-content-wrapper">
      <Switch>
        <Route path='/trips' component={TripsScreen} />
        <Route path='/cars' component={CarsScreen} />
        <Route path='/drivers' component={DriversScreen} />
        <Route exact path='/cards' component={CardsScreen} />
        <Route path='/accounts' component={AccountScreen} />
        <Route>
          <Redirect to='/trips' />
        </Route>
      </Switch>
    </section>
  </div>
)

export default AppContainer;
