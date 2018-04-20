import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import './index.css';

import TripsScreen from 'Screens/Trips';
import CarsScreen from 'Screens/Cars';
import DriversScreen from 'Screens/Drivers';
import CardsScreen from 'Screens/Cards';

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
               <a href="#search" className="zmdi zmdi-search" onClick={e => { }}> </a>
               <input defaultValue="Search .." />
            </form>
            <div>
               <a href="#show-search" className="zmdi zmdi-search" onClick={e => {
                  e.preventDefault();
                  document.querySelector('#header-search-form').classList.toggle('is-open');
               }}> </a>
               <p>
                  <span>Hi, caren.</span>
                  <img src="https://s3.amazonaws.com/assets.materialup.com/users/pictures/000/014/117/thumb/TcZxZKU2_400x400.jpg?1507620119" alt="user-profile" />
               </p>
               <a href="#search" className="zmdi zmdi-notifications" onClick={e => { }}> </a>
            </div>
         </div>
      </header>
      <div id="header-search-form" />
      <section id="app-content-wrapper">
         {/* <Router> */}
            <Switch>
               <Route path='/trips' component={TripsScreen} />
               <Route path='/cars' component={CarsScreen} />
               <Route path='/drivers' component={DriversScreen} />
               <Route exact path='/cards' component={CardsScreen} />
               {/* <Route>
                  <Redirect to='/trips' />
               </Route> */}
            </Switch>
         {/* </Router> */}
      </section>
   </div>
)

export default AppContainer;
