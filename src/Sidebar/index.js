import React from 'react';
import './index.css';

const Sidebar = ({ toggleDrawer }) => ([
  <aside id="sidebar" key={1}>
    <a href="#logo" className="logo">LOGO</a>
    <nav className="nav-list">
      <ul>
        <li><a href="#trips" className="active"> Trips </a></li>
        <li><a href="#drivers"> Drivers </a></li>
        <li><a href="#cars"> Cars </a></li>
        <li><a href="#cards"> Cards </a></li>
      </ul>
    </nav>
  </aside>,
  <div onClick={toggleDrawer} key={0} id="sidebar-backdrop" />,
])

export default Sidebar;
