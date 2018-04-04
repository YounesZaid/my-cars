import React, { Component } from 'react';
import { Button, Dialog, Intent } from '@blueprintjs/core';

import './index.css';

export default class DriversScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
  }

  _toggleDialog = () => {
    this.setState({ isOpen: !this.state.isOpen })
  };

  render() {
    return (
      <div className="screen-wrapper driver-screen">
        <header>
          <h3>Drivers</h3>
          <a href="#add-content">ADD NEW DRIVER <i className="zmdi zmdi-plus-square"></i></a>
        </header>
        <section>
          <div>
            <Button onClick={this._toggleDialog} text="Add new Driver" />
            <Dialog
              icon="inbox"
              isOpen={this.state.isOpen}
              onClose={this._toggleDialog}
              usePortal={true}
              canOutsideClickClose={false}
              canEscapeKeyClose={true}
              title="Adding New Driver">
              <div className="pt-dialog-body">
                <p>
                  <strong> In this Dialog you can do something </strong>
                </p>
                <label class="pt-label">
                  Driver Full-name
                  <span className="pt-text-muted">(required)</span>
                  <input className="pt-input" type="text" placeholder="Text input" dir="auto" />
                </label>
                <label class="pt-label">
                  Drive Number
                  <input className="pt-input" type="text" placeholder="Text input" dir="auto" />
                </label>
                <label class="pt-label">
                  Driver Identifier
                  <input className="pt-input" type="text" placeholder="Text input" dir="auto" />
                </label>
              </div>
              <div className="pt-dialog-footer">
                <div className="pt-dialog-footer-actions">
                  <Button 
                    text="Add"
                    icon="add"
                    intent={Intent.ADD}
                    // onClick={alert("Added")}
                  />
                  <Button 
                    intent={Intent.DANGER}
                    onClick={this._toggleDialog}
                    text="Close"
                  />
                </div>
              </div>
            </Dialog>
          </div>
        </section>
      </div>
    )
  }
}