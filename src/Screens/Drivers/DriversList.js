import React, { Component } from 'react';
import { Button, Dialog, Intent, Tooltip } from '@blueprintjs/core';
// import { DateInput } from "@blueprintjs/datetime";
import { db } from 'Database/config';
import moment from 'moment';
import Spinner from 'react-spinkit';

import AppToaster from 'Components/Toast';
import DriverItem from './DriverItem';

export default class DriverList extends Component {
  state = {
    drivers: [],
    isLoading: true,
    isAddDriverDialogOpen: false,
  }

  showAddDriverToast = () => {
    AppToaster.show({
      message: "Driver added successfully !",
      intent: "success"
    });
  }

  showDeleteDriverToast = () => {
    AppToaster.show({
      message: "Driver deleted :( ",
      intent: "danger"
    });
  }

  showErrorLoadingToast = () => {
    AppToaster.show({
      message: "SOMETHING WENT WRONG!",
      intent: "danger"
    });
  }

  deleteDriver = (driverId) => {
    db.collection("drivers").doc(driverId).delete().then(docRef => {
      this.showDeleteDriverToast();
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
  }

  addDriver = (driverFirstName, driverLastName, driverRegistrationNumber, driverPhoneNumber, driverHireDate, cardId) => {
    db.collection("drivers").add({
      driverFirstName,
      driverLastName,
      driverRegistrationNumber,
      driverPhoneNumber,
      driverHireDate,
      cardId,
      postedDriverAt: moment().format('MMMM Do YYYY, h:mm:ss a')
    })
      .then(docRef => {
        this.showAddDriverToast();
      })
      .catch(function (error) {
        alert("Something went wrong!");
        console.error("Error adding document: ", error);
      });
  }

  closeAddDriverDialog = () => {
    this.setState({
      isAddDriverDialogOpen: false,
    });
  }

  componentDidMount() {
    db.collection("drivers").orderBy('postedDriverAt', 'desc').onSnapshot((QuerySnapshot) => {
      const driverItems = [];
      const cardIdsDocPromises = [];
      QuerySnapshot.forEach((doc) => {
        const data = doc.data();
        const promise = db.collection("cards").doc(data.cardId).get();
        cardIdsDocPromises.push(promise);
        driverItems.push({
          driverFirstName: data.driverFirstName,
          driverLastName: data.driverLastName,
          driverRegistrationNumber: data.driverRegistrationNumber,
          driverPhoneNumber: data.driverPhoneNumber,
          driverHireDate: data.driverHireDate,
          postedDriverAt: data.postedDriverAt,
          cardId: data.cardId,
          driverId: doc.id
        });
      });

      Promise.all(cardIdsDocPromises).then(cardDocs => {
        cardDocs.forEach(cardDoc => {
          driverItems.forEach((driverObject, i) => {
            if (driverObject.cardId === cardDoc.id){
              driverItems[i] = {
                ...driverObject,
                ...(cardDoc.data())
              }
            }
          })
        });
        this.setState({
          drivers: driverItems,
          isLoading: false
        })
      })
      .catch(error => {
        this.showErrorLoadingToast();
      })

    });
  }
  

  render() {
    const { isAddDriverDialogOpen, isLoading, drivers } = this.state;
    if (isLoading || drivers.length === 0) {
      return [
        <header key={0} >
          <h3>Drivers</h3>
        </header>,
        <section key={1}>
          {isLoading && <Spinner name="three-bounce" fadeIn="quarter" className="spinner-three-bounce" />}
          {!isLoading && <h2 className="blank-list-page">
            <i className="zmdi zmdi-pin zmdi-hc-2x"></i> No drivers found! ..
            <a href="#add-content" onClick={e => {
              e.preventDefault();
              this.setState({
                isAddDriverDialogOpen: true,
              });
            }}>ADD NEW DRIVER <i className="zmdi zmdi-plus-square zmdi-hc-lg"></i></a>
            <AddDriverDialog closeDialog={this.closeAddDriverDialog} isAddDriverDialogOpen={isAddDriverDialogOpen} addDriver={this.addDriver} />
          </h2>}
        </section>
      ]
    }
    return [
      <header key={0}>
        <h3>Drivers</h3>
        <a href="#add-content" onClick={e => {
          e.preventDefault();
          this.setState({
            isAddDriverDialogOpen: true,
          });
        }}>ADD NEW DRIVER <i className="zmdi zmdi-plus-square zmdi-hc-lg"></i></a>
        <AddDriverDialog closeDialog={this.closeAddDriverDialog} isAddDriverDialogOpen={isAddDriverDialogOpen} addDriver={this.addDriver} />
      </header>,
      <section key={1}>
        {drivers.map((driver, i) => {
          return (
            <DriverItem key={driver.driverId} driverId={driver.driverId}
              driver={driver} deleteDriver={this.deleteDriver}
              onItemClicked={e => {
                e.preventDefault();
                this.props.history.push(`/drivers/${driver.driverId}`);
              }} />
          )
        })}
      </section>
    ]
  }
}

class AddDriverDialog extends Component {
  state = {
    driverFirstName: '',
    driverLastName: '',
    driverRegistrationNumber: '',
    driverPhoneNumber: '',
    driverHireDate: moment().format('MMMM Do YYYY'),
    cards: [],
    cardId: null
  }

  _getCards = () => {
    db.collection("cards").orderBy('postedCardAt', 'desc').onSnapshot(cardDoc => {
      const cardItems = [];
      cardDoc.forEach(doc => {
        const data = doc.data();
        const docItem = {
          cardType: data.cardType,
          cardIdentifier: data.cardIdentifier,
          cardId: doc.id,
          postedCardAt: data.postedCardAt
        }
        cardItems.push(docItem);
      });
      this.setState({
        cards: cardItems
      })
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isAddDriverDialogOpen && nextProps.isAddDriverDialogOpen) {
      // we're opening the dialog
      this._getCards();
    }
  }
  render() {
    const { driverFirstName, driverLastName, driverPhoneNumber, driverRegistrationNumber, driverHireDate, cardId, cards } = this.state;
    const { addDriver, isAddDriverDialogOpen, closeDialog } = this.props;
    return (
      <Dialog
        icon="inbox"
        isOpen={isAddDriverDialogOpen}
        onClose={closeDialog}
        usePortal={true}
        canOutsideClickClose={false}
        canEscapeKeyClose={true}
        title="Adding New Driver">
        <div className="pt-dialog-body">
          <p>
            <strong> In this Dialog you can add driver information </strong>
          </p>
          <label className="pt-label">
            First Name
                  <span className="pt-text-muted"></span>
            <input className="pt-input" type="text" placeholder="driver first name" dir="auto" name="driverFirstName" value={driverFirstName} onChange={(e) => {
              e.preventDefault();
              this.setState({
                driverFirstName: e.target.value
              });
            }} />
          </label>
          <label className="pt-label">
            Last Name
                  <span className="pt-text-muted"></span>
            <input className="pt-input" type="text" placeholder="driver last name" dir="auto" name="driverLastName" value={driverLastName} onChange={(e) => {
              e.preventDefault();
              this.setState({
                driverLastName: e.target.value
              })
            }} />
          </label>
          <label className="pt-label">
            Phone number
            <input className="pt-input" type="text" placeholder="Example +21260000..." dir="auto" name="driverPhoneNumber" value={driverPhoneNumber} onChange={(e) => {
              e.preventDefault();
              this.setState({
                driverPhoneNumber: e.target.value
              })
            }} />
          </label>
          <label className="pt-label">
            Registration number
            <input className="pt-input" type="text" placeholder="driver registration number" dir="auto" name="driverRegistrationNumber" value={driverRegistrationNumber} onChange={(e) => {
              e.preventDefault();
              this.setState({
                driverRegistrationNumber: e.target.value
              })
            }} />
          </label>
          <label className="pt-label">
            Hire date
            <input className="pt-input" type="date" name="driverHireDate" value={driverHireDate} onChange={(e) => {
              e.preventDefault();
              this.setState({
                driverHireDate: e.target.value
              });
            }} />
          </label>
          <label className="pt-label">
            Card Type
            <div className="pt-select">
              <select onChange={e => {
                e.preventDefault();
                this.setState({
                  cardId: e.target.value
                })
              }}>
                <option defaultValue>Choose a card...</option>
                {cards.map((card, i) => {
                  return <option key={i} value={card.cardId}>{card.cardType}</option>
                })}
              </select>
            </div>
          </label>
          {/* <Label className="pt-label">
            Hire date
              <DateInput
                value={this.state.hireDate}
                closeOnSelection= {true}
                popoverProps={{ position: Position.BOTTOM }}
                formatDate={date => moment(date).format('MMMM Do YYYY')}
                parseDate={str => new Date(str)}
                onChange={e => {
                  this.setState({
                    hireDate: e.target.value
                  });
                  console.log(this.state.hireDate);
                }}
              />
          </Label> */}
        </div>
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Tooltip content="This button is hooked up to close the dialog.">
              <Button intent={Intent.DANGER} onClick={closeDialog}>Close</Button>
            </Tooltip>
            <Button
              text="Add"
              icon="add"
              disabled={!driverFirstName || !driverLastName || !driverRegistrationNumber || !driverPhoneNumber || !driverHireDate}
              intent={Intent.PRIMARY}
              onClick={() => {
                addDriver(driverFirstName, driverLastName, driverRegistrationNumber, driverPhoneNumber, driverHireDate, cardId);
                this.setState({
                  driverFirstName: '',
                  driverLastName: '',
                  driverRegistrationNumber: '',
                  driverPhoneNumber: '',
                  driverHireDate: moment().format('MMMM Do YYYY')
                })
                closeDialog();
              }}
            />
          </div>
        </div>
      </Dialog>
    )
  }
}
