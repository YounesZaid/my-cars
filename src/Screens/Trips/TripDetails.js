import React, { Component } from 'react';
import { compose, withProps, withHandlers } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
// import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";
import Spinner from 'react-spinkit';

import { db } from 'Database/config';

// const google = window.google;
export default class TripDetails extends Component {

  state = {
    trip: null,
    isLoading: true,
  }

  deleteTrip = (tripId) => {
    db.collection("trips").doc(tripId).delete().then(function () {
      alert("Document successfully deleted!");
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
  }

  componentDidMount = () => {
    // // this is how we can get the element by id
    // const { match } = this.props;
    // const tripId = match.params.tripId;
    // where(firebase.firestore.FieldPath.documentId(), '=', 'tripId')
    db.collection("trips").doc(`${this.props.match.params.tripId}`).onSnapshot((doc) => {
      if (doc.exists) {
        this.setState({
          trip: {
            driverName: doc.data().driverName,
            carType: doc.data().carType,
            id: doc.id,
            isActive: doc.data().isActive,
            posted: doc.data().posted
          },
          isLoading: false
        })
      } else {
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
          <button type="button" className="pt-button" onClick={e => {
            e.preventDefault();
            alert("content edited !");
          }}><i className="zmdi zmdi-border-color"></i></button>
          <button type="button" className="pt-button" onClick={e => {
            e.preventDefault();
            this.deleteTrip(trip.id);
          }}><i className="zmdi zmdi-close"></i></button>
        </div>
      </header>,
      <section key={1}>
        <div className="trip-map">
          <h3> visualize your vehicle in real time</h3>
          <Map />
          <div className="trip-detail">
            <span>Driver: {trip.driverName}</span>
            <span>Car: {trip.carType}</span>
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
  zoom: 16
}
