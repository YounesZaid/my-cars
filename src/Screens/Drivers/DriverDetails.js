import React, { Component } from 'react';
import { compose, withProps, withHandlers } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";
import {db} from '../../Database/config';

export default class DriverDetails extends Component {
   state = {
      driverItems: {},
   }

   componentDidMount = () => {
      db.collection("drivers").onSnapshot((QuerySnapshot) => {
         // const driverCollection = [];
         QuerySnapshot.forEach((doc) => {
            console.log(`${doc.id} => Success`);
            let docItem = {
               driverFirstName: doc.data().driverFirstName,
               driverLastName: doc.data().driverLastName,
               driverRegistrationNumber: doc.data().driverRegistrationNumber,
               driverPhoneNumber: doc.data().driverPhoneNumber,
               driverId: doc.id
            }
            // driverCollection.push(docItem);
            this.setState({
               driverItems: docItem
            });
         });
      });
   }

   render() {
      // const { match } = this.props;
      const { driverItems } = this.state;
      // const driverId = match.params.driverId;
      // const driver = driverItems.filter(driver => driver.driverId === driverId );
      // if(driver.length > 0){
      //    const driverSelected = driver[0];
         return [
            <header key={0}>
               <h3>Driver Details / {driverItems.driverFirstName} / docId : {driverItems.driverId}</h3>
            </header>,
            <section key={1} id="driver-section">
               <div className="driver-details-info">
                  <img src="https://s3.amazonaws.com/assets.materialup.com/users/pictures/000/014/117/thumb/TcZxZKU2_400x400.jpg?1507620119" alt="driver-profile" />
                  <div className="informations">
                     <h4><span>{driverItems.driverFirstName} {driverItems.driverLastName}</span></h4>
                     <h4>Registration Number : <span>{driverItems.driverRegistrationNumber}</span></h4>
                     <h4>Phone Number : <span>{driverItems.driverPhoneNumber}</span></h4>
                  </div>
               </div>
               <div className="map-card-container">
                  <div className="driver-map-container">
                     <Map />
                  </div>
                  <aside className="driver-card-info">
                     <p>Information about your subscription card</p>
                     <h5>Card Number :</h5>
                     <h5>Consomation :</h5>
                  </aside>
               </div>
            </section>
         ]
   //    }
   //    return [
   //       <header key={0}>
   //          <h3>Driver Details Not Found</h3>
   //       </header>,
   //       <section key={1}>
   //          <h1>Please check again</h1>
   //       </section>
   //    ]
   }
}

const Map = compose( 
   withProps({
      googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyD394ITapfHaHcDZ6G68DEmh8nZQPpfujA&libraries=geometry,drawing,places",                    
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div className="driver-map-info"/>,
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
