import React from 'react';
import './index.css';

import classnames from 'classnames';
import { withRouter } from 'react-router-dom';

const Sidebar = ({ toggleDrawer, history, location }) => ([
   <aside id="sidebar" key={1}>
      <a href="#logo" className="logo">LOGO</a>
      <nav className="nav-list">
         <ul>
            <li><a href="#trips" className={classnames({ 'active': location.pathname === '/trips' })} onClick={e => {
               e.preventDefault();
               history.push('/trips')
            }}> Trips </a></li>
            <li><a href="#drivers" className={classnames({ 'active': location.pathname === '/drivers' })} onClick={e => {
               e.preventDefault();
               history.push('/drivers')
            }}> Drivers </a></li>
            <li><a href="#cars" className={classnames({ 'active': location.pathname === '/cars' })} onClick={e => {
               e.preventDefault();
               history.push('/cars')
            }}> Cars </a></li>
            <li><a href="#cards" className={classnames({ 'active': location.pathname === '/cards' })} onClick={e => {
               e.preventDefault();
               history.push('/cards')
            }}> Cards </a></li>
         </ul>
      </nav>
   </aside>,
   <div onClick={toggleDrawer} key={0} id="sidebar-backdrop" />,
])

export default withRouter(Sidebar);
