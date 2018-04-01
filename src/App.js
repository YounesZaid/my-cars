import React, { Component } from 'react';

// Layout
import Sidebar from 'Sidebar';
import AppContainer from 'AppContainer';

export default class App extends Component {
  toggleDrawer = () => {
    document.querySelector('#sidebar').classList.toggle('is-open');
  }

  render() {
    return [
      <Sidebar key={0} toggleDrawer={this.toggleDrawer} />,
      <AppContainer key={1} toggleDrawer={this.toggleDrawer} />
    ];
  }
}
