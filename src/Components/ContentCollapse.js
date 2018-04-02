import React, { Component } from 'react';
import { Button, Collapse } from '@blueprintjs/core';

import CarMap from 'Map/CarMap.js';
import './ContentCollapse.css';

class ContentCollapse extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      users: 'User1',
      cars: 'Car1'
    };
  }
  render() {
      return (
          <div id="collapse-content">
              <Button onClick={this.handleClick} className="collapse-button">
                 <span>{this.state.isOpen ? "Map" : this.state.users}</span> {this.state.cars}
              </Button>
              <Collapse isOpen={this.state.isOpen} id="collapse">
                  <div id="map-content">
                      <CarMap/>
                  </div>
              </Collapse>
          </div>
      );
  }

  handleClick = () => {
      this.setState({ isOpen: !this.state.isOpen });
  }
}

export default ContentCollapse;