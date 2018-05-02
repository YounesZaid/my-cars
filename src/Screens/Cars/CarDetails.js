import React, { Component } from 'react';
import Spinner from 'react-spinkit';
import { Button, Dialog, Intent, Tooltip, Popover, PopoverInteractionKind, Position } from "@blueprintjs/core";


// import data from './data.json';
import BarChart from 'Components/Charts/BarChart';
import AppToaster from 'Components/Toast';
import { db } from 'Database/config';


export default class CarDetails extends Component {
  state = {
    car: null,
    isLoading: true,
    isUpdateCarDialogOpen: false
  }

  showDeleteCarToast = () => {
    AppToaster.show({
      message: "Car deleted :(",
      intent: "danger"
    });
  }

  showUpdatedCarToast = (name) => {
    AppToaster.show({
      message: "car " + name + " is updated successfully √ ",
      intent: "success"
    });
  }

  updateCar = (carName, carMatricule, carType, carPlaces) => {
    db.collection("cars").doc(`${this.props.match.params.carId}`).update({
      carName,
      carMatricule,
      carType,
      carPlaces,
    }).then(() => {
      this.showUpdatedCarToast(carName);
    }).catch(error => {
      alert("SOMETHIMG WENT WRONG !");
    })
  }

  deleteCar = (carId) => {
    db.collection("cars").doc(carId).delete().then(docRef => {
      this.showDeleteCarToast();
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
  }

  closeUpdateDialog = () => {
    this.setState({
      isUpdateCarDialogOpen: false
    })
  }

  componentDidMount = () => {
    db.collection("cars").doc(`${this.props.match.params.carId}`).onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data();
        this.setState({
          car: {
            carName: data.carName,
            carMatricule: data.carMatricule,
            carType: data.carType,
            carPlaces: data.carPlaces,
            postedCarAt: data.postedCarAt,
            carId: doc.id
          },
          isLoading: false
        })
      } else {
        this.props.history.replace(`/cars`);
      }
    });
  }

  render() {
    const { car, isLoading, isUpdateCarDialogOpen } = this.state;
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Fuel Consumption in Leter',
          backgroundColor: 'rgba(75,192,192,0.2)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(75,192,192,0.4)',
          hoverBorderColor: 'rgba(75,192,192,1)',
          //data returned by cars collection
          data: [65, 59, 80, 81, 56, 60, 80]
        }
      ]
    };
    if (isLoading) {
      return [
        <header key={0}>
          <h3>Car Details Not Found</h3>
        </header>,
        <section key={1}>
          <Spinner name="three-bounce" fadeIn="quarter" className="spinner-three-bounce" />
        </section>
      ]
    }

    return [
      <header key={0}>
        <h3>Car Details </h3>
        <div>
          <button type="button" className="pt-button edit-btn" onClick={e => {
            e.preventDefault();
            this.setState({
              isUpdateCarDialogOpen: true
            })
          }}><i className="zmdi zmdi-border-color zmdi-icon"></i></button>
          <Popover
            interactionKind={PopoverInteractionKind.CLICK}
            popoverClassName="pt-popover-content-sizing"
            position={Position.TOP}
          >
            <button type="button" className="pt-button edit-btn"><i className="zmdi zmdi-close zmdi-icon"></i></button>
            <div>
              <h5>Confirm deletion</h5>
              <p>Are you sure you want to delete these items? You won't be able to recover them.</p>
              <Button intent={Intent.PRIMARY} className="pt-popover-dismiss" style={{ marginRight: 10 }}>Dismiss</Button>
              <Button intent={Intent.DANGER} className="pt-popover-dismiss" onClick={e => {
                e.preventDefault();
                this.deleteCar(car.carId);
              }}>Delete</Button>
            </div>
          </Popover>
          <UpdateCarDialog car={car} closeUpdateDialog={this.closeUpdateDialog} isUpdateCarDialogOpen={isUpdateCarDialogOpen} updateCar={this.updateCar} />
        </div>
      </header>,
      <section key={1}>
        <div className="car-title">
          <div className="image-wrapper">
            <img src="http://www.pngmart.com/files/4/Car-PNG-HD.png" alt="car" />
          </div>
          <div className="informations-wrapper">
            <div className="name-wrapper">
              <p>Car name </p>
              <p>{car.carName}</p>
            </div>
            <div className="matricule-wrapper">
              <p>Car Matricule</p>
              <p>{car.carMatricule}</p>
            </div>
          </div>
          <div className="informations-wrapper">
            <div className="name-wrapper">
              <p>Car type </p>
              <p>{car.carType}</p>
            </div>
            <div className="matricule-wrapper">
              <p>Car places</p>
              <p>{car.carPlaces}</p>
            </div>
          </div>
        </div>
        <div className="car-content">
          <BarChart data={data} />
        </div>
      </section>
    ]
  }
}

class UpdateCarDialog extends Component {
  state = {
    carName: this.props.car.carName,
    carMatricule: this.props.car.carMatricule,
    carType: this.props.car.carType,
    carPlaces: this.props.car.carPlaces,
  }
  render() {
    const { isUpdateCarDialogOpen, closeUpdateDialog, updateCar } = this.props;
    const { carName, carMatricule, carType, carPlaces } = this.state;
    return (
      <Dialog
        icon="inbox"
        isOpen={isUpdateCarDialogOpen}
        onClose={closeUpdateDialog}
        usePortal={true}
        canOutsideClickClose={false}
        canEscapeKeyClose={true}
        title="Update Car">
        <div className="pt-dialog-body">
          <p>
            <strong> In this Dialog you can Update your car informations </strong>
          </p>
          <label className="pt-label">
            Car name
            <span className="pt-text-muted">(required)</span>
            <input className="pt-input" type="text" placeholder="Example Dacia" dir="auto" name="" value={carName} onChange={(e) => {
              e.preventDefault();
              this.setState({
                carName: e.target.value
              });
            }} />
          </label>
          <label className="pt-label">
            Car matricule
            <input className="pt-input" type="text" placeholder="Expamlpe 1-A-755" dir="auto" name="" value={carMatricule} onChange={(e) => {
              e.preventDefault();
              this.setState({
                carMatricule: e.target.value
              });
            }} />
          </label>
          <label className="pt-label">
            Car type
            <input className="pt-input" type="text" placeholder="Example Diesel" dir="auto" name="" value={carType} onChange={(e) => {
              e.preventDefault();
              this.setState({
                carType: e.target.value
              });
            }} />
          </label>
          <label className="pt-label">
            Car number places
            <input className="pt-input" type="number" min="0" max="10" value={carPlaces} onChange={(e) => {
              e.preventDefault();
              this.setState({
                carPlaces: e.target.value
              });
            }} />
          </label>
        </div>
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Tooltip content="This button is hooked up to close the dialog.">
              <Button intent={Intent.DANGER} onClick={closeUpdateDialog}>Close</Button>
            </Tooltip>
            <Button
              text="Update"
              intent={Intent.PRIMARY}
              onClick={() => {
                updateCar(carName, carMatricule, carType, carPlaces);
                closeUpdateDialog();
              }}
            />
          </div>
        </div>
      </Dialog>
    )
  }
}

