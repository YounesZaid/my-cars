import React, { Component } from 'react';
import { Button, Collapse } from '@blueprintjs/core';

class ContentCollapse extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }
  render() {
      return (
          <div>
              <Button onClick={this.handleClick}>
                  {this.state.isOpen ? "Hide" : "Show"} build logs
              </Button>
              <Collapse isOpen={this.state.isOpen}>
                  <pre>
                      Dummy text.
                  </pre>
              </Collapse>
          </div>
      );
  }

  handleClick = () => {
      this.setState({ isOpen: !this.state.isOpen });
  }
}

export default ContentCollapse;