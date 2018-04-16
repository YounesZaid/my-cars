import React, { Component } from 'react';
// import GoogleMapReact from 'google-map-react';
// import * as firebase from 'firebase';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import {db} from './config';

export default class TripDetails extends Component {

   state = {
      tripsItem:[],
      isLoading: true
   }

   componentDidMount = () => {
      // // this is how we can get the element by id
      // const { match } = this.props;
      // const tripId = match.params.tripId;
      // where(firebase.firestore.FieldPath.documentId(), '=', 'tripId')
      
      db.collection("trips").onSnapshot((DocRef) => {
         const item = [];
         DocRef.forEach(doc => {
            let docItem = {
               driverName: doc.data().driverName,
               carType: doc.data().carType,
               id: doc.id,
               isActive: doc.data().isActive, 
               posted: doc.data().posted
            }
            item.push(docItem);
         });
         this.setState({
            tripsItem: item,
            isLoading: false
         })
      });
   }

   render() {
      const { match } = this.props;
      const tripId = match.params.tripId; //parseInt( stringToParse, somethingSpecial!! )
      const _trips = this.state.tripsItem.filter(trip => trip.id === tripId);
      if (_trips.length > 0) {
         const selectedTrip = _trips[0];
         return [
            // this.state.isLoading ? <Spinner name="three-bounce" fadeIn=".1" className="spinner-three-bounce"/> :
            <header key={0}>
               <h3>Trip Map / <span className="trip-details-info">{selectedTrip.driverName} / docId : {tripId}</span></h3>
            </header>,
            <section key={1}>
               <div className="trip-map">
                  <Map 
                     isMarkerShown
                     googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD394ITapfHaHcDZ6G68DEmh8nZQPpfujA&libraries=geometry,drawing,places"                     
                     loadingElement={<div style={{ height: `100%` }} />}
                     containerElement={<div className="map-container"/>}
                     mapElement={<div style={{ height: `100%` }} />}
                  />
                  <div className="trip-detail">
                     <span>Driver: {selectedTrip.driverName}</span>
                     <span>Car: {selectedTrip.carType}</span>
                     <span>Availability : {selectedTrip.isActive && <b>Active</b>}</span>
                  </div>
               </div>
            </section>
         ]
      }
      // not found
      return [
         <header key={0}>
            {/* <h3 className="blank-details-page"> No trip details was found ..! </h3> */}
         </header>,
         <section key={1}>
            <Spinner name="three-bounce" fadeIn="quarter" className="spinner-three-bounce"/>
            {/* <h3 className="blank-details-page">No trip details was found ..!</h3> */}
         </section>
      ];
   }
}

const Map = withScriptjs (withGoogleMap((props) => (
   // <div className="map-container">
      <GoogleMap
         defaultZoom={props.zoom}
         defaultCenter={props.center}
      >
         {props.isMarkerShown && <Marker position={props.center} />}
      </GoogleMap>
   // </div>
)))

Map.defaultProps = {
   center: {
      lat: 34.000677,
      lng: -6.849732
   },
   zoom: 12
}
 

const Spinner = require('react-spinkit');
