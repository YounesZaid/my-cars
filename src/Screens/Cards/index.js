import React, { Component } from 'react';
import { Button, Dialog, Intent} from "@blueprintjs/core";

import './index.css';

export default class CardsScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      showComponent: false
    }
  }

  _onButtonClick = () => {
    this.setState({
      showComponent: true,
    });
  };

  _toggleDialog = () => {
    this.setState({ isOpen: !this.state.isOpen })
  };

  render() {
    return (
      <div className="screen-wrapper cards-screen">
        <header>
          <h3>Cards</h3>
          <a href="#add-content" onClick= { e => {
            e.preventDefault();
            this._onButtonClick();
          }}>ADD NEW CARD <i className="zmdi zmdi-plus-square"></i></a>
        </header>
        <section>
          { this.state.showComponent ? <AddCardsDialog isOpen={this.state.isOpen} toggleDialog={this._toggleDialog}/> : null }
        </section>
      </div>
    )
  }
}

const AddCardsDialog = ({ isOpen, toggleDialog }) => (
  <div>
    <Button onClick={toggleDialog} text="Add new card" />
    <Dialog
        icon="inbox"
        isOpen={toggleDialog}
        onClose={toggleDialog}
        usePortal={true}
        canOutsideClickClose={false}
        canEscapeKeyClose={true}
        title="Adding New Card">
      <div className="pt-dialog-body">Some content</div>
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
)

