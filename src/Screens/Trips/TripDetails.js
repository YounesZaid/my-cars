import React, { Component } from 'react';
import { compose, withProps, withHandlers } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";

import {db} from '../../Database/config';

// const google = window.google;
export default class TripDetails extends Component {
   
   state = {
      tripsItem:[],
      isLoading: true,
      directions: null
   }
   // onMapLoad = () => {
   //    const DirectionsService = new google.maps.DirectionsService();
      
   //    DirectionsService.route({
   //      origin: new google.maps.LatLng(34.0007678, -6.8524419),
   //      destination: new google.maps.LatLng(34.0006948, -6.8501645),
   //      travelMode: google.maps.TravelMode.DRIVING,
   //    }, (result, status) => {
   //      if (status === google.maps.DirectionsStatus.OK) {
   //        this.setState({
   //          directions: result,
   //        });
   //      } else {
   //        console.error(`error fetching directions ${result}`);
   //      }
   //    });
   // }

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
      // this.onMapLoad();
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
                  <Map />
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


const Map = compose( 
   withProps({
      googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyD394ITapfHaHcDZ6G68DEmh8nZQPpfujA&libraries=geometry,drawing,places",                    
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div className="map-container"/>,
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
      defaultCenter={{lat: 34.002271,lng: -6.8543258}}
      ref={props.onMapLoad}
   >
      <MarkerClusterer
         onClick={props.onMarkerClustererClick}
         averageCenter
         enableRetinaIcons
         gridSize={60}
      >
         {props.markers.map((marker, i) => (
            <Marker
               key={i}
               position={{ lat: marker.lat, lng: marker.lng }}
            />
         ))}
      </MarkerClusterer>
   </GoogleMap>
);

Map.defaultProps = {
   markers: [
      {lat: 34.002271,lng: -6.8543258},
      {lat: 34.002109,lng: -6.854280},
      {lat: 34.003172,lng: -6.852823},
      {lat: 34.002802,lng: -6.851271},
      {lat: 34.001915,lng: -6.850802},
      {lat: 34.000556,lng: -6.850090},
      {lat: 33.997885,lng: -6.847561},
   ],
   zoom: 12
}

const Spinner = require('react-spinkit');
