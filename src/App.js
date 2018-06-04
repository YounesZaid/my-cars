import React, { Component } from 'react';
import { HashRouter as Router } from 'react-router-dom';

import '@blueprintjs/core/lib/css/blueprint.css';
import "@blueprintjs/icons/lib/css/blueprint-icons.css"

// Layout
import Sidebar from 'Layout/Sidebar';
import AppContainer from 'Layout/AppContainer';
import SigninScreen from 'Screens/Profile/SigninScreen';

export default class App extends Component {
  toggleDrawer = () => {
    document.querySelector('#sidebar').classList.toggle('is-open');
  }

  render() {
    return (
      // <Router>
      //   <div id="router-container">
      //     <Sidebar key={0} toggleDrawer={this.toggleDrawer} />
      //     <AppContainer key={1} toggleDrawer={this.toggleDrawer} />
      //   </div>
      // </Router>
      <SigninScreen />
    )
  }
}
