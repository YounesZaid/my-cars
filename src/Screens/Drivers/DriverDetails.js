import React, { Component } from 'react';
import { compose, withProps, withHandlers } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";
import Spinner from 'react-spinkit';

import { db } from 'Database/config';

export default class DriverDetails extends Component {

  state = {
    driver: null,
    isLoading: true
  }

  componentDidMount = () => {
    db.collection("drivers").doc(`${this.props.match.params.driverId}`).onSnapshot((doc) => {
      if (doc.exists) {
        this.setState({
          driver: {
            driverFirstName: doc.data().driverFirstName,
            driverLastName: doc.data().driverLastName,
            driverRegistrationNumber: doc.data().driverRegistrationNumber,
            driverPhoneNumber: doc.data().driverPhoneNumber,
            posted: doc.data().posted,
            driverId: doc.id
          },
          isLoading: false
        })
      } else {
        // 1
        // this.setState({ trip: null, isLoading: false })
        // 2
        this.props.history.replace(`/drivers`);
      }
    });
  }

  render() {
    const { driver, isLoading } = this.state;
    if (isLoading) {
      return [
        <header key={0}>
          <h3>Driver Details Not Found</h3>
        </header>,
        <section key={1}>
          <Spinner name="three-bounce" fadeIn="quarter" className="spinner-three-bounce" />
        </section>
      ]
    }
    // Else
    return [
      <header key={0}>
        <h3>Driver Details / {driver.driverFirstName} / docId : {driver.driverId}</h3>
      </header>,
      <section key={1} id="driver-section">
        <div className="driver-details-info">
          <div className="img-name">
            <img src="https://s3.amazonaws.com/uifaces/faces/twitter/dvdwinden/128.jpg" alt="driver-profile" />
            <h4><span>{driver.driverFirstName} {driver.driverLastName}</span></h4>
          </div>
          <div className="informations">
            <div className="phone-container">
              <p className="container-title">Phone </p>
              <p>{driver.driverPhoneNumber}</p>
            </div>
            <div className="registration-container">
              <p className="container-title">Registration </p>
              <p>{driver.driverRegistrationNumber}</p>
            </div>
            <div className="note-container">
              <p className="container-title">Registration date </p>
              <p> 12/08/1999</p>
            </div>
          </div>
        </div>
        <div className="map-card-container">
          <aside className="driver-map-container">
            <Map />
          </aside>
          <aside className="driver-card-info">
            <p>Information about your subscription card</p>
            <div className="driver-card">
              <h5>Card Number :</h5>
              <h5>Consomation :</h5>
            </div>
          </aside>
        </div>
      </section>
    ]
  }
}

const Map = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyD394ITapfHaHcDZ6G68DEmh8nZQPpfujA&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div className="driver-map-info" />,
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
    defaultZoom={12}
    defaultCenter={{ lat: 34.002271, lng: -6.8543258 }}
  >
    {/* <MarkerClusterer
      onClick={props.onMarkerClustererClick}
      averageCenter
      enableRetinaIcons
      gridSize={60}
    > */}
    {props.markers.map((marker, i) => (
      <Marker
        key={i}
        position={{ lat: marker.lat, lng: marker.lng }}
      />
    ))}
    {/* </MarkerClusterer> */}
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
  zoom: 12
}
