import React from 'react';
import './index.css';

const Sidebar = ({ toggleDrawer }) => ([
  <aside id="sidebar" key={1}></aside>,
  <div onClick={toggleDrawer} key={0} id="sidebar-backdrop" />,
])

export default Sidebar;
