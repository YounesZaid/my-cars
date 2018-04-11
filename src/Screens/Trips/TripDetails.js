import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import {db} from './config';

export default class TripDetails extends Component {

   state = {
      tripsItems: [],
   }

   componentDidMount = () => {
      db.collection("trips").onSnapshot((DocRef) => {
         const items = [];
         DocRef.forEach(doc => {
            let docItem = {
               driverName: doc.data().driverName,
               carType: doc.data().carType,
               id: doc.id,
               isActive: doc.data().isActive, 
               posted: doc.data().posted
            }
            items.push(docItem);
         });
         this.setState({
            tripsItems: items
         })
      });
   }
   render() {
      const { match } = this.props;
      const tripId = match.params.tripId; //parseInt( stringToParse, somethingSpecial!! )
      const _trips = this.state.tripsItems.filter(trip => trip.id === tripId);
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
            <h3>NOT FOUND</h3>
         </header>,
         <section key={1}>
            <h3 className="blank-details-page">No trip details was found ..!</h3>
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