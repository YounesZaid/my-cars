import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// Layout
import Sidebar from 'Layout/Sidebar';
import AppContainer from 'Layout/AppContainer';

export default class App extends Component {
  toggleDrawer = () => {
    document.querySelector('#sidebar').classList.toggle('is-open');
  }

  render() {
    return (
      <Router>
        <div id="router-container">
          <Sidebar key={0} toggleDrawer={this.toggleDrawer} />
          <AppContainer key={1} toggleDrawer={this.toggleDrawer} />
        </div>
      </Router>
    )
  }
}
