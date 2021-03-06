import React, { Component } from 'react';
import { compose, withProps, withHandlers } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { Button, Intent, Popover, PopoverInteractionKind, Position } from "@blueprintjs/core";
// import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";
import Spinner from 'react-spinkit';

import AppToaster from 'Components/Toast';
import { db } from 'Database/config';

// const google = window.google;
export default class TripDetails extends Component {

  state = {
    trip: null,
    isLoading: true,
  }

  showDeleteTripToast = () => {
    AppToaster.show({
      message: "Trip Deleted :(",
      icon: "warning-sign",
      intent: "danger"
    });
  }

  showErrorToast = (error) => {
    AppToaster.show({
      message: `Something went wrong ! ${error}`,
      intent: "danger"
    });
  }

  deleteTrip = () => {
    db.collection("trips").doc(this.props.match.params.tripId).delete().then(docref => {
      this.showDeleteTripToast();
    }).catch((error) => {
      console.error("Error removing document: ", error);
    });
  }

  componentDidMount = () => {
    db.collection("trips").doc(`${this.props.match.params.tripId}`).onSnapshot((doc) => {
      const driverAndCarPromises = [[], []];
      if (doc.exists) {
        const data = doc.data();
        const driverPromise = db.collection("drivers").doc(data.driverId).get();
        const carPromise = db.collection("cars").doc(data.carId).get();
        driverAndCarPromises[0].push(driverPromise);
        driverAndCarPromises[1].push(carPromise);
        const promise4All = Promise.all(driverAndCarPromises.map(Promise.all, Promise));
        promise4All
          .then(driversAndCars => {
            const driverDocs = driversAndCars[0];
            const carDocs = driversAndCars[1];
            driverDocs.forEach(driverDoc => {
              if (data.driverId === driverDoc.id) {
                carDocs.forEach(carDoc => {
                  if (data.carId === carDoc.id) {
                    this.setState({
                      trip: {
                        ...data,
                        ...(driverDoc.data()),
                        ...(carDoc.data())
                      },
                      isLoading: false
                    })
                  }
                });
              }
            });
            
          })
          .catch(error => {
            this.showErrorToast(error);
          })
      }else {
        // 1
        // this.setState({ trip: null, isLoading: false })
        // 2
        this.props.history.replace(`/trips`);
      }  
    });
  }

  render() {
    const { trip, isLoading } = this.state;

    if (isLoading) {
      return [
        <header key={0}>
          {/* <h3 className="blank-details-page"> No trip details was found ..! </h3> */}
        </header>,
        <section key={1}>
          <Spinner name="three-bounce" fadeIn="quarter" className="spinner-three-bounce" />
          {/* <h3 className="blank-details-page">No trip details was found ..!</h3> */}
        </section>
      ]
    }

    if (!trip) {
      return [
        <header key={0}>
          {/* <h3 className="blank-details-page"> No trip details was found ..! </h3> */}
        </header>,
        <section key={1}>
          <h3 className="blank-details-page">
            <i className="zmdi zmdi-pin zmdi-hc-2x"></i> No trip was found ..!
          </h3>
        </section>
      ]
    }

    return [
      // this.state.isLoading ? <Spinner name="three-bounce" fadeIn=".1" className="spinner-three-bounce"/> :
      <header key={0}>
        <h3>Trip Map </h3>
        <div>
          <button type="button" className="pt-button edit-btn" onClick={e => {
            e.preventDefault();
            alert("content edited !");
          }}><i className="zmdi zmdi-border-color"></i></button>
          <Popover
            interactionKind={PopoverInteractionKind.CLICK}
            popoverClassName="pt-popover-content-sizing"
            position={Position.TOP}
          >
            <button type="button" className="pt-button edit-btn"><i className="zmdi zmdi-close"></i></button>
            <div>
              <h5>Confirm deletion</h5>
              <p>Are you sure you want to delete these items? You won't be able to recover them.</p>
              <Button intent={Intent.PRIMARY} className="pt-popover-dismiss" style={{ marginRight: 10 }}>Dismiss</Button>
              <Button intent={Intent.DANGER} className="pt-popover-dismiss" onClick={e => {
                e.preventDefault();
                this.deleteTrip(trip.id);
              }}>Delete</Button>
            </div>
          </Popover>
        </div>
      </header>,
      <section key={1}>
        <div className="trip-map">
          <h3> visualize your vehicle in real time</h3>
          <Map locations={trip.locations} />  
          <div className="trip-detail">
            <span>Driver : {trip.driverFirstName}</span>
            <span>Car : {trip.carName}</span>
            <span>Availability : {trip.isActive && <b>Active</b>}</span>
          </div>
        </div>
      </section>
    ]
  }
}


const Map = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyD394ITapfHaHcDZ6G68DEmh8nZQPpfujA&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div className="map-container" />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withHandlers({
    onMarkerClustererClick: () => (markerClusterer) => {
      const clickedMarkers = markerClusterer.getMarkers()
      console.log(`Current clicked markers length: ${clickedMarkers.length}`)
      console.log(clickedMarkers)
    },
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    defaultZoom={props.zoom}
    defaultCenter={props.markers[0]}
  >
    {/* <MarkerClusterer
      onClick={props.onMarkerClustererClick}
      averageCenter
      enableRetinaIcons
      gridSize={60}
    > */}
    {props.locations.map((location, i) => (
      <Marker
        key={i}
        position={{ lat: location.latitude, lng: location.longitude }}
        icon="images/marker.png"
      />
    ))}
    {/* </MarkerClusterer> */}
    {/* <Marker position={{lat: props.locataion._lat, lng: props.locataion._long}}/> */}
  </GoogleMap>
);

Map.defaultProps = {
  markers: [
    { lat: 34.002271, lng: -6.8543258 },
    { lat: 34.002109, lng: -6.854280 },
    { lat: 34.003172, lng: -6.852823 },
    { lat: 34.002802, lng: -6.851271 },
    { lat: 34.001915, lng: -6.850802 },
    { lat: 34.000556, lng: -6.850090 },
    { lat: 33.997885, lng: -6.847561 },
  ],
  zoom: 16,
}
