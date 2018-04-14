import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
// import * as firebase from 'firebase';
import {db} from './config';

export default class TripDetails extends Component {

   state = {
      tripsItem:[],
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
            tripsItem: item
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
            <h3 className="blank-details-page"> No trip details was found ..! </h3>
         </header>,
         <section key={1}>
            <Spinner name="three-bounce" fadeIn=".1" className="spinner-three-bounce"/>
            {/* <h3 className="blank-details-page">No trip details was found ..!</h3> */}
         </section>
      ];
   }
}

class Map extends Component {
   static defaultProps = {
      center: {
         lat: 34.000677,
         lng: -6.849732
      },
      zoom: 12
   };

   render() {
      return (
         <div className="map-container">
            <GoogleMapReact
               bootstrapURLKeys={{ key: 'AIzaSyDJoL_iLPgGVhaKt2-HVPeL-Cr6Dpo4Ru8' }}
               defaultCenter={this.props.center}
               defaultZoom={this.props.zoom}
            />
         </div>
      );
   }
}

var Spinner = require('react-spinkit');
